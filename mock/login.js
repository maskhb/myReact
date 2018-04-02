export function login(req, res) {
  const result = {
    msgCode: 200,
    status: 'ok',
    data: {
      result: 'haskey=',
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  login,
};
