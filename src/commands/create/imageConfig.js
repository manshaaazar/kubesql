const queryParser = require('../../helpers/commandParser');
const resourceGenerator = require('../../helpers/resourceObject');
const { loadKubernetesResourceDefault } = require('../../helpers/k8s');
const tableGenerator = require('../../helpers/table');

module.exports = function registerImageConfig(create) {
  create
    .command('imageConfig <name> <keys>')
    .alias('iConfig')
    .description('Configure a Tekton image build pipeline')
    .action((name, keys) => {
      const values = {};
      queryParser.parse(keys).forEach((entry) => {
        entry = entry.split(' ');
        values[`${entry[0]}`] = entry[1];
      });
      const { imageUrl, gitUrl, branch } = values;
      const imageManifest = resourceGenerator.imageResources({ resourceName: name, type: 'image', imageUrl });
      const gitManifest = resourceGenerator.imageResources({ resourceName: name, type: 'git', gitUrl, branch });
      const taskManifest = resourceGenerator.imageBuildPushTaskResource();
      const { pipeline, pipelinePvc } = resourceGenerator.pipeline();

      // Tekton infra resources are idempotent — "already exists" on re-runs is expected
      loadKubernetesResourceDefault(taskManifest)
        .then((res) => console.log(tableGenerator.imagebuildPushTaskSuccessTable(res.body)))
        .catch(() => {});
      loadKubernetesResourceDefault(pipeline)
        .then((res) => console.log(tableGenerator.imagebuildPushTaskSuccessTable(res.body)))
        .catch(() => {});
      loadKubernetesResourceDefault(pipelinePvc)
        .then((res) => console.log(tableGenerator.pvcSuccessTable(res.body)))
        .catch(() => {});
      loadKubernetesResourceDefault(imageManifest)
        .then((res) => console.log(tableGenerator.pipelineResourceSuccessTable(res.body)))
        .catch((err) => console.log(tableGenerator.errTable(err.body)));
      loadKubernetesResourceDefault(gitManifest)
        .then((res) => console.log(tableGenerator.pipelineResourceSuccessTable(res.body)))
        .catch((err) => console.log(tableGenerator.errTable(err.body)));
    })
    .addHelpText('after', `
  Example:
    $ ksql create imageConfig <name> "(gitUrl https://github.com/user/repo.git,branch main,imageUrl myrepo/app:latest)"
  Note: requires Tekton Pipelines installed on the cluster.
`);
};
