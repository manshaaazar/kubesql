const kubernetes = require("@kubernetes/client-node");
const kubernetesConfig = new kubernetes.KubeConfig();
kubernetesConfig.loadFromDefault();
//kubernetesConfig.loadFromFile('./kube.yaml')
const kubernetesApi = kubernetesConfig.makeApiClient(
  kubernetes.KubernetesObjectApi
);
const kubeCoreV1API = kubernetesConfig.makeApiClient(kubernetes.CoreV1Api);
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
  listResources(resourceName, namespace) {
    return new Promise((resolve, reject) => {
      if (resourceName === "namespace") {
        kubeCoreV1API
          .listNamespace("Namespace")
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      } else if (resourceName === "secret") {
        kubeCoreV1API
          .listNamespacedSecret(namespace)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      } else if (resourceName === "service") {
        kubeCoreV1API
          .listNamespacedService(namespace)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      } else if (resourceName === "serviceaccount") {
        kubeCoreV1API
          .listNamespacedServiceAccount(namespace)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      } else if (resourceName === "resourcequota") {
        kubeCoreV1API
          .listNamespacedResourceQuota(namespace)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      } else if (
        resourceName === "persistentvolumeclaim" ||
        resourceName === "pvc"
      ) {
        kubeCoreV1API
          .listNamespacedPersistentVolumeClaim(namespace)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      } else if (resourceName === "pod") {
        kubeCoreV1API
          .listNamespacedPod(namespace)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      } else if (resourceName == "persistentvolume" || resourceName === "pv") {
        kubeCoreV1API
          .listPersistentVolume()
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      } else if (resourceName === "Event") {
        kubeCoreV1API
          .listNamespacedEvent(namespace)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      }
    });
  },
  getKubernetesResourceDefault(object) {
    return new Promise((resolve, reject) => {
      kubernetesApi
        .read(object)
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  },
  getPodLogs(name, namespace) {
    return new Promise((resolve, reject) => {
      console.log("name", name);
      console.log("namespace", namespace);
      kubeCoreV1API
        .readNamespacedPodLog(name, namespace)
        .then((res) => resolve(res))
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
