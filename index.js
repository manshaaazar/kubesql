#!/usr/bin/env node

const cli = require("commander");
const queryParser = require("./src/helpers/commandParser");
const resourceGenerator = require("./src/helpers/resourceObject");
const { loadKubernetesResourceDefault } = require("./src/helpers/k8s");
const tableGenerator = require("./src/helpers/table");
const { padEnd } = require("lodash");
cli.version("1.0.0").description("kubernetes strucuted query language");
// create namespace command
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
  `
  );
// create namesapce command
create
  .command("namespace <name> ")
  .alias("n")
  .description("create a namespace")
  .action((name) => {
    const values = {
      name,
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
      data: {},
    };
    parsedQuery.forEach((entry, index) => {
      entry = entry.split(" ");
      if (index === 0) {
        values[`${entry[0]}`] = entry[1];
      } else {
        if (values.type === "opaque") {
          values.data[`${entry[0]}`] = entry[1];
        } else {
          values[`${entry[0]}`] = entry[1];
        }
      }
    });
    // console.log("values", values);
    const secretManifest = resourceGenerator.secret(values);
    loadKubernetesResourceDefault(secretManifest)
      .then((res) => {
        console.log("res", res.body);
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
      .catch((err) => console.log(tableGenerator.errTable(err.body)));
  })
  .addHelpText(
    "after",
    `
  Example: 
    $ secret <secretName> "(secret value,secret value, ...)"
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
      const roleManifest = resourceGenerator.role(values);
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
cli.parse(process.argv);
