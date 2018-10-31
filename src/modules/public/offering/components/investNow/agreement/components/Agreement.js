import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Modal, Header, Button, Grid, Form, Divider, Message } from 'semantic-ui-react';
import { FormCheckbox } from '../../../../../../../theme/form';
import Helper from '../../../../../../../helper/utility';

@withRouter
@inject('investmentStore')
@observer
export default class Agreement extends React.Component {
  componentWillMount() {
    const { stepToBeRendered, setStepToBeRendered, investAccTypes } = this.props.investmentStore;
    if (investAccTypes.value === '') {
      this.props.history.push('invest-now');
    } else if (stepToBeRendered === 2) {
      setStepToBeRendered(0);
    }
  }
  handleCloseModal = () => {
    this.props.history.push('overview');
  }
  submit = () => {
    this.props.investmentStore.finishInvestment().then((investmentStatus) => {
      if (investmentStatus) {
        this.props.history.push('congratulation');
      }
    });
  }
  handleCancelAgreement = () => {
    this.props.history.push('confirm-cancellation');
  }
  render() {
    const {
      AGREEMENT_DETAILS_FORM,
      investmentAmount,
      setCheckbox,
    } = this.props.investmentStore;
    return (
      <Modal size="large" open closeIcon closeOnRootNodeClick={false} onClose={() => this.handleCloseModal()}>
        <Modal.Content className="signup-header">
          <Header as="h3" className="mb-40">
            Let&#39;s confirm your investment.<br />You are investing
            <span className="positive-text"> {Helper.CurrencyFormat(investmentAmount)}</span> in Pour Behavior.
          </Header>
          {!AGREEMENT_DETAILS_FORM.meta.isValid &&
            <Message error textAlign="left" className="mb-40">
              All boxes must be checked to confirm your investment.
            </Message>
          }
          <Form error size="huge">
            <Grid stackable>
              <Grid.Row>
                {['checkboxesLeft', 'checkboxesRight'].map(field => (
                  <Grid.Column width={8}>
                    <FormCheckbox
                      defaults
                      fielddata={AGREEMENT_DETAILS_FORM.fields[field]}
                      name={field}
                      containerclassname="ui very relaxed list"
                      changed={setCheckbox}
                    />
                  </Grid.Column>
              ))}
              </Grid.Row>
            </Grid>
          </Form>
          <Divider hidden />
          <div className="center-align">
            <Button primary disabled={!AGREEMENT_DETAILS_FORM.meta.isValid} onClick={this.submit}>
            Invest
            </Button>
            <Button type="button" color="gray" onClick={this.handleCancelAgreement}>
            Cancel
            </Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}
