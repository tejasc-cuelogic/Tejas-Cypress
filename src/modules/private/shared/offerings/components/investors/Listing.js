/* eslint-disable no-constant-condition */
import React, { Component } from 'react';
import { Table, Popup, Icon } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';
import Aux from 'react-aux';
import { reject, get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { DateTimeFormat, InlineLoader, UserAvatar } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';

// const meta = ['Investor\'s Name', 'Residence City',
// 'Investment Amount', 'Investment Time', 'Referral Code'];
const meta = [
  { label: '', value: 'avatar' },
  { label: 'Investor\'s Name', value: 'firstName' },
  { label: 'Residence City', value: 'city' },
  { label: 'State', value: 'state' },
  { label: 'Account Type', value: 'state' },
  { label: 'Investment Amount', value: 'amount' },
  { label: 'Date', value: 'investmentDate' },
  { label: 'Referral Code', value: 'referralCode' },
];

@inject('offeringInvestorStore', 'userStore', 'offeringsStore')
@withRouter
@observer
export default class Listing extends Component {
  handleSort = clickedColumn => () => {
    if (clickedColumn === 'avatar') {
      return;
    }
    const { setSortingOrder, sortOrder } = this.props.offeringInvestorStore;
    setSortingOrder(clickedColumn, sortOrder.direction === 'asc' ? 'desc' : 'asc');
  }

  // paginate = params => this.props.offeringInvestorStore.pageRequest(params);
  render() {
    const { offer } = this.props.offeringsStore;
    const { isIssuer, isAdmin } = this.props.userStore;
    const headerList = [...meta];
    const hardClosedDate = get(offer, 'closureSummary.hardCloseDate');
    const computedList = (isIssuer && hardClosedDate) || (isAdmin) ? [...meta] : reject(headerList, [{ label: 'Investment Amount', value: 'amount' }, { label: 'Account Type', value: 'state' }]);
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
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/app/users/${data.userId}/profile-data`}><p><b>{`${data.firstName} ${data.lastName}`}</b></p></Link>
                  </Table.Cell>
                  <Table.Cell>{data.city}</Table.Cell>
                  <Table.Cell>{data.state}</Table.Cell>
                  <Table.Cell>
                    {data.accountType && <Icon size="large" className={`${data.accountType.includes('entity') ? 'ns-entity-line' : data.accountType.includes('ira') ? 'ns-ira-line' : 'ns-individual-line'} `} color="green" />}
                  </Table.Cell>
                  {(isIssuer && hardClosedDate) || (isAdmin) ?
                    <Table.Cell>
                      {Helper.CurrencyFormat(data.amount, 0)}
                      {parseInt(data.investmentsCount, 10) > 1 ?
                        <span> ({`${data.investmentsCount} Investments`})</span>
                      :
                      null}
                      {(data.credit || data.autoDraftAmount) &&
                      <Popup
                        trigger={<Icon name="help circle" color="green" />}
                        content={
                          <span>
                            {data.credit ? `Credit: ${data.credit}` : ''} <br />
                            {data.autoDraftAmount ? `Auto Draft: ${data.autoDraftAmount}` : ''} <br />
                          </span>}
                        hoverable
                        position="top center"
                      />
                      }
                    </Table.Cell>
                  :
                  null
                  }
                  <Table.Cell>{data.investmentDate ? <DateTimeFormat format="MM/DD/YYYY  h:mma" datetime={data.investmentDate} /> : 'N/A'}</Table.Cell>
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
