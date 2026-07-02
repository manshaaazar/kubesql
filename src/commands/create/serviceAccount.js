const queryParser = require('../../helpers/commandParser');
const resourceGenerator = require('../../helpers/resourceObject');
const { loadKubernetesResourceDefault } = require('../../helpers/k8s');
const tableGenerator = require('../../helpers/table');
const { handleError } = require('../../helpers/errorHandler');

module.exports = function registerServiceAccount(create) {
  create
    .command('serviceAccount <name> <keys>')
    .alias('sa')
    .description('Create a service account')
    .action((name, keys) => {
      const parsedQuery = queryParser.parse(keys);
      const values = { name, secrets: [] };
      parsedQuery.forEach((entry) => {
        entry = entry.split(' ');
        if (entry[0] === 'namespace') {
          values.namespace = entry[1];
        } else {
          values.secrets.push({ name: entry[1] });
        }
      });
      loadKubernetesResourceDefault(resourceGenerator.serviceAccount(values))
        .then((res) => console.log(tableGenerator.saSuccessTable(res.body)))
        .catch(handleError);
    })
    .addHelpText('after', `
  Example:
    $ ksql create serviceAccount <name> "(namespace default,secret my-secret)"
`);
};
