import React, { Component } from 'react';
import { get } from 'lodash';
import { Table, Visibility, Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { UserAvatar, NsPagination } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';
import UserTypeIcon from './UserTypeIcon';
import { DataFormatter } from '../../../../../../helper';

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
    const {
      paginate, sortState, listData, requestState, count, isManager,
    } = this.props;
    const { by, direction } = sortState;
    const totalRecords = count || 0;
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
              {listData.map(user => (
                <Table.Row className={(user.locked && user.locked.lock === 'LOCKED') ? 'locked' : ''} key={user.id}>
                  <Table.Cell>
                    {!user.profilepic
                      && (
<div className="user-image">
                        <UserAvatar
                          UserInfo={{
                            firstName: user.info ? user.info.firstName : '',
                            lastName: user.info ? user.info.lastName : '',
                            avatarUrl: user.info && user.info.avatar ? user.info.avatar.url : '',
                            roles: user.roles.map(r => r.scope),
                          }}
                          base64url
                          size="mini"
                        />
                      </div>
                      )
                    }
                  </Table.Cell>
                  <Table.Cell className="user-status">
                    <span className="user-name">{isManager ? <Link to={`/app/users/${user.id}/profile-data`}><b>{`${user.info ? user.info.firstName : ''} ${user.info ? user.info.lastName : ''}`}</b></Link> : <b>{`${user.info ? user.info.firstName : ''} ${user.info ? user.info.lastName : ''}`}</b>}</span>
                    {user.email ? user.email.address : ''}
                  </Table.Cell>
                  <Table.Cell>
                    {get(user, 'info.mailingAddress.zipCode')
                    }
                  </Table.Cell>
                  <Table.Cell>{Helper.phoneNumberFormatter(get(user, 'phone.number') ? get(user, 'phone.number') : '')}</Table.Cell>
                  <Table.Cell><UserTypeIcon role={user.roles} /></Table.Cell>
                  <Table.Cell>
                    {user.created
                      ? DataFormatter.getDateInCST(moment.unix(user.created.date), false, false, false)
                      : 'N/A'
                    }
                  </Table.Cell>
                  <Table.Cell>
                    {user.lastLoginDate
                      ? DataFormatter.getDateInCST(moment.unix(user.lastLoginDate), false, false, false)
                      : 'N/A'
                    }
                  </Table.Cell>
                  {isManager
                  && <Table.Cell><Link to={`/app/users/${user.id}/profile-data`} className="action">view profile</Link></Table.Cell>
                  }
                </Table.Row>
              ))}
              {this.statusRow(this.props)}
            </Visibility>
          </Table>
        </div>
        {totalRecords > 0
          && <NsPagination initRequest={paginate} meta={{ totalRecords, requestState }} />
        }
      </Card>
    );
  }
}

export default UserListing;
