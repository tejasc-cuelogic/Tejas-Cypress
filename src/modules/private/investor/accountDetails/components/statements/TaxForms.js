import React, { Component } from 'react';
import { Grid, Card } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FaqWidget } from '../../../../../../theme/shared';
import { FillTable } from '../../../../../../theme/table/NSTable';

const result = {
  columns: [
    { title: 'Statement Date', field: 'taxFormDate' },
    { title: 'Form Type', field: 'types' },
    { title: 'Download as', field: 'file', textAlign: 'right' },
  ],
};

@inject('statementStore', 'educationStore')
@observer
export default class TaxForms extends Component {
  componentWillMount() {
    this.props.statementStore.initRequest('TaxForms');
  }
  render() {
    const { taxForms, loading, error } = this.props.statementStore;
    const { faqsOfModule } = this.props.educationStore;
    result.rows = taxForms;
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
            <FaqWidget heading="Tax Forms" faqs={faqsOfModule} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
