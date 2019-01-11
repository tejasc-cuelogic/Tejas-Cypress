import React, { Component } from 'react';
import { Header, Icon, Grid, Segment, Popup, Statistic } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../../constants/offering';
import Helper from '../../../../../../helper/utility';

class KeyTerms extends Component {
  render() {
    const { campaign, refLink } = this.props;
    const maturityMonth = campaign && campaign.keyTerms && campaign.keyTerms.maturity ? `${campaign.keyTerms.maturity} Months` : '[XX] Months';
    const investmentMultiple = campaign && campaign.keyTerms && campaign.keyTerms.investmentMultiple ? campaign.keyTerms.investmentMultiple : 'XXX';
    const maturityStartupPeriod = campaign && campaign.keyTerms && campaign.keyTerms.startupPeriod ? ` including a ${campaign.keyTerms.startupPeriod} month startup period for ramp up` : '';
    const portal = campaign.portal ? (campaign.portal === 'BD' ? '2%' : '1%') : '';
    return (
      <Grid.Column>
        <Segment padded className="clearfix">
          <Header as="h4">
            <Link to={`${refLink.url}/keyterms`}>
              Key Terms
              <Icon className="ns-chevron-right" color="green" />
            </Link>
          </Header>
          <Grid columns={3} doubling divided className="vertical-gutter">
            <Grid.Column>
              <Statistic size="mini" className="basic">
                <Statistic.Label><b>Investment Type </b>
                  <Popup
                    trigger={<Icon name="help circle" color="green" />}
                    content="Lorem Ipsum"
                    position="top center"
                  />
                </Statistic.Label>
                <Statistic.Value>
                  {campaign && campaign.keyTerms &&
                    campaign.keyTerms.securities ?
                    CAMPAIGN_KEYTERMS_SECURITIES[campaign.keyTerms.securities]
                    :
                    ''}
                </Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column>
              <Statistic size="mini" className="basic">
                <Statistic.Label><b>Multiple</b>
                  <Popup
                    trigger={<Icon name="help circle" color="green" />}
                    content={`For every $100 you invest, you are paid a portion of this company's gross revenue every month until you are paid $${investmentMultiple === 'XXX' ? investmentMultiple : investmentMultiple * 100} within ${maturityMonth === '[XX] Months' ? 'YY' : maturityMonth} months. ${portal ? `A ${portal} service fee is deducted from each payment.` : ''}`}
                    position="top center"
                  />
                </Statistic.Label>
                <Statistic.Value>
                  {campaign && campaign.keyTerms && campaign.keyTerms.investmentMultiple ? campaign.keyTerms.investmentMultiple : '-'}
                </Statistic.Value>
              </Statistic>
            </Grid.Column>
            {/* <Grid.Column>
              <Statistic size="mini" className="basic">
                <Statistic.Label>Revenue Sharing <Popup trigger=
                {<Icon name="help circle" color="green" />}
                content="For every $100 you invest, you are paid a portion of
                 this company's gross revenue every month until you are paid $190 within
                  78 months. A 1.0% service fee is deducted from each payment
                  . See some examples." position="top center" /></Statistic.Label>
                <Statistic.Value>
                  {campaign && campaign.keyTerms ? campaign.keyTerms.revSharePercentage : '-'}
                </Statistic.Value>
              </Statistic>
            </Grid.Column> */}
            <Grid.Column>
              <Statistic size="mini" className="basic">
                <Statistic.Label><b>Maturity</b> <Popup trigger={<Icon name="help circle" color="green" />} content={`If the investors have not been paid in full within ${maturityMonth}, the Issuer is required to promptly pay the entire outstanding balance to the investors.`} position="top center" /></Statistic.Label>
                <Statistic.Value>
                  {maturityMonth ?
                    `${maturityMonth} ${maturityStartupPeriod && maturityStartupPeriod}`
                    :
                    '-'
                  }
                </Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column>
              <Statistic size="mini" className="basic">
                <Statistic.Label><b>Min Investment</b>{' '}
                  <Popup
                    trigger={<Icon name="help circle" color="green" />}
                    content="The required minimum investment per investor in this offering."
                    position="top center"
                    hoverable
                  />
                </Statistic.Label>
                <Statistic.Value>
                  {campaign && campaign.keyTerms && campaign.keyTerms.minInvestAmt ?
                    Helper.CurrencyFormat(campaign.keyTerms.minInvestAmt) : '-'
                  }
                </Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column>
              <Statistic size="mini" className="basic">
                <Statistic.Label><b>Payments</b>{' '}
                  <Popup
                    trigger={<Icon name="help circle" color="green" />}
                    content="The Issuer will make monthly payments based on the relevant revenue sharing percentage."
                    position="top center"
                  />
                </Statistic.Label>
                <Statistic.Value>
                  {campaign && campaign.keyTerms && campaign.keyTerms.frequencyOfPayments ? campaign.keyTerms.frequencyOfPayments : '-'}
                </Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column>
              <Statistic size="mini" className="basic">
                <Statistic.Label><b>Ownership</b> <Popup trigger={<Icon name="help circle" color="green" />} content="Equity interest in the Issuer or voting or management rights with respect to the Issuer as a result of an investment in Securities." position="top center" /></Statistic.Label>
                <Statistic.Value>
                  {campaign && campaign.keyTerms && campaign.keyTerms.securitiesOwnershipPercentage ? `${campaign.keyTerms.securitiesOwnershipPercentage}%` : '-'}
                </Statistic.Value>
              </Statistic>
            </Grid.Column>
          </Grid>
        </Segment>
      </Grid.Column>
    );
  }
}

export default KeyTerms;
