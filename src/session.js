let sessionValue = null;

const getSession = (key) => {
  return key ? sessionValue[key] : sessionValue;
};

const setSession = (session) => {
  return sessionValue = session;
};

module.exports = {
  getSession,
  setSession
};