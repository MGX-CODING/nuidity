import { SchematicsException } from '@angular-devkit/schematics';

/** Shorthand to stop a schematic that failed */
export function exit(message: string) {
  return new SchematicsException(message);
}
