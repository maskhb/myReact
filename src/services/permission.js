import request from '../utils/request';

async function current() {
  // return request('https://ht-yunying-sit.htmimi.com/2.0/api/authorization/iAuthService/getVerifiedAuthoritiesBycurrent', {
  return request('/api/permission/current', {
    method: 'POST',
    headers: {
      // Accept: '*/*',
      // 'Content-Type': 'application/x-thrift',
    },
    body: [1, 'getVerifiedAuthoritiesBycurrent', 1, 0, {}],
  });
}

export default {
  current,
};
