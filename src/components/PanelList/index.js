import React, { Component } from 'react';
import { Form } from 'antd';
import { withState } from 'recompose';
import childrenWithProps from '../../utils/childrenWithProps';
import Search from '../TableSearch';
import Batch from '../TableBatch';
import Table from '../TableStandard';

@withState('selectedRows', 'setSelectedRows', {})
@withState('stateOfSearch', 'setStateOfSearch', {})
@Form.create()
export default class PanelList extends Component {
  render() {
    const {
      children,
      form,
      stateOfSearch,
      setStateOfSearch,
      selectedRows,
      setSelectedRows,
    } = this.props;
    const passProps = {
      form,
      stateOfSearch,
      setStateOfSearch,
      selectedRows,
      setSelectedRows,
    };

    return (
      <div>
        {childrenWithProps(children[0], { ...passProps })}
        {childrenWithProps(children[1], { ...passProps })}
        {childrenWithProps(children[2], { ...passProps })}
      </div>
    );
  }
}

export {
  Search,
  Batch,
  Table,
};
