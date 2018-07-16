import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Header } from 'semantic-ui-react';
import NoBeneficiary from '../components/beneficiaries/NoBeneficiary';
import BeneficiaryList from '../components/beneficiaries/BeneficiaryList';

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
          updatedDate={beneficiary.updatedDate ? beneficiary.updatedDate : beneficiary.createdDate}
          key={beneficiary.accountId}
          title={beneficiary.accountType}
          match={this.props.match}
          beneficiaries={beneficiary.beneficiary}
          loading={bLoading}
          curLocation={this.props.location}
        /> :
        (beneficiary.status === 'FULL' ?
          <NoBeneficiary
            accountId={beneficiary.accountId}
            match={this.props.match}
            title={beneficiary.accountType}
            key={beneficiary.accountId}
            curLocation={this.props.location}
          /> : null)
    )) :
          <div>loading</div>;
    return (
      <div>
        <Header as="h3">Beneficiaries</Header>
        {/* <p className="intro-text">Pellentesque facilisis</p> */}
        {bLoading ? <div>loading...</div> : (
          <Grid columns={1} stackable>
            { beneficiaryList }
          </Grid>
          )
        }
      </div>
    );
  }
}
