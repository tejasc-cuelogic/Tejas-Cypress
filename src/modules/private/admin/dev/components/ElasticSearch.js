import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

@inject('accreditationStore')
@withRouter
@observer
export default class ElasticSearch extends Component {
  componentWillMount() {
    // if (this.props.match.isExact) {
    //   this.props.accreditationStore.initRequest();
    // }
  }
  render() {
    return (
      <div>test</div>
    );
  }
}
