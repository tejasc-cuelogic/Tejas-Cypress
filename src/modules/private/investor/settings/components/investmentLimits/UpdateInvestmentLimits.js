import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
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
    this.props.history.goBack();
  }
  updateInvestmentLimit = () => {
    this.props.investmentLimitStore.updateInvestmentLimit().then(() => {
      this.props.history.goBack();
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
              Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus,
            </p>
          </Modal.Header>
          <Modal.Content>
            {errors &&
              <Message error>
                <ListErrors errors={[errors]} />
              </Message>
            }
            <Statistic size="tiny">
              <Statistic.Label>
                Estimated investment limit
              </Statistic.Label>
              <Statistic.Value>
                {Helper.CurrencyFormat(currentLimit)}
              </Statistic.Value>
            </Statistic>
            <Divider clearing hidden />
            <Form error onSubmit={this.submit}>
              {fields &&
                ['annualIncome', 'netWorth', 'otherInvestments'].map(field => (
                  <MaskedInput
                    key={field}
                    name={field}
                    currency
                    prefix="$ "
                    value={fields[field].value}
                    fielddata={fields[field]}
                    changed={maskingFieldChange}
                    onBlur={investmentCalculate}
                  />
                ))
              }
              <div className="center-align mt-30">
                <Button loading={inProgress} disabled={!INVESTEMENT_LIMIT_META.meta.isValid} onClick={this.updateInvestmentLimit} color="green">Update investment limits</Button>
              </div>
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
