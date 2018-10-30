import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { Header, Table, Grid, Statistic, Button, Divider } from 'semantic-ui-react';
import { AccTypeTitle } from '../../../../../../theme/shared';
import { CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../../constants/offering';
import PayOffChart from './PayOffChart';

@inject('portfolioStore', 'campaignStore')
@observer
class Overview extends Component {
  render() {
    const { campaign } = this.props.campaignStore;
    return (
      <Aux>
        <div className="inner-content-spacer bg-offwhite">
          <span className="pull-left">
            <Header as="h5">
              <AccTypeTitle moreText="investment" />
            </Header>
          </span>
          <span className="pull-right">
            <Link target="_blank" to={`/offerings/${campaign.id}/overview`} className="pull-right">View offering page</Link>
          </span>
        </div>
        <div className="inner-content-spacer">
          <Grid>
            <Grid.Column width={9}>
              <Header as="h4">Offering Summary</Header>
              <div className="table-wrapper">
                <Table unstackable definition basic="very">
                  <Table.Body>
                    <Table.Row verticalAlign="top">
                      <Table.Cell width={5}>Issuer</Table.Cell>
                      <Table.Cell>
                        {campaign && campaign.keyTerms &&
                          campaign.keyTerms.shorthandBusinessName ?
                          campaign.keyTerms.shorthandBusinessName
                          :
                          'NA'
                        }
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row verticalAlign="top">
                      <Table.Cell>Entity Type</Table.Cell>
                      <Table.Cell>
                        {campaign && campaign.keyTerms &&
                          campaign.keyTerms.legalBusinessType ?
                          campaign.keyTerms.legalBusinessType
                          :
                          'NA'
                        }
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row verticalAlign="top">
                      <Table.Cell>Anticipated Opening</Table.Cell>
                      <Table.Cell>
                        {campaign && campaign.offering &&
                          campaign.offering.launch &&
                          campaign.offering.launch.targetDate ?
                          moment(campaign.offering.launch.targetDate).format('ll')
                          :
                          'NA'
                        }
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row verticalAlign="top">
                      <Table.Cell>Maturity</Table.Cell>
                      <Table.Cell>
                        {campaign && campaign.keyTerms &&
                          campaign.keyTerms.maturity ?
                          `${campaign.keyTerms.maturity} Months to Offering Summary`
                          :
                          'NA'
                        }
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row verticalAlign="top">
                      <Table.Cell>Principal Office</Table.Cell>
                      <Table.Cell>4102 Avenue H #A, Austin, TX 78751</Table.Cell>
                    </Table.Row>
                    <Table.Row verticalAlign="top">
                      <Table.Cell>Security Interest</Table.Cell>
                      <Table.Cell>
                        {campaign && campaign.keyTerms &&
                          campaign.keyTerms.securityInterest ?
                          campaign.keyTerms.securityInterest
                          :
                          'NA'
                        }
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row verticalAlign="top">
                      <Table.Cell>Ownership %</Table.Cell>
                      <Table.Cell>
                        {campaign && campaign.keyTerms &&
                          campaign.keyTerms.securitiesOwnershipPercentage ?
                          `${campaign.keyTerms.securitiesOwnershipPercentage}% 
                          Investors will not receive any equity interests in
                          the Issuer or any voting or management rights with respect
                          to the Issuer as a result of an investment in Securities.`
                          :
                          'NA'
                        }
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row verticalAlign="top">
                      <Table.Cell>Interest Rate</Table.Cell>
                      <Table.Cell>
                        {campaign && campaign.keyTerms &&
                          campaign.keyTerms.interestRate ?
                          campaign.keyTerms.interestRate
                          :
                          'NA'
                        }
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row verticalAlign="top">
                      <Table.Cell>Securities</Table.Cell>
                      <Table.Cell>
                        {campaign && campaign.keyTerms &&
                          campaign.keyTerms.securities ?
                          CAMPAIGN_KEYTERMS_SECURITIES[campaign.keyTerms.securities]
                          :
                          'NA'
                        }
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell colSpan="2">
                        <Button primary content="Fill SEC Form C" />
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </div>
            </Grid.Column>
            <Grid.Column width={4} floated="right">
              <Header as="h4">Key Dates & Values</Header>
              <Statistic.Group size="mini" className="vertical">
                <Statistic>
                  <Statistic.Label>Open date</Statistic.Label>
                  <Statistic.Value>
                    {campaign && campaign.offering &&
                      campaign.offering.launch &&
                      campaign.offering.launch.targetDate ?
                      moment(campaign.offering.launch.targetDate).format('MMM Do YYYY')
                      :
                      'NA'
                    }
                  </Statistic.Value>
                </Statistic>
                <Statistic>
                  <Statistic.Label>Months to Maturity</Statistic.Label>
                  <Statistic.Value>
                    {campaign && campaign.keyTerms &&
                      campaign.keyTerms.maturity ?
                      `${campaign.keyTerms.maturity} months`
                      :
                      'NA'
                    }
                  </Statistic.Value>
                </Statistic>
              </Statistic.Group>
            </Grid.Column>
          </Grid>
        </div>
        <Divider />
        <div className="inner-content-spacer payoff-chart">
          <Header as="h4">Pay Off Chart</Header>
          <PayOffChart />
        </div>
      </Aux>
    );
  }
}

export default Overview;
