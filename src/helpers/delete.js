const { deleteKubernetesResourceDefault } = require("./k8s");
const tableGenerator = require("./table");
const _ = require("lodash");
module.exports = {
  delete(namespace, resource, resourceName) {
    resource = resource.split("=");
    resource = _.capitalize(resource[1]);
    resourceName = resourceName.split("=");
    const object = {
      apiVersion: "",
      kind: "",
      metadata: { name: "" },
    };
    if (resource === "Namespace") {
      object.apiVersion = "v1";
      object.kind = resource;
      object.metadata.name = resourceName[1];
    }
    deleteKubernetesResourceDefault(object)
      .then((res) => console.log(tableGenerator.deleteSuccessTable(res.body)))
      .catch((err) => console.log(tableGenerator.deleteErrTable(err.body)));
  },
};
