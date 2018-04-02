const config = require('./apihost.json');

const env = process.env.NODE_ENV;
const apiEnv = process.env.API_ENV;
const httpPrefix = 'http://';

const apihost = (api, mock) => {
  let result = location.host + api;

  for (const [key, val] of Object.entries(config)) {
    if (env === 'production' && val.includes(location.hostname)) {
      result = `${key}/${api}`;
    } else if (env === 'development') {
      if (!mock && val.includes(apiEnv)) {
        result = `${key}/${api}`;
      }
    }
  }

  return httpPrefix + result.replace(/\/\//, '/');
};

export default apihost;
