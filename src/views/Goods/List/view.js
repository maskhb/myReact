import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Menu, message, Popconfirm, Input, DatePicker, Popover, Icon } from 'antd';
import _ from 'lodash';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import PanelList, { Search, Batch, Table } from '../../../components/PanelList';
import ModalAudit from '../../../components/ModalAudit';
import getColumns from './columns';
import { ONLINESTATUS } from '../../../components/Status/online';

@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods,
}))
export default class List extends PureComponent {
  static defaultProps = {
    searchDefault: {
      auditStatus: 1,
      onlineStatus: 0,
    },
  };

  state = {
    modalAuditVisible: false,
  };

  componentDidMount() {
    this.search.handleSearch();
  }

  handleSearch = (values = {}) => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'goods/list',
      payload: values,
    });
  }

  handleDelete = (rows = []) => {
    const { dispatch } = this.props;
    const name = '删除';

    dispatch({
      type: 'goods/remove',
      payload: {
        id: rows.map(row => row.id).join(','),
      },
    }).then(() => {
      const { goods } = this.props;
      const { remove } = goods;
      if (remove.result === 0) {
        message.success(`${name}成功`);
        this.search.handleSearch();
      } else if (remove.result === 1) {
        message.error(`${name}失败, ${remove.msg || '请稍后再试。'}`);
      }
    });
  }

  batchOnline = (rows = []) => {
    const { dispatch } = this.props;
    const status = _.uniq(Object.values(rows).map(r => r.onlineStatus));
    const text = ONLINESTATUS[status[0] ? 0 : 1];

    dispatch({
      type: 'goods/remove',
      payload: {
        no: rows.map(row => row.no).join(','),
      },
    }).then(() => {
      const { remove } = this.props.goods;
      if (remove.result === 0) {
        message.success(`${text}成功`);
        this.search.handleSearch();
      } else if (remove.result === 1) {
        message.error(`${text}失败, ${remove.msg || '请稍后再试。'}`);
      }
    });
  }
  batchAudit = (rows) => {
    this.modalAuditShow(rows);
  }
  batchDelete = (rows) => {
    this.handleDelete(rows);
  }
  batchMore = (rows, e) => {
    const { dispatch } = this.props;

    switch (e.key) {
      case 'export':
        break;
      case 'update':
        break;
      case 'recycle':
        dispatch({
          type: 'goods/remove',
          payload: {
            no: rows.map(row => row.no).join(','),
          },
        }).then(() => {
          this.search.handleSearch();
        });
        break;
      default:
        break;
    }
  }

  popConfirmOnline = (val) => {
    const { dispatch } = this.props;
    const text = ONLINESTATUS[val === 0 ? 1 : 0];

    dispatch({
      type: 'goods/audit',
      payload: val,
    }).then(() => {
      const { audit } = this.props.goods;
      if (audit.result === 0) {
        message.success(`${text}成功`);
        this.search.handleSearch();
      } else if (audit.result === 1) {
        message.error(`${text}失败, ${audit.msg || '请稍后再试。'}`);
      }
    });
  }

  popConfirmDelete = (rows) => {
    this.handleDelete(rows);
  }

  modalAuditShow = (records) => {
    if (!records) {
      return;
    }

    let rows = [];
    if (records.constructor.name !== 'Array') {
      rows = [records];
    } else {
      rows = records;
    }

    this.modalAuditRef.resetFields();
    this.modalAuditRef.rows = rows;
    this.setState({ modalAuditVisible: true });
  }
  modalAuditCancel = () => {
    this.setState({ modalAuditVisible: false });
  }
  modalAuditOk = () => {
    this.modalAuditRef.validateFields((err, values) => {
      if (err) {
        return;
      }

      const { dispatch } = this.props;
      dispatch({
        type: 'goods/audit',
        payload: {
          ...values,
          ids: this.modalAuditRef.rows.map(row => row.id).join(','),
        },
      }).then(() => {
        const { audit } = this.props.goods;
        if (audit.result === 0) {
          message.success('审核成功');
          this.search.handleSearch();
          // this.setState({
          //   selectedRows: [],
          // });
        } else if (audit.result === 1) {
          message.error(`审核失败, ${audit.msg || '请稍后再试。'}`);
        }
      });

      this.modalAuditCancel();
    });
  }

  render() {
    const { goods, loading, searchDefault } = this.props;
    const { modalAuditVisible } = this.state;

    return (
      <PageHeaderLayout>
        <Card>
          <PanelList>
            <Search
              ref={(inst) => { this.search = inst; }}
              searchDefault={searchDefault}
              onSearch={this.handleSearch}
            >
              <Search.Item label="商品ID" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('id', {
                    })(
                      <Input placeholder="请输入" />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="商品名称" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('name', {
                    })(
                      <Input placeholder="请输入" />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="创建时间">
                {
                  ({ form }) => (
                    form.getFieldDecorator('createdTime', {
                    })(
                      <DatePicker.RangePicker />
                    )
                  )
                }
              </Search.Item>
            </Search>

            <Batch>
              <a href="#/goods/list/add/0">
                <Button icon="plus" type="primary">新建</Button>
              </a>
              <Batch.Item>
                {
                  ({ rows }) => {
                    const status = _.uniq(Object.values(rows).map(r => r.onlineStatus));

                    return (
                      rows.length
                        ? (
                          status.length === 2
                            ? (
                              <Popover placement="right" title="" content="只能批量操作一种状态！" trigger="hover">
                                <Button disabled>
                                  上/下架<Icon type="question-circle-o" style={{ color: '#000' }} />
                                </Button>
                              </Popover>
                            )
                            : status.length === 1
                              ? (
                                <Popconfirm placement="top" title={`确认${ONLINESTATUS[status[0] ? 0 : 1]}？`} onConfirm={this.batchOnline.bind(this, rows)} okText="确认" cancelText="取消">
                                  <Button>{ONLINESTATUS[status[0] ? 0 : 1]}</Button>
                                </Popconfirm>
                              )
                              : ''
                        )
                        : ''
                    );
                  }
                }
              </Batch.Item>
              <Batch.Item>
                {
                  ({ rows }) => {
                    return (
                      rows.length
                        ? <Button onClick={this.batchAudit.bind(this, rows)}>审核</Button>
                        : ''
                    );
                  }
                }
              </Batch.Item>
              <Batch.Item>
                {
                  ({ rows }) => {
                    return (
                      rows.length
                        ? (
                          <Popconfirm placement="top" title="确认删除？" onConfirm={this.batchDelete.bind(this, rows)} okText="确认" cancelText="取消">
                            <Button>删除</Button>
                          </Popconfirm>
                        )
                        : ''
                    );
                  }
                }
              </Batch.Item>
              <Batch.More>
                {
                  ({ rows }) => {
                    return (
                      <Menu onClick={this.batchMore.bind(this, rows)}>
                        <Menu.Item key="export">导出</Menu.Item>
                        <Menu.Item key="update">更新</Menu.Item>
                        <Menu.Item key="recycle">移至回收站</Menu.Item>
                      </Menu>
                    );
                  }
                }
              </Batch.More>
            </Batch>

            <Table
              loading={loading}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              dataSource={goods?.list?.list}
              pagination={goods?.list?.pagination}
            />
          </PanelList>

          <ModalAudit
            ref={(inst) => { this.modalAuditRef = inst; }}
            visible={modalAuditVisible}
            onCancel={this.modalAuditCancel}
            onOk={this.modalAuditOk}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
