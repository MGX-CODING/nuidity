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
  getProjectFromWorkspace,
  getProjectStyleFile,
  getProjectTargetOptions,
} from '@angular/cdk/schematics';
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
      operations.push(mergeWith(generateRawThemeFiles(targetPath)));
      operations.push(addStyles(options.project, targetPath));
    }

    return chain(operations);
  };
}

/** Add raw theme files to the given folder */
function generateRawThemeFiles(path: string): Source {
  return apply(url('../common_files/styles'), [move(normalize(path))]);
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
