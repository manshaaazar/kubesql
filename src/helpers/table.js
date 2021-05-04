const cliTable = require("cli-table");
const generateTable = (value) => {
  const table = require("prettytable");
  if (value.managedFields) {
    delete value.managedFields;
  } else if (value.finalizers) {
    value.finalizers = value.finalizers[0];
  }
  const newTable = new table();
  const headers = Object.keys(value);
  const rows = [];
  rows.push(headers.map((key) => value[key]));
  console.log("headers", headers);
  console.log("rows", rows);
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
    // console.log(specTable);
    // console.log(statusTable);
    //  console.log(metadataTable);
    //  console.log(rootTable);
    const rootLevel = new cliTable({
      style: { compact: true, "padding-right": 0, "padding-left": 0 },
      chars: { left: "", right: "", top: "", bottom: "" },
    });
    rootLevel.push(
      { Namespace: metadata.name },
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
    rootLevel.push(
      { Namespace: details.name },
      { root: rootTable },
      { details: detailsTable }
    );
    const finalTable = rootLevel.toString();
    return finalTable;
  },
};
