import React from 'react';
import Aux from 'react-aux';
import { Grid, Statistic, Icon } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';

const OfferingInvestDetails = props => (
  <Aux>
    <div className="featured-section investment-details">
      <Grid columns={2} divided relaxed="very">
        <Grid.Row>
          <Grid.Column>
            <Statistic size="mini" className="basic">
              <Statistic.Label>Investment Amount</Statistic.Label>
              <Statistic.Value>
                {Helper.MoneyMathDisplayCurrency((props.offering && props.offering.investedAmount)
                || 0)}
              </Statistic.Value>
            </Statistic>
          </Grid.Column>
          <Grid.Column>
            <Statistic size="mini" className="basic">
              <Statistic.Label>Account</Statistic.Label>
              <Statistic.Value>
                <Icon className={`ns-${props.accType}-line`} color="green" />{' '}
                {(props.offering && props.offering.offering.keyTerms &&
                  props.offering.offering.keyTerms.shorthandBusinessName)}
              </Statistic.Value>
            </Statistic>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  </Aux>
);

export default OfferingInvestDetails;
