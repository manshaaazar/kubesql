const queryParser = require('../../helpers/commandParser');
const resourceGenerator = require('../../helpers/resourceObject');
const { loadKubernetesResourceDefault } = require('../../helpers/k8s');
const tableGenerator = require('../../helpers/table');
const { handleError } = require('../../helpers/errorHandler');

module.exports = function registerClusterRoleBinding(create) {
  create
    .command('clusterRoleBinding <name> <keys>')
    .alias('crb')
    .description('Create a ClusterRoleBinding')
    .action((name, keys) => {
      const parsedQuery = queryParser.parse(keys);
      const values = { name };
      parsedQuery.forEach((entry) => {
        entry = entry.split(' ');
        values[`${entry[0]}`] = entry[1];
      });
      loadKubernetesResourceDefault(resourceGenerator.clusterRoleBinding(values))
        .then((res) => console.log(tableGenerator.roleBindingSuccessTable(res.body)))
        .catch(handleError);
    })
    .addHelpText('after', `
  Example:
    $ ksql create clusterRoleBinding <name> "(namespace default,subjectKind ServiceAccount,subjectName my-sa,role my-cr)"
`);
};
