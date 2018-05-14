import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Button, Message, Table } from 'semantic-ui-react';
import ListErrors from '../../../../theme/common/ListErrors';
import Helper from '../../../../helper/utility';

@inject('individualAccountStore', 'uiStore', 'userStore')
@withRouter
@observer
export default class Summary extends React.Component {
  finalizeAccount = (e) => {
    e.preventDefault();
    this.props.individualAccountStore.finalizeAccount().then(() => {
      Helper.toast('Individual account has been finalized.', 'success');
    });
  }
  render() {
    const { errors } = this.props.uiStore;
    const { currentUser } = this.props.userStore;
    const { nsAccId, formAddFunds, plaidAccDetails } = this.props.individualAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Link Bank Account</Header>
        <Header as="h4" textAlign="center">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Header>
        {errors &&
          <Message error>
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        <div className="summary-wrap">
          <div className="field-wrap">
            <div className="table-wrapper">
              <Table compact basic>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell><b>Investor Name</b></Table.Cell>
                    <Table.Cell>{currentUser.givenName}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell><b>Bank Name</b></Table.Cell>
                    <Table.Cell>{plaidAccDetails.institution.name}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell><b>Bank Account</b></Table.Cell>
                    <Table.Cell>{nsAccId}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell><b>Your initial deposit</b></Table.Cell>
                    <Table.Cell>{formAddFunds.fields.value.value !== '' ? `$${formAddFunds.fields.value.value}` : ''}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
        <div className="center-align">
          <Button primary size="large" onClick={this.finalizeAccount}>Create the account</Button>
        </div>
      </div>
    );
  }
}
