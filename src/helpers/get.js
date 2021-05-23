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
        .catch((err) => console.log(err.body));
    } else {
      resourceList.forEach((resource) => {
        if (resourceName === "role") {
          const object = {
            apiVersion: "rbac.authorization.k8s.io/v1",
            kind: "Role",
            metadata: { name: resource, namespace: namespace },
          };
          getKubernetesResourceDefault(object)
            .then((res) =>
              console.log(tableGenerator.roleSuccessTable(res.body))
            )
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (resourceName === "clusterrolebinding") {
          const object = {
            apiVersion: "rbac.authorization.k8s.io/v1",
            kind: "ClusterRoleBinding",
            metadata: { name: resource },
          };
          getKubernetesResourceDefault(object)
            .then((res) =>
              console.log(tableGenerator.roleBindingSuccessTable(res.body))
            )
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (resourceName === "deployment") {
          const object = {
            apiVersion: "apps/v1",
            kind: "Deployment",
            metadata: { name: resource, namespace: namespace },
          };
          getKubernetesResourceDefault(object)
            .then((res) => {
              console.log("res", res.body);
              console.log(tableGenerator.deploymentSuccessTable(res.body));
            })
            .catch((err) => {
              console.log(tableGenerator.errTable(err.body));
            });
        } else if (resourceName === "namespace") {
          const object = {
            apiVersion: "v1",
            kind: "Namespace",
            metadata: { name: resource },
          };
          getKubernetesResourceDefault(object)
            .then((res) => console.log(tableGenerator.successTable(res.body)))
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (
          resourceName === "iconfig" ||
          resourceName === "imageconfig"
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
          resourceName === "ibuilder" ||
          resourceName === "imagebuilder"
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
        } else if (resourceName === "service") {
          const object = {
            apiVersion: "v1",
            kind: "Service",
            metadata: { name: resource, namespace: namespace },
          };
          console.log("object", object);
          getKubernetesResourceDefault(object)
            .then((res) =>
              console.log(tableGenerator.serviceSuccessTable(res.body))
            )
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (resourceName === "serviceaccount") {
          const object = {
            apiVersion: "v1",
            kind: "ServiceAccount",
            metadata: { name: resource, namespace: namespace },
          };

          getKubernetesResourceDefault(object)
            .then((res) => {
              console.log(res.body);
              console.log(tableGenerator.saSuccessTable(res.body));
            })
            .catch((err) => {
              console.log(err);
              console.log(tableGenerator.errTable(err.body));
            });
        } else if (resourceName === "secret") {
          const object = {
            apiVersion: "v1",
            kind: "Secret",
            metadata: { name: resource, namespace: namespace },
          };
          getKubernetesResourceDefault(object)
            .then((res) =>
              console.log(tableGenerator.secretSuccessTable(res.body))
            )
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (resourceName === "clusterrole") {
          const object = {
            apiVersion: "v1",
            kind: "ClusterRole",
            metadata: { name: resource, namespace: namespace },
          };
          console.log("object", object);
          getKubernetesResourceDefault(object)
            .then((res) =>
              console.log(tableGenerator.roleSuccessTable(res.body))
            )
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (resourceName === "rolebinding") {
          const object = {
            apiVersion: "v1",
            kind: "RoleBinding",
            metadata: { name: resource, namespace: namespace },
          };

          getKubernetesResourceDefault(object)
            .then((res) =>
              console.log(tableGenerator.roleBindingSuccessTable(res.body))
            )
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (
          resourceName === "persistentvolumeclaim" ||
          resourceName === "pvc"
        ) {
          const object = {
            apiVersion: "v1",
            kind: "PersistentVolumeClaim",
            metadata: { name: resource, namespace: namespace },
          };
          getKubernetesResourceDefault(object)
            .then((res) => {
              console.log("res", res);
              console.log(tableGenerator.pvcSuccessTable(res.body));
            })
            .catch((err) => {
              console.log("err", err);
              console.log(tableGenerator.errTable(err.body));
            });
        } else if (
          resourceName === "pv" ||
          resourceName === "persistentvolume"
        ) {
          const object = {
            apiVersion: "v1",
            kind: "PersistentVolume",
            metadata: { name: resource, namespace: namespace },
          };
          getKubernetesResourceDefault(object)
            .then((res) => {
              //console.log("res", res);
              console.log(tableGenerator.pvTable(res.body));
            })
            .catch((err) => {
              console.log("err", err);
              //   console.log(tableGenerator.errTable(err.body));
            });
        } else if (resourceName === "resourcequota") {
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
        } else if (resourceName === "pod") {
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
        } else if (resourceName === "podlogs") {
          getPodLogs(resource, namespace)
            .then((res) => console.log(tableGenerator.successTable(res.body)))
            .catch((err) => console.log(tableGenerator.logsTable(err.body)));
        }
      });
    }
  },
};
