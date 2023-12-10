import { normalize, workspaces } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  Source,
  Tree,
  apply,
  chain,
  mergeWith,
  move,
  url,
} from '@angular-devkit/schematics';
import {
  addModuleImportToRootModule,
  getAppModulePath,
  getProjectFromWorkspace,
  getProjectMainFile,
  getProjectStyleFile,
  getProjectTargetOptions,
  hasNgModuleImport,
} from '@angular/cdk/schematics';
import { addRootProvider } from '@schematics/angular/utility';
import {
  getWorkspace,
  updateWorkspace,
} from '@schematics/angular/utility/workspace';
import { ProjectType } from '@schematics/angular/utility/workspace-models';

import { exit } from '../utils';
import { NgAddOptions } from './schema';

export default function ngAddSchematic(options: NgAddOptions): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const workspace = await getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, options.project);
    const sourceRoot = project?.sourceRoot!;
    const targetPath = sourceRoot + '/theming';

    if (project.extensions['projectType'] !== ProjectType.Application)
      throw exit('Selected project is not an application.');

    const operations: Rule[] = [];

    if (options.includeRawTheme) {
      operations.push(mergeWith(addRawThemeFiles(targetPath)));
      operations.push(mergeWith(addConfigModule(targetPath)));
      operations.push(updateAppConfig(project, options.project));
      operations.push(addStyles(options.project, targetPath));
    }

    return chain(operations);
  };
}

/** Add raw theme files to the given folder */
function addRawThemeFiles(path: string): Source {
  return apply(url('../common_files/styles'), [move(normalize(path))]);
}

/** Adds the library configuration module to the application */
function addConfigModule(path: string) {
  const file = '../common_files/configs';
  return apply(url(file), [move(normalize(path))]);
}

/** Update workspace's style preprocessor options and project's global style sheet */
function addStyles(projectName: string, path: string): Rule {
  return (tree, context) => {
    return updateWorkspace((workspace) => {
      const project = getProjectFromWorkspace(workspace, projectName);
      addPreprocessor(project, path);
      updateStyleSheet(tree, context, project);
    });
  };
}

function addPreprocessor(project: workspaces.ProjectDefinition, path: string) {
  const options = getProjectTargetOptions(project, 'build');
  const { includePaths } = (options['stylePreprocessorOptions'] ??
    ((options['stylePreprocessorOptions'] = {
      includePaths: [],
    }),
    options['stylePreprocessorOptions'])) as { includePaths: string[] };

  if (!includePaths.includes(path)) includePaths.push(path);
}

/** Updates the application config (or module) to add the configuration module */
function updateAppConfig(
  project: workspaces.ProjectDefinition,
  projectName: string
): Rule {
  return (tree, { logger }) => {
    const dir = normalize(project.sourceRoot + '/app');
    const importPath = normalize('../theming/nuidity.config.module');
    const modulePath = normalize(dir + '/app.module.ts');
    const configPath = normalize(dir + '/app.config.ts');

    if (tree.exists(configPath)) {
      const content = tree.read(configPath)!.toString();

      if (content.includes('provideNuidityConfig()'))
        return logger.warn('provideNuidityConfig() already provided');

      return addRootProvider(
        projectName,
        ({ code, external }) =>
          code`${external('provideNuidityConfig', importPath)}()`
      );
    }

    if (tree.exists(modulePath)) {
      const mainFile = getProjectMainFile(project);
      const modulePath = getAppModulePath(tree, mainFile);
      const modname = 'NuiConfigModule';

      if (!hasNgModuleImport(tree, modulePath, modname))
        return addModuleImportToRootModule(tree, modname, importPath, project);
      else
        return logger.warn('NuiConfigModule already imported into app module');
    }

    logger.error('Unable to find app config or app module');
    logger.warn('Nuidity configuration module is thus not imported');
    logger.warn('Unless you add it by hand, no feature can be configured');

    return tree;
  };
}

function updateStyleSheet(
  tree: Tree,
  { logger }: SchematicContext,
  project: workspaces.ProjectDefinition
) {
  const path = getProjectStyleFile(project);

  if (!path) {
    logger.error('Could not find global style sheet in project');
    logger.warn('N-ui-dity styles are thus not included in it');
    logger.warn('Unless you add them yourself, no style will be included');
    return;
  }

  const buffer = tree.read(path);

  if (!buffer) {
    logger.error('Could not read global style sheet in project');
    logger.warn('N-ui-dity styles are thus not included in it');
    logger.warn('Unless you add them yourself, no style will be included');
    return;
  }

  const content = buffer.toString();

  if (content.includes('@include core.applyTheme;'))
    return logger.warn('Main mixin already imported into global style sheet');

  const useregex = /(@use(?![\s\S]*@use).*$)/gm;
  const inserted =
    `// Import core style from "theming" folder\n` +
    `@use 'core';\n\n` +
    `// Add the theming style to the application\n` +
    `// Hint : scope it to use multiple themes, or use CSS "@layer"s to control its specificity !\n` +
    `@include core.applyTheme;\n\n`;
  const replaced = content.match(useregex)
    ? content.replace(useregex, '$1\n\n' + inserted)
    : inserted + content;

  tree.overwrite(path, replaced);
}
