import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Table, Divider, Popup, Icon, Modal, Form, Header } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import Helper from '../../../../../helper/utility';
import { MaskedInput } from '../../../../../theme/form';

@inject('investmentStore', 'userDetailsStore', 'rewardStore')
@withRouter
@observer
class ChangeInvestmentLimit extends Component {
  changeInvestmentLimit = () => {
    this.props.investmentStore.updateInvestmentLimits().then(() => {
      Helper.toast('Investment limit changed successfully.', 'success');
    });
    this.handleCloseModal();
  }
  handleCloseModal = () => {
    if (this.props.changeInvestment) {
      this.props.history.push(`${this.props.refLink}/${this.props.match.params.offeringId}/invest-now`);
    } else {
      this.props.history.push(this.props.refLink);
    }
  }
  render() {
    const {
      INVESTMENT_LIMITS_FORM,
      investmentLimitChange,
      changedInvestmentLimit,
    } = this.props.investmentStore;
    return (
      <Modal open closeIcon onClose={this.handleCloseModal}>
        <Modal.Content>
          <Header as="h3" textAlign="center">Update your investment limits</Header>
          <Form>
            <Table basic="very" className="confirm-transfer-table mt-30" compact>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    Net Worth
                    <Popup
                      wide
                      trigger={<Icon name="help circle" color="green" />}
                      content="Includes your total assets minus your liabilities. Does not include the value of your primary residence"
                      position="top center"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <MaskedInput
                      name="netWorth"
                      fielddata={INVESTMENT_LIMITS_FORM.fields.netWorth}
                      changed={(values, name) => investmentLimitChange(values, name)}
                      prefix="$"
                      currency
                      hidelabel
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                        Annual Income:
                    <Popup
                      wide
                      trigger={<Icon name="help circle" color="green" />}
                      content="Includes your earned income, your spouse's income and ancillary sources of income (including from side jobs, rental income and capital gains)."
                      position="top center"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <MaskedInput
                      name="annualIncome"
                      fielddata={INVESTMENT_LIMITS_FORM.fields.annualIncome}
                      changed={(values, name) => investmentLimitChange(values, name)}
                      prefix="$"
                      currency
                      hidelabel
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Other Reg CF Investments: </Table.Cell>
                  <Table.Cell>
                    <MaskedInput
                      name="cfInvestments"
                      fielddata={INVESTMENT_LIMITS_FORM.fields.cfInvestments}
                      changed={(values, name) => investmentLimitChange(values, name)}
                      prefix="$"
                      currency
                      hidelabel
                    />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell>Your Investment Limit: </Table.HeaderCell>
                  <Table.HeaderCell className="positive-text" collapsing>{Helper.CurrencyFormat(changedInvestmentLimit)}</Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
            <Divider hidden />
            <p>
              By clicking the “Confirm” button, I authorize the transfer from
              my <Link to={this.props.match.url}>Banco do Brasil account (x-1923)</Link>
              to my NextSeed account in the amount equal to the Transfer Requested above.
              I understand this transfer will
              be <Link to={this.props.match.url}>initiated within 1 business day</Link>.
            </p>
            <div className="center-align">
              <Button.Group>
                <Button primary content="Update" onClick={this.changeInvestmentLimit} />
                <Button type="button" onClick={this.handleCloseModal}>Cancel</Button>
              </Button.Group>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}

export default ChangeInvestmentLimit;
