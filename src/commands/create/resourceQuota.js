const queryParser = require('../../helpers/commandParser');
const resourceGenerator = require('../../helpers/resourceObject');
const { loadKubernetesResourceDefault } = require('../../helpers/k8s');
const tableGenerator = require('../../helpers/table');
const { handleError } = require('../../helpers/errorHandler');

module.exports = function registerResourceQuota(create) {
  create
    .command('resourceQuota <name> <keys>')
    .alias('rq')
    .description('Create a ResourceQuota')
    .action((name, keys) => {
      const parsedQuery = queryParser.parse(keys);
      const values = { name };
      parsedQuery.forEach((entry) => {
        entry = entry.split(' ');
        values[`${entry[0]}`] = entry[1];
      });
      loadKubernetesResourceDefault(resourceGenerator.resourceQuota(values))
        .then((res) => console.log(tableGenerator.resourceQuotaTable(res.body)))
        .catch(handleError);
    })
    .addHelpText('after', `
  Example:
    $ ksql create resourceQuota <name> "(namespace default,configmaps 5,secrets 10)"
`);
};
