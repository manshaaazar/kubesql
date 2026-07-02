const queryParser = require('../../helpers/commandParser');
const resourceGenerator = require('../../helpers/resourceObject');
const { loadKubernetesResourceDefault } = require('../../helpers/k8s');
const tableGenerator = require('../../helpers/table');
const { handleError } = require('../../helpers/errorHandler');

module.exports = function registerDeployment(create) {
  create
    .command('deployment <name> <keys>')
    .alias('deploy')
    .description('Create a deployment')
    .action((name, keys) => {
      const parsedQuery = queryParser.parse(keys);
      const values = { name, volumePaths: [] };
      parsedQuery.forEach((entry) => {
        entry = entry.split(' ');
        if (entry[0] === 'volumes') {
          entry.shift();
          values.volumes = entry;
          entry.forEach((v) => values.volumePaths.push({ name: v }));
        } else if (entry[0] === 'volumePaths') {
          entry.shift();
          entry.forEach((v, i) => { values.volumePaths[i].mountPath = v; });
        } else {
          values[`${entry[0]}`] = entry[1];
        }
      });
      loadKubernetesResourceDefault(resourceGenerator.deployment(values))
        .then((res) => console.log(tableGenerator.deploymentSuccessTable(res.body)))
        .catch(handleError);
    })
    .addHelpText('after', `
  Example:
    $ ksql create deployment <name> "(namespace default,image myrepo/app:latest,port 8080,label my-app)"
`);
};
