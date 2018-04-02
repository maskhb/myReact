import request from '../utils/request';

async function current() {
  return request('/api/user/current');
}

export default {
  current,
};
