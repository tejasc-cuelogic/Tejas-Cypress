import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Table } from 'semantic-ui-react';

@inject('campaignStore')
@observer
export default class BonusRewards extends Component {
  componentDidMount() {
    this.props.campaignStore.offeringWatchlist(this.props.offeringId);
  }

  render() {
    return (
      <>
        <Table unstackable singleLine className="investment-details">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Investor Name</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
          </Table>
      </>
    );
  }
}
