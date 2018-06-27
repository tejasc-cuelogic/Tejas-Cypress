import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import { Grid, Header } from 'semantic-ui-react';
import NoBeneficiary from '../components/beneficiaries/NoBeneficiary';
import BeneficiaryList from '../components/beneficiaries/BeneficiaryList';
import AddBeneficiary from '../components/beneficiaries/AddBeneficiary';

@inject('userDetailsStore')
@observer
export default class Beneficiaries extends Component {
  componentWillMount() {
    this.props.userDetailsStore.getBeneficiaries();
  }

  render() {
    const {
      beneficiaries, bLoading, bErr, deleteBeneficiary, deleting,
    } = this.props.userDetailsStore;
    console.log(beneficiaries, bErr);
    const beneficiaryList = beneficiaries.map(beneficary => (
      beneficary ?
        <NoBeneficiary
          match={this.props.match}
          title={beneficary.accountType}
          key={beneficary.accountId}
          curLocation={this.props.location}
        /> :
        <BeneficiaryList
          key={beneficary.accountId}
          title={beneficary.accountType}
          match={this.props.match}
          delete={deleteBeneficiary}
          beneficiaries={beneficiaries}
          deleting={deleting}
          loading={bLoading}
        />
    ));
    return (
      <div>
        <Header as="h3">Beneficiaries</Header>
        <p className="intro-text">Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec malesuada fames ac turpis</p>
        {bLoading ? <div>loading...</div> : (
          <Grid columns={1} stackable>
            { beneficiaryList }
            <Route exact path={`${this.props.match.url}/add-beneficiary`} render={props => <AddBeneficiary refLink={this.props.match.url} {...props} />} />
          </Grid>
          )
        }
      </div>
    );
  }
}
