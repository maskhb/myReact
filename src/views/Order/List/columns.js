import React, { Fragment } from 'react';
import { Divider } from 'antd';
import moment from 'moment';
// import { ORDERSTATUS } from '../../../components/Status';
import { format } from '../../../components/Const';

export default (me) => {
  return [
    {
      title: '商品id',
      dataIndex: 'id',
      render(val) {
        return <a href={`#/goods/detail/${val}`}>{val}</a>;
      },
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      search: {
        type: 'input-text',
      },
      searchImportant: true,
    },
    {
      title: '商品型号',
      dataIndex: 'model',
      search: true,
    },
    {
      title: '一级类目',
      dataIndex: 'categoryNameLv1',
      sorter: true,
      // align: 'right',
      // render: val => `${val} 万`,
    },
    {
      title: '二级类目',
      dataIndex: 'categoryNameLv2',
      sorter: true,
      // align: 'right',
      // render: val => `${val} 万`,
    },
    {
      title: '三级类目',
      dataIndex: 'categoryNameLv3',
      sorter: true,
      // align: 'right',
      // render: val => `${val} 万`,
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierShortName',
      sorter: true,
    },
    {
      title: '品牌',
      dataIndex: 'brandName',
      sorter: true,
    },
    {
      title: '单位',
      dataIndex: 'sellUnitName',
      sorter: true,
      align: 'right',
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      sorter: true,
      render: val => <span>{moment(val).format(format)}</span>,
      search: {
        type: 'date-range',
      },
      searchImportant: true,
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      sorter: true,
      render: val => <span>{moment(val).format(format)}</span>,
      search: {
        type: 'date',
      },
      searchImportant: true,
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      // filters: ORDERSTATUS.map((item, i) => {
      //   return {
      //     text: item,
      //     value: i,
      //   };
      // }),
      // render(val) {
      //   return ORDERSTATUS[val];
      // },
      search: {
        type: 'radio',
        order: 1,
        simple: true,
        md: 14,
      },
    },
    {
      title: '操作',
      render: () => {
        return (
          <Fragment>
            <a href="">审核</a>
            <Divider type="vertical" />
            <a onClick={me.showModal}>sku清单</a>
          </Fragment>
        );
      },
    },
  ];
};
