import React, { Component } from 'react';
import Parser from 'html-react-parser';
import { get } from 'lodash';
import Aux from 'react-aux';
import { Table, Popup, Icon } from 'semantic-ui-react';
import { ROUND_TYPES_ENUM, CAMPAIGN_KEYTERMS_SECURITIES_ENUM } from '../../../../../../constants/offering';
import Helper from '../../../../../../helper/utility';

class KeyTermsSecurityDetails extends Component {
  render() {
    const {
      KeyTerms, campaign,
    } = this.props;
    const maturityMonth = KeyTerms && KeyTerms.maturity ? `${KeyTerms.maturity} Months` : '[XX] Months';
    const investmentMultiple = KeyTerms && KeyTerms.investmentMultiple ? KeyTerms.investmentMultiple : 'XXX';
    const portal = campaign && campaign.regulation ? (campaign.regulation.includes('BD') ? '2%' : '1%') : '';
    const { offerStructure } = this.props.campaignStore;
    return (
      <Aux>
        {offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REVENUE_SHARING_NOTE &&
        <Aux>
          <Table.Row verticalAlign="top">
            <Table.Cell width={5} className="neutral-text"><b>Investment Multiple{' '}</b>
              <Popup
                trigger={<Icon name="help circle" color="green" />}
                content={`For every $100 you invest, you are paid a portion of this company's gross revenue every month until you are paid $${investmentMultiple === 'XXX' ? investmentMultiple : investmentMultiple * 100} within ${maturityMonth === '[XX] Months' ? 'YY' : maturityMonth} months. ${portal ? `A ${portal} service fee is deducted from each payment.` : ''}`}
                position="top center"
              />
            </Table.Cell>
            <Table.Cell>
              <p>
                {get(KeyTerms, 'investmentMultiple') ? get(KeyTerms, 'investmentMultiple') : 'NA'}
              </p>
              <p>
                {Parser(get(KeyTerms, 'investmentMultipleSummary') ?
                  get(KeyTerms, 'investmentMultipleSummary')
                  :
                  '')}
              </p>
            </Table.Cell>
          </Table.Row>
          <Table.Row verticalAlign="top">
            <Table.Cell width={5} className="neutral-text"><b>Revenue Sharing Percentage</b></Table.Cell>
            <Table.Cell>
              <p> {get(KeyTerms, 'revSharePercentage') ?
                  KeyTerms.revSharePercentage
                    : 'NA'}
              </p>
              <p>
                {Parser(get(KeyTerms, 'revShareSummary') ?
                  KeyTerms.revShareSummary
                  :
                  '')}
              </p>
            </Table.Cell>
          </Table.Row>
        </Aux>
    }
        {offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.TERM_NOTE &&
          <Aux>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5} className="neutral-text"><b>Interest Rate{' '}</b>
                <Popup
                  trigger={<Icon name="help circle" color="green" />}
                  content="Interest payment is calculated at a gross annualized interest rate of 16.0% each month on the remaining balance of your investment from the prior month."
                  position="top center"
                />
              </Table.Cell>
              <Table.Cell>
                {KeyTerms && KeyTerms.interestRate ? `${KeyTerms.interestRate}%` : 'NA'}
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5} className="neutral-text"><b>Security Interest{' '}</b>
                <Popup
                  trigger={<Icon name="help circle" color="green" />}
                  content="The Issuer will grant a security interest in all of its assets in favor of NextSeed for the benefit of the investors to secure the Issuer’s obligations under the Securities. For more details, please see the disclosure statement."
                  position="top center"
                />
              </Table.Cell>
              <Table.Cell>
                {KeyTerms && KeyTerms.securityInterest ? KeyTerms.securityInterest : ' NA'}
              </Table.Cell>
            </Table.Row>
          </Aux>
    }
        {offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.PREFERRED_EQUITY_506C &&
        <Aux>
          {KeyTerms && KeyTerms.roundType &&
          <Table.Row verticalAlign="top">
            <Table.Cell width={5} className="neutral-text"><b>Round Type{' '}</b>
            </Table.Cell>
            <Table.Cell>
              <p>
                {ROUND_TYPES_ENUM[KeyTerms.roundType]}
              </p>
            </Table.Cell>
          </Table.Row>
          }
          {KeyTerms && KeyTerms.unitPrice &&
          <Table.Row verticalAlign="top">
            <Table.Cell width={5} className="neutral-text"><b>Share Price{' '}</b>
            </Table.Cell>
            <Table.Cell>
              <p>
                {Helper.CurrencyFormat(KeyTerms.unitPrice)}
              </p>
            </Table.Cell>
          </Table.Row>
          }
          {KeyTerms && KeyTerms.premoneyValuation &&
          <Table.Row verticalAlign="top">
            <Table.Cell width={5} className="neutral-text"><b>Pre-Money valuation{' '}</b>
            </Table.Cell>
            <Table.Cell>
              <p>
                {Helper.CurrencyFormat(KeyTerms.premoneyValuation)}
              </p>
            </Table.Cell>
          </Table.Row>
          }
          {get(KeyTerms, 'additionalKeyterms') && get(KeyTerms, 'additionalKeyterms').length !== 0 &&
            KeyTerms.additionalKeyterms.map(item => (
              <Table.Row verticalAlign="top">
                <Table.Cell width={5} className="neutral-text"><b>{item.label}{' '}</b>
                </Table.Cell>
                <Table.Cell>
                  {Parser(item.description || '')}
                </Table.Cell>
              </Table.Row>
            ))
          }
        </Aux>
      }
      </Aux>
    );
  }
}

export default KeyTermsSecurityDetails;
