const queryParser = require('../../helpers/commandParser');
const resourceGenerator = require('../../helpers/resourceObject');
const { loadKubernetesResourceDefault } = require('../../helpers/k8s');
const tableGenerator = require('../../helpers/table');
const { handleError } = require('../../helpers/errorHandler');

module.exports = function registerImageBuilder(create) {
  create
    .command('imageBuilder <name> <keys>')
    .alias('iBuilder')
    .description('Trigger a Tekton image build pipeline run')
    .action((name, keys) => {
      const values = { name };
      queryParser.parse(keys).forEach((entry) => {
        entry = entry.split(' ');
        values[`${entry[0]}`] = entry[1];
      });
      loadKubernetesResourceDefault(resourceGenerator.pipelineRun(values))
        .then((res) => console.log(tableGenerator.pipelineRunSuccessTable(res.body)))
        .catch(handleError);
    })
    .addHelpText('after', `
  Example:
    $ ksql create imageBuilder <name> "(namespace default,sa my-sa,gitResources my-config,registryResource my-config)"
  Note: requires Tekton Pipelines installed on the cluster.
`);
};
