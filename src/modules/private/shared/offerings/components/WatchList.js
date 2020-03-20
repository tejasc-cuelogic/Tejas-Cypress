import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { get } from 'lodash';
import { observer, inject } from 'mobx-react';
import { Table, Card, Icon, Button, Header, Divider } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../theme/shared';
import { DataFormatter } from '../../../../../helper';

const watchListMeta = [
  { headerText: 'Investors Watchers', status: 'INVESTOR' },
  { headerText: 'Public Watchers', status: 'WATCHING' },
  { headerText: 'Deleted Watchers', status: 'DELETED' },
];
@inject('watchListStore', 'offeringCreationStore', 'nsUiStore', 'userStore')
@withRouter
@observer
export default class WatchList extends Component {
  state = {
    INVESTOR: false,
    WATCHING: true,
    DELETED: false,
  }

  componentDidMount() {
    this.props.watchListStore.offeringWatchList(this.props.offeringCreationStore.currentOfferingId);
  }

  componentWillUnmount() {
    this.props.watchListStore.resetWatchList();
  }

  handleDelete = (params) => {
    this.props.watchListStore.addRemoveWatchList(params, true);
  }

  toggleVisibilityStatus = (field) => {
    this.setState({ [field]: !this.state[field] });
  }

  exportButton = () => (
    <Button
      primary
      className="relaxed"
      content="Export"
      // onClick={this.populateCsvData}
      // // loading={inProgress}
      // disabled={!investorLists.length}
    />
  )

  watchListTable = ({ WatchersList, hasUsersAccess }) => (
    <Card fluid>
        <div className="table-wrapper">
          <Table unstackable singleline className="investment-details">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell collapsing>Date</Table.HeaderCell>
                <Table.HeaderCell>Time</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>City</Table.HeaderCell>
                <Table.HeaderCell>State</Table.HeaderCell>
                <Table.HeaderCell># of Prior Investments</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {WatchersList.length === 0 ? (
                <Table.Cell textAlign="center" colSpan={3}>
                  No Data found
              </Table.Cell>
              ) : (
                <>
                {WatchersList.map(user => (
                  <Table.Row key={user.userId} className={`${this.props.nsUiStore.loadingArray.includes(`removing-${user.userId}`) ? 'disabled' : ''}`}>
                    <Table.Cell collapsing>
                      {get(user, 'lastUpdated') ? DataFormatter.getDateAsPerTimeZone(get(user, 'lastUpdated'), true, false, false) : '-'}
                    </Table.Cell>
                    <Table.Cell>
                      {get(user, 'lastUpdated') ? DataFormatter.getDateAsPerTimeZone(get(user, 'lastUpdated'), true, false, false, false, undefined, false, false, true) : '-'}
                    </Table.Cell>
                    <Table.Cell>
                      {hasUsersAccess
                        ? (
                          <Link onClick={() => sessionStorage.setItem('userDetailsRefUrl', this.props.match.url)} to={`/dashboard/users/${user.userId}/profile-data`}>
                            {`${get(user, 'userInfo.info.firstName')} ${get(user, 'userInfo.info.lastName')}`}
                          </Link>
                        ) : (
                          <>{`${get(user, 'userInfo.info.firstName')} ${get(user, 'userInfo.info.lastName')}`}</>
                        )
                      }
                    </Table.Cell>
                    <Table.Cell>
                    {get(user, 'userInfo.info.mailingAddress.city')}
                    </Table.Cell>
                    <Table.Cell>
                    {get(user, 'userInfo.info.mailingAddress.state')}
                    </Table.Cell>
                    <Table.Cell>
                    {get(user, 'investmentCount')}
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

  render() {
    const { allWatchList } = this.props.watchListStore;
    const access = this.props.userStore.myAccessForModule('USERS');
    const hasUsersAccess = access.level !== 'SUPPORT';
    if (this.props.nsUiStore.loadingArray.includes('offeringWatchList')) {
      return <InlineLoader />;
    }
    return (
      <div className="inner-content-spacer">
        {watchListMeta.map(watcherType => (
          watcherType.status !== 'INVESTOR' && (
          <>
            <Header as="h4" floated="left">{`${watcherType.headerText} (${allWatchList[watcherType.status].length}) `} <Icon onClick={() => this.toggleVisibilityStatus(watcherType.status)} className={`ns-chevron-${this.state[watcherType.status] === true ? 'up' : 'down'}-compact right`} color="blue" /></Header>
            <Header floated="right"><this.exportButton /></Header>
            {this.state[watcherType.status] && <this.watchListTable hasUsersAccess={hasUsersAccess} WatchersList={allWatchList[watcherType.status]} />}
            <Divider section />
          </>
          )))
        }
      </div>
    );
  }
}
