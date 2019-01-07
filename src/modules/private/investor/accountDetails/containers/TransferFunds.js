import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { includes } from 'lodash';
import { InlineLoader } from '../../../../../theme/shared';
import AvailableCashTransfer from '../components/transferFunds/AvailableCashTransfer';

@inject('educationStore', 'transactionStore', 'userDetailsStore', 'uiStore')
@withRouter
@observer
export default class TransferFunds extends Component {
  componentWillMount() {
    const { setFieldValue } = this.props.userDetailsStore;
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    setFieldValue('currentActiveAccount', accountType);
    this.props.transactionStore.getInvestorAvailableCash();
    this.props.uiStore.clearErrors();
  }
  render() {
    const { cash } = this.props.transactionStore;
    if (!cash) {
      return <InlineLoader />;
    }
    return (
      <div>
        <Header as="h4">Transfer funds</Header>
        <Grid>
          <Grid.Row>
            <Grid.Column widescreen={8} largeScreen={11} computer={13} tablet={16} mobile={16}>
              <AvailableCashTransfer match={this.props.match} cash={cash} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
