const { DEFAULT_URLID, DEFAULT_PREFIX } = require('./configs');

export const getConfig = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlid = urlParams.get('id') || DEFAULT_URLID;
  const prefix = urlParams.get('prefix') || DEFAULT_PREFIX;
  return { urlid, prefix };
}
