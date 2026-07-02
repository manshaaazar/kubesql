const sqlParser = require('sqlite-parser');
const resourceGenerator = require('../helpers/resourceObject');
const { updateKubernetesResourceDefault } = require('../helpers/k8s');
const tableGenerator = require('../helpers/table');
const { getResource } = require('../helpers/get');
const { handleError } = require('../helpers/errorHandler');

module.exports = function registerQuery(cli) {
  cli
    .arguments('<query>')
    .option('-q', 'SQL query')
    .description('Read or update any Kubernetes resource using SQL')
    .action(async (query) => {
      const options = cli.opts();
      if (!options.q) return;

      const parsedQuery = await sqlParser(query);
      const { statement } = parsedQuery;

      if (statement[0].variant === 'select') {
        const { result, from, where } = statement[0];
        const resourceList = result.map((r) =>
          r.variant === 'text' ? r.value : r.name
        );
        const { name: namespace } = from;
        const { operation } = where[0];
        if (operation === '=') {
          const { right: resourceName } = where[0];
          getResource(resourceList, namespace, resourceName.name);
        }
      } else if (statement[0].variant === 'update') {
        const { into, set, where } = statement[0];
        const { name: resourceName } = into;
        const { operation } = where[0];
        if (operation === 'and') {
          const { left, right } = where[0];
          const { right: firstValue } = left;
          const { right: secondValue } = right;

          if (firstValue.value === 'deployment') {
            const values = { name: resourceName, namespace: secondValue.value ?? 'default' };
            set.forEach((obj) => { values[`${obj.target.name}`] = obj.value.value; });
            updateKubernetesResourceDefault(resourceGenerator.deployment(values))
              .then((res) => console.log(tableGenerator.deploymentSuccessTable(res.body)))
              .catch(handleError);
          } else if (firstValue.value === 'secret') {
            const values = { name: resourceName, namespace: secondValue.value ?? 'default', data: {} };
            set.forEach((obj) => { values.data[`${obj.target.name}`] = obj.value.value; });
            updateKubernetesResourceDefault(resourceGenerator.secret(values))
              .then((res) => console.log(tableGenerator.secretSuccessTable(res.body)))
              .catch(handleError);
          } else if (firstValue.value === 'persistentvolumeclaim' || firstValue.value === 'pvc') {
            const values = { name: resourceName, namespace: secondValue.value ?? 'default' };
            set.forEach((obj) => { values[`${obj.target.name}`] = obj.value.value; });
            updateKubernetesResourceDefault(resourceGenerator.pvc(values))
              .then((res) => console.log(tableGenerator.pvcSuccessTable(res.body)))
              .catch(handleError);
          } else {
            console.log('Resource type not supported for UPDATE');
          }
        }
      }
    })
    .addHelpText('after', `
  Examples:
    $ ksql -q "select * from default where resource=deployment"
    $ ksql -q "update my-app set image=myrepo/app:v2 where resource=deployment and namespace=default"
`);
};
