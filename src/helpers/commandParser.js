module.exports = {
  parse(keys) {
    keys = keys.replace("(", "");
    keys = keys.replace(")", "");
    return keys.split(",");
  },
};
