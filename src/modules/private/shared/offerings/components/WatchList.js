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
@inject('watchListStore', 'offeringsStore', 'nsUiStore', 'userStore')
@withRouter
@observer
export default class WatchList extends Component {
  state = {
    INVESTOR: false,
    WATCHING: false,
    DELETED: false,
  }

  componentDidMount() {
    this.props.watchListStore.offeringWatchList(this.props.offeringsStore.currentId);
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

  watchListTable = ({ WatchersList, hasUsersAccess }) => (
    <Card fluid>
        <div className="table-wrapper">
          <Table unstackable singleLine className="investment-details">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell collapsing>Investor&#39;s Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell />
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
                      {hasUsersAccess
                        ? (
                    <Link to={`/app/users/${user.userId}/profile-data`}>
                      {`${get(user, 'userInfo.info.firstName')} ${get(user, 'userInfo.info.lastName')}`}
                    </Link>
                        ) : (
                        <>{`${get(user, 'userInfo.info.firstName')} ${get(user, 'userInfo.info.lastName')}`}</>
                        )
                      }
                    </Table.Cell>
                    <Table.Cell>
                    {get(user, 'userInfo.email.address')}
                    </Table.Cell>
                    <Table.Cell>
                    {get(user, 'lastUpdated') ? DataFormatter.getDateAsPerTimeZone(get(user, 'lastUpdated'), true, false, false) : '-'}
                    </Table.Cell>
                    <Table.Cell collapsing textAlign="center">
                    {user.status !== 'DELETED'
                    && (
                    <Button onClick={() => this.handleDelete({ offeringId: user.offeringId, userId: user.userId, status: user.status })} icon className="link-button">
                                <Icon className="trash" />
                              </Button>
                    )}
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
          <>
          <Header as="h4">{`${watcherType.headerText} (${allWatchList[watcherType.status].length}) `} <Icon onClick={() => this.toggleVisibilityStatus(watcherType.status)} className={`ns-chevron-${this.state[watcherType.status] === true ? 'up' : 'down'}-compact right`} color="blue" /></Header>
          {this.state[watcherType.status] && <this.watchListTable hasUsersAccess={hasUsersAccess} WatchersList={allWatchList[watcherType.status]} />}
          <Divider section />
          </>
        ))
        }
      </div>
    );
  }
}
