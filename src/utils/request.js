import fetch from 'dva/fetch';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import utility from 'utility';
import cookie from './cookie';
import store from '../index';
import { apihost } from '../config/global';

const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  // throw error; 抛出异常会被fetch方法catch，跳转到例如403页面
}

function getRandomString(len = 32) {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
  const maxPos = chars.length;
  let pwd = '';
  for (let i = 0; i < len; i += 1) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

function getClientId(len = 6) {
  let clientId = cookie.get('x-client-id');
  if (!clientId) {
    clientId = `${getRandomString(len)}-${Date.now()}`;
    cookie.set('x-client-id', clientId);
  }
  return clientId;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    const token = cookie.get('x-manager-token');
    const time = Date.now();

    newOptions.headers = {
      version: VERSION, /* eslint no-undef: 0 */
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'x-client-channel': 0,
      'x-client-hardware': 0,
      'x-client-id': getClientId(),
      'x-client-os': 'web',
      'x-client-os-version': 0,
      'x-client-type': 'pc',
      'x-client-version-code': '0',
      'x-client-version-name': '0',
      'x-manager-token': token,
      'x-request-time': time,
      'x-security-signature': utility.md5(`${token}ever$!@grande*&${time}`).toUpperCase(),
      'x-security-timestamp': time,
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }

  return fetch(apihost(url, newOptions.mock), newOptions)
    .then(checkStatus)
    .then((response) => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch((e) => {
      const { dispatch } = store;
      if (e.name === 401) {
        dispatch({
          type: 'login/logout',
        });
        return;
      }
      if (e.name === 403) {
        dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if (e.name <= 504 && e.name >= 500) {
        dispatch(routerRedux.push('/exception/500'));
        return;
      }
      if (e.name >= 404 && e.name < 422) {
        dispatch(routerRedux.push('/exception/404'));
      }
    });
}
