import React from 'react';
import { Card, List, Icon } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';
import { PopUpModal } from '../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;
const SummaryTerms = props => (
  <>
    <Card.Group stackable itemsPerRow="2" className="application-cards">
      <Card fluid className="investment-summary">
        <Card.Content className="plr-0 pt-0 pb-0">
          <List divided className="summary-term-list">
            <List.Item className="right-align">
              <List.Content>
                <List.Header className="left floated">
                  <PopUpModal showOnlyPopup={!isMobile} content="Includes your Current Portfolio Value, Pending Investments, Available Cash, and Rewards Balance." customTrigger={<span className="popup-label">Total Account Value</span>} />
                </List.Header>
                <List.Description><b>{Helper.CurrencyFormat(props.details.totalAccountValue)}</b></List.Description>
                <List.List>
                  <List.Item className="right-align">
                    <List.Content>
                      <List.Header className="left floated">
                        <PopUpModal showOnlyPopup={!isMobile} content="This calculates the total unrealized value of securities in your portfolio." customTrigger={<span className="popup-label">Outstanding Portfolio Value</span>} />
                      </List.Header>
                      <List.Description>{Helper.CurrencyFormat(props.details.outstandingPortfolioValue)}</List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item className="right-align">
                    <List.Content>
                      <List.Header className="left floated">
                        <PopUpModal showOnlyPopup={!isMobile} content="Reservations in live offerings that have not closed or have not been processed." customTrigger={<span className="popup-label">Pending Investments</span>} />
                      </List.Header>
                      <List.Description>{Helper.CurrencyFormat(props.details.pendingInvestments)}</List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item className="right-align">
                    <List.Content>
                      <List.Header className="left floated">
                        <PopUpModal showOnlyPopup={!isMobile} content="Cash that is immediately available for investment in your account." customTrigger={<span className="popup-label">Available Cash</span>} />
                      </List.Header>
                      <List.Description>{Helper.CurrencyFormat(props.details.availableCash.replace(/\D./g, ''))}</List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item className="right-align">
                    <List.Content>
                      <List.Header className="left floated">
                        <PopUpModal showOnlyPopup={!isMobile} content="Available investment credits that will be applied to your next investments." customTrigger={<span className="popup-label">Rewards Balance</span>} />
                      </List.Header>
                      <List.Description>{Helper.CurrencyFormat(props.details.rewardsBalance)}</List.Description>
                    </List.Content>
                  </List.Item>
                </List.List>
              </List.Content>
            </List.Item>
          </List>
        </Card.Content>
        <Card.Content className="plr-0 pt-0 pb-0">
          <List divided className="summary-term-list">
            <List.Item className="right-align">
              <List.Content>
                <List.Header className="left floated">
                  <PopUpModal showOnlyPopup={!isMobile} content="Total payments received from your investments on NextSeed, net of fees." customTrigger={<span className="popup-label">Lifetime Payments Received</span>} />
                </List.Header>
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
                <List.Header className="left floated">
                  <PopUpModal showOnlyPopup={!isMobile} content="Total investments made on NextSeed." customTrigger={<span className="popup-label">Lifetime Investments</span>} />
                </List.Header>
                <List.Description><b>{Helper.CurrencyFormat(props.details.lifetimeInvestments)}</b></List.Description>
                <List.List>
                  <List.Item className="right-align">
                    <List.Content>
                      <List.Header className="left floated">
                        <PopUpModal showOnlyPopup={!isMobile} content="Investments made from net new cash deposits. Does not include investments made from payments received." customTrigger={<span className="popup-label">Cash Investments</span>} />
                      </List.Header>
                      <List.Description>{Helper.CurrencyFormat(props.details.cashInvestments)}</List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item className="right-align">
                    <List.Content>
                      <List.Header className="left floated">
                        <PopUpModal showOnlyPopup={!isMobile} content="Investments made using cash received from prior payments." customTrigger={<span className="popup-label">Reinvested Earnings</span>} />
                      </List.Header>
                      <List.Description>{Helper.CurrencyFormat(props.details.reinvestedEarnings)}</List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item className="right-align">
                    <List.Content>
                      <List.Header className="left floated">
                        <PopUpModal showOnlyPopup={!isMobile} content="" customTrigger={<span className="popup-label">Credits Applied </span>} />
                      </List.Header>
                      <List.Description>{Helper.CurrencyFormat(props.details.creditsApplied)}</List.Description>
                    </List.Content>
                  </List.Item>
                </List.List>
              </List.Content>
            </List.Item>
          </List>
        </Card.Content>
        <Card.Content className="plr-0 pt-0 pb-0">
          <List divided className="summary-term-list">
            <List.Item className="right-align">
              <List.Content>
                <List.Header className="left floated">
                  <PopUpModal showOnlyPopup={!isMobile} content="TNAR calculation(new calculation accounts for all payments to date plus a balloon payment at maturity for the current remaining balance)" customTrigger={<span className="popup-label">Total Net Annulize Return</span>} />
                </List.Header>
                <List.Description><b>{props.details.tnar}</b></List.Description>
              </List.Content>
            </List.Item>
          </List>
        </Card.Content>
        <Card.Content className="plr-0 pt-0 pb-0">
          <List divided className="summary-term-list">
            <List.Item className="right-align">
              <List.Content>
                <List.Header className="left floated">
                  <PopUpModal showOnlyPopup={!isMobile} content="Lifetime Payments Received / Lifetime Investments." customTrigger={<span className="popup-label">Realized ROI on Lifetime Investments</span>} />
                </List.Header>
                <List.Description><b>{props.details.realizedRoiOnLifetimeInvestments}</b></List.Description>
              </List.Content>
            </List.Item>
          </List>
        </Card.Content>
        <Card.Content className="plr-0 pt-0 pb-0">
          <List divided className="summary-term-list">
            <List.Item className="right-align">
              <List.Content>
                <List.Header className="left floated">
                  <PopUpModal showOnlyPopup={!isMobile} content="(Lifetime Payments Received –Reinvested Cash) / New Cash Investments." customTrigger={<span className="popup-label">Realized ROI on Cash Investments</span>} />
                </List.Header>
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
