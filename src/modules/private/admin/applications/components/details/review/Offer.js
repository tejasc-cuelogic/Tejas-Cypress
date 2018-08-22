import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Table } from 'semantic-ui-react';

@inject('businessAppReviewStore')
@observer
export default class Offer extends Component {
  render() {
    const { OFFERS_FRM } = this.props.businessAppReviewStore;
    return (
      <div className="inner-content-spacer">
        <Header as="h4">
          Offers
        </Header>
        <Form>
          <Table basic compact className="grey-table">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>&nbsp;</Table.HeaderCell>
                <Table.HeaderCell>Offer A</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
              OFFERS_FRM.fields.data.map(offer => (
                Object.keys(offer).forEach(key => (
                  <Table.Row>
                    <Table.Cell>
                      {offer[key].label}
                      jghjgjhghj
                    </Table.Cell>
                  </Table.Row>
                ))
              ))
              }
            </Table.Body>
          </Table>
        </Form>
      </div>
    );
  }
}
