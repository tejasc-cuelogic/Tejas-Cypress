import React, { Component } from 'react';
import { Table, Visibility, Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { DateTimeFormat, UserAvatar } from './../../../../../../theme/shared';
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
      <Card fluid>
        <div className="table-wrapper">
          <Table unstackable striped sortable singleLine className="user-list">
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
            >
              {this.props.listData.map(user => (
                <Table.Row className={(user.accountStatus === 'locked') ? 'locked' : ''} key={user.id}>
                  <Table.Cell collapsing>
                    {!user.profilepic &&
                      <div className="user-image">
                        <UserAvatar
                          UserInfo={{
                            firstName: user.info ? user.info.firstName : '',
                            lastName: user.info ? user.info.lastName : '',
                            avatarUrl: user.info && user.info.avatar ? user.info.avatar.url : '',
                            roles: user.roles.map(r => r.scope),
                          }}
                          size="mini"
                        />
                      </div>
                    }
                  </Table.Cell>
                  <Table.Cell className="user-status">
                    <span className="user-name"><Link to={`/app/users/${user.id}/profile-data`}>{`${user.info ? user.info.firstName : ''} ${user.info ? user.info.lastName : ''}`}</Link></span>
                    {user.email ? user.email.address : ''}
                  </Table.Cell>
                  <Table.Cell>
                    {user.mailingAddress && user.mailingAddress.city ?
                      user.mailingAddress.city : ''
                    }
                  </Table.Cell>
                  <Table.Cell>
                    {user.phone ? user.phone.number : ''}
                  </Table.Cell>
                  <Table.Cell>
                    <UserTypeIcon
                      role={user.roles.map(r => r.scope)[0]}
                      items={user.roles.map(r => r.scope).filter(r => r !== 'investor')}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {user.created && <DateTimeFormat fromNow datetime={user.created.date} />}
                  </Table.Cell>
                  <Table.Cell>
                    {user.lastLoginDate && <DateTimeFormat fromNow datetime={user.lastLoginDate} />}
                  </Table.Cell>
                  <Table.Cell><Link to={`/app/users/${user.id}/profile-data`} className="action">view profile</Link></Table.Cell>
                </Table.Row>
              ))}
              {this.statusRow(this.props)}
            </Visibility>
          </Table>
        </div>
      </Card>
    );
  }
}

export default UserListing;
