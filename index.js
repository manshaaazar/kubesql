#!/usr/bin/env node

const cli = require("commander");
const queryParser = require("./src/helpers/commandParser");
const resourceGenerator = require("./src/helpers/resourceObject");
const {
  loadKubernetesResourceDefault,
  updateKubernetesResourceDefault,
} = require("./src/helpers/k8s");
const tableGenerator = require("./src/helpers/table");
const _ = require("lodash");
const deleteComHandler = require("./src/helpers/delete");
const sqlParser = require("sqlite-parser");
const { getResource } = require("./src/helpers/get");
cli.version("1.0.0").description("kubernetes strucuted query language");
const create = cli
  .command("create")
  .description("create any kubernetes object resource ")
  .addHelpText(
    "after",
    `
  Examples:
    $ create namespace                      | n 
    $ create secret                         | sec
    $ create service                        | ser
    $ create persistentVolume               | pv
    $ create persistentVolumeClaim          | pvc 
    $ create rsourceQuota                   | rq
    $ create role                           | r
    $ create roleBinding                    | rb 
    $ create clusterRole                    | cr
    $ create clsuterRoleBinding             | crb
    $ create deployment                     | dep 
    $ create statefulSet                    | ss
    $ create imageConfig                    | iConfig
    $ create imageBuilder                   | iBuilder
    `
  );
// create namesapce command
create
  .command("namespace <keys> ")
  .alias("n")
  .description("create a namespace")
  .action((keys) => {
    let parsedQuery = queryParser.parse(keys);
    console.log("parsedQuery", parsedQuery);
    parsedQuery = parsedQuery[0].split(" ");
    const values = {
      name: parsedQuery[1],
    };
    const namespaceManifest = resourceGenerator.namespace(values);
    loadKubernetesResourceDefault(namespaceManifest)
      .then((res) => console.log(tableGenerator.successTable(res.body)))
      .catch((err) => console.log(tableGenerator.errTable(err.body)));
  })
  .addHelpText(
    "after",
    `
  Example: 
    $ namespace "(name mynamespace)"
  `
  );
