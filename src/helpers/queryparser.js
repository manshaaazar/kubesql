const parser = require("sqlite-parser");

module.exports = {
  parseQuery(objectName, query) {
    return new Promise((resolve, reject) => {
      query = `create table ${objectName} ${query}`;
      parser(query, (err, parsedQ) => {
        err ? reject(err) : resolve(parsedQ);
      });
    });
  },
};
