import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Segment, Statistic, Grid, Popup, Icon } from 'semantic-ui-react';
import { CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../../constants/offering';

const isTabletLand = document.documentElement.clientWidth >= 992
&& document.documentElement.clientWidth < 1200;
class RevenueSharingDetails extends Component {
  render() {
    const { KeyTerms, refLink } = this.props;
    return (
      <Grid.Row>
        <Grid.Column widescreen={10} largeScreen={10} computer={16} tablet={16}>
          <Segment padded>
            <Header as="h4">
              <Link to={`${refLink}/investment-details/summary`}>
                Revenue Sharing Summary*
                <Icon className="ns-chevron-right" color="green" />
              </Link>
            </Header>
            <p>
              This investment has a 6-month startup period during which no cash payments will
              be made. The startup period commences the first full month after the offering’s
              close.
            </p>
            <p>
              After the end of the startup period or once the Issuer commences
              operations (whichever comes later), the Issuer will share a percentage of each
              month’s gross revenue with the investors as a group until they are paid in full.
              The total amount raised by the offering will determine the Investment Multiple
              and the monthly Revenue Sharing Percentage.
            </p>
            <p className="note mt-30">
              * For illustration only. See expanded Payment Calculator view to
              read more regarding actual performance variables.
            </p>
          </Segment>
        </Grid.Column>
        <Grid.Column widescreen={6} largeScreen={6} computer={16} tablet={16} className={isTabletLand && 'mt-30'}>
          <Segment padded className="clearfix">
            <Header as="h4">
              <Link to={`${this.props.match.url}/keyterms`}>
                Key Terms
                <Icon className="ns-chevron-right" color="green" />
              </Link>
            </Header>
            <Grid columns={3} doubling divided className="vertical-gutter">
              <Grid.Column>
                <Statistic size="mini" className="basic">
                  <Statistic.Label><b>Investment Type</b>{' '}
                    <Popup
                      trigger={<Icon name="help circle" color="green" />}
                      content="Lorem Ipsum"
                      position="top center"
                    />
                  </Statistic.Label>
                  <Statistic.Value>
                    {CAMPAIGN_KEYTERMS_SECURITIES[KeyTerms.securities]}
                  </Statistic.Value>
                </Statistic>
              </Grid.Column>
              <Grid.Column>
                <Statistic size="mini" className="basic">
                  <Statistic.Label><b>Interest Rate</b>{' '}
                    <Popup
                      trigger={<Icon name="help circle" color="green" />}
                      content="Lorem Ipsum"
                      position="top center"
                    />
                  </Statistic.Label>
                  <Statistic.Value>{KeyTerms ? KeyTerms.interestRate : '0'}%</Statistic.Value>
                </Statistic>
              </Grid.Column>
              <Grid.Column>
                <Statistic size="mini" className="basic">
                  <Statistic.Label><b>Maturity</b>{' '}
                    <Popup
                      trigger={<Icon name="help circle" color="green" />}
                      content="If the investors have not been paid in full within [XX] months, the Issuer is required to promptly pay the entire outstanding balance to the investors."
                      position="top center"
                    />
                  </Statistic.Label>
                  <Statistic.Value>{KeyTerms ? KeyTerms.maturity : '0'} months</Statistic.Value>
                </Statistic>
              </Grid.Column>
              <Grid.Column>
                <Statistic size="mini" className="basic">
                  <Statistic.Label><b>Min Investment</b>{''}
                    <Popup
                      trigger={<Icon name="help circle" color="green" />}
                      content="Lorem Ipsum"
                      position="top center"
                      hoverable
                    />
                  </Statistic.Label>
                  <Statistic.Value>${KeyTerms ? KeyTerms.minInvestAmt : '0'}</Statistic.Value>
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
                  <Statistic.Value>{KeyTerms.frequencyOfPayments}</Statistic.Value>
                </Statistic>
              </Grid.Column>
              <Grid.Column>
                <Statistic size="mini" className="basic">
                  <Statistic.Label><b>Ownership</b>{' '}
                    <Popup
                      trigger={<Icon name="help circle" color="green" />}
                      content="Equity interest in the Issuer or voting or management rights with respect to the Issuer as a result of an investment in Securities. "
                      position="top center"
                    />
                  </Statistic.Label>
                  <Statistic.Value>{KeyTerms ? KeyTerms.securitiesOwnershipPercentage : '0'}%</Statistic.Value>
                </Statistic>
              </Grid.Column>
            </Grid>
            <Link to={`${refLink}/overview/keyterms`} className="right-align mt-10">View More</Link>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default RevenueSharingDetails;
