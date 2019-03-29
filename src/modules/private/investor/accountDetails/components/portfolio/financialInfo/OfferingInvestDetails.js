import React from 'react';
import { Grid, Statistic } from 'semantic-ui-react';
import Helper from '../../../../../../../helper/utility';

const OfferingInvestDetails = props => (
  <div className="featured-section investment-details">
    <Grid columns={2} divided relaxed="very">
      <Grid.Row>
        <Grid.Column>
          <Statistic size="mini" className={`basic ${props.disabledClass}`}>
            <Statistic.Label>Offering</Statistic.Label>
            <Statistic.Value>
              {(props.offering && props.offering.offering.keyTerms &&
                props.offering.offering.keyTerms.shorthandBusinessName)}
            </Statistic.Value>
          </Statistic>
        </Grid.Column>
        <Grid.Column>
          <Statistic size="mini" className={`basic ${props.disabledClass}`}>
            <Statistic.Label>Investment amount</Statistic.Label>
            <Statistic.Value>
              {Helper.CurrencyFormat((props.offering && props.offering.investedAmount)
              || 0, false)}
            </Statistic.Value>
          </Statistic>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default OfferingInvestDetails;
