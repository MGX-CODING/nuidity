import * as S from '../helpers';
import { createThemingFiles, deleteDirectory, exit } from '../utils';

const collection = '@schematics/angular';
const feature = 'lib';
const entryFile = 'index';
const barrelContent = `export { NuidityConfigModule, provideNuidityConfig } from './src/nuidity.config.module';`;
const README = `# N-ui-dity theme

This library is a pre-configured theme for the [\`@mgxdev/nuidity\`](https://github.com/MGX-CODING/nuidity) library.  
To understand how the main library works, please refer to their documentation.

## Library support

You can find the supported library version within the \`"peerDepdendencies"\` of the \`"package.json"\` file.

If the main library has a greater version than this theme, open an issue to request an update.  
It also means some components will not have any styling or configuration, so report to the main library changelog to see which ones.

## Theme details

*(Coming soon)*`;

export default function createTheme(options: { name: string }): S.Rule {
  const name = S.strings.dasherize(options.name);
  const args = { name, entryFile, skipTsConfig: true };

  return async (tree, context) => {
    return S.chain([
      S.externalSchematic(collection, feature, args),
      async (tree, context) => {
        const workspace = await S.getWorkspace(tree);
        const project = S.getProjectFromWorkspace(workspace, name);

        return S.chain([
          addPeerDep(tree, project.root),
          deleteDirectory(project.sourceRoot!),
          S.mergeWith(createThemingFiles(project.sourceRoot!)),
          updateEntryFile(project),
          preparePublishing(project, name),
          (tree, context) => {
            context.logger.info(
              `Library created. You might need to change its name in the package.json file before publishing it.`
            );
            context.logger.info(
              `You might also want to update the README to give details about your library ?`
            );
          },
        ]);
      },
    ]);
  };
}

function updateEntryFile(project: S.workspaces.ProjectDefinition): S.Rule {
  return (tree, context) => {
    const root = project.root;
    const ngPckgPath = `${root}/ng-package.json`;
    const ngPckg: any = tree.readJson(ngPckgPath);
    ngPckg.lib.entryFile = './index.ts';
    ngPckg.assets = [{ input: 'src', glob: '**/*.scss', output: 'styles' }];
    tree.overwrite(ngPckgPath, JSON.stringify(ngPckg, null, 2));
    tree.create(`${root}/index.ts`, barrelContent);
  };
}

function addPeerDep(tree: S.Tree, path: string): S.Rule {
  return (tree, context) => {
    const dep = S.getPackageJsonDependency(tree, '@mgxdev/nuidity');
    if (!dep)
      throw exit('Unable to find n-ui-dity version in your package.json');
    dep.type = S.NodeDependencyType.Peer;
    S.addPackageJsonDependency(tree, dep, path + '/package.json');
  };
}

function preparePublishing(
  project: S.workspaces.ProjectDefinition,
  name: string
): S.Rule {
  return (tree, context) => {
    const path = `${project.root}/package.json`;
    const content: any = tree.readJson(path);
    Object.assign(content, {
      publishConfig: { access: 'public' },
      exports: {
        '.': { sass: './styles/_core.scss' },
        './mixins': { sass: './styles/_mixins.scss' },
        './vars': { sass: './styles/_vars.scss' },
      },
      scripts: {
        ...content.sripts,
        prepublish: `ng build ${name}`,
        publish: `cd ../../dist/${name} && npm publish`,
        postpublish: `cd $INIT_CWD`,
      },
    });
    tree.overwrite(path, JSON.stringify(content, null, 2));

    const pckg = tree.readJson('package.json') as any;
    pckg.scripts = {
      ...pckg.scripts,
      [`${name}:publish`]: `npm run publish --prefix projects/${name}`,
    };
    tree.overwrite('package.json', JSON.stringify(pckg, null, 2));

    tree.overwrite(`${project.root}/README.md`, README);
  };
}
