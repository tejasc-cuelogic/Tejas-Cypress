/* eslint-disable react/jsx-indent */
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Button, Item, Grid, Card } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';
import { LINKED_ACCOUND_STATUS } from '../../../../../../constants/account';
import { bankAccountActions } from '../../../../../../services/actions';
import FrozenAccountModal from '../../FrozenAccountModal';
import NSImage from '../../../../../shared/NSImage';
import { DataFormatter } from '../../../../../../helper';

const isMobile = document.documentElement.clientWidth < 768;
@inject('bankAccountStore', 'transactionStore', 'uiStore', 'userDetailsStore', 'accountStore')
@withRouter
@observer
export default class AccountDetailsView extends Component {
  componentWillMount() {
    const { accountDetails, accountType } = this.props;
    const { setFieldValue } = this.props.userDetailsStore;
    const investorAccount = this.props.location.pathname.includes('individual') ? 'individual' : this.props.location.pathname.includes('ira') ? 'ira' : 'entity';
    setFieldValue('currentActiveAccount', investorAccount);
    const activeBankInstutationId = accountDetails && accountDetails.plaidInstitutionId
      ? accountDetails.plaidInstitutionId : null;

    if (activeBankInstutationId) {
      this.props.bankAccountStore.setFieldValue('loadingState', true);
      bankAccountActions.getById(activeBankInstutationId, accountType).then(() => {
        this.props.bankAccountStore.setFieldValue('loadingState', false);
      });
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

  handleClose = () => {
    this.props.accountStore.setFieldValue('showAccountFrozenModal', false);
  }

  render() {
    const {
      accountDetails, match, click, accountType, pendingAccoungDetails, uiStore, accountStore,
    } = this.props;
    const { activeBankPladLogo, pendingBankPladLogo, loadingState } = this.props.bankAccountStore;
    const pladidLogo = accountType === 'pending'
      ? pendingBankPladLogo : activeBankPladLogo;
    let currentStaus = '';
    if (accountType === 'active') {
      currentStaus = (pendingAccoungDetails && pendingAccoungDetails.status !== 'APPROVED') ? 'Inactive (Pending Removal)' : 'Active';
    } else {
      currentStaus = accountDetails.status
        ? LINKED_ACCOUND_STATUS[accountDetails.status] : null;
    }
    if (loadingState) {
      return <InlineLoader />;
    }

    if (accountStore.showAccountFrozenModal) {
      return <FrozenAccountModal handleClose={this.handleClose} refLink={this.props.match.url} />;
    }
    return (
      <Card.Content>
        <Grid stackable columns="equal">
          <Grid.Row>
            <Grid.Column width={2} verticalAlign="middle">
              <Item>
                {pladidLogo
                  ? <Item.Image size="tiny" src={`data:image/png;base64,${pladidLogo}`} />
                  : (
<div className="ui tiny image">
                    <NSImage path="banks/default.png" />
                  </div>
                  )
                }
              </Item>
            </Grid.Column>
            <Grid.Column>
              <Item>
                <Item.Content>
                  <Item.Extra>Number</Item.Extra>
                  <Item.Header>
                    {accountDetails && accountDetails.accountNumber
                      ? Helper.encryptNumberWithX(accountDetails.accountNumber)
                      : null}
                  </Item.Header>
                </Item.Content>
              </Item>
            </Grid.Column>
            <Grid.Column>
              <Item>
                <Item.Content>
                  <Item.Extra>
                    {accountDetails && accountDetails.dateLinked ? 'Date linked' : 'Date Requested'
                    }
                  </Item.Extra>
                  <Item.Header>
                    {
                      DataFormatter.getDateInLocalTimeZone((accountDetails.dateLinked || accountDetails.dateRequested), true, false, false)
                    }
                  </Item.Header>
                </Item.Content>
              </Item>
            </Grid.Column>
            <Grid.Column>
              <Item>
                <Item.Content>
                  <>
                    <Item.Extra>Status</Item.Extra>
                      <Item.Header>
                        {currentStaus}
                      </Item.Header>
                  </>
                </Item.Content>
              </Item>
            </Grid.Column>
            <Grid.Column width={3} textAlign={!isMobile ? 'right' : ''} verticalAlign="middle">
              {accountType === 'active'
                ? accountDetails && !accountDetails.pendingUpdate
                && (
<>
                {
                  <Button as={Link} inverted onClick={click} to={`${match.url}/link-bank-account`} color="green" content="Change Linked Bank" />
                }
</>
                )
                : <Button loading={uiStore.inProgress} inverted onClick={this.handleCancelRequest} color="red" content="Cancel Request" />
              }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
    );
  }
}
