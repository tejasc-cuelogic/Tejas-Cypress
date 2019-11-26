import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { includes, isEmpty, get } from 'lodash';
import money from 'money-math';
import { InlineLoader } from '../../../../../theme/shared';
import AvailableCashTransfer from '../components/transferFunds/AvailableCashTransfer';
import HtmlEditor from '../../../../shared/HtmlEditor';

const NO_PERMISSION_MSG = `Please contact
  <a href="mailto:support@nextseed.com">support@nextseed.com</a>
  to request a transfer of your IRA funds.`;

const NO_LINKED_BANK_MSG = `No Linked Bank available to Transfer Fund, go to
  <a href='/app/account-details/ira/bank-accounts'>Bank Accounts<a>`;

@inject('educationStore', 'transactionStore', 'userDetailsStore', 'uiStore', 'accountStore')
@withRouter
@observer
export default class TransferFunds extends Component {
  constructor(props) {
    super(props);
    const { setFieldValue } = this.props.userDetailsStore;
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    setFieldValue('currentActiveAccount', accountType);
    if (this.props.match.isExact) {
      this.props.transactionStore.getInvestorAvailableCash(false);
    }
    this.props.uiStore.clearErrors();
  }

  render() {
    const { userDetails, isAccountFrozen, isAccountHardFrozen } = this.props.userDetailsStore;
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    const { cash, cashAvailable } = this.props.transactionStore;
    const { setFieldValue, showAccountFrozenModal } = this.props.accountStore;
    const cashAmount = cash ? money.isNegative(cash) ? '0.00' : cash : '0.00';
    if (this.props.match.isExact && (!cash || cashAvailable.loading)) {
      return <InlineLoader />;
    }
    let linkedBank = [];
    get(userDetails, 'roles').map((role) => {
      if (accountType === get(role, 'name')) {
        linkedBank = get(role, 'details.linkedBank');
      }
      return null;
    });
    return (
      <div>
        {!isEmpty(linkedBank) && accountType !== 'ira'
          ? (
            <>
              <Header as="h4">Transfer funds</Header>
              <Grid>
                <Grid.Row>
                  <Grid.Column widescreen={7} largeScreen={10} computer={10} tablet={16} mobile={16}>
                    <AvailableCashTransfer
                      match={this.props.match}
                      isAccountFrozen={isAccountFrozen}
                      isAccountHardFrozen={isAccountHardFrozen}
                      cash={cashAmount || '0.00'}
                      setFieldValue={setFieldValue}
                      showAccountFrozenModal={showAccountFrozenModal}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </>
          ) : accountType === 'ira'
            ? (
              <section className="center-align">
                <h4 style={{ color: '#31333d7d' }}>
                  <HtmlEditor readOnly content={NO_PERMISSION_MSG} />
                </h4>
              </section>
            )
            : (
              <section className="center-align">
                <h4 style={{ color: '#31333d7d' }}>
                  <HtmlEditor readOnly content={NO_LINKED_BANK_MSG} />
                </h4>
              </section>
            )
        }
      </div>
    );
  }
}
