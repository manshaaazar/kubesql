const queryParser = require('../../helpers/commandParser');
const resourceGenerator = require('../../helpers/resourceObject');
const { loadKubernetesResourceDefault } = require('../../helpers/k8s');
const tableGenerator = require('../../helpers/table');
const { handleError } = require('../../helpers/errorHandler');

module.exports = function registerPersistentVolume(create) {
  create
    .command('persistentVolume <name> <keys>')
    .alias('pv')
    .description('Create a PersistentVolume')
    .action((name, keys) => {
      const parsedQuery = queryParser.parse(keys);
      const values = { name };
      parsedQuery.forEach((entry) => {
        entry = entry.split(' ');
        values[`${entry[0]}`] = entry[1];
      });
      loadKubernetesResourceDefault(resourceGenerator.pv(values))
        .then((res) => console.log(tableGenerator.pvTable(res.body)))
        .catch(handleError);
    })
    .addHelpText('after', `
  Example:
    $ ksql create persistentVolume <name> "(namespace default,storage 1Gi,accessModes ReadWriteOnce,sc default,reclaimPolicy Retain)"
`);
};
