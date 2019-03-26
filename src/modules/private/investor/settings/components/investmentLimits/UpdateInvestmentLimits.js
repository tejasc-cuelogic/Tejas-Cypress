import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Modal, Header, Divider, Button, Message, Form, Statistic } from 'semantic-ui-react';
import { MaskedInput } from '../../../../../../theme/form';
import { ListErrors } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';

@inject('uiStore', 'investmentLimitStore')
@withRouter
@observer
export default class UpdateInvestmentLimits extends Component {
  submit = (e) => {
    e.stopPropagation();
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.push(this.props.refLink);
  }
  updateInvestmentLimit = () => {
    this.props.investmentLimitStore.updateInvestmentLimit().then(() => {
      this.props.history.push(this.props.refLink);
    });
  }
  render() {
    const errors = false;
    const { inProgress } = this.props.uiStore;
    const {
      INVESTEMENT_LIMIT_META, maskingFieldChange, currentLimit, investmentCalculate,
    } = this.props.investmentLimitStore;
    const { fields } = INVESTEMENT_LIMIT_META;
    return (
      <div>
        <Modal open closeIcon onClose={this.handleCloseModal} size="tiny" closeOnDimmerClick={false}>
          <Modal.Header className="center-align signup-header">
            <Header as="h3">Update Investment limits</Header>
            <Divider />
            <p>
              Ensure that your 12-month Investment Limit for Regulation Crowdfunding is up to date
              by providing your most recent Annual Income and Net Worth.&nbsp;
              <Link target="_blank" to="/app/resources/faq">See FAQ on how your investment limit is calculated</Link>
            </p>
          </Modal.Header>
          <Modal.Content>
            <Statistic size="tiny">
              <Statistic.Label>Estimated investment limit</Statistic.Label>
              <Statistic.Value>{Helper.CurrencyFormat(currentLimit, 0)}</Statistic.Value>
            </Statistic>
            <Divider clearing hidden />
            <Form error onSubmit={this.submit}>
              {fields &&
                ['annualIncome', 'netWorth', 'cfInvestments'].map(field => (
                  <MaskedInput
                    key={field}
                    name={field}
                    currency
                    prefix="$ "
                    value={fields[field].value}
                    fielddata={fields[field]}
                    changed={maskingFieldChange}
                    onblur={investmentCalculate}
                  />
                ))
              }
              {errors &&
                <Message error className="mt-30">
                  <ListErrors errors={[errors]} />
                </Message>
              }
              <div className="center-align mt-30">
                <Button.Group>
                  <Button type="button" onClick={this.handleCloseModal}>Cancel</Button>
                  <Button primary content="Update investment limits" loading={inProgress} disabled={!INVESTEMENT_LIMIT_META.meta.isValid} onClick={this.updateInvestmentLimit} />
                </Button.Group>
              </div>
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
