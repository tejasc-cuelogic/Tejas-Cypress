import React from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Button, Table } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
// import { ListErrors } from '../../../../../theme/shared';

@inject('bankAccountStore', 'individualAccountStore', 'uiStore', 'userDetailsStore', 'agreementsStore', 'userStore', 'accountStore', 'iraAccountStore', 'entityAccountStore')
@withRouter
@observer
export default class LinkbankSummary extends React.Component {
  componentWillMount() {
    this.props.bankAccountStore.setLoaderForAccountBlank();
    this.props.bankAccountStore.fetchRoutingNumber();
  }
  componentDidUpdate() {
    const {
      setLoaderForAccountBlank,
    } = this.props.bankAccountStore;
    setLoaderForAccountBlank();
  }

  render() {
    // const { errors } = this.props.uiStore;
    const {
      plaidAccDetails,
      formLinkBankManually,
      changeLinkbank,
      routingNum,
    } = this.props.bankAccountStore;
    const bankAccountNumber = !isEmpty(plaidAccDetails) ?
      plaidAccDetails.accountNumber ? plaidAccDetails.accountNumber : '' : formLinkBankManually.fields.accountNumber.value;
    return (
      <Aux>
        <Header as="h3" textAlign="center">Linked Bank</Header>
        <p className="center-align mb-50">The bank account you have currently linked to this account is</p>
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
                { !isEmpty(routingNum) &&
                  <Table.Row>
                    <Table.Cell>Routing Number</Table.Cell>
                    <Table.Cell>
                      { routingNum || '' }
                    </Table.Cell>
                  </Table.Row>
                }
              </Table.Body>
            </Table>
          </div>
        </div>
        {/* {errors &&
          <Message error className="center-align">
            <ListErrors errors={[errors.message]} />
          </Message>
        } */}
        {/* <div className="center-align mt-30">
        <Button primary
          size="large"
          className="relaxed"
          content="Continue" onClick={() => this.handleSubmit()}
          disabled={errors || !bankAccountNumber} />
        </div> */}
        <div className="center-align mt-30">
          <Button color="green" className="link-button" content="or change linked bank" onClick={() => changeLinkbank()} />
        </div>
      </Aux>
    );
  }
}
