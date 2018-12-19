import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Parser from 'html-react-parser';
import { Header, Segment, Statistic, Grid, Popup, Icon } from 'semantic-ui-react';
import { CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../../constants/offering';
import { InlineLoader } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';

const isTabletLand = document.documentElement.clientWidth >= 992
  && document.documentElement.clientWidth < 1200;
class RevenueSharingDetails extends Component {
  render() {
    const { KeyTerms, refLink } = this.props;
    const revenueShareSummary =
      (KeyTerms && KeyTerms.revShareSummary) || null;
    const maturityMonth = KeyTerms && KeyTerms.maturity ? `${KeyTerms.maturity} Months` : null;
    const maturityStartupPeriod = KeyTerms && KeyTerms.startupPeriod ? ` including a ${KeyTerms.startupPeriod} month startup period for ramp up` : '';
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
              {revenueShareSummary ?
                <p className="detail-section">
                  {Parser(revenueShareSummary)}
                </p>
                : <InlineLoader text="No data available" />
              }
            </p>
            <p className="note">
              * For illustration only. See expanded Payment Calculator view to read more
              regarding actual performance variables.
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
                    {KeyTerms && KeyTerms.securities ? CAMPAIGN_KEYTERMS_SECURITIES[KeyTerms.securities] : '-'}
                  </Statistic.Value>
                </Statistic>
              </Grid.Column>
              <Grid.Column>
                <Statistic size="mini" className="basic">
                  <Statistic.Label><b>Multiple</b>{' '}
                    <Popup
                      trigger={<Icon name="help circle" color="green" />}
                      content="Lorem Ipsum"
                      position="top center"
                    />
                  </Statistic.Label>
                  <Statistic.Value>{KeyTerms && KeyTerms.investmentMultiple ? KeyTerms.investmentMultiple : '-'}</Statistic.Value>
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
                  <Statistic.Value>
                    {maturityMonth ?
                      `${maturityMonth} ${maturityStartupPeriod && maturityStartupPeriod}`
                      :
                      '-'}
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
                  <Statistic.Value>{KeyTerms && KeyTerms.minInvestAmt ? Helper.CurrencyFormat(KeyTerms.minInvestAmt) : '-'}</Statistic.Value>
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
                  <Statistic.Value>{KeyTerms && KeyTerms.frequencyOfPayments ? KeyTerms.frequencyOfPayments : '-'}</Statistic.Value>
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
                  <Statistic.Value>{KeyTerms && KeyTerms.securitiesOwnershipPercentage ? `${KeyTerms.securitiesOwnershipPercentage}%` : '-'}</Statistic.Value>
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
