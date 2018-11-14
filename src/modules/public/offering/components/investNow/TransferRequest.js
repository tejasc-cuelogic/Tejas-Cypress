import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Button, Table, Divider, Popup, Icon, Message } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import Helper from '../../../../../helper/utility';

@inject('investmentStore', 'userDetailsStore', 'rewardStore')
@withRouter
@observer
class TransferRequest extends Component {
  componentWillMount() {
    const {
      getTransferRequestAmount,
      setStepToBeRendered,
      setFieldValue,
    } = this.props.investmentStore;
    if (getTransferRequestAmount > 0) {
      setStepToBeRendered(2);
    } else {
      this.props.history.push('agreement');
    }
    setFieldValue('investmentFlowErrorMessage', null);
  }
  componentDidMount() {
    const { setStepToBeRendered, setFieldValue } = this.props.investmentStore;
    setFieldValue('disableNextbtn', true);
    setStepToBeRendered(2);
  }
  componentWillUnmount() {
    const { stepToBeRendered, setStepToBeRendered } = this.props.investmentStore;
    if (stepToBeRendered === 2) {
      setStepToBeRendered(0);
    }
  }
  handleShowTransferErrRequest = () => {
    this.props.investmentStore.setShowTransferRequestErr(false);
  }
  render() {
    const { rewardStore, investmentStore } = this.props;
    const {
      getTransferRequestAmount,
      getCurrCashAvailable,
      showTransferRequestErr,
      investmentAmount,
      investmentFlowErrorMessage,
    } = investmentStore;
    const { getCurrCreditAvailable } = rewardStore;
    if (showTransferRequestErr) {
      return (
        <div className="center-align">
          <Header as="h3" textAlign="center">Your investment transaction was not processed.</Header>
          <p className="mt-30 mb-30">This may have happened because your session expired or your network connection dropped.
            We did not complete your investment transaction. Please check your account, and
            try again to complete your investment.
          </p>
          <Button primary content="Try Again" onClick={this.handleShowTransferErrRequest} />
        </div>
      );
    }
    return (
      <div className="center-align">
        <Header as="h3" textAlign="center">Confirm Transfer Request</Header>
        {investmentFlowErrorMessage &&
          <Message error textAlign="left" className="mb-40">
            {investmentFlowErrorMessage}
          </Message>
        }
        <Table basic="very" className="confirm-transfer-table mt-30" compact>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Investment Amount:</Table.Cell>
              <Table.Cell collapsing>
                {Helper.CurrencyFormat(investmentAmount, 'number')}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                Cash Available:
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
              <Table.Cell>Available Credit: </Table.Cell>
              <Table.Cell collapsing>
                {Helper.CurrencyFormat(getCurrCreditAvailable, 'number')}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell>Transfer Request: </Table.HeaderCell>
              <Table.HeaderCell className="positive-text" collapsing>{Helper.CurrencyFormat(getTransferRequestAmount, 'number')}</Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
        <Divider hidden />
        <Button.Group>
          <Button primary content="Confirm" onClick={this.props.confirm} />
          <Button type="button" onClick={this.props.cancel}>Cancel</Button>
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

export default TransferRequest;
