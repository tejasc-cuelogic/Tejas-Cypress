import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { includes } from 'lodash';
import { FaqWidget, InlineLoader } from '../../../../../theme/shared';
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
    const { faqsOfModule } = this.props.educationStore;
    const { cash } = this.props.transactionStore;
    if (!Number.isFinite(cash)) {
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
          <Grid.Row>
            <Grid.Column widescreen={6} largeScreen={8} computer={10} tablet={13} mobile={16}>
              <FaqWidget heading="Transfer Funds" faqs={faqsOfModule} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
