const queryParser = require('../../helpers/commandParser');
const resourceGenerator = require('../../helpers/resourceObject');
const { loadKubernetesResourceDefault } = require('../../helpers/k8s');
const tableGenerator = require('../../helpers/table');
const { handleError } = require('../../helpers/errorHandler');

module.exports = function registerService(create) {
  create
    .command('service <name> <keys>')
    .alias('ser')
    .description('Create a service')
    .action((name, keys) => {
      const parsedQuery = queryParser.parse(keys);
      const values = { name };
      parsedQuery.forEach((entry) => {
        entry = entry.split(' ');
        values[`${entry[0]}`] = entry[1];
      });
      loadKubernetesResourceDefault(resourceGenerator.service(values))
        .then((res) => console.log(tableGenerator.serviceSuccessTable(res.body)))
        .catch(handleError);
    })
    .addHelpText('after', `
  Example:
    $ ksql create service <name> "(namespace default,type LoadBalancer,app nginx,port 3000)"
`);
};
