import React from 'react';
import { Card, Divider } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';

const SummaryTerms = props => (
  <>
    <Card.Group stackable itemsPerRow="2" className="application-cards">
        <Card fluid>
            <Card.Content>
                    <p>Total Account Value {Helper.CurrencyFormat(props.details.totalAccountValue)}</p>
                    <p>Outstanding Portfolio Value {Helper.CurrencyFormat(props.details.outstandingPortfolioValue)}</p>
                    <p>Pending Investments {Helper.CurrencyFormat(props.details.pendingInvestments)}</p>
                    <p>Available Cash {Helper.CurrencyFormat(props.details.availableCash.replace(/\D./g, ''))}</p>
                    <p>Rewards Balance {Helper.CurrencyFormat(props.details.rewardsBalance)}</p>
                    <Divider />
                    <p>Lifetime Payments Received {Helper.CurrencyFormat(props.details.lifetimePaymentsReceived.replace(/\D./g, ''))}</p>
            </Card.Content>
        </Card>
        <Card fluid>
            <Card.Content>
                <p>Lifetime Investments {Helper.CurrencyFormat(props.details.lifetimeInvestments)}</p>
                <p>Cash Investments {Helper.CurrencyFormat(props.details.cashInvestments)}</p>
                <p>Reinvested Earnings {Helper.CurrencyFormat(props.details.reinvestedEarnings)}</p>
                <p>Credits Applied {Helper.CurrencyFormat(props.details.creditsApplied)}</p>
                <Divider />
                <p>Total Net Annulize Return {props.details.tnar}</p>
                <Divider />
                <p>Realized ROI on Lifetime Investments {props.details.realizedRoiOnLifetimeInvestments}</p>
                <Divider />
                <p>Realized ROI on Cash Investments {props.details.realizedRoiOnCashInvestments}</p>
            </Card.Content>
        </Card>
    </Card.Group>
  </>
);

export default SummaryTerms;
