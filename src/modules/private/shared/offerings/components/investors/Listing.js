import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { reject, get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { DateTimeFormat, InlineLoader, UserAvatar } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';

// const meta = ['Investor\'s Name', 'Residence City',
// 'Investment Amount', 'Investment Time', 'Referral Code'];
const meta = [
  { label: 'Investor\'s Name', value: 'firstName' },
  { label: 'Residence City', value: 'city' },
  { label: 'Investment Amount', value: 'amount' },
  { label: 'Investment Time', value: 'investmentDate' },
  { label: 'Referral Code', value: 'referralCode' },
];

@inject('offeringInvestorStore', 'userStore', 'offeringsStore')
@withRouter
@observer
export default class Listing extends Component {
  handleSort = clickedColumn => () => {
    const { setSortingOrder, sortOrder } = this.props.offeringInvestorStore;
    setSortingOrder(clickedColumn, sortOrder.direction === 'asc' ? 'desc' : 'asc');
  }

  // paginate = params => this.props.offeringInvestorStore.pageRequest(params);
  render() {
    const { offer } = this.props.offeringsStore;
    const { isIssuer, isAdmin } = this.props.userStore;
    const headerList = [...meta];
    const hardClosedDate = get(offer, 'closureSummary.hardCloseDate');
    const computedList = (isIssuer && hardClosedDate) || (isAdmin) ? [...meta] : reject(headerList, { label: 'Investment Amount', value: 'amount' });
    const listHeader = computedList;
    const { investorLists, loading } = this.props.offeringInvestorStore;
    // const totalRecords = count || 0;
    if (loading) {
      return <InlineLoader />;
    }
    if (investorLists.length === 0) {
      return <InlineLoader text="No record to display." />;
    }
    const { sortOrder } = this.props.offeringInvestorStore;
    return (
      <Aux>
        <div className="table-wrapper">
          <Table sortable unstackable singleLine className="investment-details">
            <Table.Header>
              <Table.Row>
                {
                  listHeader.map(cell => (
                    <Table.HeaderCell
                      key={cell.label.split(' ')[0]}
                      textAlign={cell.label === 'Referral Code' ? 'right' : ''}
                      sorted={sortOrder.column === cell.value ? sortOrder.direction === 'asc' ? 'ascending' : 'descending' : null}
                      onClick={this.handleSort(cell.value)}
                    >
                      {cell.label}
                    </Table.HeaderCell>
                  ))
                }
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {investorLists.map(data => (
                <Table.Row key={data.userId}>
                  <Table.Cell>
                    <UserAvatar
                      size="mini"
                      UserInfo={{
                        firstName: data.firstName,
                        lastName: data.lastName,
                        avatarUrl: data.avatar,
                        roles: [],
                      }}
                    />
                    <span className="ml-10">{`${data.firstName} ${data.lastName}`}</span>
                  </Table.Cell>
                  <Table.Cell>{`${data.city}, ${data.state}`}</Table.Cell>
                  {(isIssuer && hardClosedDate) || (isAdmin) ?
                    <Table.Cell>
                      {Helper.CurrencyFormat(data.amount)}
                      {parseInt(data.investmentsCount, 10) > 1 ?
                        <span> ({`${data.investmentsCount} Investments`})</span>
                      :
                      null}
                    </Table.Cell>
                  :
                  null
                  }
                  <Table.Cell>{data.investmentDate ? <DateTimeFormat format="MM-DD-YYYY  h:mmA" datetime={data.investmentDate} /> : 'N/A'}</Table.Cell>
                  <Table.Cell textAlign="right">{data.referralCode || null}</Table.Cell>
                </Table.Row>
              ))
              }
            </Table.Body>
          </Table>
        </div>
        {/* {totalRecords > 0 &&
          <NsPagination
           floated="right"
            initRequest={this.paginate}
             meta={{ totalRecords, requestState }}
              />
        } */}
      </Aux>
    );
  }
}
