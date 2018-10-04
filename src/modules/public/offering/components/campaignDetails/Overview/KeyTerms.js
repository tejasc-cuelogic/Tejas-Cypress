import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Icon, Grid, Segment, Breadcrumb, Popup, Statistic } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../../constants/offering';

class KeyTerms extends Component {
  render() {
    const { campaign, refLink } = this.props;
    return (
      <Grid.Column>
        <Segment padded>
          <Breadcrumb>
            <Breadcrumb.Section as={Link} to={`${refLink.url}/keyterms`}><b>View Key Terms</b></Breadcrumb.Section>
            <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
          </Breadcrumb>
          <Header as="h4" className="mb-20">Revenue Sharing Notes</Header>
          <Grid columns={3} doubling divided className="vertical-gutter">
            <Grid.Column>
              <Statistic size="mini" className="basic">
                <Statistic.Label>Multiple <Popup trigger={<Icon name="help circle" color="green" />} content="For every $100 you invest, you are paid a portion of this company's gross revenue every month until you are paid $XXX within YY months. A 1.0% service fee is deducted from each payment." position="top center" /></Statistic.Label>
                <Statistic.Value>
                  {campaign && campaign.keyTerms ? campaign.keyTerms.investmentMultiple : '-'}
                </Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column>
              <Statistic size="mini" className="basic">
                <Statistic.Label>Revenue Sharing <Popup trigger={<Icon name="help circle" color="green" />} content="For every $100 you invest, you are paid a portion of this company's gross revenue every month until you are paid $190 within 78 months. A 1.0% service fee is deducted from each payment. See some examples." position="top center" /></Statistic.Label>
                <Statistic.Value>
                  {campaign && campaign.keyTerms ? campaign.keyTerms.revSharePercentage : '-'}
                </Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column>
              <Statistic size="mini" className="basic">
                <Statistic.Label>Maturity <Popup trigger={<Icon name="help circle" color="green" />} content="If the investors have not been paid in full within [XX] months, the Issuer is required to promptly pay the entire outstanding balance to the investors." position="top center" /></Statistic.Label>
                <Statistic.Value>
                  {campaign && campaign.keyTerms ? campaign.keyTerms.maturity : '-'}
                </Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column>
              <Statistic size="mini" className="basic">
                <Statistic.Label>Payments{' '}
                  <Popup
                    trigger={<Icon name="help circle" color="green" />}
                    content="The Issuer will make monthly payments based on the relevant revenue sharing percentage."
                    position="top center"
                  />
                </Statistic.Label>
                <Statistic.Value>
                  {campaign && campaign.keyTerms ? campaign.keyTerms.frequencyOfPayments : '-'}
                </Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column>
              <Statistic size="mini" className="basic">
                <Statistic.Label>Ownership <Popup trigger={<Icon name="help circle" color="green" />} content="Equity interest in the Issuer or voting or management rights with respect to the Issuer as a result of an investment in Securities." position="top center" /></Statistic.Label>
                <Statistic.Value>
                  {campaign && campaign.keyTerms ? campaign.keyTerms.securitiesOwnershipPercentage : '-'}
                </Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column>
              <Statistic size="mini" className="basic">
                <Statistic.Label>Type of Raise&nbsp;
                  <Popup
                    trigger={<Icon name="help circle" color="green" />}
                    content={(
                      <Aux>
                        This campaign is raising capital under Regulation CF and
                        Regulation D. For more information on what this means, check out
                        our <a href="/">Education Center.</a>
                      </Aux>
                    )}
                    position="top center"
                    hoverable
                  />
                </Statistic.Label>
                <Statistic.Value>
                  {campaign && campaign.keyTerms ? CAMPAIGN_KEYTERMS_SECURITIES[campaign.keyTerms.securities] : '-'}
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
