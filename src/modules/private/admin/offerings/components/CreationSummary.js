import React from 'react';
import snakeCase from 'lodash/snakeCase';
import Aux from 'react-aux';
import { Card, Grid, Popup, Statistic, Icon } from 'semantic-ui-react';
import Helper from '../../../../../helper/utility';
import { DataFormatter } from '../../../../../helper';
/*
  type =>
  0 / undefined: display as it is
  1: amount so prefix $ sign
  2: date representation
*/

const showValue = props => ((props.type === 1) ?
  (Helper.CurrencyFormat(props.content)) :
  ((props.type === 2) ? `date ${props.content}` : props.content));

const summary = offer => [
  {
    title: 'Created date',
    content: offer.created ? DataFormatter.formatedDate(offer.created.date) : 'N/A',
    type: 0,
  },
  {
    title: 'POC',
    content: offer.issuerDetails && offer.issuerDetails.info ? `${offer.issuerDetails.info.firstName} ${offer.issuerDetails.info.lastName}` : 'N/A',
    type: 0,
  },
  {
    title: 'Lead',
    content: offer.leadDetails && offer.leadDetails.info ? `${offer.leadDetails.info.firstName} ${offer.leadDetails.info.lastName}` : 'N/A',
    type: 0,
  },
  {
    title: 'Days Till Launch',
    content: (offer.offering && offer.offering.launch) ? `${DataFormatter.diffDays(offer.offering.launch.targetDate)} days` : 'N/A',
    type: 0,
  },
];

const CreationSummary = ({ offer }) => (
  <Aux>
    <Card fluid>
      <Grid doubling celled columns={summary(offer).length} className="custom-divided">
        {
          summary(offer).map(row => (
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

export default CreationSummary;
