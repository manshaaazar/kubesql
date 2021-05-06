const kubernetes = require("@kubernetes/client-node");
const kubernetesConfig = new kubernetes.KubeConfig();
kubernetesConfig.loadFromDefault();
const kubernetesApi = kubernetesConfig.makeApiClient(
  kubernetes.KubernetesObjectApi
);
module.exports = {
  loadKubernetesResourceDefault(object) {
    return new Promise((resolve, reject) => {
      kubernetesApi
        .create(object)
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
  },
  deleteKubernetesResourceDefault(object) {
    return new Promise((resolve, reject) => {
      kubernetesApi
        .delete(object)
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  },
  loadKubernetesResource(object, config) {
    return new Promise((resolve, reject) => {
      const kconfig = new k8s.KubeConfig();
      kconfig.loadFromString(`${config}`);
      const k8sClient = kc.makeApiClient(k8s.KubernetesObjectApi);
      k8sClient
        .create(object)
        .then((result) => {
          resolve(result);
          console.log("result", result.body);
        })
        .catch((err) => reject(err));
    });
  },
  deleteKubernetesResource(object, config) {
    return new Promise((resolve, reject) => {
      const kconfig = new k8s.KubeConfig();
      kconfig.loadFromString(`${config}`);
      const k8sClient = kc.makeApiClient(k8s.KubernetesObjectApi);
      k8sClient
        .delete(object)
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  },
};
