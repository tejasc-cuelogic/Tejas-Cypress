import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
// import { Button, Table, Popup, Icon, Modal, Form, Header } from 'semantic-ui-react';
import { Modal, Header, Divider, Button, Message, Form, Statistic } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { get } from 'lodash';
import Helper from '../../../../../helper/utility';
import { MaskedInput } from '../../../../../theme/form';
import { ListErrors } from '../../../../../theme/shared';

@inject('investmentStore', 'userDetailsStore', 'uiStore', 'investmentLimitStore')
@withRouter
@observer
class ChangeInvestmentLimit extends Component {
  constructor(props) {
    super(props);
    this.props.investmentStore.setInvestmentLimitData();
    this.props.investmentStore.resetFormErrors('INVESTMONEY_FORM');
    this.props.investmentStore.setFieldValue('disableNextbtn', true);
    const { getCurrentInvestNowHealthCheck, setFieldValue } = this.props.investmentLimitStore;
    const currentInvestmentLimit = get(getCurrentInvestNowHealthCheck, 'investmentLimit') || 0;
    setFieldValue('currentLimit', currentInvestmentLimit);
  }

  componentWillUnmount() {
    const { getCurrentInvestNowHealthCheck, setFieldValue } = this.props.investmentLimitStore;
    const currentInvestmentLimit = get(getCurrentInvestNowHealthCheck, 'investmentLimit') || 0;
    setFieldValue('currentLimit', currentInvestmentLimit);
  }

  changeInvestmentLimit = () => {
    const { uiStore } = this.props;
    uiStore.setProgress();
    const offeringId = this.props.offeringId ? this.props.offeringId : this.props.match.params.offeringId;
    this.props.investmentStore.updateInvestmentLimits(offeringId).then(() => {
      Helper.toast('Investment limit changed successfully.', 'success');
      this.handleCloseModal();
    });
  }

  handleCloseModal = () => {
    if (this.props.changeInvestment) {
      const redirectPath = this.props.match.url.includes('agreement') ? `${this.props.refLink}/${this.props.match.params.offeringId}/agreement` : `${this.props.refLink}/${this.props.match.params.offeringId}/invest-now`;
      this.props.history.push(redirectPath);
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
    const errors = false;
    const { inProgress } = this.props.uiStore;
    const {
      INVESTMENT_LIMITS_FORM,
      // changedInvestmentLimit,
    } = this.props.investmentStore;
    const { calculateCfLimit, currentLimit } = this.props.investmentLimitStore;
    // const currentInvestmentLimit = get(getCurrentInvestNowHealthCheck, 'investmentLimit') || 0;
    const { fields } = INVESTMENT_LIMITS_FORM;
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="tiny" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Update Investment limits</Header>
          <Divider />
          <p>
            Ensure that your 12-month Investment Limit for Regulation Crowdfunding is up to date
            by providing your most recent Annual Income and Net Worth.&nbsp;
            <Link target="_blank" to="/resources/education-center/investor/faq">See FAQ on how your investment limit is calculated</Link>
          </p>
        </Modal.Header>
        <Modal.Content>
          <Statistic size="tiny">
            <Statistic.Label>Estimated investment limit</Statistic.Label>
            <Statistic.Value>{Helper.MoneyMathDisplayCurrency(currentLimit || 0, false)}</Statistic.Value>
          </Statistic>
          <Divider clearing hidden />
          <Form error onSubmit={this.submit}>
            {fields
              && ['annualIncome', 'netWorth', 'cfInvestments'].map(field => (
                <MaskedInput
                  key={field}
                  name={field}
                  currency
                  prefix="$ "
                  value={fields[field].value}
                  fielddata={fields[field]}
                  // changed={maskingFieldChange}
                  changed={(values, name) => this.change(values, name)}
                  onblur={calculateCfLimit}
                />
              ))
            }
            {errors
              && (
                <Message error className="mt-30">
                  <ListErrors errors={[errors]} />
                </Message>
              )
            }
            <div className="center-align mt-30">
              <Button.Group>
                <Button type="button" disabled={inProgress} onClick={this.handleCloseModal}>Cancel</Button>
                <Button primary content="Update investment limits" loading={inProgress} disabled={!INVESTMENT_LIMITS_FORM.meta.isValid || inProgress} onClick={this.changeInvestmentLimit} />
              </Button.Group>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}

export default ChangeInvestmentLimit;
