import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Table, Popup, Icon, Modal, Form, Header } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import Helper from '../../../../../helper/utility';
import { MaskedInput } from '../../../../../theme/form';

@inject('investmentStore', 'userDetailsStore', 'rewardStore', 'investmentLimitStore')
@withRouter
@observer
class ChangeInvestmentLimit extends Component {
  componentWillMount = () => {
    this.props.investmentStore.setInvestmentLimitData();
  }
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
    const { resetForm, INVESTMENT_LIMITS_FORM } = this.props.investmentStore;
    resetForm(INVESTMENT_LIMITS_FORM);
  }
  change = (values, name) => {
    this.props.investmentStore.investmentLimitChange(values, name);
    this.forceUpdate();
  }
  render() {
    const {
      INVESTMENT_LIMITS_FORM,
      changedInvestmentLimit,
    } = this.props.investmentStore;
    // const { getCurrentInvestNowHealthCheck } = this.props.investmentLimitStore;
    // const bankAndAccountName = getCurrentInvestNowHealthCheck &&
    // getCurrentInvestNowHealthCheck.bankNameAndAccountNumber ?
    // getCurrentInvestNowHealthCheck.bankNameAndAccountNumber : '-';
    return (
      <Modal open closeIcon onClose={this.handleCloseModal}>
        <Modal.Content className="center-align">
          <Header as="h3" textAlign="center">Update your investment limits</Header>
          <a target="_blank" rel="noopener noreferrer" href={`${window.location.origin}/resources/education-center/investor/investment-limit-calcuator/`} className="link">How is this calculated?</a>
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
                  <Table.Cell width={5} textAlign="right">
                    <MaskedInput
                      name="netWorth"
                      fielddata={INVESTMENT_LIMITS_FORM.fields.netWorth
                        ? INVESTMENT_LIMITS_FORM.fields.netWorth : 0}
                      changed={(values, name) => this.change(values, name)}
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
                  <Table.Cell textAlign="right">
                    <MaskedInput
                      name="annualIncome"
                      fielddata={INVESTMENT_LIMITS_FORM.fields.annualIncome
                        ? INVESTMENT_LIMITS_FORM.fields.annualIncome : 0}
                      changed={(values, name) => this.change(values, name)}
                      prefix="$"
                      currency
                      hidelabel
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Other Reg CF Investments:</Table.Cell>
                  <Table.Cell textAlign="right">
                    <MaskedInput
                      name="cfInvestments"
                      fielddata={INVESTMENT_LIMITS_FORM.fields.cfInvestments
                        ? INVESTMENT_LIMITS_FORM.fields.cfInvestments : 0}
                      changed={(values, name) => this.change(values, name)}
                      prefix="$"
                      currency
                      hidelabel
                    />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell>Your Investment Limit:</Table.HeaderCell>
                  <Table.HeaderCell textAlign="right" className="positive-text">{Helper.CurrencyFormat(changedInvestmentLimit, 0)}</Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
            <div className="center-align mt-30">
              <Button.Group>
                <Button type="button" onClick={this.handleCloseModal}>Cancel</Button>
                <Button primary content="Update" onClick={this.changeInvestmentLimit} />
              </Button.Group>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}

export default ChangeInvestmentLimit;