// create secret command
create
  .command("secret <name> <keys>")
  .alias("sec")
  .description("create a secret")
  .action((name, keys) => {
    console.log(keys);
    const parsedQuery = queryParser.parse(keys);
    const values = {
      name,
      annotations: {},
      data: {},
    };
    parsedQuery.forEach((entry) => {
      entry = entry.split(" ");
      if (entry[0] === "namespace") {
        values.namespace = entry[1];
      } else if (entry[0] === "type") {
        values.type = entry[1];
      } else if (entry[0] === "annotation") {
        values.annotations[`${entry[1]}`] = entry[2];
      } else {
        entry[1] = entry[1].replace(/"/g, " ");
        entry[1] = _.trim(entry[1]);
        values.data[`${entry[0]}`] = entry[1];
      }
    });
    console.log("values", values);
    const secretManifest = resourceGenerator.secret(values);
    loadKubernetesResourceDefault(secretManifest)
      .then((res) => {
        const { kind, apiVersion, metadata, data, type } = res.body;
        console.log(
          tableGenerator.secretSuccessTable({
            kind,
            apiVersion,
            metadata,
            data,
            type,
          })
        );
      })
      .catch((err) => {
        console.log(tableGenerator.errTable(err.body));
      });
  })
  .addHelpText(
    "after",
    `
  Example: 
    $ secret <secretName> "(namespace default,username value,password value, ...)"
  `
  );
create
  .command("service <name> <keys>")
  .alias("ser")
  .description("create a service")
  .action((name, keys) => {
    //console.log("keys", keys);
    const parsedQuery = queryParser.parse(keys);
    //  console.log("parsedQuery", parsedQuery);
    const values = {
      name,
    };
    parsedQuery.forEach((entry) => {
      entry = entry.split(" ");
      values[`${entry[0]}`] = entry[1];
    });
    console.log("values", values);
    const serviceManifest = resourceGenerator.service(values);
    loadKubernetesResourceDefault(serviceManifest)
      .then((res) => console.log(tableGenerator.serviceSuccessTable(res.body)))
      .catch((err) => console.log(tableGenerator.errTable(err.body)));
  })
  .addHelpText(
    "after",
    `
  Example:
    $ create service <serviceName> "(namesapce default,type loadBalancer,app nginx, port 3000)"
  `
  );
create
  .command("persistentVolumeClaim <name> <keys>")
  .alias("pvc")
  .description("create a persistentVolumeClaim")
  .action((name, keys) => {
    const parsedQuery = queryParser.parse(keys);
    let values = {
      name,
    };
    parsedQuery.forEach((entry) => {
      entry = entry.split(" ");
      values[`${entry[0]}`] = entry[1];
    });
    const persistentVolumeClaimManifest = resourceGenerator.pvc(values);
    loadKubernetesResourceDefault(persistentVolumeClaimManifest)
      .then((res) => console.log(tableGenerator.pvcSuccessTable(res.body)))
      .catch((err) => console.log(tableGenerator.errTable(err.body)));
  })
  .addHelpText(
    "after",
    `
  Example:
    $ create persistentVolumeClaim | pvc <pvName> "(namepsace default,label mypvc,pvSelector mypv,accessModes ReadWriteOnce,sc default,storage 1Gi)" 
  `
  );
create
  .command("persistentVolume <name> <keys>")
  .alias("pv")
  .description("create a persistentVolume")
  .action((name, keys) => {
    const parsedQuery = queryParser.parse(keys);
    const values = {
      name,
    };
    parsedQuery.forEach((entry) => {
      entry = entry.split(" ");
      values[`${entry[0]}`] = entry[1];
    });
    const persistentVolumeManifest = resourceGenerator.pv(values);
    console.log("pvManifest", persistentVolumeManifest);
    loadKubernetesResourceDefault(persistentVolumeManifest)
      .then((res) => console.log(res))
      .catch((err) => console.log(err.body));
  })
  .addHelpText(
    "after",
    `
    Example:
      $ create persistentVolume | pv <pvName> "(namespace default,label mypv,storage 1Gi,accessModes ReadWriteOnce,sc default,reclaimPolicy Retained)"
  `
  );
create
  .command("resourceQuota <name> <keys>")
  .alias("rq")
  .description("create a resource quota")
  .action((name, keys) => {
    const parsedQuery = queryParser.parse(keys);
    const values = {
      name,
    };
    parsedQuery.forEach((entry) => {
      entry = entry.split(" ");
      values[`${entry[0]}`] = entry[1];
    });
    const resourceQuotaManifest = resourceGenerator.resourceQuota(values);
    console.log("resourceQuota", resourceQuotaManifest);
    loadKubernetesResourceDefault(resourceQuotaManifest)
      .then((res) => console.log(tableGenerator.resourceQuotaTable(res.body)))
      .catch((err) => console.log(tableGenerator.errTable(err.body)));
  })
  .addHelpText(
    "after",
    `
Example:
  $ create resourceQuota | rq <resourceQuotaName> "(namespace default,configmaps 2,secrets 4, ...)"
`
  );
create
  .command("role <name> <keys>")
  .alias("r")
  .description("create a role")
  .action((name, keys) => {
    const parsedQuery = queryParser.parse(keys);
    const values = {
      name,
      rules: [],
    };
    parsedQuery.forEach((entry, index) => {
      if (index === 0) {
        entry = entry.split(" ");
        values[`${entry[0]}`] = entry[1];
      } else {
        const rule = {
          apiGroups: [
            "",
            "batch",
            "extensions",
            "apps",
            "rbac.authorization.k8s.io",
            "apiextensions.k8s.io",
            "admissionregistration.k8s.io",
            "policy",
          ],
          resources: [],
          verbs: [],
        };
        entry = entry.split(" ");
        rule.verbs.push(entry[0]);
        entry.shift();
        rule.resources = entry;
        values.rules.push(rule);
      }
    });
    const roleManifest = resourceGenerator.role(values);
    loadKubernetesResourceDefault(roleManifest)
      .then((res) => console.log(tableGenerator.roleSuccessTable(res.body)))
      .catch((err) => console.log(tableGenerator.errTable(err.body)));
  })
  .addHelpText(
    "after",
    `
  Example:
    $ create role | r <roleName> "(namespace default, get deployment services,put deployment services, ...)"
  `
  );
create
  .command("rolebinding <name> <keys>")
  .alias("rb")
  .description("crrate a role binding")
  .action((name, keys) => {
    const parsedQuery = queryParser.parse(keys);
    const values = {
      name,
    };
    parsedQuery.forEach((entry) => {
      entry = entry.split(" ");
      values[`${entry[0]}`] = entry[1];
    });
    const roleBindingManifest = resourceGenerator.roleBinding(values);
    loadKubernetesResourceDefault(roleBindingManifest)
      .then((res) =>
        console.log(tableGenerator.roleBindingSuccessTable(res.body))
      )
      .catch((err) => console.log(tableGenerator.errTable(err.body)));
  })
  .addHelpText(
    "after",
    `
  Example:
    $ create rolebinding | rb <roleBindingName> "(namespace default,subjectKind ServiceAccount,subjectName default,role roleName)"
  `
  );
create
  .command("clusterRole <name> <keys>")
  .alias("cr")
  .description("create a cluster role")
  .action((name, keys) => {
    const parsedQuery = queryParser.parse(keys);
    const values = {
      name,
      rules: [],
    };
    parsedQuery.forEach((entry, index) => {
      if (index === 0) {
        entry = entry.split(" ");
        values[`${entry[0]}`] = entry[1];
      } else {
        const rule = {
          apiGroups: [
            "",
            "batch",
            "extensions",
            "apps",
            "rbac.authorization.k8s.io",
            "apiextensions.k8s.io",
            "admissionregistration.k8s.io",
            "policy",
          ],
          resources: [],
          verbs: [],
        };
        entry = entry.split(" ");
        rule.verbs.push(entry[0]);
        entry.shift();
        rule.resources = entry;
        values.rules.push(rule);
      }
    });
    const clusterRoleManifest = resourceGenerator.clusterRole(values);
    loadKubernetesResourceDefault(clusterRoleManifest)
      .then((res) => console.log(tableGenerator.roleSuccessTable(res.body)))
      .catch((err) => console.log(tableGenerator.errTable(err.body)));
  })
  .addHelpText(
    "after",
    `
  Example:
    $ create clusterRole | cr <clusterRoleName> "(namespace default, get deployment services,put deployment services, ...)"
  `
  );
create
  .command("clusterRoleBinding <name> <keys>")
  .alias("crb")
  .description("crrate a cluster role binding")
  .action((name, keys) => {
    const parsedQuery = queryParser.parse(keys);
    const values = {
      name,
    };
    parsedQuery.forEach((entry) => {
      entry = entry.split(" ");
      values[`${entry[0]}`] = entry[1];
    });
    const roleBindingManifest = resourceGenerator.roleBinding(values);
    loadKubernetesResourceDefault(roleBindingManifest)
      .then((res) =>
        console.log(tableGenerator.roleBindingSuccessTable(res.body))
      )
      .catch((err) => console.log(tableGenerator.errTable(err.body)));
  })
  .addHelpText(
    "after",
    `
  Example:
    $ create clusterRoleBinding | crb <clusterRoleBindingName> "(namespace default,subjectKind ServiceAccount,subjectName default,role roleName)"
  `
  );
create
  .command("deployment <name> <keys>")
  .alias("deploy")
  .description("create a deployment")
  .action((name, keys) => {
    const parsedQuery = queryParser.parse(keys);
    console.log("parsedQuery", parsedQuery);
    const values = {
      name,
      volumePaths: [],
    };
    parsedQuery.forEach((entry) => {
      entry = entry.split(" ");
      if (entry[0] === "volumes") {
        entry.shift();
        values.volumes = entry;
        entry.forEach((entry) => {
          values.volumePaths.push({ name: entry });
        });
      } else if (entry[0] === "volumePaths") {
        entry.shift();
        entry.forEach((entry, index) => {
          values.volumePaths[index].mountPath = entry;
        });
      } else {
        values[`${entry[0]}`] = entry[1];
      }
    });
    const deploymentManifest = resourceGenerator.deployment(values);
    console.log("deploymentManifest", deploymentManifest);
    loadKubernetesResourceDefault(deploymentManifest)
      .then((res) =>
        console.log(tableGenerator.deploymentSuccessTable(res.body))
      )
      .catch((err) => console.log(tableGenerator.errTable(err.body)));
  })
  .addHelpText(
    "after",
    `
  Example:
    $ create deployment | deploy <deploymentName> "(namespace default,port 3000,image manshaaazar/knight:latest,label mydpeloyment, ...)"
  `
  );
create
  .command("serviceAccount <name> <keys>")
  .alias("sa")
  .description("create a service account")
  .action((name, keys) => {
    const parsedQuery = queryParser.parse(keys);
    const values = {
      name,
      secrets: [],
    };
    parsedQuery.forEach((entry) => {
      entry = entry.split(" ");
      if (entry[0] === "namespace") {
        values[`${entry[0]}`] = entry[1];
      } else {
        values.secrets.push({ name: entry[1] });
      }
    });

    const serviceAccountManifest = resourceGenerator.serviceAccount(values);
    loadKubernetesResourceDefault(serviceAccountManifest)
      .then((res) => console.log(tableGenerator.saSuccessTable(res.body)))
      .catch((err) => console.log(tableGenerator.errTable(err.body)));
  })
  .addHelpText(
    "after",
    `
  Example:
    $ create serviceAccount | sa <serviceAccountName> "(namespace default,secret secret1,secret secret2, ...)"
  `
  );
create
  .command("imageConfig <name> <keys>")
  .alias("iConfig")
  .description("create an imageConfig to configure the image creation process")
  .action((name, keys) => {
    const values = {};
    const parsedQuery = queryParser.parse(keys);
    parsedQuery.forEach((entry) => {
      entry = entry.split(" ");
      values[`${entry[0]}`] = entry[1];
    });
    const { imageUrl, gitUrl, branch } = values;
    const imageManifest = resourceGenerator.imageResources({
      resourceName: name,
      type: "image",
      imageUrl,
    });
    const gitManifest = resourceGenerator.imageResources({
      resourceName: name,
      type: "git",
      gitUrl,
      branch,
    });
    const imageBuildPushTaskManifest =
      resourceGenerator.imageBuildPushTaskResource();
    const { pipeline, pipelinePvc } = resourceGenerator.pipeline();
    // load tekton pipeline
    // load tekton image build push task
    // load image build push task resources
    // load tekton pvc
    // load pipeline run
    loadKubernetesResourceDefault(imageBuildPushTaskManifest)
      .then((res) =>
        console.log(tableGenerator.imagebuildPushTaskSuccessTable(res.body))
      )
      .catch((err) => {
        return;
      });
    loadKubernetesResourceDefault(pipeline)
      .then((res) =>
        console.log(tableGenerator.imagebuildPushTaskSuccessTable(res.body))
      )
      .catch((err) => {
        return;
      });
    loadKubernetesResourceDefault(pipelinePvc)
      .then((res) => console.log(tableGenerator.pvcSuccessTable(res.body)))
      .catch((err) => {
        return;
      });
    loadKubernetesResourceDefault(imageManifest)
      .then((res) =>
        console.log(tableGenerator.pipelineResourceSuccessTable(res.body))
      )
      .catch((err) => console.log(tableGenerator.errTable(err.body)));
    loadKubernetesResourceDefault(gitManifest)
      .then((res) =>
        console.log(tableGenerator.pipelineResourceSuccessTable(res.body))
      )
      .catch((err) => tableGenerator.errTable(err.body));
  })

  .addHelpText(
    "after",
    `
  Example:
    $ create image | img <imageName> "(gitUrl https://github.com/manshaaazar/kubesql.git,branch master,imageUrl manshahesan/knight:latest)" 
  `
  );
create
  .command("imageBuilder <name> <keys>")
  .alias("iBuilder")
  .description("create a imageBuilder to trigger image creation process")
  .action((name, keys) => {
    const values = { name };
    const parsedQuery = queryParser.parse(keys);
    parsedQuery.forEach((entry) => {
      entry = entry.split(" ");
      values[`${entry[0]}`] = entry[1];
    });
    const imageBuilderManifest = resourceGenerator.pipelineRun(values);
    loadKubernetesResourceDefault(imageBuilderManifest)
      .then((res) =>
        console.log(tableGenerator.pipelineRunSuccessTable(res.body))
      )
      .catch((err) => console.log(tableGenerator.errTable(err.body)));
  })
  .addHelpText(
    "after",
    `
  Example: 
    $ create a imageBuilder | iBuilder <imageBuilderName> '(namespace default,sa serviceAccountName,gitResources resourceName,registryResource resourceName)'
  `
  );
cli
  .command("delete <from> <namespace> <where> <resource> <and> <resourceName>")
  .description("delete any kubernetes object resource ")
  .action((from, namespace, where, resource, and, resourName) => {
    deleteComHandler.delete(namespace, resource, resourName);
  })
  .addHelpText(
    "after",
    `
Example:
  $ delete from denouement where resource=service and name=den-service
`
  );
cli
  .arguments("<query>")
  .option("-q", "sql query")
  .description("read any kubernetes object resource")
  .action(async (query) => {
    const options = cli.opts();
    if (options.q) {
      const parsedQuery = await sqlParser(query);
      const { statement } = parsedQuery;
      if (statement[0].variant === "select") {
        // select query logic goes here
        const { result, from, where } = parsedQuery.statement[0];
        let resourceList = [];
        resourceList = result.map((resource) => {
          if (resource.variant === "text") {
            return resource.value;
          } else {
            return resource.name;
          }
        });
        const { name: namespace } = from;
        const { operation } = where[0];
        if (operation === "=") {
          const { right: resourceName } = where[0];
          let { name } = resourceName;
          console.log("name", name);
          console.log("resourceLsit", resourceList);
          console.log("namespace", namespace);
          getResource(resourceList, namespace, name);
        } else if (operation === "and") {
          const { left, right } = where[0];
          console.log("where", where[0]);
        }
      } else if (statement[0].variant === "update") {
        // update query logic goes here
        const { into, set, where } = statement[0];
        const { name: resourceName } = into;
        const { name: resourceType } = where[0].right;
        if (resourceType === "secret") {
          console.log("resourceName", resourceName);
          console.log("resourceType", resourceType);
          const values = {
            name: resourceName,
            data: {},
          };
          set.forEach((obj) => {
            values.data[`${obj.target.name}`] = obj.value.value;
          });
          console.log("values", values);
          const object = resourceGenerator.secret(values);
          console.log("object", object);
          updateKubernetesResourceDefault(object)
            .then((res) =>
              console.log(tableGenerator.secretSuccessTable(res.body))
            )
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (resourceType === "service") {
          const values = {
            name: resourceName,
          };
          set.forEach((obj) => {
            values[`${obj.target.name}`] = obj.value.value;
          });
          const object = resourceGenerator.service(values);
          console.log("object", object);
          updateKubernetesResourceDefault(object)
            .then((res) =>
              console.log(tableGenerator.serviceSuccessTable(res.body))
            )
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else if (resourceType === "deployment") {
          const values = {
            name: resourceName,
          };
          set.forEach((obj) => {
            values[`${obj.target.name}`] = obj.value.value;
          });
          const object = resourceGenerator.deployment(values);
          console.log("object", object);
          updateKubernetesResourceDefault(object)
            .then((res) =>
              console.log(tableGenerator.deploymentSuccessTable(res.body))
            )
            .catch((err) => console.log(tableGenerator.errTable(err.body)));
        } else {
          console.log("pending");
        }
      } else {
        console.log("query not supported");
      }
    }
    /*
    getResource(resourceList, namespace, resourceName);
    */
  })
  .addHelpText(
    "after",
    `
  Example:
    $ ksql -q  "select secret1,secret2 where resource=Secret"
  `
  );
cli.parseAsync(process.argv);
