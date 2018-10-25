import React from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Button, Grid, Form, Popup, Icon, Divider } from 'semantic-ui-react';
import { MaskedInput, FormCheckbox } from '../../../../../../../theme/form';
import Helper from '../../../../../../../helper/utility';
@inject('investmentStore')
@observer
export default class Agreement extends React.Component {
  componentWillMount() {
    const { stepToBeRendered, setStepToBeRendered } = this.props.investmentStore;
    if (stepToBeRendered === 2) {
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

  render() {
    const {
      investmentLimitsChecked,
      AGREEMENT_DETAILS_FORM,
      investmentAmount,
      agreementInfoChange,
      setCheckbox,
    } = this.props.investmentStore;
    return (
      <Modal size="large" open closeIcon closeOnRo otNodeClick={false} onClose={() => this.handleCloseModal()}>
        <Modal.Content className="signup-header">
          <Header as="h3" className="mb-40">
            Let&#39;s confirm your investment.<br />You are investing
            <span className="positive-text"> {Helper.CurrencyFormat(investmentAmount)}</span> in Pour Behavior.
          </Header>
          <Form error size="huge">
            {investmentLimitsChecked ?
              <Grid divided doubling columns={4} className="agreement-details">
                {['netWorth', 'annualIncome', 'OtherRegCfInvestments'].map(field => (
                  <Grid.Column>
                    <MaskedInput
                      hoverable
                      currency
                      prefix="$ "
                      fielddata={AGREEMENT_DETAILS_FORM.fields[field]}
                      changed={values => agreementInfoChange(values, field)}
                    />
                  </Grid.Column>
                  ))
                  }
                <Grid.Column verticalAlign="middle">
                  <p className="note"><i>Why do I need to provide this information?</i>
                    <Popup
                      trigger={<Icon color="green" name="help circle" />}
                      content="If you invest more than $2,200 in a 12-month period, we are required by law to ask for your net worth and annual income."
                      position="top center"
                    />
                  </p>
                </Grid.Column>
              </Grid>
           : null
            }
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
            <Button primary onClick={this.submit}>Invest</Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}
