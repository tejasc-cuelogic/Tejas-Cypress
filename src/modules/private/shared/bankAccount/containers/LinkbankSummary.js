import React from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Button, Message, Table } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import { ListErrors } from '../../../../../theme/shared';

@inject('bankAccountStore', 'individualAccountStore', 'uiStore', 'userDetailsStore', 'agreementsStore', 'userStore')
@withRouter
@observer

export default class LinkbankSummary extends React.Component {
  componentDidMount() {
    const { plaidAccDetails } = this.props.bankAccountStore;
    this.props.uiStore.setProgress(isEmpty(plaidAccDetails));
  }

  handleSubmit = () => {
    this.props.bankAccountStore.setShowAddFunds();
  }

  changeLinkbank = () => {
    this.props.bankAccountStore.setBankLinkInterface('list');
    this.props.uiStore.clearErrors();
  }

  render() {
    const { errors } = this.props.uiStore;
    const {
      plaidAccDetails,
      formLinkBankManually,
      isEncrypted,
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
        <Button color="green" className="link-button mt-30" content="or change linked bank" onClick={() => this.changeLinkbank()} />
      </Aux>
    );
  }
}