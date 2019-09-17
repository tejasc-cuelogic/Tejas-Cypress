import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { observer, inject } from 'mobx-react';
import { Table, Card } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../theme/shared';

@inject('watchListStore', 'offeringsStore')
@withRouter
@observer
export default class WatchList extends Component {
  componentDidMount() {
    this.props.watchListStore.offeringWatchList(this.props.offeringsStore.currentId);
  }

  render() {
    const { allWatchList, watchListLoading } = this.props.watchListStore;
    if (watchListLoading) {
      return <InlineLoader />;
    }
    return (
      <Card fluid>
        <Table unstackable singleLine className="investment-details">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Investor Name</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {allWatchList.length === 0 ? (
                 <Table.Cell>
                   No Data found
              </Table.Cell>
              ) : (
                 <>
                 {allWatchList.map(user => (
              <Table.Cell>
                {`${get(user, 'userInfo.info.firstName')} ${get(user, 'userInfo.info.lastName')}`}
              </Table.Cell>
                 ))
                 }
                 </>
              )
              }
            </Table.Body>
          </Table>
      </Card>
    );
  }
}
