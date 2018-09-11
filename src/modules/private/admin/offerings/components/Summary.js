import React from 'react';
import snakeCase from 'lodash/snakeCase';
import Aux from 'react-aux';
import { Card, Grid, Popup, Statistic, Icon } from 'semantic-ui-react';
import Helper from '../../../../../helper/utility';
/*
  type =>
  0 / undefined: display as it is
  1: amount so prefix $ sign
  2: date representation
*/

const showValue = props => ((props.type === 1) ?
  (Helper.CurrencyFormat(props.content)) :
  ((props.type === 2) ? `date ${props.content}` : props.content));

const Summary = props => (
  <Aux>
    <Card fluid className={props.details.className || ''}>
      <Grid doubling celled columns={props.cols || props.details.summary.length} className="custom-divided">
        {
          props.details.summary.map(row => (
            <Grid.Column key={snakeCase(row.title)}>
              <Card.Content>
                <Statistic size="mini" className={row.status}>
                  <Statistic.Label>
                    {row.title}
                    {row.info &&
                      <Popup
                        trigger={<Icon className="ns-help-circle" />}
                        content={row.info}
                        position="top center"
                        className="center-align"
                      />
                    }
                  </Statistic.Label>
                  <Statistic.Value>{showValue(row)}</Statistic.Value>
                </Statistic>
              </Card.Content>
            </Grid.Column>
          ))
        }
      </Grid>
    </Card>
  </Aux>
);

export default Summary;
