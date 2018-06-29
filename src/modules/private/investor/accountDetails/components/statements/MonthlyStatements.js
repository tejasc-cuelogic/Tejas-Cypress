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

const faqs = [
  {
    id: 1,
    title: 'Are these one-time investments or monthly investments?',
    description: `Funds for your investment will first be taken from the available cash sitting in
    your NextSeed account. If you have insufficient funds in your NextSeed account,
    you will be prompted to request an immediate transfer of funds from your external banking account
    to your NextSeed account.`,
  },
  {
    id: 2,
    title: 'Can I cancel my investment after the closing?',
    description: `Unlike investing in in companies listed on a stock exchange where you can quickly
    and easily trade securities, there is no public market for crowdfunded securities.`,
  },
];

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
            <FaqWidget heading="Monthly Statements" faqs={faqs} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
