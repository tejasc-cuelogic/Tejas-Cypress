/* eslint-disable react/no-array-index-key */
/* eslint-disable no-constant-condition */
import React, { Component } from 'react';
import { Table, Popup, Icon, Label } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';
import { reject, get, find } from 'lodash';
import { inject, observer } from 'mobx-react';
import { DateTimeFormat, InlineLoader } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';
import { DataFormatter } from '../../../../../../helper';
import { OFFERING_AGREEMENT_REGULATIONS } from '../../../../../../constants/offering';

const meta = [
  { label: 'Date', value: 'investmentDate' },
  { label: 'Investor\'s Name', value: 'firstName' },
  { label: 'Amount', value: 'amount' },
  { label: 'Residence City', value: 'city' },
  { label: 'State', value: 'state' },
  { label: 'Account Type', value: 'accountType' },
  { label: 'Regulation', value: 'regulation' },
  { label: 'EB', value: 'earlyBirdEligibility' },
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

  showReferralCode = (referralCode, investorReferralCodes) => {
    const matchReferral = find(investorReferralCodes, r => r.code === referralCode);
    return (matchReferral && get(matchReferral, 'isValid')) ? ('Yes') : '';
  }

  render() {
    const { offer } = this.props.offeringsStore;
    const { isIssuer, isAdmin } = this.props.userStore;
    const headerList = [...meta];
    const referralCode = get(offer, 'referralCode');
    const isParallel = ['BD_CF_506C'].includes(get(offer, 'regulation'));
    const isOfferingClose = ['STARTUP_PERIOD', 'IN_REPAYMENT', 'COMPLETE', 'DEFAULTED'].includes(get(offer, 'stage'));
    let computedList = (isIssuer && isOfferingClose) || (isAdmin) ? [...meta] : reject(headerList, { label: 'Amount', value: 'amount' });
    computedList = (isAdmin && isParallel) ? [...meta] : reject(computedList, { label: 'Regulation', value: 'regulation' });
    computedList = (isIssuer && isOfferingClose) || (isAdmin) ? [...computedList] : reject(computedList, { label: 'EB', value: 'earlyBirdEligibility' });
    computedList = isAdmin ? [...computedList] : [...computedList].filter(o => !['Account Type', 'Regulation'].includes(o.label));
    const listHeader = computedList;
    const { investorLists, loading } = this.props.offeringInvestorStore;
    const isUsersCapablities = this.props.userStore.myAccessForModule('USERS');
    if (loading) {
      return <InlineLoader />;
    }
    if (investorLists.length === 0) {
      return <InlineLoader text="No record to display." />;
    }
    const { sortOrder } = this.props.offeringInvestorStore;
    return (
      <>
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
              {investorLists.map((data, index) => (
                <Table.Row key={`${index}${data.userId}${Math.random()}`}>
                  <Table.Cell>{data.investmentDate ? <DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone(data.investmentDate, true, false, false)} /> : 'N/A'}</Table.Cell>
                  <Table.Cell>
                    <div>
                      {get(isUsersCapablities, 'level') && get(isUsersCapablities, 'level') !== 'SUPPORT'
                        ? <Link to={`/dashboard/users/${data.userId}/profile-data`}><p><b>{`${data.firstName} ${data.lastName}`}</b></p></Link>
                        : `${data.firstName} ${data.lastName}`
                      }
                    </div>
                  </Table.Cell>
                  {((isIssuer && isOfferingClose) || (isAdmin))
                    && (
                      <>
                      <Table.Cell>
                        {Helper.CurrencyFormat(data.amount, 0)}
                        {parseInt(data.investmentsCount, 10) > 1
                          ? (
                            <span>
                              {` (${data.investmentsCount} Investments)`}
                            </span>
                          )
                          : null}
                        {(data.credit || data.autoDraftAmount) && isAdmin
                          ? (
                            <Popup
                              trigger={<Icon name="help circle" color="green" />}
                              content={(
                                <span>
                                  {data.credit ? `Credit: ${data.credit}` : ''}
                                  {data.autoDraftAmount && data.credit ? <br /> : ''}
                                  {data.autoDraftAmount ? `Auto Draft: ${data.autoDraftAmount}` : ''}
                                </span>
                              )}
                              hoverable
                              position="top center"
                            />
                          ) : null
                        }
                      </Table.Cell>
                      </>
                    )
                  }
                  <Table.Cell>
                    <div className="table-info-wrap">
                      <p>
                        {<span>{data.city || 'N/A'}</span>}
                      </p>
                    </div>
                  </Table.Cell>
                  <Table.Cell>{data.state || 'N/A'}</Table.Cell>
                  {isAdmin
                    && (
                      <Table.Cell>
                        {data.accountType && <Icon size="large" className={`${data.accountType.includes('entity') ? 'ns-entity-line' : data.accountType.includes('ira') ? 'ns-ira-line' : 'ns-individual-line'} `} color="green" />}
                      </Table.Cell>
                    )
                  }
                  {isAdmin && isParallel
                  && (
                      <Table.Cell>
                        {data.regulation ? OFFERING_AGREEMENT_REGULATIONS[data.regulation] : ''}
                      </Table.Cell>
                  )
                  }
                  {((isIssuer && isOfferingClose) || (isAdmin))
                    && (
                    <Table.Cell>
                      {data.earlyBirdEligibility
                        ? (
                          <Popup
                            trigger={<Label color="green" circular empty className="mr-10" />}
                            content="Eligible for Early Bird Reward"
                            hoverable
                            position="top center"
                          />
                        )
                        : ''}
                      </Table.Cell>
                    )
                  }
                  <Table.Cell textAlign="right">{data.referralCode ? this.showReferralCode(referralCode, data.referralCode, isIssuer) : ''}</Table.Cell>
                </Table.Row>
              ))
              }
            </Table.Body>
          </Table>
        </div>
      </>
    );
  }
}
