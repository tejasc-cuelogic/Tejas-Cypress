import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Button, Table } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
// import { ListErrors } from '../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

@inject('bankAccountStore', 'uiStore', 'accountStore')
@withRouter
@observer
export default class LinkbankSummary extends React.Component {
  constructor(props) {
    super(props);
    this.props.bankAccountStore.setLoaderForAccountBlank();
    this.props.bankAccountStore.fetchRoutingNumber();
  }

  componentDidUpdate() {
    this.props.bankAccountStore.setLoaderForAccountBlank();
    this.props.bankAccountStore.fetchRoutingNumber();
  }

  handleContinueCta = () => {
    const { ACC_TYPE_MAPPING, INVESTMENT_ACC_TYPES, investmentAccType } = this.props.accountStore;
    const { store } = ACC_TYPE_MAPPING[INVESTMENT_ACC_TYPES.fields.accType.value];
    const { stepToBeRendered, setStepToBeRendered } = store;
    if (investmentAccType === 'individual') {
      setStepToBeRendered(stepToBeRendered + 1);
    } else {
      this.props.bankAccountStore.setShowAddFunds();
    }
  }

  render() {
    // const { errors } = this.props.uiStore;
    const {
      plaidAccDetails,
      formLinkBankManually,
      changeLinkbank,
      routingNum,
    } = this.props.bankAccountStore;
    const bankAccountNumber = !isEmpty(plaidAccDetails)
      ? plaidAccDetails.accountNumber ? plaidAccDetails.accountNumber : '' : formLinkBankManually.fields.accountNumber.value;
    return (
      <>
        <Header as="h4" textAlign={isMobile ? '' : 'center'}>The bank account you have currently linked to this account is</Header>
        <div className={isMobile ? '' : 'field-wrap'}>
          <div className="table-wrapper">
            <Table unstackable basic="very" fixed>
              <Table.Body>
                {(!isEmpty(plaidAccDetails) && plaidAccDetails.bankName)
                  && (
<Table.Row>
                    <Table.Cell>Bank: </Table.Cell>
                    <Table.Cell>{isEmpty(plaidAccDetails) || !plaidAccDetails.institution ? plaidAccDetails.bankName ? plaidAccDetails.bankName : '' : plaidAccDetails.institution.name}</Table.Cell>
                  </Table.Row>
                  )
                }
                <Table.Row>
                  <Table.Cell>Bank Account Number: </Table.Cell>
                  <Table.Cell>{bankAccountNumber || ''}</Table.Cell>
                </Table.Row>
                { !isEmpty(routingNum)
                  && (
<Table.Row>
                    <Table.Cell>Routing Number</Table.Cell>
                    <Table.Cell>
                      { routingNum || '' }
                    </Table.Cell>
                  </Table.Row>
                  )
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
         {isMobile
            && (
              <Button onClick={this.handleContinueCta} primary size="large" fluid className="mt-40 relaxed" content="Continue" />
            )
          }
        <div className={`${isMobile ? 'mb-30' : ''} center-align mt-30`}>
          <Button color="green" className="link-button" content="Change link bank account" onClick={() => changeLinkbank()} />
        </div>
      </>
    );
  }
}
