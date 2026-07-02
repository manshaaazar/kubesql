const queryParser = require('../../helpers/commandParser');
const resourceGenerator = require('../../helpers/resourceObject');
const { loadKubernetesResourceDefault } = require('../../helpers/k8s');
const tableGenerator = require('../../helpers/table');
const { handleError } = require('../../helpers/errorHandler');

const API_GROUPS = [
  '', 'batch', 'extensions', 'apps',
  'rbac.authorization.k8s.io', 'apiextensions.k8s.io',
  'admissionregistration.k8s.io', 'policy',
];

module.exports = function registerClusterRole(create) {
  create
    .command('clusterRole <name> <keys>')
    .alias('cr')
    .description('Create a ClusterRole')
    .action((name, keys) => {
      const parsedQuery = queryParser.parse(keys);
      const values = { name, rules: [] };
      parsedQuery.forEach((entry, index) => {
        entry = entry.split(' ');
        if (index === 0) {
          values[`${entry[0]}`] = entry[1];
        } else {
          const rule = { apiGroups: API_GROUPS, resources: [], verbs: [] };
          rule.verbs.push(entry[0]);
          entry.shift();
          rule.resources = entry;
          values.rules.push(rule);
        }
      });
      loadKubernetesResourceDefault(resourceGenerator.clusterRole(values))
        .then((res) => console.log(tableGenerator.roleSuccessTable(res.body)))
        .catch(handleError);
    })
    .addHelpText('after', `
  Example:
    $ ksql create clusterRole <name> "(namespace default, get deployments services)"
`);
};
