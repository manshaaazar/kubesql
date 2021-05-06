#!/usr/bin/env node

const cli = require("commander");
const queryParser = require("./src/helpers/commandParser");
const resourceGenerator = require("./src/helpers/resourceObject");
const { loadKubernetesResourceDefault } = require("./src/helpers/k8s");
const tableGenerator = require("./src/helpers/table");
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
        }
        parsedQuery.forEach(entry => {
            entry = entry.split(" ");
            values[`${entry[0]}`] = entry[1];
        })
        const resourceQuotaManifest = resourceGenerator.resourceQuota(values);
        console.log("resourceQuota", resourceQuotaManifest);
        loadKubernetesResourceDefault(resourceQuotaManifest)
            .then(res => console.log(tableGenerator.resourceQuotaTable(res.body)))
            .catch(err => console.log(tableGenerator.errTable(err.body)))

    })
    .addHelpText('after', `
Example:
  $ create resourceQuota | rq <resourceQuotaName> "(namespace default,configmaps 2,secrets 4, ...)"
`);
cli.parse(process.argv);