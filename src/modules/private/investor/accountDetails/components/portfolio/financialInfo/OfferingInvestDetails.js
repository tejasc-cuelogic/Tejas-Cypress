import React from 'react';
import { Grid, Statistic, Icon } from 'semantic-ui-react';
import Helper from '../../../../../../../helper/utility';

const OfferingInvestDetails = props => (
  <div className="featured-section investment-details">
    <Grid columns={2} divided relaxed="very">
      <Grid.Row>
        <Grid.Column>
          <Statistic size="mini" className={`basic ${props.disabledClass}`}>
            <Statistic.Label>Account</Statistic.Label>
            <Statistic.Value>
              <Icon className={`ns-${props.accType}-line `} color="green" />{' '}
              {(props.offering && props.offering.offering.keyTerms &&
                props.offering.offering.keyTerms.shorthandBusinessName)}
            </Statistic.Value>
          </Statistic>
        </Grid.Column>
        <Grid.Column>
          <Statistic size="mini" className={`basic ${props.disabledClass}`}>
            <Statistic.Label>Investment amount</Statistic.Label>
            <Statistic.Value>
              {Helper.MoneyMathDisplayCurrency((props.offering && props.offering.investedAmount)
              || 0, false)}
            </Statistic.Value>
          </Statistic>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default OfferingInvestDetails;
