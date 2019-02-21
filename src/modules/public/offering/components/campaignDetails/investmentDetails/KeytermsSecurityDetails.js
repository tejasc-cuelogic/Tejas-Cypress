import React, { Component } from 'react';
import Parser from 'html-react-parser';
import { get } from 'lodash';
import Aux from 'react-aux';
import { Table, Popup, Icon } from 'semantic-ui-react';
import { ROUND_TYPES_ENUM, CAMPAIGN_KEYTERMS_SECURITIES, CAMPAIGN_KEYTERMS_SECURITIES_ENUM } from '../../../../../../constants/offering';
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
                {get(KeyTerms, 'investmentMultiple') ?
                  <b>
                    {get(KeyTerms, 'investmentMultiple')}
                  </b>
                  : 'NA'}
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
                <b>
                  {KeyTerms.revSharePercentage}
                </b>
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
                {KeyTerms && KeyTerms.interestRate ?
                  <p>
                    <b>{KeyTerms.interestRate}%</b>
                  </p>
                  :
                  'NA'
              }
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
                <p>
                  {KeyTerms && KeyTerms.securityInterest ?
                    <b>
                      {KeyTerms.securityInterest}
                    </b>
                      : ' NA'}
                </p>
              </Table.Cell>
            </Table.Row>
          </Aux>
    }
        {offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.PREFERRED_EQUITY_506C &&
        <Aux>
          <Table.Row verticalAlign="top">
            <Table.Cell width={5} className="neutral-text"><b>Round Type{' '}</b>
            </Table.Cell>
            <Table.Cell>
              <p>
                {KeyTerms && KeyTerms.roundType ?
                  <b>
                    {ROUND_TYPES_ENUM[KeyTerms.roundType]}
                  </b>
                :
                ' NA'
              }
              </p>
            </Table.Cell>
          </Table.Row>
          <Table.Row verticalAlign="top">
            <Table.Cell width={5} className="neutral-text"><b>Security Type{' '}</b>
            </Table.Cell>
            <Table.Cell>
              <p>
                {KeyTerms && KeyTerms.securities ?
                  <b>
                    {CAMPAIGN_KEYTERMS_SECURITIES[KeyTerms.securities]}
                  </b> : ' NA'
                  }
              </p>
            </Table.Cell>
          </Table.Row>
          <Table.Row verticalAlign="top">
            <Table.Cell width={5} className="neutral-text"><b>Unit Price{' '}</b>
            </Table.Cell>
            <Table.Cell>
              <p>
                {KeyTerms && KeyTerms.unitPrice ?
                  <b>
                    {Helper.CurrencyFormat(KeyTerms.unitPrice)}
                  </b> : ' NA'
                  }
              </p>
            </Table.Cell>
          </Table.Row>
          <Table.Row verticalAlign="top">
            <Table.Cell width={5} className="neutral-text"><b>Pre-Money valuation{' '}</b>
            </Table.Cell>
            <Table.Cell>
              <p>
                {KeyTerms && KeyTerms.premoneyValuation ?
                  <b>
                    {Helper.CurrencyFormat(KeyTerms.premoneyValuation)}
                  </b>
                     : ' NA'}
              </p>
            </Table.Cell>
          </Table.Row>
          {get(KeyTerms, 'additionalKeyterms') && get(KeyTerms, 'additionalKeyterms').length !== 0 &&
            KeyTerms.additionalKeyterms.map(item => (
              <Table.Row verticalAlign="top">
                <Table.Cell width={5} className="neutral-text"><b>{item.label}{' '}</b>
                </Table.Cell>
                <Table.Cell>
                  <p>
                    <b>
                      {Parser(item.description || '')}
                    </b>
                  </p>
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
