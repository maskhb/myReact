import React, { PureComponent } from 'react';
import { Row, Form, Button, Icon, Col } from 'antd';
import emitter from '../../utils/events';
import childrenWithProps from '../../utils/childrenWithProps';
import SearchItem from './Item';
import './index.scss';

export default class TableSearch extends PureComponent {
  static Item = SearchItem;

  state = {
    expand: false,
  };

  componentWillMount() {
    const { searchDefault, setStateOfSearch } = this.props;
    setStateOfSearch(searchDefault);

    emitter.addListener('panellist.search', (e, params) => {
      this.handleSearch(e, params);
    });
  }

  componentWillUnmount() {
    emitter.removeListener('panellist.search', () => {});
  }

  toggleOperate = () => {
    this.setState({
      expand: !this.state.expand,
    });
  }

  handleSearch = (e, params = {}) => {
    e?.preventDefault();
    const { form, stateOfSearch, setStateOfSearch, searchDefault, onSearch } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...searchDefault,
        ...stateOfSearch,
        ...fieldsValue,
        ...params,
      };

      setStateOfSearch(values);
      onSearch?.(values);
    });
  }

  handleFormReset = (e) => {
    const { form, searchDefault } = this.props;
    form.resetFields();
    this.handleSearch(e, searchDefault);
  }

  render() {
    const { form, children } = this.props;
    const { expand } = this.state;

    const operate = (
      children
        ? (
          <Col md={8} sm={24}>
            <span styleName="operate">
              <Button type="primary" htmlType="submit" styleName="btnSubmit">查询</Button>
              <Button onClick={this.handleFormReset}>重置</Button>
              {
                expand
                ? (
                  <a onClick={this.toggleOperate}>
                    收起 <Icon type="up" />
                  </a>
                )
                : (
                  <a onClick={this.toggleOperate}>
                    展开 <Icon type="down" />
                  </a>
                )
              }
            </span>
          </Col>
        )
        : ''
    );

    return (
      <div styleName="search">
        <div styleName="form">
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              {childrenWithProps(children, { form, expand })}
              {operate}
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}
