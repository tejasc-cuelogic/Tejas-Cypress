import React from 'react';
import { Table } from 'semantic-ui-react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
// import DateTimeFormat from './../../../components/common/DateTimeFormat';
import Pagination from './../../../theme/table/Pagination';
import Randavatar from './../../../components/common/Randavatar';

const paginateOptions = {
  activePage: 5,
  boundaryRange: 1,
  siblingRange: 1,
  showEllipsis: true,
  showFirstAndLastNav: true,
  showPreviousAndNextNav: true,
  totalPages: 50,
};

const userListing = props => (
  <Aux>
    <div className="table-wrapper">
      <Table striped sortable singleLine className="user-list">
        <Table.Header>
          <Table.Row>
            {props.header.map(item => <Table.HeaderCell key={item[0]}>{item[1]}</Table.HeaderCell>)}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.map(props.listData, user => (
            <Table.Row key={user.username}>
              <Table.Cell collapsing>
                {!user.profilepic &&
                  <div className="user-image">
                    <Randavatar avatarKey={user.username} name={user.given_name} size="mini" />
                  </div>
                }
              </Table.Cell>
              <Table.Cell className="user-status">
                <span className="user-name"><Link to="/app/users/1/UserDetails">{`${user.given_name} ${user.family_name}`}</Link></span>
                {user.email}
              </Table.Cell>
              <Table.Cell>Detroit, MI (80331)</Table.Cell>
              <Table.Cell>617 434-1551</Table.Cell>
              <Table.Cell>
                <div className="account-type small full accredited">R</div>
              </Table.Cell>
              <Table.Cell>2 days ago</Table.Cell>
              <Table.Cell>13 months ago</Table.Cell>
              {/* <Table.Cell><DateTimeFormat datetime={user.UserCreateDate} /></Table.Cell> */}
              <Table.Cell><Link to="/app/users/1/UserDetails" className="action">view profile</Link></Table.Cell>
            </Table.Row>
          ))}
          {!props.listData &&
            <Table.Row>
              <Table.Cell colSpan={props.header.length}>No record found</Table.Cell>
            </Table.Row>
          }
        </Table.Body>
      </Table>
    </div>
    {props.hasPagination &&
      <Pagination paginateOptions={paginateOptions} colspan={props.header.length} />
    }
  </Aux>
);

export default userListing;
