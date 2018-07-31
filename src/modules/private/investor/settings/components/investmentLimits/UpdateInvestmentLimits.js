import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Modal, Header, Divider, Button, Message, Grid, Form, Statistic } from 'semantic-ui-react';
import { MaskedInput2 } from '../../../../../../theme/form';
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
  render() {
    const errors = false;
    const { inProgress } = this.props.uiStore;
    const { INVESTEMENT_LIMIT_META, maskingFieldChange } = this.props.investmentLimitStore;
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
                {Helper.CurrencyFormat(35000)}
              </Statistic.Value>
            </Statistic>
            <Divider clearing hidden />
            <Form error onSubmit={this.submit}>
              <Grid>
                <Grid.Column widescreen={16} largeScreen={16} computer={16} tablet={16} mobile={16}>
                  <div className="field-wrap">
                    {fields &&
                      ['annualIncome', 'netWorth', 'otherInvestment'].map(field => (
                        <MaskedInput2
                          key={field}
                          name={field}
                          currency
                          value={fields[field].value}
                          fielddata={fields[field]}
                          changed={maskingFieldChange}
                        />
                      ))
                    }
                  </div>
                </Grid.Column>
              </Grid>
              <div className="center-align mt-30">
                <Button loading={inProgress} disabled={!INVESTEMENT_LIMIT_META.meta.isValid} color="green">Update investment limits</Button>
              </div>
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
