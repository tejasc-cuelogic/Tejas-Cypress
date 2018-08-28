import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Button, Table, Form, Divider, Popup, Icon } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { MaskedInput } from '../../../../../theme/form';
import Helper from '../../../../../helper/utility';

@inject('investmentStore', 'userDetailsStore')
@withRouter
@observer
class TransferRequest extends Component {
  componentWillMount() {
    const {
      cashAvailable,
      investmentAmount,
      setStepToBeRendered,
    } = this.props.investmentStore;
    if (cashAvailable > investmentAmount) {
      this.props.history.push('agreement');
    } else {
      setStepToBeRendered(2);
    }
  }
  componentDidMount() {
    const { setStepToBeRendered, setDisableNextbtn } = this.props.investmentStore;
    setDisableNextbtn();
    setStepToBeRendered(2);
  }
  componentWillUnmount() {
    const { stepToBeRendered, setStepToBeRendered } = this.props.investmentStore;
    if (stepToBeRendered === 2) {
      setStepToBeRendered(0);
    }
  }
  render() {
    const {
      cashAvailable,
      availableCreditsChange,
      investmentAmount,
      TRANSFER_REQ_FORM,
    } = this.props.investmentStore;
    return (
      <div className="center-align">
        <Header as="h3" textAlign="center">Confirm Transfer Request</Header>
        <Table basic="very" className="confirm-transfer-table mt-30" compact>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Investment Amount:</Table.Cell>
              <Table.Cell collapsing>
                {investmentAmount && Helper.CurrencyFormat(investmentAmount, 'number')}
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
              ({cashAvailable && Helper.CurrencyFormat(cashAvailable, 'number')})
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Available Credit ($100): </Table.Cell>
              <Table.Cell collapsing>
                <Form>
                  <Form.Group>
                    <MaskedInput
                      hidelabel
                      prefix=" $"
                      name="availableCredits"
                      currency
                      fielddata={TRANSFER_REQ_FORM.fields.availableCredits}
                      changed={values => availableCreditsChange(values, 'availableCredits')}
                    />
                  </Form.Group>
                </Form>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell>Transfer Request: </Table.HeaderCell>
              <Table.HeaderCell className="positive-text" collapsing>$9,180.99</Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
        <Divider hidden />
        <Button.Group>
          <Button
            primary
            onClick={this.props.confirm}
            disabled={!TRANSFER_REQ_FORM.meta.isValid}
          >Confirm
          </Button>
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

export default TransferRequest;
