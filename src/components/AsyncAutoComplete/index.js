import React from 'react';
import { connect } from 'dva';
import { AutoComplete } from 'antd';
import { debounce } from 'lodash';

class AsyncAutoComplete extends React.Component {
  render() {
    return (
      <div>
      123
        <AutoComplete />
      </div>
    );
  }
}

export default AsyncAutoComplete;
