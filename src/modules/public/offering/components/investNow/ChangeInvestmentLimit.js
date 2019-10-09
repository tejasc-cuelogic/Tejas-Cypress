import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
// import { Button, Table, Popup, Icon, Modal, Form, Header } from 'semantic-ui-react';
import { Modal, Header, Divider, Button, Message, Form, Statistic } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import Helper from '../../../../../helper/utility';
import { MaskedInput } from '../../../../../theme/form';
import { ListErrors } from '../../../../../theme/shared';

@inject('investmentStore', 'userDetailsStore', 'rewardStore', 'uiStore')
@withRouter
@observer
class ChangeInvestmentLimit extends Component {
  constructor(props) {
    super(props);
    this.props.investmentStore.setInvestmentLimitData();
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
      changedInvestmentLimit,
    } = this.props.investmentStore;
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
            <Statistic.Value>{Helper.CurrencyFormat(changedInvestmentLimit, 0)}</Statistic.Value>
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
                  allowNegative={false}
                  // changed={maskingFieldChange}
                  changed={(values, name) => this.change(values, name)}
                // onblur={investmentCalculate}
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
                <Button type="button" onClick={this.handleCloseModal}>Cancel</Button>
                <Button primary content="Update investment limits" loading={inProgress} disabled={!INVESTMENT_LIMITS_FORM.meta.isValid} onClick={this.changeInvestmentLimit} />
              </Button.Group>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}

export default ChangeInvestmentLimit;
