import React from 'react';
import { Badge, Popconfirm } from 'antd';
import moment from 'moment';
import { AUDITSTATUS, AUDITSTATUSLEVELS, AUDITSTATUSBRIEF } from '../../../components/Status/audit';
import { ONLINESTATUS, ONLINESTATUSLEVELS } from '../../../components/Status/online';
import { format } from '../../../components/Const';
import Authorized from '../../../utils/Authorized';

export default (me, searchDefault) => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      render(val) {
        return <a href={`#/goods/list/detail/${val}`}>{val}</a>;
      },
    },
    {
      title: '图片',
      dataIndex: 'image',
      render(val) {
        return (
          <div style={{
            width: 80,
            height: 50,
            backgroundImage: `url(${val})`,
            backgroundSize: 'cover',
            }}
          />
        );
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '商家',
      dataIndex: 'categoryNameLv1',
    },
    {
      title: '分类',
      dataIndex: 'categoryNameLv2',
    },
    {
      title: '上下架状态',
      dataIndex: 'onlineStatus',
      filters: Object.values(ONLINESTATUS).map((v, k) => ({ text: v, value: k })),
      filteredValue: String(me.search?.props.stateOfSearch.onlineStatus || searchDefault.onlineStatus).split(','),
      render(val) {
        const confirmText = ONLINESTATUS[val === 0 ? 1 : 0];
        const text = (
          <Authorized authority={['OPERPORT_JIAJU_GOODS_ONLINE']} noMatch={ONLINESTATUS[val]}>
            <Popconfirm placement="top" title={`确认${confirmText}？`} onConfirm={me.popConfirmOnline.bind(me, val)} okText="确认" cancelText="取消">
              <a>{ONLINESTATUS[val]}</a>
            </Popconfirm>
          </Authorized>
        );

        return <Badge status={ONLINESTATUSLEVELS[val]} text={text} />;
      },
    },
    {
      // TODO 待审核一定是下架商品
      title: '审核状态',
      dataIndex: 'auditStatus',
      filters: Object.values(AUDITSTATUSBRIEF).map((v, k) => ({ text: v, value: k })),
      filteredValue: String(me.search?.props.stateOfSearch.auditStatus || searchDefault.auditStatus).split(','),
      render(val, record) {
        let text = AUDITSTATUSBRIEF[val];
        if (val === 0) {
          text = (<a onClick={me.modalAuditShow.bind(me, record)}>{AUDITSTATUS[val]}</a>);
        }
        return (
          <Badge key={val} status={AUDITSTATUSLEVELS[val]} text={text} />
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      render: val => <span>{moment(val).format(format)}</span>,
    },
    {
      title: '操作',
      render: (val) => {
        return (
          <div>
            <Popconfirm placement="top" title="确认删除？" onConfirm={me.popConfirmDelete.bind(me, [val])} okText="确认" cancelText="取消">
              <a>删除</a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
};
