import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Button, Table, Divider, Popup, Icon } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import Helper from '../../../../../helper/utility';

@inject('investmentStore', 'userDetailsStore', 'rewardStore')
@withRouter
@observer
class ChangeInvestmentLimit extends Component {
  render() {
    const { rewardStore, investmentStore } = this.props;
    const {
      getTransferRequestAmount,
      getCurrCashAvailable,
      investmentAmount,
    } = investmentStore;
    const { getCurrCreditAvailable } = rewardStore;
    return (
      <div className="center-align">
        <Header as="h3" textAlign="center">Confirm Transfer Request</Header>
        <Table basic="very" className="confirm-transfer-table mt-30" compact>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Net Worth:</Table.Cell>
              <Table.Cell collapsing>
                {Helper.CurrencyFormat(investmentAmount, 'number')}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                Annual Income:
                <Popup
                  wide
                  trigger={<Icon name="help circle" color="green" />}
                  content="If this investment is a request to change an existing investment in this offering, then Cash Available also includes any dollars currently reserved or invested in the same offering."
                  position="top center"
                />
              </Table.Cell>
              <Table.Cell collapsing>
                {Helper.CurrencyFormat(getCurrCashAvailable, 'number')}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Other Reg CF Investments: </Table.Cell>
              <Table.Cell collapsing>
                {Helper.CurrencyFormat(getCurrCreditAvailable, 'number')}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell>Your Investment Limit: </Table.HeaderCell>
              <Table.HeaderCell className="positive-text" collapsing>{Helper.CurrencyFormat(getTransferRequestAmount, 'number')}</Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
        <Divider hidden />
        <Button.Group>
          <Button primary content="Confirm" onClick={this.props.confirm} />
          <Button onClick={this.props.cancel}>Cancel</Button>
        </Button.Group>
        <p className="mt-50">
          By clicking the “Confirm” button, I authorize the transfer from
          my <Link to="/">Banco do Brasil account (x-1923)</Link> to my NextSeed account in the
          amount equal to the Transfer Requested above. I understand this transfer will
          be <Link to="/">initiated within 1 business day</Link>.
        </p>
      </div>
    );
  }
}

export default ChangeInvestmentLimit;
