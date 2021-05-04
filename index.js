const cli = require("commander");
//const { parseQuery } = require("./src/helpers/queryparser");
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
    $ create namespace | n 
    $ create secret    | sec
    $ create service   | ser
    $ create persistentVolume | pv
    $ create persistentVolumeClaim | pvc 
    $ create rsourceQuota | rq
    $ create role | r
    $ create roleBinding | rb 
    $ create clusterRole | cr
    $ create clsuterRoleBinding | crb
    $ create deployment | dep 
    $ create statefulSet | ss
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
        const { kind, apiVersion, metadata, data, type } = res.body;
        console.log(
          tableGenerator.successTable({
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
    $ secret "(secret value,secret value, ...)"
  `
  );
cli.parse(process.argv);
