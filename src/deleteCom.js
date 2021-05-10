const cli = require("commander");
const deleteCommand = () => {
  const del = cli
    .command("delete")
    .description("create any kubernetes object resource ")
    .addHelpText(
      "after",
      `
  Examples:
    $ delete namespace                      | n 
    $ delete secret                         | sec
    $ delete service                        | ser
    $ delete persistentVolume               | pv
    $ delete persistentVolumeClaim          | pvc 
    $ delete rsourceQuota                   | rq
    $ delete role                           | r
    $ delete roleBinding                    | rb 
    $ delete clusterRole                    | cr
    $ delete clsuterRoleBinding             | crb
    $ delete deployment                     | dep 
    $ delete statefulSet                    | ss
    $ delete imageConfig                    | iConfig
    $ delete imageBuilder                   | iBuilder
    `
    );
  del
    .command("secret <namespace> <where> <keys>")
    .alias("sec")
    .description("delete a secret from a specific namesapce")
    .action((namespace, where, keys) => {})
    .addHelpText(
      "after",
      `
    Example:
        $ delete secret from  namespaceName where name=mysecret
    `
    );
};
