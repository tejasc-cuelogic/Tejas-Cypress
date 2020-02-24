import React from 'react';
import { Card, List } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';

const SummaryTerms = props => (
  <>
    <Card.Group stackable itemsPerRow="2" className="application-cards">
      <Card fluid className="investment-summary">
        <Card.Content className="plr-0 pt-0 pb-0">
          <List divided className="summary-term-list">
            <List.Item className="right-align">
              <List.Content>
                <List.Header className="left floated">Total Account Value</List.Header>
                <List.Description><b>{Helper.CurrencyFormat(props.details.totalAccountValue)}</b></List.Description>
                <List.List>
                  <List.Item className="right-align">
                    <List.Content>
                      <List.Header className="left floated">Outstanding Portfolio Value</List.Header>
                      <List.Description>{Helper.CurrencyFormat(props.details.outstandingPortfolioValue)}</List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item className="right-align">
                    <List.Content>
                      <List.Header className="left floated">Pending Investments</List.Header>
                      <List.Description>{Helper.CurrencyFormat(props.details.pendingInvestments)}</List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item className="right-align">
                    <List.Content>
                      <List.Header className="left floated">Available Cash</List.Header>
                      <List.Description>{Helper.CurrencyFormat(props.details.availableCash.replace(/\D./g, ''))}</List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item className="right-align">
                    <List.Content>
                      <List.Header className="left floated">Rewards Balance</List.Header>
                      <List.Description>{Helper.CurrencyFormat(props.details.rewardsBalance)}</List.Description>
                    </List.Content>
                  </List.Item>
                </List.List>
              </List.Content>
            </List.Item>
            <List.Item className="right-align">
              <List.Content>
                <List.Header className="left floated">Lifetime Payments Received</List.Header>
                <List.Description><b>{Helper.CurrencyFormat(props.details.lifetimePaymentsReceived.replace(/\D./g, ''))}</b></List.Description>
              </List.Content>
            </List.Item>
          </List>
        </Card.Content>
      </Card>
      <Card fluid className="investment-summary">
        <Card.Content className="plr-0 pt-0 pb-0">
          <List divided className="summary-term-list">
            <List.Item className="right-align">
              <List.Content>
                <List.Header className="left floated">Lifetime Investments</List.Header>
                <List.Description><b>{Helper.CurrencyFormat(props.details.lifetimeInvestments)}</b></List.Description>
                <List.List>
                  <List.Item className="right-align">
                    <List.Content>
                      <List.Header className="left floated">Cash Investments</List.Header>
                      <List.Description>{Helper.CurrencyFormat(props.details.cashInvestments)}</List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item className="right-align">
                    <List.Content>
                      <List.Header className="left floated">Reinvested Earnings</List.Header>
                      <List.Description>{Helper.CurrencyFormat(props.details.reinvestedEarnings)}</List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item className="right-align">
                    <List.Content>
                      <List.Header className="left floated">Credits Applied</List.Header>
                      <List.Description>{Helper.CurrencyFormat(props.details.creditsApplied)}</List.Description>
                    </List.Content>
                  </List.Item>
                </List.List>
              </List.Content>
            </List.Item>
            <List.Item className="right-align">
              <List.Content>
                <List.Header className="left floated">Total Net Annulize Return</List.Header>
                <List.Description><b>{props.details.tnar}</b></List.Description>
              </List.Content>
            </List.Item>
            <List.Item className="right-align">
              <List.Content>
                <List.Header className="left floated">Realized ROI on Lifetime Investments</List.Header>
                <List.Description><b>{props.details.realizedRoiOnLifetimeInvestments}</b></List.Description>
              </List.Content>
            </List.Item>
            <List.Item className="right-align">
              <List.Content>
                <List.Header className="left floated">Realized ROI on Cash Investments</List.Header>
                <List.Description><b>{props.details.realizedRoiOnCashInvestments}</b></List.Description>
              </List.Content>
            </List.Item>
          </List>
        </Card.Content>
      </Card>
    </Card.Group>
  </>
);

export default SummaryTerms;
