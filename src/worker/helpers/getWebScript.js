// (script: Function | String) => String
const getWebScript = (script) => {
  if (typeof script === "function") {
    return `return (${script}).apply(null, arguments)`;
  }

  if (script.trim().startsWith("return")) {
    return script;
  }

  return `return ${script}`;
};

module.exports = {
  getWebScript
};