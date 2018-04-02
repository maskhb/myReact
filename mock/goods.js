import { getUrlParams } from './utils';

const tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    id: i + 1,
    key: i,
    image: 'http://g-search2.alicdn.com/img/bao/uploaded/i4/i4/3527440877/TB19EyfksnI8KJjSsziXXb8QpXa_!!0-item_pic.jpg_250x250.jpg_.webp',
    name: `螺丝${i}`,
    model: `型号${i}`,
    categoryNameLv1: `装修材料${i}`,
    categoryNameLv2: `装修材料${i}`,
    categoryNameLv3: `装修材料${i}`,
    supplierShortName: `xx供应商${i}`,
    brandName: `品牌${i}`,
    sellUnitName: `${i}个`,
    createdTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    beginTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    auditStatus: Math.floor(Math.random() * 10) % 3,
    orderStatus: Math.floor(Math.random() * 10) % 8,
    onlineStatus: Math.floor(Math.random() * 10) % 2,
    code: 1,
    barCode: 1,
    moq: 1,
    supplyPrice: 1,
    marketPrice: 1,
    price: 1,
    discountPrice: 1,
  });
}

function list(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...tableListDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.auditStatus) {
    const auditStatus = params.auditStatus.split(',');
    let filterDataSource = [];
    auditStatus.forEach((s) => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.auditStatus, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.onlineStatus) {
    const onlineStatus = params.onlineStatus.split(',');
    let filterDataSource = [];
    onlineStatus.forEach((s) => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.onlineStatus, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.no) {
    dataSource = dataSource.filter(data => data.no.indexOf(params.no) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

function add(req, res) {
  const result = {
    result: Math.floor(Math.random() * 10) % 2,
    msg: '服务器错误',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

function remove(req, res) {
  const result = {
    result: Math.floor(Math.random() * 10) % 2,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

function audit(req, res) {
  const result = {
    result: Math.floor(Math.random() * 10) % 2,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

function unit(req, res) {
  const result = [
    {
      id: 1,
      text: '个',
    },
    {
      id: 2,
      text: '台',
    },
  ];

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  list,
  add,
  remove,
  audit,
  unit,
};
