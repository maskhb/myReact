import goodsBrand from '../services/goodsBrand';

export default {
  namespace: 'goodsBrand',

  state: {
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(goodsBrand.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
