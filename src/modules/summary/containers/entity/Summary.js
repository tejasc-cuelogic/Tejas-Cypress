import React, { Component } from 'react';
import { Header, Table, Button, Item } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import Banklogo from '../../../../assets/images/boa-logo.jpg';
import DateTimeFormat from '../../../../theme/common/DateTimeFormat';
import Helper from '../../../../helper/utility';

@inject('entityAccountStore')
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
    return (
      <div>
        <Header as="h1" textAlign="center">Verify the info and create Entity account</Header>
        <Header as="h4" textAlign="center">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Header>
        <div className="field-wrap">
          <div className="table-wrapper">
            <Table compact basic fixed>
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
                  <Table.Cell>{formGeneralInfo.fields.street1.value}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><b>Is Entity a trust?</b></Table.Cell>
                  <Table.Cell>{formEntityInfo.fields.isTrust.value}
                    {formEntityInfo.fields.isTrust.value === 'yes' &&
                      ', since '
                    }
                    {formEntityInfo.fields.isTrust.value === 'yes' &&
                      <DateTimeFormat datetime={formEntityInfo.fields.trustDate.value} />
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
                        <Item.Image size="tiny" src={Banklogo} />
                        <Item.Content verticalAlign="middle" className="right-align">
                          <h5>...5648</h5>
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
          <Button primary size="large" onClick={() => this.handleCreateAccount()}>Create the account</Button>
        </div>
      </div>
    );
  }
}
