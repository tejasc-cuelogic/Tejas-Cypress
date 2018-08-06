import React from 'react';
// import { Link } from 'react-router-dom';
import snakeCase from 'lodash/snakeCase';
import Aux from 'react-aux';
import { Card, Grid, Popup, Divider, Statistic, Icon, Header } from 'semantic-ui-react';
import { AccTypeTitle } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';
/*
  type =>
  0 / undefined: display as it is
  1: amount so prefix $ sign
  2: date representation
*/

const showValue = props => ((props.type === 1) ?
  (Helper.CurrencyFormat(props.content)) :
  ((props.type === 2) ? `date ${props.content}` : props.content));

const SummaryTitle = props => ((props.details.businessName) ? (
  <Header as="h3">
    {props.details.businessName}
  </Header>
) : (
  <Aux>
    <Card.Content>
      <Card.Header className="with-icon"><AccTypeTitle /></Card.Header>
    </Card.Content>
    <Divider horizontal className="only-border" />
  </Aux>
));

const SummaryHeader = props => (
  <Aux>
    {props.details.title !== false && props.details.businessName &&
      <SummaryTitle {...props} />
    }
    <Card fluid className={props.details.className || ''}>
      {props.details.title !== false && !props.details.businessName &&
        <SummaryTitle {...props} />
      }
      <Grid celled="internally" columns={props.details.summary.length} doubling>
        <Grid.Row>
          {
            props.details.summary.map(row => (
              <Grid.Column key={snakeCase(row.title)}>
                <Card.Content>
                  <Statistic size="mini">
                    <Statistic.Label>
                      {row.title}
                      <Popup
                        trigger={<Icon className="ns-help-circle" />}
                        content={row.info}
                        position="top center"
                        className="center-align"
                      />
                    </Statistic.Label>
                    <Statistic.Value>{showValue(row)}</Statistic.Value>
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
  </Aux>
);

export default SummaryHeader;
