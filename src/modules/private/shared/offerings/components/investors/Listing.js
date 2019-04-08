import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { DateTimeFormat, InlineLoader, NsPagination, UserAvatar } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';

const meta = ['Investor\'s Name', 'Residence City', 'Investment Amount', 'Investment Time', 'Referral Code'];

@inject('offeringInvestorStore')
@withRouter
@observer
export default class Listing extends Component {
  paginate = params => this.props.offeringInvestorStore.pageRequest(params);
  render() {
    const listHeader = [...meta];
    const {
      investorLists, loading, count, requestState,
    } = this.props.offeringInvestorStore;
    const totalRecords = count || 0;
    if (loading) {
      return <InlineLoader />;
    }
    if (investorLists.length === 0) {
      return <InlineLoader text="No record to display." />;
    }
    return (
      <Aux>
        <div className="table-wrapper">
          <Table unstackable singleLine className="investment-details">
            <Table.Header>
              <Table.Row>
                {
                  listHeader.map(cell => (
                    <Table.HeaderCell key={cell.split(' ')[0]} textAlign={cell === 'Referral Code' ? 'right' : ''}>{cell}</Table.HeaderCell>
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
                  <Table.Cell>{Helper.CurrencyFormat(data.amount)}</Table.Cell>
                  <Table.Cell>{data.investmentDate ? <DateTimeFormat format="MM-DD-YYYY  h:mmA" datetime={data.investmentDate} /> : 'N/A'}</Table.Cell>
                  <Table.Cell textAlign="right">{data.referralCode || 'N/A'}</Table.Cell>
                </Table.Row>
              ))
              }
            </Table.Body>
          </Table>
        </div>
        {totalRecords > 0 &&
          <NsPagination floated="right" initRequest={this.paginate} meta={{ totalRecords, requestState }} />
        }
      </Aux>
    );
  }
}
