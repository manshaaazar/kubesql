const cli = require("commander");
const { parseQuery } = require("./src/helpers/queryparser");
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
  .command("namespace <keys>")
  .alias("n")
  .description("create a namespace")
  .action((keys) => {
    parseQuery("namespace", keys)
      .then((parsedQuery) => {
        console.log("parsedQuery", parsedQuery.statement[0].definition);
        // generate values object from parsedQuery
        // pass values object to resource function and get resource object
        // create that resource in cluster
        const keys = parsedQuery.statement[0].definition;
        const values = {
          name: keys[0].datatype.variant,
        };
        const namespaceManifest = resourceGenerator.namespace(values);
        console.log(namespaceManifest);
        loadKubernetesResourceDefault(namespaceManifest)
          .then((response) => {
            // console.log("response", response.body);
            console.log(tableGenerator.successTable(response.body));
          })
          .catch((err) => {
            console.log("err", err.body);
            console.log(tableGenerator.errTable(err.body));
          });
      })
      .catch((err) => console.log("err", err));
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
  .command("secret <keys>")
  .alias("sec")
  .description("create a secret")
  .action((keys) => console.log(keys))
  .addHelpText(
    "after",
    `
  Example: 
    $ secret "(secret value,secret value, ...)"
  `
  );
cli.parse(process.argv);
