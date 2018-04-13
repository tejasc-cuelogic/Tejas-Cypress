import React, { Component } from 'react';
import { Header, Table, Button, Item } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import Banklogo from '../../../../assets/images/boa-logo.jpg';
import DateTimeFormat from '../../../../components/common/DateTimeFormat';

@inject('accountStore')
@observer
export default class Summary extends Component {
  render() {
    const { entityAccount } = this.props.accountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Verify the info and create Entity account</Header>
        <Header as="h4" textAlign="center">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Header>
        <div className="field-wrap">
          <div className="table-wrapper">
            {/* Entity net assest - {entityAccount.entityNetAssets.value}
            Other CF Investments - {entityAccount.cfInvestments.value}
            Entitys name - {entityAccount.nameOfEntity.value}
            Tax ID - {entityAccount.taxId.value}
            Entity Address - {entityAccount.street.value}, {entityAccount.city.value},
            {entityAccount.state.value}, {entityAccount.zipCode.value}
            Is Entity a trust? - {entityAccount.isEntityTrust.value.type}
            Title with the entity - {entityAccount.entityTitle.value}
            Bank account - test */}
            <Table compact basic fixed>
              <Table.Body>
                <Table.Row>
                  <Table.Cell><b>Entity net assest</b></Table.Cell>
                  <Table.Cell>{entityAccount.entityNetAssets.value}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><b>Other CF Investments</b></Table.Cell>
                  <Table.Cell>{entityAccount.cfInvestments.value}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><b>Entitys name</b></Table.Cell>
                  <Table.Cell>{entityAccount.nameOfEntity.value}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><b>Tax ID</b></Table.Cell>
                  <Table.Cell>{entityAccount.taxId.value}</Table.Cell>
                </Table.Row>
                <Table.Row verticalAlign="top">
                  <Table.Cell><b>Entity Address</b></Table.Cell>
                  <Table.Cell>{this.props.accountStore.fullAddress}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><b>Is Entity a trust?</b></Table.Cell>
                  <Table.Cell>{entityAccount.isEntityTrust.value}
                    {entityAccount.isEntityTrust.value === 'yes' &&
                      ', since '
                    }
                    {entityAccount.isEntityTrust.value === 'yes' &&
                      <DateTimeFormat datetime={entityAccount.dateOfTrust.value} />
                    }
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><b>Title with the entity</b></Table.Cell>
                  <Table.Cell>{entityAccount.entityTitle.value}</Table.Cell>
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
          <Button color="green" size="large">Create the account</Button>
        </div>
      </div>
    );
  }
}
