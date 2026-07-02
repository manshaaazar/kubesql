const {
  getKubernetesResourceDefault,
  listResources,
  getPodLogs,
} = require("./k8s");

const tableGenerator = require("./table");

const RESOURCE_REGISTRY = {
  namespace: {
    apiVersion: "v1",
    kind: "Namespace",
    formatter: "successTable",
    namespaced: false,
  },
  secret: {
    apiVersion: "v1",
    kind: "Secret",
    formatter: "secretSuccessTable",
    namespaced: true,
  },
  service: {
    apiVersion: "v1",
    kind: "Service",
    formatter: "serviceSuccessTable",
    namespaced: true,
  },
  serviceaccount: {
    apiVersion: "v1",
    kind: "ServiceAccount",
    formatter: "saSuccessTable",
    namespaced: true,
  },
  resourcequota: {
    apiVersion: "v1",
    kind: "ResourceQuota",
    formatter: "resourceQuotaTable",
    namespaced: true,
  },
  persistentvolumeclaim: {
    apiVersion: "v1",
    kind: "PersistentVolumeClaim",
    formatter: "pvcSuccessTable",
    namespaced: true,
  },
  pvc: {
    apiVersion: "v1",
    kind: "PersistentVolumeClaim",
    formatter: "pvcSuccessTable",
    namespaced: true,
  },
  persistentvolume: {
    apiVersion: "v1",
    kind: "PersistentVolume",
    formatter: "pvTable",
    namespaced: false,
  },
  pv: {
    apiVersion: "v1",
    kind: "PersistentVolume",
    formatter: "pvTable",
    namespaced: false,
  },
  pod: {
    apiVersion: "v1",
    kind: "Pod",
    formatter: "podTable",
    namespaced: true,
  },
  deployment: {
    apiVersion: "apps/v1",
    kind: "Deployment",
    formatter: "deploymentSuccessTable",
    namespaced: true,
  },
  role: {
    apiVersion: "rbac.authorization.k8s.io/v1",
    kind: "Role",
    formatter: "roleSuccessTable",
    namespaced: true,
  },
  clusterrole: {
    apiVersion: "v1",
    kind: "ClusterRole",
    formatter: "roleSuccessTable",
    namespaced: true,
  },
  rolebinding: {
    apiVersion: "v1",
    kind: "RoleBinding",
    formatter: "roleBindingSuccessTable",
    namespaced: true,
  },
  clusterrolebinding: {
    apiVersion: "rbac.authorization.k8s.io/v1",
    kind: "ClusterRoleBinding",
    formatter: "roleBindingSuccessTable",
    namespaced: false,
  },
  ibuilder: {
    apiVersion: "tekton.dev/v1beta1",
    kind: "PipelineRun",
    formatter: "pipelineResourceSuccessTable",
    namespaced: false,
  },
  imagebuilder: {
    apiVersion: "tekton.dev/v1beta1",
    kind: "PipelineRun",
    formatter: "pipelineResourceSuccessTable",
    namespaced: false,
  },
};

const fetchAndPrint = (object, formatter) => {
  getKubernetesResourceDefault(object)
    .then((res) => console.log(tableGenerator[formatter](res.body)))
    .catch((err) => console.log(tableGenerator.errTable(err.body)));
};

module.exports = {
  getResource(resourceList, namespace, resourceName) {
    if (resourceList[0] === "*") {
      listResources(resourceName, namespace)
        .then((res) => {
          const resources =
            res.body.items.length === 0
              ? [{ metadata: { name: "Empty", namespace } }]
              : res.body.items;
          console.log(tableGenerator.listResource(resources));
        })
        .catch((err) => console.log(err.body));
      return;
    }

    resourceList.forEach((resource) => {
      if (resourceName === "iconfig" || resourceName === "imageconfig") {
        fetchAndPrint(
          {
            apiVersion: "tekton.dev/v1alpha1",
            kind: "PipelineResource",
            metadata: { name: `${resource}-image`, namespace },
          },
          "pipelineResourceSuccessTable"
        );
        fetchAndPrint(
          {
            apiVersion: "tekton.dev/v1alpha1",
            kind: "PipelineResource",
            metadata: { name: `${resource}-git`, namespace },
          },
          "pipelineResourceSuccessTable"
        );
        return;
      }

      if (resourceName === "podlogs") {
        getPodLogs(resource, namespace)
          .then((res) => console.log(tableGenerator.successTable(res.body)))
          .catch((err) => console.log(tableGenerator.logsTable(err.body)));
        return;
      }

      const entry = RESOURCE_REGISTRY[resourceName];
      if (!entry) return;
      const object = {
        apiVersion: entry.apiVersion,
        kind: entry.kind,
        metadata: { name: resource, ...(entry.namespaced && { namespace }) },
      };
      fetchAndPrint(object, entry.formatter);
    });
  },
};
