import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Header } from 'semantic-ui-react';
import NoBeneficiary from '../components/beneficiaries/NoBeneficiary';
import BeneficiaryList from '../components/beneficiaries/BeneficiaryList';
import { InlineLoader, EmptyDataSet } from '../../../../../theme/shared';

@inject('beneficiaryStore')
@observer
export default class Beneficiaries extends Component {
  componentWillMount() {
    this.props.beneficiaryStore.getBeneficiaries();
    if (this.props.match.url === this.props.location.pathname) {
      this.props.beneficiaryStore.setShareModalData(false);
    }
  }

  render() {
    const {
      beneficiaries, bLoading,
    } = this.props.beneficiaryStore;
    const beneficiaryList = beneficiaries ? beneficiaries.map(beneficiary => (
      beneficiary.beneficiary ?
        <BeneficiaryList
          accountId={beneficiary.accountId}
          updatedDate={beneficiary.updated.date ? beneficiary.updated.date
            : beneficiary.created.date}
          key={beneficiary.accountId}
          title={beneficiary.type}
          match={this.props.match}
          beneficiaries={beneficiary.beneficiary}
          loading={bLoading}
          curLocation={this.props.location}
        /> :
        (beneficiary.status === 'FULL' ?
          <NoBeneficiary
            accountId={beneficiary.accountId}
            match={this.props.match}
            title={beneficiary.type}
            key={beneficiary.accountId}
            curLocation={this.props.location}
          /> : null)
    )) : <EmptyDataSet title="No data available for beneficiaries." />;
    return (
      <div>
        <Header as="h4">Beneficiaries</Header>
        <p className="note">
          Designate beneficiaries for each of your investment accounts.
          If you have multiple accounts, each can be adjusted separately.
        </p>
        {bLoading ? <InlineLoader /> : (
          <Grid columns={1} stackable>
            { beneficiaryList }
          </Grid>
          )
        }
      </div>
    );
  }
}
