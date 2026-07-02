const deleteComHandler = require('../helpers/delete');

module.exports = function registerDelete(cli) {
  cli
    .command('delete <from> <namespace> <where> <resource> <and> <resourceName>')
    .description('Delete any Kubernetes resource')
    .action((from, namespace, where, resource, and, resourceName) => {
      deleteComHandler.delete(namespace, resource, resourceName);
    })
    .addHelpText('after', `
  Example:
    $ ksql delete from default where resource=Deployment and name=my-app
`);
};
