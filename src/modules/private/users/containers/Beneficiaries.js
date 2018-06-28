import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Header } from 'semantic-ui-react';
import NoBeneficiary from '../components/beneficiaries/NoBeneficiary';
import BeneficiaryList from '../components/beneficiaries/BeneficiaryList';

@inject('userDetailsStore')
@observer
export default class Beneficiaries extends Component {
  componentWillMount() {
    this.props.userDetailsStore.getBeneficiaries();
  }

  render() {
    const {
      beneficiaries, bLoading, deleteBeneficiary, deleting,
    } = this.props.userDetailsStore;
    const beneficiaryList = beneficiaries ? beneficiaries.map(beneficiary => (
      beneficiary.beneficiary ?
        <BeneficiaryList
          key={beneficiary.accountId}
          title={beneficiary.accountType}
          match={this.props.match}
          delete={deleteBeneficiary}
          beneficiaries={beneficiary.beneficiary}
          deleting={deleting}
          loading={bLoading}
        /> :
        <NoBeneficiary
          match={this.props.match}
          title={beneficiary.accountType}
          key={beneficiary.accountId}
          curLocation={this.props.location}
        />
    )) :
        <div>loading</div>;
    return (
      <div>
        <Header as="h3">Beneficiaries</Header>
        <p className="intro-text">Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec malesuada fames ac turpis</p>
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
