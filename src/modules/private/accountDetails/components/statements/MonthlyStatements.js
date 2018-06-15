import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FillTable } from '../../../../../theme/table/NSTable';

const result = {
  columns: [
    { title: 'Statement Date', field: 'statementDate' },
    { title: 'Description', field: 'description' },
    { title: 'Download as', field: 'file', textAlign: 'right' },
  ],
};

@inject('statementStore')
@observer
export default class MonthlyStatements extends Component {
  componentWillMount() {
    this.props.statementStore.initRequest('MonthlyStatements');
  }
  render() {
    const { monthlyStatements, loading, error } = this.props.statementStore;
    result.rows = monthlyStatements;
    return (
      <Card fluid>
        <FillTable loading={loading} error={error} result={result} />
      </Card>
    );
  }
}
