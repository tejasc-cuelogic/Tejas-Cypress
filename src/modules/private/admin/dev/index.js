import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PrivateLayout from '../../shared/PrivateLayout';
import ElasticSearch from './components/ElasticSearch';

@inject('accreditationStore')
@observer
export default class CrowdPay extends Component {
  componentWillMount() {
    this.props.accreditationStore.initRequest();
  }
  render() {
    return (
      <PrivateLayout
        {...this.props}
      >
        <ElasticSearch {...this.props} />
      </PrivateLayout>
    );
  }
}
