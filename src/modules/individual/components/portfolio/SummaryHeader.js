import React from 'react';
import { Card, Grid, Popup, Divider, Statistic, Icon } from 'semantic-ui-react';

const details = {
  accountType: 'individual',
  summary: [
    { title: 'Total Balance', amount: 400.0, info: 'Your Total Balance as of today' },
    { title: 'Total Deposit', amount: 250.0, info: 'Your Total Deposit as of today' },
    { title: 'Net Payments', amount: 100.0, info: 'Your Net Payments as of today' },
    { title: 'TNAR', amount: 50.0, info: 'Your TNAR as of today' },
  ],
};

const SummaryHeader = () => (
  <Card fluid className="investment-summary">
    <Card.Content>
      <Card.Header><Icon className={`ns-${details.accountType}-line`} />{details.accountType}</Card.Header>
    </Card.Content>
    <Divider className="only-border" />
    <Grid divided padded="horizontally" columns={4} doubling>
      <Grid.Row>
        {
          details.summary.map(row => (
            <Grid.Column>
              <Card.Content>
                <Statistic size="tiny" className="basic">
                  <Statistic.Label>
                    {row.title}
                    <Popup
                      trigger={<Icon className="ns-help-circle" />}
                      content={row.info}
                      position="top center"
                      className="center-align"
                    />
                  </Statistic.Label>
                  <Statistic.Value>${row.amount}</Statistic.Value>
                  {row.title === 'Total Balance' &&
                    <Statistic.Label as="a">Deposit funds</Statistic.Label>
                  }
                </Statistic>
              </Card.Content>
            </Grid.Column>
          ))
        }
      </Grid.Row>
    </Grid>
  </Card>
);

export default SummaryHeader;
