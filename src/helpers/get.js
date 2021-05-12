const {
  getKubernetesResourceDefault,
  listResources,
  getPodLogs,
} = require("./k8s");

const tableGenerator = require("./table");
module.exports = {
  getResource(resourceList, namespace, resourceName) {
    if (resourceList[0] === "*") {
      listResources(resourceName, namespace)
        .then((res) => {
          console.log("res", res.body);
          const resources =
            res.body.items.length === 0
              ? [
                  {
                    metadata: {
                      name: "Empty",
                      namespace: namespace,
                    },
                  },
                ]
              : res.body.items;
          console.log(tableGenerator.listResource(resources));
        })
        .catch((err) => console.log(err));
    } else {
      resourceList.forEach((resource) => {
        if (resourceName === "Role") {
          const object = {
            apiVersion: "rbac.authorization.k8s.io/v1",
            kind: resourceName,
            metadata: { name: resource, namespace: namespace },
          };
          getKubernetesResourceDefault(object)
            .then((res) =>
              console.log(tableGenerator.roleSuccessTable(res.body))
            )
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (resourceName === "ClusterRoleBinding") {
          const object = {
            apiVersion: "rbac.authorization.k8s.io/v1",
            kind: resourceName,
            metadata: { name: resource },
          };
          getKubernetesResourceDefault(object)
            .then((res) =>
              console.log(tableGenerator.roleBindingSuccessTable(res.body))
            )
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (resourceName === "Deployment") {
          const object = {
            apiVersion: "apps/v1",
            kind: resourceName,
            metadata: { name: resource, namespace: namespace },
          };
          getKubernetesResourceDefault(object)
            .then((res) =>
              console.log(tableGenerator.deploymentSuccessTable(res.body))
            )
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (resourceName === "Namespace") {
          const object = {
            apiVersion: "v1",
            kind: resourceName,
            metadata: { name: resource },
          };
          getKubernetesResourceDefault(object)
            .then((res) => console.log(tableGenerator.successTable(res.body)))
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (
          resourceName === "iConfig" ||
          resourceName === "imageConfig"
        ) {
          const gitResource = {
            apiVersion: "tekton.dev/v1alpha1",
            kind: "PipelineResource",
            metadata: {
              name: `${resource}-git`,
              namespace: namespace,
            },
          };
          const ImageResource = {
            apiVersion: "tekton.dev/v1alpha1",
            kind: "PipelineResource",
            metadata: {
              name: `${resource}-image`,
              namespace: namespace,
            },
          };
          getKubernetesResourceDefault(ImageResource)
            .then((res) =>
              console.log(tableGenerator.pipelineResourceSuccessTable(res.body))
            )
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
          getKubernetesResourceDefault(gitResource)
            .then((res) =>
              console.log(tableGenerator.pipelineResourceSuccessTable(res.body))
            )
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (
          resourceName === "iBuilder" ||
          resourceName === "imageBuilder"
        ) {
          const object = {
            apiVersion: "tekton.dev/v1beta1",
            kind: "PipelineRun",
            metadata: {
              name: resource,
            },
          };
          getKubernetesResourceDefault(object)
            .then((res) =>
              console.log(tableGenerator.pipelineResourceSuccessTable(res.body))
            )
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (resourceName === "Service") {
          const object = {
            apiVersion: "v1",
            kind: resourceName,
            metadata: { name: resource, namespace: namespace },
          };
          console.log("object", object);
          getKubernetesResourceDefault(object)
            .then((res) =>
              console.log(tableGenerator.serviceSuccessTable(res.body))
            )
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (resourceName === "ServiceAccount") {
          const object = {
            apiVersion: "v1",
            kind: resourceName,
            metadata: { name: resource, namespace: namespace },
          };

          getKubernetesResourceDefault(object)
            .then((res) => console.log(tableGenerator.saSuccessTable(res.body)))
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (resourceName === "Secret") {
          const object = {
            apiVersion: "v1",
            kind: resourceName,
            metadata: { name: resource, namespace: namespace },
          };
          getKubernetesResourceDefault(object)
            .then((res) =>
              console.log(tableGenerator.secretSuccessTable(res.body))
            )
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (resourceName === "ClusterRole") {
          const object = {
            apiVersion: "v1",
            kind: resourceName,
            metadata: { name: resource, namespace: namespace },
          };
          console.log("object", object);
          getKubernetesResourceDefault(object)
            .then((res) =>
              console.log(tableGenerator.roleSuccessTable(res.body))
            )
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (resourceName === "RoleBinding") {
          const object = {
            apiVersion: "v1",
            kind: resourceName,
            metadata: { name: resource, namespace: namespace },
          };

          getKubernetesResourceDefault(object)
            .then((res) =>
              console.log(tableGenerator.roleBindingSuccessTable(res.body))
            )
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (
          resourceName === "PersistentVolumeClaim" ||
          resourceName === "pvc"
        ) {
          const object = {
            apiVersion: "v1",
            kind: "PersistentVolumeClaim",
            metadata: { name: resource, namespace: namespace },
          };
          getKubernetesResourceDefault(object)
            .then((res) =>
              console.log(tableGenerator.pvcSuccessTable(res.body))
            )
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (
          (resourceName === "pv", resourceName === "PersistentVolume")
        ) {
          const object = {
            apiVersion: "v1",
            kind: resourceName,
            metadata: { name: resource, namespace: namespace },
          };

          getKubernetesResourceDefault(object)
            .then((res) =>
              console.log(tableGenerator.pvcSuccessTable(res.body))
            )
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (resourceName === "ResourceQuota") {
          const object = {
            apiVersion: "v1",
            kind: "ResourceQuota",
            metadata: { name: resource, namespace: namespace },
          };
          console.log("object", object);
          getKubernetesResourceDefault(object)
            .then((res) =>
              console.log(tableGenerator.resourceQuotaTable(res.body))
            )
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (resourceName === "Pod") {
          const object = {
            apiVersion: "v1",
            kind: "Pod",
            metadata: { name: resource, namespace: namespace },
          };

          getKubernetesResourceDefault(object)
            .then((res) => {
              console.log(tableGenerator.podTable(res.body));
            })
            .catch((err) => {
              console.log(tableGenerator.errTable(err.body));
            });
        } else if (resourceName === "PodLogs") {
          getPodLogs(resource, namespace)
            .then((res) => console.log(tableGenerator.successTable(res.body)))
            .catch((err) => console.log(tableGenerator.logsTable(err.body)));
        }
      });
    }
  },
};
