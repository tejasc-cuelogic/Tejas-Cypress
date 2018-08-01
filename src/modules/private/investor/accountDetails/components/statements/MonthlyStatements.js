import React, { Component } from 'react';
import { Grid, Card } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FaqWidget } from '../../../../../../theme/shared';
import { FillTable } from '../../../../../../theme/table/NSTable';

const result = {
  columns: [
    { title: 'Statement Date', field: 'statementDate' },
    { title: 'Description', field: 'description' },
    { title: 'Download as', field: 'file', textAlign: 'right' },
  ],
};

@inject('statementStore', 'educationStore')
@observer
export default class MonthlyStatements extends Component {
  componentWillMount() {
    this.props.statementStore.initRequest('MonthlyStatements');
  }
  render() {
    const { faqsOfModule } = this.props.educationStore;
    const { monthlyStatements, loading, error } = this.props.statementStore;
    result.rows = monthlyStatements;
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <Card fluid>
              <FillTable loading={loading} error={error} result={result} />
            </Card>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column widescreen={12} largeScreen={12} computer={12} tablet={16} mobile={16}>
            <FaqWidget heading="Monthly Statements" faqs={faqsOfModule} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
