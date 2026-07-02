const queryParser = require('../../helpers/commandParser');
const resourceGenerator = require('../../helpers/resourceObject');
const { loadKubernetesResourceDefault } = require('../../helpers/k8s');
const tableGenerator = require('../../helpers/table');
const { handleError } = require('../../helpers/errorHandler');

module.exports = function registerPersistentVolumeClaim(create) {
  create
    .command('persistentVolumeClaim <name> <keys>')
    .alias('pvc')
    .description('Create a PersistentVolumeClaim')
    .action((name, keys) => {
      const parsedQuery = queryParser.parse(keys);
      const values = { name };
      parsedQuery.forEach((entry) => {
        entry = entry.split(' ');
        values[`${entry[0]}`] = entry[1];
      });
      loadKubernetesResourceDefault(resourceGenerator.pvc(values))
        .then((res) => console.log(tableGenerator.pvcSuccessTable(res.body)))
        .catch(handleError);
    })
    .addHelpText('after', `
  Example:
    $ ksql create persistentVolumeClaim <name> "(namespace default,pvSelector my-pv,accessModes ReadWriteOnce,sc default,storage 1Gi)"
`);
};
