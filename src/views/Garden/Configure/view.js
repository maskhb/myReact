import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Cascader, AutoComplete } from 'antd';
import { debounce } from 'lodash';
import { AsyncAutoComplete } from 'components';
@connect(({ xxx, loading }) => ({
  xxx,
  loading: loading.models.xxx,
}))
export default class List extends PureComponent {
  static defaultProps = {
  };

  state = {
    dataSource: [],
  };

  handleSearch = (value) => {
    // debounce((value) => { console.log(value); }, 1000);
    /* this.setState({
      dataSource: !value ? [] : [
        value,
        value + value,
        value + value + value,
      ],
    }); */
  }
  sendMessage = (val) => {
    console.log(val);
  }
  render() {
    const { dataSource } = this.state;
    const options = [{
      value: 'zhejiang',
      label: 'Zhejiang',
      children: [{
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [{
          value: 'xihu',
          label: 'West Lake',
        }],
      }],
    }, {
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [{
        value: 'nanjing',
        label: 'Nanjing',
        children: [{
          value: 'zhonghuamen',
          label: 'Zhong Hua Men',
        }],
      }],
    }];


    function onChange() {
      console.log(123);
    }
    // Just show the latest item.
    function displayRender(label) {
      return label[label.length - 1];
    }
    function onSelect(value) {
      console.log('onSelect', value);
    }


    return (
      <div>
        <h3>级联选择器.带搜索(options需要第一次全部请求)</h3>
        <Cascader
          options={options}
          expandTrigger="click"
          displayRender={displayRender}
          onChange={onChange}
          showSearch
        />
        <br />
        <br />
        <br />
        <h3>AutoComplete(异步请求)</h3>
        <p>{dataSource}</p>
        {/*
          这里用异步请求的方式把dataSource里面的数据表单动态填充
        */}
        <AutoComplete
          dataSource={dataSource}
          style={{ width: 200 }}
          onSelect={onSelect}
          onSearch={this.handleSearch}
          // onChange={value => debounce(() => { console.log(value); }, 1000)}
          placeholder="随便写点什么吧"
        />
        <AsyncAutoComplete />
      </div>
    );
  }
}
