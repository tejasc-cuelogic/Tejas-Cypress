import React, { Component } from 'react';
import { Table, Visibility, Card } from 'semantic-ui-react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import DateTimeFormat from './../../../components/common/DateTimeFormat';
import Randavatar from './../../../components/common/Randavatar';
import UserTypeIcon from './UserTypeIcon';

class UserListing extends Component {
  statusRow = (props) => {
    let message = '';
    if (props.error) {
      message = 'Something went wrong while loading data, please try again!';
    } else if (props.loading) {
      message = 'Loading...';
    } else if (props.listData && props.listData.length === 0) {
      message = 'No record found';
    }
    return (
      <Table.Row>
        <Table.Cell textAlign="center" colSpan={props.header.length}>{message}</Table.Cell>
      </Table.Row>
    );
  };
  render() {
    const { by, direction } = this.props.sortState;
    return (
      <Aux>
        <div className="content-spacer">
          <Card fluid>
            <div className="table-wrapper">
              <Table compact sortable singleLine className="user-list">
                <Table.Header>
                  <Table.Row>
                    {this.props.header.map(item => (
                      <Table.HeaderCell
                        sorted={by === item[0] ? direction : null}
                        onClick={() => this.props.sortHandler(item[0], item[2])}
                        key={item[0]}
                      >
                        {item[1]}
                      </Table.HeaderCell>
                    ))}
                  </Table.Row>
                </Table.Header>
                <Visibility
                  as="tbody"
                  continuous
                  onBottomVisible={() => console.log('This will call API')}
                >
                  {_.map(this.props.listData, user => (
                    <Table.Row className={(user.status === 'LOCKED') ? 'locked' : ''} key={user.id}>
                      <Table.Cell collapsing>
                        {!user.profilepic &&
                          <div className="user-image">
                            <Randavatar avatarKey={user.id} name={user.id} size="mini" />
                          </div>
                        }
                      </Table.Cell>
                      <Table.Cell className="user-status">
                        <span className="user-name"><Link to={`/app/users/${user.id}/profile`}>{`${user.firstName} ${user.lastName}`}</Link></span>
                        {user.email}
                      </Table.Cell>
                      <Table.Cell>{`${user.city}, MI (${user.zipCode})`}</Table.Cell>
                      <Table.Cell>{user.phoneNumber}</Table.Cell>
                      <Table.Cell>
                        <UserTypeIcon user={user} />
                      </Table.Cell>
                      <Table.Cell><DateTimeFormat fromNow datetime={user.lastLogin} /></Table.Cell>
                      <Table.Cell><DateTimeFormat fromNow datetime={user.createdAt} /></Table.Cell>
                      <Table.Cell><Link to={`/app/users/${user.id}/profile`} className="action">view profile</Link></Table.Cell>
                    </Table.Row>
                  ))}
                  {this.statusRow(this.props)}
                </Visibility>
              </Table>
            </div>
          </Card>
          <button onClick={this.props.loadMore}>loadMore {(this.props.loading) ? '- loading' : ''}</button>
        </div>
      </Aux>
    );
  }
}

export default UserListing;
