import { SchematicsException } from '@angular-devkit/schematics';
import * as S from './helpers';

/** Shorthand to stop a schematic that failed */
export function exit(message: string) {
  return new SchematicsException(message);
}

/** Creates all the theming files the library uses (styles, configs, animations ...) */
export function createThemingFiles(path: string): S.Source {
  return S.apply(S.url('../common_files'), [S.move(S.normalize(path))]);
}

/** Deletes an entire directory and all of its children */
export function deleteDirectory(path: string): S.Rule {
  return (tree, context) => {
    function recursiveDelete(p: string) {
      const entry = tree.getDir(p);
      const folders = entry.subdirs;
      const files = entry.subfiles;

      for (const file of files) tree.delete(`${p}/${file}`);
      for (const folder of folders) recursiveDelete(`${p}/${folder}`);
    }

    recursiveDelete(path);
  };
}
