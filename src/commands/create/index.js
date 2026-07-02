const registerNamespace = require('./namespace');
const registerSecret = require('./secret');
const registerService = require('./service');
const registerServiceAccount = require('./serviceAccount');

module.exports = function registerCreate(cli) {
  const create = cli
    .command('create')
    .description('Create any Kubernetes resource')
    .addHelpText('after', `
  Resources:
    namespace        | n       deployment           | deploy
    secret           | sec     persistentVolume     | pv
    service          | ser     persistentVolumeClaim | pvc
    serviceAccount   | sa      resourceQuota        | rq
    role             | r       clusterRole          | cr
    roleBinding      | rb      clusterRoleBinding   | crb
    imageConfig      | iConfig imageBuilder         | iBuilder
`);

  registerNamespace(create);
  registerSecret(create);
  registerService(create);
  registerServiceAccount(create);
};
