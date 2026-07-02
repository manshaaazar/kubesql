const tableGenerator = require('./table');

const handleError = (err) => {
  const body = err && err.body ? err.body : err;
  console.log(tableGenerator.errTable(body));
};

module.exports = { handleError };
