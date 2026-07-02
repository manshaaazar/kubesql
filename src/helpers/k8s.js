const kubernetes = require("@kubernetes/client-node");
const kubernetesConfig = new kubernetes.KubeConfig();
kubernetesConfig.loadFromDefault();
//kubernetesConfig.loadFromFile('./kube.yaml')
const kubernetesApi = kubernetesConfig.makeApiClient(
  kubernetes.KubernetesObjectApi
);
const kubeCoreV1API = kubernetesConfig.makeApiClient(kubernetes.CoreV1Api);
const kubeAppsV1API = kubernetesConfig.makeApiClient(kubernetes.AppsV1Api);

const LIST_RESOURCE_HANDLERS = {
  namespace: () => kubeCoreV1API.listNamespace("Namespace"),
  secret: (namespace) => kubeCoreV1API.listNamespacedSecret(namespace),
  service: (namespace) => kubeCoreV1API.listNamespacedService(namespace),
  serviceaccount: (namespace) =>
    kubeCoreV1API.listNamespacedServiceAccount(namespace),
  resourcequota: (namespace) =>
    kubeCoreV1API.listNamespacedResourceQuota(namespace),
  persistentvolumeclaim: (namespace) =>
    kubeCoreV1API.listNamespacedPersistentVolumeClaim(namespace),
  pvc: (namespace) =>
    kubeCoreV1API.listNamespacedPersistentVolumeClaim(namespace),
  pod: (namespace) => kubeCoreV1API.listNamespacedPod(namespace),
  persistentvolume: () => kubeCoreV1API.listPersistentVolume(),
  pv: () => kubeCoreV1API.listPersistentVolume(),
  event: (namespace) => kubeCoreV1API.listNamespacedEvent(namespace),
  deployment: (namespace) => kubeAppsV1API.listNamespacedDeployment(namespace),
};

module.exports = {
  loadKubernetesResourceDefault(object) {
    return kubernetesApi.create(object);
  },
  deleteKubernetesResourceDefault(object) {
    return kubernetesApi.delete(object);
  },
  listResources(resourceName, namespace) {
    const handler = LIST_RESOURCE_HANDLERS[resourceName];
    return handler ? handler(namespace) : Promise.resolve(undefined);
  },
  getKubernetesResourceDefault(object) {
    return kubernetesApi.read(object);
  },
  updateKubernetesResourceDefault(object) {
    return kubernetesApi.patch(object);
  },
  getPodLogs(name, namespace) {
    return kubeCoreV1API.readNamespacedPodLog(name, namespace);
  },
  replacepvc(name, namespace, body) {
    return kubeCoreV1API.replaceNamespacedPersistentVolumeClaimStatus(
      name,
      namespace,
      body
    );
  },
};
