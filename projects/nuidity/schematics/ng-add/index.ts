import * as S from '../helpers';

import { createThemingFiles, exit } from '../utils';
import { NgAddOptions } from './schema';

export default function ngAddSchematic(options: NgAddOptions): S.Rule {
  return async (tree: S.Tree, context: S.SchematicContext) => {
    const workspace = await S.getWorkspace(tree);
    const project = S.getProjectFromWorkspace(workspace, options.project);
    const sourceRoot = project?.sourceRoot!;
    const targetPath = sourceRoot + '/nuidity';

    if (project.extensions['projectType'] !== S.ProjectType.Application)
      throw exit('Selected project is not an application.');

    const operations: S.Rule[] = [];

    if (options.includeRawTheme) {
      operations.push(S.mergeWith(createThemingFiles(targetPath)));
      operations.push(updateAppConfig(project, options.project));
      operations.push(addStyles(options.project, targetPath));
    }

    return S.chain(operations);
  };
}

function addStyles(projectName: string, path: string): S.Rule {
  return (tree, context) => {
    return S.updateWorkspace((workspace) => {
      const project = S.getProjectFromWorkspace(workspace, projectName);
      addPreprocessor(project, path);
      updateStyleSheet(tree, context, project);
    });
  };
}

function addPreprocessor(
  project: S.workspaces.ProjectDefinition,
  path: string
) {
  const options = S.getProjectTargetOptions(project, 'build');
  const { includePaths } = (options['stylePreprocessorOptions'] ??
    ((options['stylePreprocessorOptions'] = {
      includePaths: [],
    }),
    options['stylePreprocessorOptions'])) as { includePaths: string[] };

  if (!includePaths.includes(path)) includePaths.push(path);
}

function updateAppConfig(
  project: S.workspaces.ProjectDefinition,
  projectName: string
): S.Rule {
  return (tree, { logger }) => {
    const dir = S.normalize(project.sourceRoot + '/app');
    const importPath = S.normalize('../nuidity/nuidity.config.module');
    const modulePath = S.normalize(dir + '/app.module.ts');
    const configPath = S.normalize(dir + '/app.config.ts');

    if (tree.exists(configPath)) {
      const content = tree.read(configPath)!.toString();

      if (content.includes('provideNuidityConfig()'))
        return logger.warn('provideNuidityConfig() already provided');

      return S.addRootProvider(
        projectName,
        ({ code, external }) =>
          code`${external('provideNuidityConfig', importPath)}()`
      );
    }

    if (tree.exists(modulePath)) {
      const mainFile = S.getProjectMainFile(project);
      const modulePath = S.getAppModulePath(tree, mainFile);
      const modname = 'NuiConfigModule';

      if (!S.hasNgModuleImport(tree, modulePath, modname))
        return S.addModuleImportToRootModule(
          tree,
          modname,
          importPath,
          project
        );
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
  tree: S.Tree,
  { logger }: S.SchematicContext,
  project: S.workspaces.ProjectDefinition
) {
  const path = S.getProjectStyleFile(project);

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
    `// Import core style from "nuidity" folder\n` +
    `@use 'core';\n\n` +
    `// Add the theming style to the application\n` +
    `// Hint : scope it to use multiple themes, or use CSS "@layer"s to control its specificity !\n` +
    `@include core.applyTheme;\n\n`;
  const replaced = content.match(useregex)
    ? content.replace(useregex, '$1\n\n' + inserted)
    : inserted + content;

  tree.overwrite(path, replaced);
}
