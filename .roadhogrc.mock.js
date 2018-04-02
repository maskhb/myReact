import mockjs from 'mockjs';
import { delay } from 'roadhog-api-doc';
import { login } from './mock/login';
const config = require('require-glob').sync('./mock/*');

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
let proxy = {
  'POST /api/login': login,
  'POST /api/upload/img': {
    data: [
      {
        url: 'https://www.baidu.com/img/bd_logo1.png',
      },
    ],
  },
};

for(const [key, val] of Object.entries(config)) {
  for(const [k, v] of Object.entries(val)) {
    proxy[`GET /api/${key}/${k}`] = proxy[`POST /api/${key}/${k}`] = v;
  }
}

export default noProxy ? {} : delay(proxy, 1000);
