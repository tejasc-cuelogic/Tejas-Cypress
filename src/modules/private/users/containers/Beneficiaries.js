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
      beneficiaries, bLoading, bErr, deleteBeneficiary,
    } = this.props.userDetailsStore;
    return (
      <div>
        <Route exact path={`${this.props.match.url}/add-beneficiary`} render={props => <AddBeneficiary refLink={this.props.match.url} {...props} />} />
        <Header as="h3">Beneficiaries</Header>
        <p className="intro-text">Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec malesuada fames ac turpis</p>
        <Grid columns={1} stackable>
          {(bErr || (!bLoading && beneficiaries.length === 0)) ?
            <NoBeneficiary match={this.props.match} /> :
            <BeneficiaryList
              match={this.props.match}
              delete={deleteBeneficiary}
              beneficiaries={beneficiaries}
              loading={bLoading}
            />
          }
        </Grid>
      </div>
    );
  }
}
