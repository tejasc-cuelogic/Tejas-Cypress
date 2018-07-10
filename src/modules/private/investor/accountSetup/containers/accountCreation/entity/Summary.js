import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Header, Table, Button, Item, Message } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import { DateTimeFormat, ListErrors } from '../../../../../../../theme/shared';
import Helper from '../../../../../../../helper/utility';

@inject('entityAccountStore', 'uiStore', 'bankAccountStore')
@withRouter
@observer
export default class Summary extends Component {
  handleCreateAccount = () => {
    this.props.entityAccountStore.createAccount('Summary', 'submit');
    this.props.history.push('/app/summary');
  }
  render() {
    const {
      FIN_INFO_FRM,
      PERSONAL_INFO_FRM,
      GEN_INFO_FRM,
      TRUST_INFO_FRM,
    }
      = this.props.entityAccountStore;
    const { errors } = this.props.uiStore;
    const { plaidBankDetails, formLinkBankManually } = this.props.bankAccountStore;
    const bankAccountNumber = !_.isEmpty(plaidBankDetails) ?
      plaidBankDetails.accountNumber : formLinkBankManually.fields.accountNumber.value;
    return (
      <div>
        <Header as="h1" textAlign="center">Verify the info and create Entity account</Header>
        <Header as="h4" textAlign="center">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Header>
        {errors &&
          <Message error>
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        <div className="field-wrap">
          <div className="table-wrapper">
            <Table unstackable compact basic fixed>
              <Table.Body>
                <Table.Row>
                  <Table.Cell><b>Entity net assest</b></Table.Cell>
                  <Table.Cell>{Helper.CurrencyFormat(FIN_INFO_FRM.fields.netAssets.value ?
                      FIN_INFO_FRM.fields.netAssets.value : 0)}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><b>Other CF Investments</b></Table.Cell>
                  <Table.Cell>{Helper.CurrencyFormat(FIN_INFO_FRM.fields.cfInvestment.value ?
                      FIN_INFO_FRM.fields.cfInvestment.value : 0)}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><b>Entitys name</b></Table.Cell>
                  <Table.Cell>{PERSONAL_INFO_FRM.fields.title.value}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><b>Tax ID</b></Table.Cell>
                  <Table.Cell>{GEN_INFO_FRM.fields.taxId.value}</Table.Cell>
                </Table.Row>
                <Table.Row verticalAlign="top">
                  <Table.Cell><b>Entity Address</b></Table.Cell>
                  <Table.Cell>{GEN_INFO_FRM.fields.street.value}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><b>Is Entity a trust?</b></Table.Cell>
                  <Table.Cell>{TRUST_INFO_FRM.fields.isTrust.value}
                    {TRUST_INFO_FRM.fields.isTrust.value &&
                      'Yes, since '
                    }
                    {TRUST_INFO_FRM.fields.isTrust.value &&
                      <DateTimeFormat datetime={TRUST_INFO_FRM.fields.trustDate.value} />
                    }
                    {!TRUST_INFO_FRM.fields.isTrust.value &&
                      'No'
                    }
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><b>Title with the entity</b></Table.Cell>
                  <Table.Cell>{PERSONAL_INFO_FRM.fields.title.value}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><b>Bank account</b></Table.Cell>
                  <Table.Cell>
                    <Item.Group>
                      <Item>
                        <Item.Content>
                          <h5>{Helper.encryptNumber(bankAccountNumber)}</h5>
                        </Item.Content>
                      </Item>
                    </Item.Group>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </div>
        <div className="center-align">
          <Button primary size="large" onClick={() => this.handleCreateAccount()} disabled={!this.props.entityAccountStore.isValidEntityForm}>Create the account</Button>
        </div>
      </div>
    );
  }
}
