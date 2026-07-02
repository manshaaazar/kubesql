const queryParser = require('../../helpers/commandParser');
const resourceGenerator = require('../../helpers/resourceObject');
const { loadKubernetesResourceDefault } = require('../../helpers/k8s');
const tableGenerator = require('../../helpers/table');
const { handleError } = require('../../helpers/errorHandler');
const _ = require('lodash');

module.exports = function registerSecret(create) {
  create
    .command('secret <name> <keys>')
    .alias('sec')
    .description('Create a secret')
    .action((name, keys) => {
      const parsedQuery = queryParser.parse(keys);
      const values = { name, annotations: {}, data: {} };
      parsedQuery.forEach((entry) => {
        entry = entry.split(' ');
        if (entry[0] === 'namespace') {
          values.namespace = entry[1];
        } else if (entry[0] === 'type') {
          values.type = entry[1];
        } else if (entry[0] === 'annotation') {
          values.annotations[`${entry[1]}`] = entry[2];
        } else {
          entry[1] = _.trim(entry[1].replace(/"/g, ' '));
          values.data[`${entry[0]}`] = entry[1];
        }
      });
      loadKubernetesResourceDefault(resourceGenerator.secret(values))
        .then((res) => {
          const { kind, apiVersion, metadata, data, type } = res.body;
          console.log(tableGenerator.secretSuccessTable({ kind, apiVersion, metadata, data, type }));
        })
        .catch(handleError);
    })
    .addHelpText('after', `
  Example:
    $ ksql create secret <name> "(namespace default,username admin,password secret)"
`);
};
