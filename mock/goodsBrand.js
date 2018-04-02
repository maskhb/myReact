function list(req, res) {
  const result = {
    list: [
      {
        id: 1,
        name: '品牌1',
      },
      {
        id: 2,
        name: '品牌2',
      },
    ],
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  list,
};
