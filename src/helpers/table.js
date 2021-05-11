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
  const finalTable = newTable.toString();
  return finalTable;
};
module.exports = {
  successTable({ kind, apiVersion, metadata, spec, status }) {
    const statusTable = generateTable(status);
    const specTable = generateTable(spec);
    const metadataTable = generateTable(metadata);
    const rootTable = generateTable({ kind, apiVersion });
    //   console.log("spec", specTable);
    //   console.log("status", statusTable);
    //  console.log("meta", metadataTable);
    //  console.log("root", rootTable);
    const rootLevel = new cliTable({
      style: { compact: true, "padding-right": 0, "padding-left": 0 },
      chars: { left: "", right: "", top: "", bottom: "" },
    });
    rootLevel.push(
      { root: rootTable },
      { status: statusTable },
      { spec: specTable },
      { metadata: metadataTable }
    );
    const finalTable = rootLevel.toString();
    return finalTable;
  },
  errTable({ kind, apiVersion, status, message, reason, details, code }) {
    const detailsTable = generateTable(details);
    const rootTable = generateTable({
      kind,
      apiVersion,
      status,
      message,
      reason,
      code,
    });
    const rootLevel = new cliTable({
      style: { compact: true, "padding-right": 0, "padding-left": 0 },
      chars: { left: "", right: "", top: "", bottom: "" },
    });
    rootLevel.push({ root: rootTable }, { details: detailsTable });
    const finalTable = rootLevel.toString();
    return finalTable;
  },
  secretSuccessTable({ kind, apiVersion, metadata, data, type }) {
    const dataTable = generateTable(data);
    const metadataTable = generateTable(metadata);
    const rootTable = generateTable({ kind, apiVersion, type });
    const rootLevel = new cliTable({
      style: { compact: true, "padding-right": 0, "padding-left": 0 },
      chars: { left: "", right: "", top: "", bottom: "" },
    });
    rootLevel.push(
      { root: rootTable },
      { data: dataTable },
      { metadata: metadataTable }
    );
    const finalTable = rootLevel.toString();
    return finalTable;
  },
  serviceSuccessTable({ kind, apiVersion, metadata, spec, status }) {
    const { clusterIP, type, sessionAffinity, ports, selector } = spec;
    const specTable = generateTable({
      clusterIP,
      type,
      sessionAffinity,
    });
    const portsTable = generateTable(ports[0]);
    const metadataTable = generateTable(metadata);
    const selectorTable = generateTable(selector);
    const rootTable = generateTable({ kind, apiVersion });

    const rootLevel = new cliTable({
      style: { compact: true, "padding-right": 0, "padding-left": 0 },
      chars: { left: "", right: "", top: "", bottom: "" },
    });
    rootLevel.push(
      { root: rootTable },
      { spec: specTable },
      { selector: selectorTable },
      { ports: portsTable },
      { metadata: metadataTable }
    );
    const finalTable = rootLevel.toString();
    return finalTable;
  },
  pvcSuccessTable({ kind, apiVersion, metadata, spec, status }) {
    console.log("status", status);
    const { phase } = status;
    const { selector, resources, storageClassName, volumeMode } = spec;
    const selectorTable = generateTable(selector.matchLabels);
    const resourceTable = generateTable(resources.requests);
    const specTable = generateTable({ storageClassName, volumeMode });
    const rootTable = generateTable({
      kind,
      apiVersion,
      phase,
      status: "Success",
    });
    const metadataTable = generateTable(metadata);
    const rootLevel = new cliTable({
      style: { compact: true, "padding-right": 0, "padding-left": 0 },
      chars: { left: "", right: "", top: "", bottom: "" },
    });
    rootLevel.push(
      { root: rootTable },
      { spec: specTable },
      { resource: resourceTable },
      { selector: selectorTable },
      { metadata: metadataTable }
    );
    const finalTable = rootLevel.toString();
    return finalTable;
  },
  resourceQuotaTable({ kind, apiVersion, metadata, spec }) {
    const specTable = generateTable(spec.hard);
    const metadataTable = generateTable(metadata);
    const rootTable = generateTable({
      kind,
      apiVersion,
      status,
    });
    const rootLevel = new cliTable({
      style: { compact: true, "padding-right": 0, "padding-left": 0 },
      chars: { left: "", right: "", top: "", bottom: "" },
    });
    rootLevel.push(
      { root: rootTable },
      { spec: specTable },
      { metadata: metadataTable }
    );
    const finalTable = rootLevel.toString();
    return finalTable;
  },
  roleSuccessTable({ kind, apiVersion, metadata, rules }) {
    const rootTable = generateTable({ kind, apiVersion, status: "Success" });
    const metadataTable = generateTable(metadata);
    const rootLevel = new cliTable({
      style: { compact: true, "padding-right": 0, "padding-left": 0 },
      chars: { left: "", right: "", top: "", bottom: "" },
    });
    rootLevel.push({ root: rootTable }, { metadata: metadataTable });
    const finalTable = rootLevel.toString();
    return finalTable;
  },
  roleBindingSuccessTable({ kind, apiVersion, metadata, subjects, roleRef }) {
    const rootTable = generateTable({ kind, apiVersion, status: "Success" });
    const roleRefTable = generateTable(roleRef);
    const subjectsTable = generateTable(subjects[0]);
    const metadataTable = generateTable(metadata);
    const rootLevel = new cliTable({
      style: { compact: true, "padding-right": 0, "padding-left": 0 },
      chars: { left: "", right: "", top: "", bottom: "" },
    });
    rootLevel.push(
      { root: rootTable },
      { metadata: metadataTable },
      { roleRef: roleRefTable },
      { subject: subjectsTable }
    );
    const finalTable = rootLevel.toString();
    return finalTable;
  },
  saSuccessTable({ kind, apiVersion, metadata }) {
    const metadataTable = generateTable(metadata);
    const rootTable = generateTable({ kind, apiVersion, status: "Success" });
    const rootLevel = new cliTable({
      style: { compact: true, "padding-right": 0, "padding-left": 0 },
      chars: { left: "", right: "", top: "", bottom: "" },
    });
    rootLevel.push({ root: rootTable }, { metadata: metadataTable });
    const finalTable = rootLevel.toString();
    return finalTable;
  },
  deploymentSuccessTable({ kind, apiVersion, metadata, spec }) {
    const rootTable = generateTable({ kind, apiVersion, status: "Success" });
    const metadataTable = generateTable(metadata);
    const labelsTable = generateTable(metadata.labels);
    const {
      revisionHistoryLimit,
      progressDeadlineSeconds,
      replicas,
      selector,
      strategy,
    } = spec;
    const specTable = generateTable({
      revisionHistoryLimit,
      progressDeadlineSeconds,
      replicas,
    });
    const selectorTable = generateTable(selector.matchLabels);
    const { type } = strategy;
    const starategyTable = generateTable({ type });
    const rootLevel = new cliTable({
      style: { compact: true, "padding-right": 0, "padding-left": 0 },
      chars: { left: "", right: "", top: "", bottom: "" },
    });
    rootLevel.push(
      { root: rootTable },
      { metadata: metadataTable },
      { labels: labelsTable },
      { spec: specTable },
      { selector: selectorTable },
      { strategy: starategyTable }
    );
    const finalTable = rootLevel.toString();
    return finalTable;
  },
  imagebuildPushTaskSuccessTable({ kind, apiVersion }) {
    const rootTable = generateTable({ kind, apiVersion });
    const metadataTable = generateTable(metadataTable);
    const rootLevel = new cliTable({
      style: { compact: true, "padding-right": 0, "padding-left": 0 },
      chars: { left: "", right: "", top: "", bottom: "" },
    });
    rootLevel.push({ root: rootTable }, { metadata: metadataTable });
    const finalTable = rootLevel.toString();
    return finalTable;
  },
  pipelineResourceSuccessTable({ kind, apiVersion, metadata, spec }) {
    const { type } = spec;
    const rootTable = generateTable({
      kind,
      apiVersion,
      type,
      status: "Success",
    });
    const metadataTable = generateTable(metadata);
    const rootLevel = new cliTable({
      style: { compact: true, "padding-right": 0, "padding-left": 0 },
      chars: { left: "", right: "", top: "", bottom: "" },
    });
    rootLevel.push({ root: rootTable }, { metadata: metadataTable });
    const finalTable = rootLevel.toString();
    return finalTable;
  },
  pipelineRunSuccessTable({ kind, apiVersion, metadata, spec }) {
    const rootTable = generateTable({
      kind,
      apiVersion,
      timeout: spec.timeout,
      status: "In Progress",
    });
    const metadataTable = generateTable(metadata);
    const rootLevel = new cliTable({
      style: { compact: true, "padding-right": 0, "padding-left": 0 },
      chars: { left: "", right: "", top: "", bottom: "" },
    });
    rootLevel.push({ root: rootTable }, { metadata: metadataTable });
    const finalTable = rootLevel.toString();
    return finalTable;
  },
  deleteSuccessTable({ apiVersion, kind, status }) {
    const rootTable = generateTable({ kind, apiVersion, status: "Success" });
    const rootLevel = new cliTable({
      style: { compact: true, "padding-right": 0, "padding-left": 0 },
      chars: { left: "", right: "", top: "", bottom: "" },
    });
    rootLevel.push({ root: rootTable });
    const finalTable = rootLevel.toString();
    return finalTable;
  },
  deleteErrTable({
    kind,
    apiVersion,
    message,
    code,
    metadata,
    reason,
    status,
  }) {
    const rootTable = generateTable({
      kind,
      apiVersion,
      message,
      code,
      reason,
      status,
    });
    const rootLevel = new cliTable({
      style: { compact: true, "padding-right": 0, "padding-left": 0 },
      chars: { left: "", right: "", top: "", bottom: "" },
    });
    rootLevel.push({ root: rootTable });
    const finalTable = rootLevel.toString();
    return finalTable;
  },
};
