#!/usr/bin/env node

const cli = require('commander');
const registerCreate = require('./src/commands/create/index');
const registerDelete = require('./src/commands/delete');
const registerQuery = require('./src/commands/query');

cli.version('1.0.0').description('Kubernetes structured query language');

registerCreate(cli);
registerDelete(cli);
registerQuery(cli);

cli.parseAsync(process.argv);
