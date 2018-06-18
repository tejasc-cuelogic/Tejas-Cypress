import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Header, Table, Button, Item, Message } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import DateTimeFormat from '../../../../theme/common/DateTimeFormat';
import Helper from '../../../../helper/utility';
import ListErrors from '../../../../theme/common/ListErrors';

@inject('entityAccountStore', 'accountStore', 'uiStore')
@withRouter
@observer
export default class Summary extends Component {
  handleCreateAccount = () => {
    this.props.entityAccountStore.createAccount('Summary', 'submit');
  }
  render() {
    const {
      formFinInfo,
      formPersonalInfo,
      formGeneralInfo,
      formEntityInfo,
    }
      = this.props.entityAccountStore;
    const { errors } = this.props.uiStore;
    const { plaidBankDetails, formLinkBankManually } = this.props.accountStore;
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
                  <Table.Cell>{Helper.CurrencyFormat(formFinInfo.fields.netAssets.value ?
                      formFinInfo.fields.netAssets.value : 0)}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><b>Other CF Investments</b></Table.Cell>
                  <Table.Cell>{Helper.CurrencyFormat(formFinInfo.fields.cfInvestment.value ?
                      formFinInfo.fields.cfInvestment.value : 0)}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><b>Entitys name</b></Table.Cell>
                  <Table.Cell>{formPersonalInfo.fields.title.value}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><b>Tax ID</b></Table.Cell>
                  <Table.Cell>{formGeneralInfo.fields.taxId.value}</Table.Cell>
                </Table.Row>
                <Table.Row verticalAlign="top">
                  <Table.Cell><b>Entity Address</b></Table.Cell>
                  <Table.Cell>{formGeneralInfo.fields.street.value}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><b>Is Entity a trust?</b></Table.Cell>
                  <Table.Cell>{formEntityInfo.fields.isTrust.value}
                    {formEntityInfo.fields.isTrust.value &&
                      'Yes, since '
                    }
                    {formEntityInfo.fields.isTrust.value &&
                      <DateTimeFormat datetime={formEntityInfo.fields.trustDate.value} />
                    }
                    {!formEntityInfo.fields.isTrust.value &&
                      'No'
                    }
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><b>Title with the entity</b></Table.Cell>
                  <Table.Cell>{formPersonalInfo.fields.title.value}</Table.Cell>
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
