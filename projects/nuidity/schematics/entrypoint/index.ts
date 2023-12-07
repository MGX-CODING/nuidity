import { Rule, SchematicsException, Tree } from '@angular-devkit/schematics';
import { SchemaEntrypoint } from './schema';
// import { strings, normalize, virtualFs, workspaces } from '@angular-devkit/core';

const schemaPath = 'node_modules/ng-packagr/ng-package.schema.json';
const schemaName = 'ng-package.json';
const indexName = 'index.ts';

/** Get Angular's workspace config as JSON object */
function getWorkspaceConfig(tree: Tree) {
  const configStr = tree.read('/angular.json')?.toString();

  if (!configStr)
    throw new SchematicsException(
      'Unable to find workspace configuration (angular.json)'
    );

  const config: any = JSON.parse(configStr);

  return config;
}

/** In case there is a single library project, return its name */
function getProjectName(config: any) {
  const projects = Object.entries(config.projects);
  const libs = projects.filter(
    ([k, v]: [any, any]) => v.projectType === 'library'
  );
  if (libs.length > 1)
    throw new SchematicsException(
      'Multiple libraries found in your current workspace. Please select a project (--project, -p)'
    );
  else if (!libs.length)
    throw new SchematicsException(
      'No library found in your current workspace.'
    );

  return libs[0][0];
}

/** Ensure that the selected project is indeed a library */
function ensureLibrary(config: any, projectName: string) {
  const project = config.projects[projectName];
  if (!project)
    throw new SchematicsException(
      `The project you have provided does not exist (${projectName})`
    );
  if (project.projectType !== 'library')
    throw new SchematicsException(
      `The project you have provided is not a library (${projectName})`
    );
  return project;
}

/** Creates the files for the sub entrypoint */
function createFiles(tree: Tree, path: string) {
  const backpath = Array.from(path.split('/'), () => '..').join('/') + '/';

  const $schema = backpath + schemaPath;
  const entryFile = './' + indexName;

  const schema = { $schema, lib: { entryFile } };

  const sp = path + '/' + schemaName;
  const ip = path + '/' + indexName;

  if (tree.exists(sp))
    throw new SchematicsException(`A ng-package file already exists (${sp})`);
  if (tree.exists(ip))
    throw new SchematicsException(`A barrel file already exists (${ip})`);

  tree.create(sp, JSON.stringify(schema, null, 2));
  tree.create(ip, `export const REPLACE_ME = null;`);
}

/** Schematic */
export default function entrypoint(options: SchemaEntrypoint): Rule {
  return (tree: Tree) => {
    const config = getWorkspaceConfig(tree);
    const projectName = options.project ?? getProjectName(config);
    const project = ensureLibrary(config, projectName);
    const path = `${project.sourceRoot}/${options.name}`;

    createFiles(tree, path);

    return tree;
  };
}
