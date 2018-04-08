import React from 'react';
import { Table } from 'semantic-ui-react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import DateTimeFormat from './../../../components/common/DateTimeFormat';
import Pagination from './../../../theme/table/Pagination';
import Randavatar from './../../../components/common/Randavatar';
import UserTypeIcon from './UserTypeIcon';

const paginateOptions = {
  activePage: 5,
  boundaryRange: 1,
  siblingRange: 1,
  showEllipsis: true,
  showFirstAndLastNav: true,
  showPreviousAndNextNav: true,
  totalPages: 50,
};

const statusRow = (props) => {
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

const userListing = props => (
  <Aux>
    <div className="table-wrapper">
      <Table striped sortable singleLine className="user-list">
        <Table.Header>
          <Table.Row>
            {props.header.map(item => (
              <Table.HeaderCell
                sorted={props.sortState.by === item[0] ? props.sortState.direction : null}
                onClick={() => props.sortHandler(item[0], item[2])}
                key={item[0]}
              >
                {item[1]}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.map(props.listData, user => (
            <Table.Row className={(user.locked) ? 'locked' : ''} key={user.id}>
              <Table.Cell collapsing>
                {!user.profilepic &&
                  <div className="user-image">
                    <Randavatar avatarKey={user.id} name={user.id} size="mini" />
                  </div>
                }
              </Table.Cell>
              <Table.Cell className="user-status">
                <span className="user-name"><Link to={`/app/users/${user.id}/UserDetails`}>{`${user.firstName} ${user.lastName}`}</Link></span>
                {user.email}
              </Table.Cell>
              <Table.Cell>Detroit, MI (80331)</Table.Cell>
              <Table.Cell>617 434-1551</Table.Cell>
              <Table.Cell>
                <UserTypeIcon user={user} />
              </Table.Cell>
              <Table.Cell><DateTimeFormat fromNow datetime={user.lastLogin} /></Table.Cell>
              <Table.Cell><DateTimeFormat fromNow datetime={user.createdAt} /></Table.Cell>
              {/* <Table.Cell><DateTimeFormat datetime={user.createdAt} /></Table.Cell> */}
              <Table.Cell><Link to={`/app/users/${user.id}/UserDetails`} className="action">view profile</Link></Table.Cell>
            </Table.Row>
          ))}
          {statusRow(props)}
        </Table.Body>
      </Table>
      <button onClick={props.loadMore}>loadMore {(props.loading) ? 'loading' : 'not'}</button>
    </div>
    {props.hasPagination &&
      <Pagination paginateOptions={paginateOptions} colspan={props.header.length} />
    }
  </Aux>
);

export default userListing;
