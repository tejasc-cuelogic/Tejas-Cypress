import React from 'react';
import { Card, List } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';
import { PopUpModal } from '../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;
const AccountSummary = summaryData => (
  summaryData.map(summaryCard => (
    <Card fluid className="investment-summary">
      {summaryCard.map(summaryElement => (
      <Card.Content className="plr-0 pt-0 pb-0">
      <List divided className="summary-term-list">
        <List.Item className="right-align">
          <List.Content>
            <List.Header className="left floated">
              { summaryElement.tooltip ? <PopUpModal showOnlyPopup={!isMobile} content={summaryElement.tooltip} customTrigger={<span className="popup-label">{summaryElement.title}</span>} /> : summaryElement.title }
            </List.Header>
            <List.Description><b>{summaryElement.value}</b></List.Description>
            {summaryElement.subitems
              && (
                <List.List>
                  {summaryElement.subitems.map(summarySubElement => (
                    <List.Item className="right-align">
                    <List.Content>
                      <List.Header className="left floated">
                        { summarySubElement.tooltip ? <PopUpModal showOnlyPopup={!isMobile} content={summarySubElement.tooltip} customTrigger={<span className="popup-label">{summarySubElement.title}</span>} /> : summarySubElement.title }
                      </List.Header>
                      <List.Description>{summarySubElement.value}</List.Description>
                    </List.Content>
                    </List.Item>
                  ))}
                </List.List>
              )
            }
          </List.Content>
        </List.Item>
      </List>
    </Card.Content>
    ))}
    </Card>
  )));

const summaryData = props => [
  [
    {
      title: 'Total Account Value',
      value: Helper.CurrencyFormat(props.details.totalAccountValue),
      tooltip: 'Includes your Current Portfolio Value, Pending Investments, Available Cash, and Rewards Balance.',
      subitems: [
        {
          title: 'Outstanding Portfolio Value',
          value: Helper.CurrencyFormat(props.details.outstandingPortfolioValue),
          tooltip: 'This calculates the total unrealized value of securities in your portfolio.',
        },
        {
          title: 'Pending Investments',
          value: Helper.CurrencyFormat(props.details.pendingInvestments),
          tooltip: 'Reservations in live offerings that have not closed or have not been processed.',
        },
        {
          title: 'Available Cash',
          value: Helper.CurrencyFormat(props.details.availableCash.replace(/\D./g, '')),
          tooltip: 'Cash that is immediately available for investment in your account.',
        },
        {
          title: 'Rewards Balance',
          value: Helper.CurrencyFormat(props.details.rewardsBalance),
          tooltip: 'Available investment credits that will be applied to your next investments.',
        },
      ],
    },
    {
      title: 'Lifetime Payments Received',
      value: Helper.CurrencyFormat(props.details.lifetimePaymentsReceived.replace(/\D./g, '')),
      tooltip: 'Total payments received from your investments on NextSeed, net of fees.',
    },
  ],
  [
    {
      title: 'Lifetime Investments',
      value: Helper.CurrencyFormat(props.details.lifetimeInvestments),
      tooltip: 'Total investments made on NextSeed.',
      subitems: [
        {
          title: 'Cash Investments',
          value: Helper.CurrencyFormat(props.details.cashInvestments),
          tooltip: 'Investments made from net new cash deposits. Does not include investments made from payments received.',
        },
        {
          title: 'Reinvested Earnings',
          value: Helper.CurrencyFormat(props.details.reinvestedEarnings),
          tooltip: 'Investments made using cash received from prior payments.',
        },
        {
          title: 'Credits Applied',
          value: Helper.CurrencyFormat(props.details.creditsApplied),
        },
      ],
    },
    {
      title: 'Total Net Annulize Return',
      value: props.details.tnar,
      tooltip: 'TNAR calculation(new calculation accounts for all payments to date plus a balloon payment at maturity for the current remaining balance)',
    },
    {
      title: 'Realized ROI on Lifetime Investments',
      value: props.details.realizedRoiOnLifetimeInvestments,
      tooltip: 'Lifetime Payments Received / Lifetime Investments.',
    },
    {
      title: 'Realized ROI on Cash Investments',
      value: props.details.realizedRoiOnCashInvestments,
      tooltip: '(Lifetime Payments Received –Reinvested Cash) / New Cash Investments.',
    },
  ],
];

const SummaryTerms = props => (
  <>
    <Card.Group stackable itemsPerRow="2" className="application-cards">
      {AccountSummary(summaryData(props))}
    </Card.Group>
  </>
);

export default SummaryTerms;
