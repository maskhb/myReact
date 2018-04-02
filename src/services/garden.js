import { stringify } from 'qs';
import request from '../utils/request';

async function list(params) {
  return request(`/api/garden/list?${stringify(params)}`);
}

async function add(params) {
  return request('/api/garden/add', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

async function edit(params) {
  return request('/api/garden/edit', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

async function remove(params) {
  return request('/api/garden/remove', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

async function update(params) {
  return request('/api/garden/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export default {
  list,
  add,
  edit,
  remove,
  update,
};
