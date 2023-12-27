export * from '@angular-devkit/schematics';
export * from '@angular-devkit/schematics/tasks';
export * from '@angular/cdk/schematics';
export * from '@schematics/angular/utility';
export * from '@schematics/angular/utility/dependencies';
export * from '@schematics/angular/utility/workspace';
export * from '@schematics/angular/utility/workspace-models';

export { normalize, workspaces } from '@angular-devkit/core';

/**
 * This is just an helper barrel file to get all imports in the same place.
 * Not only they're scattered, but autocomplete on VSCode does not seem to work properly for them.
 *
 * Also, when scouting the source code of Angular's repo, it gets easier to import functions found in it.
 */
