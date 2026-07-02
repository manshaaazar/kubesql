const queryParser = require('../../helpers/commandParser');
const resourceGenerator = require('../../helpers/resourceObject');
const { loadKubernetesResourceDefault } = require('../../helpers/k8s');
const tableGenerator = require('../../helpers/table');
const { handleError } = require('../../helpers/errorHandler');

module.exports = function registerRoleBinding(create) {
  create
    .command('rolebinding <name> <keys>')
    .alias('rb')
    .description('Create a RoleBinding')
    .action((name, keys) => {
      const parsedQuery = queryParser.parse(keys);
      const values = { name };
      parsedQuery.forEach((entry) => {
        entry = entry.split(' ');
        values[`${entry[0]}`] = entry[1];
      });
      loadKubernetesResourceDefault(resourceGenerator.roleBinding(values))
        .then((res) => console.log(tableGenerator.roleBindingSuccessTable(res.body)))
        .catch(handleError);
    })
    .addHelpText('after', `
  Example:
    $ ksql create rolebinding <name> "(namespace default,subjectKind ServiceAccount,subjectName my-sa,role my-role)"
`);
};
