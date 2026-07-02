const queryParser = require('../../helpers/commandParser');
const resourceGenerator = require('../../helpers/resourceObject');
const { loadKubernetesResourceDefault } = require('../../helpers/k8s');
const tableGenerator = require('../../helpers/table');
const { handleError } = require('../../helpers/errorHandler');

module.exports = function registerNamespace(create) {
  create
    .command('namespace <keys>')
    .alias('n')
    .description('Create a namespace')
    .action((keys) => {
      let parsed = queryParser.parse(keys);
      parsed = parsed[0].split(' ');
      const values = { name: parsed[1] };
      loadKubernetesResourceDefault(resourceGenerator.namespace(values))
        .then((res) => console.log(tableGenerator.successTable(res.body)))
        .catch(handleError);
    })
    .addHelpText('after', `
  Example:
    $ ksql create namespace "(name my-namespace)"
`);
};
