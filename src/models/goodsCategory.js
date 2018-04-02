import goodsCategory from '../services/goodsCategory';

export default {
  namespace: 'goodsCategory',

  state: {
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(goodsCategory.list, payload);
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
