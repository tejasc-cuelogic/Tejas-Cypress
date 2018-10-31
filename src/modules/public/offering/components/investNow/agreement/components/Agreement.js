import React from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Route, withRouter } from 'react-router-dom';
import { Modal, Header, Button, Grid, Form, Divider, Message } from 'semantic-ui-react';
import { FormCheckbox } from '../../../../../../../theme/form';
import Helper from '../../../../../../../helper/utility';
import ConfirmCancellation from '../../ConfirmCancellation';

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
    const { match } = this.props;
    this.props.history.push(`${match.url}/confirm-cancellation`);
  }
  render() {
    const {
      AGREEMENT_DETAILS_FORM,
      investmentAmount,
      setCheckbox,
      agreementDetails,
    } = this.props.investmentStore;
    const { match } = this.props;
    return (
      <Modal size="large" open closeIcon closeOnRo otNodeClick={false} onClose={() => this.handleCloseModal()}>
        <Route path={`${match.url}/confirm-cancellation`} render={props => <ConfirmCancellation refLink={match.url} {...props} />} />
        <Modal.Content className="signup-header">
          <Aux style={{ display: 'none' }}>
            <div className="pdf-viewer">
              <iframe onLoad={this.iframeLoading} width="100%" height="100%" title="agreement" src={agreementDetails && agreementDetails.docuSignViewURL} />
            </div>
            <Divider hidden />
          </Aux>
          <Aux>
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
          </Aux>
        </Modal.Content>
      </Modal>
    );
  }
}
