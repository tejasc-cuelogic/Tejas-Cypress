/* eslint-disable react/jsx-indent */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { Button, Item, Grid, Card } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';
import Banklogo from '../../../../../../assets/images/banks/default.png';
import { LINKED_ACCOUND_STATUS } from '../../../../../../constants/account';
import { bankAccountActions } from '../../../../../../services/actions';

@inject('bankAccountStore', 'transactionStore')
@withRouter
@observer
export default class AccountDetailsView extends Component {
  componentWillMount() {
    const { accountDetails, accountType } = this.props;
    const activeBankInstutationId = accountDetails && accountDetails.plaidInstitutionId ?
      accountDetails.plaidInstitutionId : null;

    if (activeBankInstutationId) {
      bankAccountActions.getById(activeBankInstutationId, accountType);
    } else if (accountType === 'active') {
      this.props.bankAccountStore.setActiveBankPlaidLogo(null);
    } else if (accountType === 'pending') {
      this.props.bankAccountStore.setPendingeBankPlaidLogo(null);
    }
  }
  handleCancelRequest = (e) => {
    e.preventDefault();
    this.props.bankAccountStore.setLinkedBankCancelRequestStatus(true);
    this.props.transactionStore.requestOtpForManageTransactions().then(() => {
      const confirmUrl = `${this.props.match.url}/cancel-bank-account/confirm`;
      this.props.history.push(confirmUrl);
    });
  }
  render() {
    const {
      accountDetails,
      click,
      match,
      accountType,
      pendingAccoungDetails,
    } = this.props;
    const { activeBankPladLogo, pendingBankPladLogo } = this.props.bankAccountStore;
    const pladidLogo = accountType === 'pending' ? pendingBankPladLogo : activeBankPladLogo;
    let currentStaus = '';
    if (accountType === 'active') {
      currentStaus = pendingAccoungDetails ? 'Pending Removal' : 'Active';
    } else {
      currentStaus = accountDetails.status ? LINKED_ACCOUND_STATUS[accountDetails.status] : null;
    }
    return (
      <Card.Content>
        <Grid columns="equal">
          <Grid.Row>
            <Grid.Column verticalAlign="middle">
              <Item>
                {pladidLogo ?
                  <Item.Image size="tiny" src={`data:image/png;base64,${pladidLogo}`} />
                  :
                  <Item.Image size="tiny" src={Banklogo} />
                }
              </Item>
            </Grid.Column>
            <Grid.Column>
              <Item>
                <Item.Content>
                  <Item.Extra>Number</Item.Extra>
                  <Item.Header>
                    {accountDetails && accountDetails.accountNumber ?
                      Helper.encryptNumber(accountDetails.accountNumber)
                      : null}
                  </Item.Header>
                </Item.Content>
              </Item>
            </Grid.Column>
            <Grid.Column>
              <Item>
                <Item.Content>
                  <Item.Extra>
                    {accountDetails && pendingAccoungDetails ? 'Date linked' : 'Date Requested'
                    }
                  </Item.Extra>
                  <Item.Header>
                  {accountDetails && pendingAccoungDetails && accountDetails.changeRequest &&
                      accountDetails.changeRequest.dateRequested ?
                      moment(accountDetails.changeRequest.dateRequested).format('MM/DD/YYYY') :
                      moment(accountDetails.dateLinked).format('MM/DD/YYYY')
                    }
                  </Item.Header>
                </Item.Content>
              </Item>
            </Grid.Column>
            <Grid.Column>
              <Item>
                <Item.Content>
                  <Item.Extra>Status</Item.Extra>
                  {accountType === 'pending' ?
                    <Item.Header as={Link} to={`${match.url}/link-bank-account/verify-update`}>
                      {currentStaus}
                    </Item.Header>
                    :
                    <Item.Header>
                      {currentStaus}
                    </Item.Header>
                  }
                </Item.Content>
              </Item>
            </Grid.Column>
            <Grid.Column width={5} textAlign="right" verticalAlign="middle">
              {accountType === 'active' ?
                accountDetails && !pendingAccoungDetails &&
                <Button as={Link} inverted onClick={click} to={`${match.url}/link-bank-account`} color="green" content="Change Linked Bank" />
                :
                <Button inverted onClick={this.handleCancelRequest} color="red" content="Cancel Request" />
              }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
    );
  }
}

