function current(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const result = {
    currentAuthority: ['OPERPORT_JIAJU_ORDER_LIST', 'OPERPORT_JIAJU_GOODS_ONLINE'],
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  current,
};
