const cliTable = require("cli-table");

const generateTable = (value) => {
  const table = require("prettytable");
  if (value.managedFields) {
    delete value.managedFields;
  } else if (value.finalizers) {
    value.finalizers = value.finalizers[0];
  } else if (value.causes) {
    delete value.causes;
  }
  const newTable = new table();
  const headers = Object.keys(value);
  const rows = [];
  rows.push(headers.map((key) => value[key]));
  newTable.create(headers, rows);
  return newTable.toString();
};

const makeRootLevel = () =>
  new cliTable({
    style: { compact: true, "padding-right": 0, "padding-left": 0 },
    chars: { left: "", right: "", top: "", bottom: "" },
  });

// sections: array of [label, data] pairs, rendered in order via generateTable
const buildTable = (sections) => {
  const rootLevel = makeRootLevel();
  sections.forEach(([label, data]) =>
    rootLevel.push({ [label]: generateTable(data) })
  );
  return rootLevel.toString();
};

module.exports = {
  successTable({ kind, apiVersion, metadata, spec, status }) {
    return buildTable([
      ["root", { kind, apiVersion }],
      ["status", status],
      ["spec", spec],
      ["metadata", metadata],
    ]);
  },
  errTable({ kind, apiVersion, status, message, reason, details, code }) {
    return buildTable([
      ["root", { kind, apiVersion, status, message, reason, code }],
    ]);
  },
  secretSuccessTable({ kind, apiVersion, metadata, data, type }) {
    return buildTable([
      ["root", { kind, apiVersion, type }],
      ["data", data],
      ["metadata", metadata],
    ]);
  },
  serviceSuccessTable({ kind, apiVersion, metadata, spec }) {
    const { clusterIP, type, sessionAffinity, ports, selector } = spec;
    return buildTable([
      ["root", { kind, apiVersion }],
      ["spec", { clusterIP, type, sessionAffinity }],
      ["selector", selector],
      ["ports", ports[0]],
      ["metadata", metadata],
    ]);
  },
  pvcSuccessTable({ kind, apiVersion, metadata, spec, status }) {
    const { phase } = status;
    const { selector, resources, storageClassName, volumeMode } = spec;
    return buildTable([
      ["root", { kind, apiVersion, phase, status: "Success" }],
      ["spec", { storageClassName, volumeMode }],
      ["resource", resources.requests],
      ["metadata", metadata],
    ]);
  },
  pvTable({ kind, apiVersion, metadata, spec, status }) {
    const {
      claimRef,
      capacity,
      hostPath,
      persistentVolumeReclaimPolicy,
      storageClassName,
      volumeMode,
    } = spec;
    return buildTable([
      [
        "root",
        {
          kind,
          apiVersion,
          volumeMode,
          persistentVolumeReclaimPolicy:
            persistentVolumeReclaimPolicy ?? "undefined",
          status: status?.phase,
          storageClassName: storageClassName ?? "undefined",
        },
      ],
      ["metadata", metadata],
      ["capacity", capacity],
      ["hostPath", hostPath],
      ["claimRef", claimRef],
    ]);
  },
  resourceQuotaTable({ kind, apiVersion, metadata, spec }) {
    return buildTable([
      ["root", { kind, apiVersion, status }],
      ["spec", spec.hard],
      ["metadata", metadata],
    ]);
  },
  roleSuccessTable({ kind, apiVersion, metadata }) {
    return buildTable([
      ["root", { kind, apiVersion, status: "Success" }],
      ["metadata", metadata],
    ]);
  },
  roleBindingSuccessTable({ kind, apiVersion, metadata, subjects, roleRef }) {
    return buildTable([
      ["root", { kind, apiVersion, status: "Success" }],
      ["metadata", metadata],
      ["roleRef", roleRef],
      ["subject", subjects[0]],
    ]);
  },
  saSuccessTable({ kind, apiVersion, metadata }) {
    return buildTable([
      ["root", { kind, apiVersion, status: "Success" }],
      ["metadata", metadata],
    ]);
  },
  deploymentSuccessTable({ kind, apiVersion, metadata, spec }) {
    const rootLevel = makeRootLevel();
    const { namespace, name } = metadata || {};
    const {
      revisionHistoryLimit,
      progressDeadlineSeconds,
      replicas,
      selector,
      strategy,
      template,
    } = spec;
    const { metadata: podMetadata, spec: podSpec } = template || {};
    const { type } = strategy;

    rootLevel.push(
      { root: generateTable({ kind, apiVersion, status: "Success" }) },
      { metadata: generateTable({ namespace, name }) },
      { labels: generateTable(metadata.labels) },
      {
        spec: generateTable({
          revisionHistoryLimit,
          progressDeadlineSeconds,
          replicas,
        }),
      },
      { selector: generateTable(selector.matchLabels) },
      { strategy: generateTable({ type }) },
      { podMetadata: generateTable({ name: podMetadata.name }) }
    );

    podSpec.containers.forEach((container) => {
      const { name, ports } = container || {};
      rootLevel.push({
        container: generateTable({ name, ports: JSON.stringify(ports) }),
      });
    });
    return rootLevel.toString();
  },
  imagebuildPushTaskSuccessTable({ kind, apiVersion, metadata }) {
    return buildTable([
      ["root", { kind, apiVersion }],
      ["metadata", metadata],
    ]);
  },
  pipelineResourceSuccessTable({ kind, apiVersion, metadata, spec }) {
    const { type } = spec;
    return buildTable([
      ["root", { kind, apiVersion, type, status: "Success" }],
      ["metadata", metadata],
    ]);
  },
  pipelineRunSuccessTable({ kind, apiVersion, metadata, spec }) {
    return buildTable([
      [
        "root",
        { kind, apiVersion, timeout: spec.timeout, status: "In Progress" },
      ],
      ["metadata", metadata],
    ]);
  },
  deleteSuccessTable({ apiVersion, kind, status }) {
    return buildTable([["root", { kind, apiVersion, status: "Success" }]]);
  },
  deleteErrTable({ kind, apiVersion, message, code, metadata, reason, status }) {
    return buildTable([
      ["root", { kind, apiVersion, message, code, reason, status }],
    ]);
  },
  listResource(items) {
    const rootLevel = makeRootLevel();
    items.forEach((resource) => {
      const { name, namespace } = resource.metadata;
      rootLevel.push({
        metadata: generateTable({ name, namespace: namespace ?? "Global" }),
      });
    });
    return rootLevel.toString();
  },
  podTable({ kind, apiVersion, metadata, spec, status }) {
    const rootLevel = makeRootLevel();
    const { name, namespace, uid } = metadata || {};
    const { restartPolicy, serviceAccount, nodeName } = spec || {};
    const { phase, podIP, qosClass, containerStatuses } = status || {};

    rootLevel.push(
      { root: generateTable({ kind, apiVersion }) },
      { metadata: generateTable({ name, namespace, uid }) },
      {
        spec: generateTable({
          restartPolicy,
          serviceAccount: serviceAccount ?? "",
          nodeName,
        }),
      },
      { status: generateTable({ phase, podIP, qosClass }) }
    );
    containerStatuses.forEach((container) => {
      const { name, started } = container;
      rootLevel.push({ container: generateTable({ name, started }) });
    });
    return rootLevel.toString();
  },
  logsTable({ kind, apiVersion, status, message, reason, code }) {
    return buildTable([
      ["root", { kind, apiVersion, status, reason, code }],
      ["logs", { message }],
    ]);
  },
};
