import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { includes, isEmpty, get } from 'lodash';
import Aux from 'react-aux';
import { InlineLoader } from '../../../../../theme/shared';
import AvailableCashTransfer from '../components/transferFunds/AvailableCashTransfer';
import HtmlEditor from '../../../../../modules/shared/HtmlEditor';

@inject('educationStore', 'transactionStore', 'userDetailsStore', 'uiStore')
@withRouter
@observer
export default class TransferFunds extends Component {
  componentWillMount() {
    const { setFieldValue } = this.props.userDetailsStore;
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    setFieldValue('currentActiveAccount', accountType);
    if (this.props.match.isExact) {
      this.props.transactionStore.getInvestorAvailableCash();
    }
    this.props.uiStore.clearErrors();
  }
  render() {
    const { userDetails } = this.props.userDetailsStore;
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    const { cash, cashAvailable } = this.props.transactionStore;
    if (!cash && cashAvailable.loading) {
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
        { !isEmpty(linkedBank) || accountType !== 'ira' ?
          <Aux>
            <Header as="h4">Transfer funds</Header>
            <Grid>
              <Grid.Row>
                <Grid.Column widescreen={8} largeScreen={11} computer={13} tablet={16} mobile={16}>
                  <AvailableCashTransfer match={this.props.match} cash={cash} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Aux> : accountType === 'ira' ?
            <section className="center-align">
              <h4 style={{ color: '#31333d7d' }}>
                <HtmlEditor
                  readOnly
                  content={(`Please contact
    <a href="mailto:support@nextseed.com">support@nextseed.com</a> to request a transfer of your IRA funds.`)}
                />
              </h4>
            </section>
          :
            <section className="center-align">
              <h4 style={{ color: '#31333d7d' }}>
                <HtmlEditor
                  readOnly
                  content={
                    `No Linked Bank available to Transfer Fund, go to
                    <a href='/app/account-details/ira/bank-accounts'>
                    Bank Accounts
                    <a>}`
                    }
                />
              </h4>
            </section>
        }
      </div>
    );
  }
}
