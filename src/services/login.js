import request from '../utils/request';
import { encryptByAes, encryptSecure } from '../utils/crypto';

const xSecure = encryptSecure('password,username');

export async function login(params) {
  // return request('https://ht-yunying-sit.htmimi.com/2.0/api/json/sys-sso-api/systemSso/loginSys', {
  return request('/api/login', {
    mock: true,
    headers: {
      'x-secure': xSecure,
    },
    method: 'POST',
    body: {
      username: encryptByAes(params.username, xSecure),
      password: encryptByAes(params.password, xSecure),
      systemType: 2,
    },
  });
}
