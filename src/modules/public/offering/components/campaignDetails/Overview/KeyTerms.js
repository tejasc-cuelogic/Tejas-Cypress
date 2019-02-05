/* eslint-disable no-undef */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link, withRouter } from 'react-router-dom';
import { Icon, Popup, Table, Header, Button } from 'semantic-ui-react';
import { CAMPAIGN_KEYTERMS_SECURITIES, CAMPAIGN_KEYTERMS_REGULATION } from '../../../../../../constants/offering';

const isTablet = document.documentElement.clientWidth < 991;

@withRouter
class KeyTerms extends Component {
  handleViewInvestmentDetails = (e) => {
    e.preventDefault();
    this.props.history.push(`${this.props.refLink}/investment-details`);
  }
  render() {
    const { campaign } = this.props;
    const maturityMonth = campaign && campaign.keyTerms && campaign.keyTerms.maturity ? `${campaign.keyTerms.maturity} Months` : '[XX] Months';
    const maturityStartupPeriod = campaign && campaign.keyTerms && campaign.keyTerms.startupPeriod ? ` including a ${campaign.keyTerms.startupPeriod} month startup period for ramp up` : '';
    return (
      <Aux>
        <Header as="h3" className="mb-30 anchor-wrap">
          Investment Highlights
          <span className="anchor" id="investment-highlights" />
        </Header>
        <Table basic="very" className="key-terms-table neutral-text">
          <Table.Body>
            <Table.Row verticalAlign="top">
              <Table.Cell><b>Type of Raise</b>{' '}
                <Popup
                  hoverable
                  position="top center"
                  trigger={<Icon
                    name="help circle"
                    color="green"
                  />}
                  content={(
                    <span>This campaign is raising capital under Regulation CF and
                      Regulation D. For more information on what this means, check out our{' '}
                      <Link to="/resources/education-center">Education Center</Link>.
                    </span>
                  )}
                />
              </Table.Cell>
              <Table.Cell className="grey-header">
                {campaign && campaign.keyTerms && campaign.keyTerms.regulation ?
                  CAMPAIGN_KEYTERMS_REGULATION[campaign.keyTerms.regulation] : '-'}
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell><b>Investment Type</b>{' '}
                <Popup
                  trigger={<Icon name="help circle" color="green" />}
                  content="Lorem Ipsum"
                  position="top center"
                />
              </Table.Cell>
              <Table.Cell className="grey-header">
                {campaign && campaign.keyTerms &&
                  campaign.keyTerms.securities ?
                  CAMPAIGN_KEYTERMS_SECURITIES[campaign.keyTerms.securities]
                  :
                '-'}
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Maturity</b>{' '}
                <Popup
                  trigger={<Icon name="help circle" color="green" />}
                  content={`If the investors have not been paid in full within ${maturityMonth}, the Issuer is required to promptly pay the entire outstanding balance to the investors.`}
                  position="top center"
                />
              </Table.Cell>
              <Table.Cell className="grey-header">
                {maturityMonth ?
                  `${maturityMonth} ${maturityStartupPeriod && maturityStartupPeriod}`
                  :
                  '-'
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell collapsing><b>Revenue Sharing Percentage</b>{' '}
                <Popup
                  hoverable
                  trigger={<Icon name="help circle" color="green" />}
                  content={(<span>To learn more about how Revenue Sharing works, check out the <Link to="/resources/education-center">Education Center</Link>.</span>)}
                  position="top center"
                />
              </Table.Cell>
              <Table.Cell className="grey-header" >
                {campaign && campaign.keyTerms && campaign.keyTerms.revSharePercentage ? campaign.keyTerms.revSharePercentage : '-'}
                {/* <br />
                {campaign && campaign.keyTerms && campaign.keyTerms.revShareSummary ?
                campaign.keyTerms.revShareSummary : ' '} */}
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell><b>Multiple</b>{' '}
                <Popup
                  hoverable
                  trigger={<Icon name="help circle" color="green" />}
                  content={(<span>The business will pay you a percent of its gross revenues until a multiple of your investment is paid back to you. See the <Link to={`${this.props.refLink}/investment-details`}>Key Terms</Link> for more details.</span>)}
                  position="top center"
                />
              </Table.Cell>
              <Table.Cell className="grey-header">
                {campaign && campaign.keyTerms && campaign.keyTerms.investmentMultiple ? campaign.keyTerms.investmentMultiple : '-'}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Button fluid={isTablet} onClick={this.handleViewInvestmentDetails} basic compact className="highlight-text mt-40">
          View Investment Details
          <Icon size="small" className="ns-chevron-right right" color="white" />
        </Button>
      </Aux>
    );
  }
}

export default KeyTerms;
