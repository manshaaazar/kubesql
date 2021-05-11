const { deleteKubernetesResourceDefault } = require("./k8s");
const tableGenerator = require("./table");
const _ = require("lodash");
module.exports = {
  delete(namespace, resource, resourceName) {
    resource = resource.split("=");
    resource = _.capitalize(resource[1]);
    resourceName = resourceName.split("=");
    if (resource === "Role" || resource === "RoleBinding") {
      const object = {
        apiVersion: "rbac.authorization.k8s.io/v1",
        kind: resource,
        metadata: { name: resourceName[1], namespace: namespace },
      };
      deleteKubernetesResourceDefault(object)
        .then((res) => tableGenerator.deleteSuccessTable(res.body))
        .catch((err) => tableGenerator.deleteErrTable(err.body));
    } else if (resource === "Cluster" || resource === "ClusterRoleBinding") {
      const object = {
        apiVersion: "rbac.authorization.k8s.io/v1",
        kind: resource,
        metadata: { name: resourceName[1] },
      };
      deleteKubernetesResourceDefault(object)
        .then((res) => tableGenerator.deleteSuccessTable(res.body))
        .catch((err) => tableGenerator.deleteErrTable(err.body));
    } else if (resource === "Deployment") {
      const object = {
        apiVersion: "apps/v1",
        kind: resource,
        metadata: { name: resourceName[1], namespace: namespace },
      };
      deleteKubernetesResourceDefault(object)
        .then((res) => tableGenerator.deleteSuccessTable(res.body))
        .catch((err) => tableGenerator.deleteErrTable(err.body));
    } else if (resource === "Namespace") {
      const object = {
        apiVersion: "v1",
        kind: resource,
        metadata: { name: resourceName[1] },
      };
      deleteKubernetesResourceDefault(object)
        .then((res) => tableGenerator.deleteSuccessTable(res.body))
        .catch((err) => tableGenerator.deleteErrTable(err.body));
    } else if (resource === "iConfig") {
      const gitResource = {
        apiVersion: "tekton.dev/v1alpha1",
        kind: "PipelineResource",
        metadata: {
          name: `${resourceName}-git`,
          namespace: namespace,
        },
      };
      const ImageResource = {
        apiVersion: "tekton.dev/v1alpha1",
        kind: "PipelineResource",
        metadata: {
          name: `${resourceName}-image`,
          namespace: namespace,
        },
      };
      deleteKubernetesResourceDefault(gitResource)
        .then((res) => tableGenerator.deleteSuccessTable(res.body))
        .catch((err) => tableGenerator.deleteErrTable(err.body));
      deleteKubernetesResourceDefault(ImageResource)
        .then((res) => tableGenerator.deleteSuccessTable(res.body))
        .catch((err) => tableGenerator.deleteErrTable(err.body));
    } else {
      const object = {
        apiVersion: "v1",
        kind: resource,
        metadata: { name: resourceName[1], namespace: namespace },
      };
      deleteKubernetesResourceDefault(object)
        .then((res) => console.log(tableGenerator.deleteSuccessTable(res.body)))
        .catch((err) => console.log(tableGenerator.deleteErrTable(err.body)));
    }
  },
};
