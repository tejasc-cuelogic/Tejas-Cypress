import React from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Button, Message, Table } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import { ListErrors } from '../../../../../theme/shared';
import { validationActions } from '../../../../../services/actions';

@inject('bankAccountStore', 'individualAccountStore', 'uiStore', 'userDetailsStore', 'agreementsStore', 'userStore', 'accountStore', 'iraAccountStore', 'entityAccountStore')
@withRouter
@observer
export default class LinkbankSummary extends React.Component {
  componentDidUpdate() {
    const { isAccountPresent } = this.props.bankAccountStore;
    this.props.uiStore.setProgress(!isAccountPresent);
  }

  handleSubmit = () => {
    const { investmentAccType } = this.props.accountStore;
    const accTypeStore = investmentAccType === 'individual' ? 'individualAccountStore' : investmentAccType === 'entity' ? 'entityAccountStore' : investmentAccType === 'ira' ? 'iraAccountStore' : 'individualAccountStore';
    const currentStep = investmentAccType === 'entity' ? { name: 'Link bank', validate: validationActions.validateLinkBankForm, stepToBeRendered: 5 } : investmentAccType === 'ira' ? { name: 'Link bank', validate: validationActions.validateLinkBankForm, stepToBeRendered: 3 } : { name: 'Link bank', validate: validationActions.validateLinkBankForm, stepToBeRendered: 1 };
    // this.props.bankAccountStore.resetAddFundsForm();
    this.props[accTypeStore].createAccount(currentStep).then(() => {
      if (investmentAccType === 'individual') {
        this.props[accTypeStore].setStepToBeRendered(1);
        // this.props[accTypeStore].setIsManualLinkBankSubmitted(true);
      } else {
        this.props[accTypeStore].setStepToBeRendered(currentStep.stepToBeRendered);
        this.props.bankAccountStore.setLinkBankSummary(false);
        this.props.bankAccountStore.setIsManualLinkBankSubmitted(false);
        this.props.bankAccountStore.setShowAddFunds();
      }
    });
  }

  render() {
    const { errors } = this.props.uiStore;
    const {
      plaidAccDetails,
      formLinkBankManually,
      isEncrypted,
      changeLinkbank,
    } = this.props.bankAccountStore;
    const bankAccountNumber = !isEmpty(plaidAccDetails) ?
      plaidAccDetails.accountNumber ? plaidAccDetails.accountNumber : '' : formLinkBankManually.fields.accountNumber.value;
    return (
      <Aux>
        <Header as="h3" textAlign="center">Linked  Bank</Header>
        <div className="field-wrap">
          <div className="table-wrapper">
            <Table unstackable basic="very" fixed>
              <Table.Body>
                {(!isEmpty(plaidAccDetails) && plaidAccDetails.bankName) &&
                  <Table.Row>
                    <Table.Cell>Bank: </Table.Cell>
                    <Table.Cell>{isEmpty(plaidAccDetails) || !plaidAccDetails.institution ? plaidAccDetails.bankName ? plaidAccDetails.bankName : '' : plaidAccDetails.institution.name}</Table.Cell>
                  </Table.Row>
                }
                <Table.Row>
                  <Table.Cell>Bank Account Number: </Table.Cell>
                  <Table.Cell>{bankAccountNumber || ''}</Table.Cell>
                </Table.Row>
                {(formLinkBankManually.fields.routingNumber.value &&
                  !isEncrypted(formLinkBankManually.fields.routingNumber.value, 'routingNo')) &&
                  <Table.Row>
                    <Table.Cell>Routing Number</Table.Cell>
                    <Table.Cell>
                      {formLinkBankManually.fields.routingNumber.value}
                    </Table.Cell>
                  </Table.Row>
                }
              </Table.Body>
            </Table>
          </div>
        </div>
        {errors &&
          <Message error className="center-align">
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        <div className="center-align mt-30">
          <Button primary size="large" className="relaxed" content="Continue" onClick={() => this.handleSubmit()} disabled={errors || !bankAccountNumber} />
        </div>
        <div className="center-align mt-30">
          <Button color="green" className="link-button" content="or change linked bank" onClick={() => changeLinkbank()} />
        </div>
      </Aux>
    );
  }
}
