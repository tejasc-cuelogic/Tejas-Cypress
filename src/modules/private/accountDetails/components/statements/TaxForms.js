import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FillTable } from '../../../../../theme/table/NSTable';

const result = {
  columns: [
    { title: 'Statement Date', field: 'taxFormDate' },
    { title: 'Form Type', field: 'types' },
    { title: 'Download as', field: 'file', textAlign: 'right' },
  ],
};

@inject('statementStore')
@observer
export default class TaxForms extends Component {
  componentWillMount() {
    this.props.statementStore.initRequest('TaxForms');
  }
  render() {
    const { taxForms, loading, error } = this.props.statementStore;
    result.rows = taxForms;
    return (
      <Card fluid>
        <FillTable loading={loading} error={error} result={result} />
      </Card>
    );
  }
}
