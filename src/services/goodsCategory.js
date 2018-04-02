import { stringify } from 'qs';
import request from '../utils/request';

async function list(params) {
  return request(`/api/goodsCategory/list?${stringify(params)}`);
}

export default {
  list,
};
