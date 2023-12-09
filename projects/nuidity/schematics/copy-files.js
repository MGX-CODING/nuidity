const fs = require("fs/promises");
const { join } = require("path");
const root = __dirname;
const recursive = { recursive: true };
const dist = join(root, "..", "..", "..", "dist", "nuidity", "schematics");

/*
  Custom script to copy all schematics-related files into the dist directory, because no package on NPM was suitable
    - copyfiles ignores folders
    - cpx requires one command per copy, or a bigass regex
*/

fs.readdir(root, { withFileTypes: true })
  .then((entries) => entries.filter((e) => e.isDirectory()))
  .then((dirs) => dirs.map(schematicsFiles))
  .then((ops) => [ops, commonFiles(), collectionFile()].flat())
  .then((ops) => Promise.allSettled(ops))
  .then(() => process.exit(0))
  .catch((error) => (console.error(error), process.exit(1)));

// If no files present, ignore the error
function noFiles(error) {
  if (error.code === "ENOENT" && error.errno === -2) return null;
  throw error;
}

// Schematics-related files per schematic
function schematicsFiles(dir) {
  const schema = join(dir.name, "schema.json");
  const files = join(dir.name, "files");

  return [
    fs.cp(join(root, schema), join(dist, schema)).catch(noFiles),
    fs.cp(join(root, files), join(dist, files), recursive).catch(noFiles),
  ];
}

// Common files used by multiple schematics
function commonFiles() {
  const files = "common_files";
  return fs.cp(join(root, files), join(dist, files), recursive);
}

// Main schematics collection file
function collectionFile() {
  const schema = "collection.json";
  fs.cp(join(root, schema), join(dist, schema));
}
