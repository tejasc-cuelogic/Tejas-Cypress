import React, { Component } from 'react';
import { Table, Visibility, Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { DateTimeFormat } from './../../../../../../theme/shared';
import Randavatar from './../../../../../../theme/shared/Randavatar';
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
                        <Randavatar
                          UserInfo={{
                            firstName: user.firstName,
                            lastName: user.lastName,
                            avatarUrl: user.avatar ? user.avatar.url : '',
                            roles: ['admin'],
                          }}
                          size="mini"
                        />
                      </div>
                    }
                  </Table.Cell>
                  <Table.Cell className="user-status">
                    <span className="user-name"><Link to={`/app/users/${user.id}/profile`}>{`${user.firstName} ${user.lastName}`}</Link></span>
                    {user.email}
                  </Table.Cell>
                  <Table.Cell>
                    {user.legalDetails && user.legalDetails.legalAddress &&
                      `${user.legalDetails.legalAddress.city}, ${user.legalDetails.legalAddress.state} (${user.legalDetails.legalAddress.zipCode})`
                    }
                  </Table.Cell>
                  <Table.Cell>
                    {user.contactDetails && user.contactDetails.phone &&
                      user.contactDetails.phone.number &&
                      `${user.contactDetails.phone.number}`
                    }
                  </Table.Cell>
                  <Table.Cell>
                    <UserTypeIcon user={user} />
                  </Table.Cell>
                  <Table.Cell>
                    <DateTimeFormat fromNow datetime={user.createdDate} />
                  </Table.Cell>
                  <Table.Cell>
                    <DateTimeFormat fromNow datetime={user.lastLoginDate} />
                  </Table.Cell>
                  <Table.Cell><Link to={`/app/users/${user.id}/profile`} className="action">view profile</Link></Table.Cell>
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
