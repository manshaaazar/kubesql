const { Command, description } = require("commander");
const cli = require("commander");

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
    console.log(keys);
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
