import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { observer, inject } from 'mobx-react';
import { Table, Card, Icon, Button } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../theme/shared';

@inject('watchListStore', 'offeringsStore', 'nsUiStore')
@withRouter
@observer
export default class WatchList extends Component {
  componentDidMount() {
    this.props.watchListStore.offeringWatchList(this.props.offeringsStore.currentId);
  }

  render() {
    const { allWatchList } = this.props.watchListStore;
    if (this.props.nsUiStore.loadingArray.includes('offeringWatchList')) {
      return <InlineLoader />;
    }
    return (
      <Card fluid>
        <div className="table-wrapper">
        <Table unstackable singleLine className="investment-details">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Investor Name</Table.HeaderCell>
                <Table.HeaderCell />
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
                   <Table.Row key={user.userId}>
                    <Table.Cell>
                      {`${get(user, 'userInfo.info.firstName')} ${get(user, 'userInfo.info.lastName')}`}
                    </Table.Cell>
                    <Table.Cell collapsing textAlign="center">
                    <Button icon className="link-button">
                      <Icon className="trash" />
                    </Button>
                    </Table.Cell>
                   </Table.Row>
                 ))
                 }
                 </>
              )
              }
            </Table.Body>
          </Table>
        </div>
        </Card>
    );
  }
}
