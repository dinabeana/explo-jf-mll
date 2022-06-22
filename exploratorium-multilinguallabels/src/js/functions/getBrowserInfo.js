
const getBrowserInfo = () => {
  const info = {
    name: false,
    version: false,
    ua: navigator.userAgent
  };
  let match = /Chrome\/(\d+)/.exec(info.ua);
  if (match) {
    info.name = 'chrome';
    info.version = match[1];
    return info;
  }
  match = /Firefox\/(\d+)/.exec(info.ua);
  if (match) {
    info.name = 'firefox';
    info.version = match[1];
    return info;
  }
  return info;
};

export default getBrowserInfo;
