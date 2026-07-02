const registerNamespace = require('./namespace');
const registerSecret = require('./secret');
const registerService = require('./service');
const registerServiceAccount = require('./serviceAccount');
const registerDeployment = require('./deployment');
const registerPersistentVolume = require('./persistentVolume');
const registerPersistentVolumeClaim = require('./persistentVolumeClaim');
const registerResourceQuota = require('./resourceQuota');
const registerRole = require('./role');
const registerRoleBinding = require('./roleBinding');
const registerClusterRole = require('./clusterRole');
const registerClusterRoleBinding = require('./clusterRoleBinding');
const registerImageConfig = require('./imageConfig');
const registerImageBuilder = require('./imageBuilder');

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
  registerDeployment(create);
  registerPersistentVolume(create);
  registerPersistentVolumeClaim(create);
  registerResourceQuota(create);
  registerRole(create);
  registerRoleBinding(create);
  registerClusterRole(create);
  registerClusterRoleBinding(create);
  registerImageConfig(create);
  registerImageBuilder(create);
};
