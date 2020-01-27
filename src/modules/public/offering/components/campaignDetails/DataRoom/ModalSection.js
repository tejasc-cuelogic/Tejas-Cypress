import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import { Button, Header, Grid } from 'semantic-ui-react';
import { FormCheckbox } from '../../../../../../theme/form';

@inject('accreditationStore', 'campaignStore', 'uiStore')
@withRouter
@observer
class Disclosure extends Component {
  state = {
    isSelfAccredited: true,
    loading: false,
  };

  constructor(props) {
    super(props);
    this.props.accreditationStore.resetForm('SELF_ACCREDITATION_FRM');
  }

  selfAccreditedHandle = () => {
    this.setState({ isSelfAccredited: true });
  }

  handleLoginAction = () => {
    this.props.uiStore.setAuthRef(this.props.location.pathname, this.props.location.hash);
    this.props.history.push('/login');
  }

  investorSelfVerifyAccreditedStatus = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    const { accreditationStore, doc, campaignStore } = this.props;
    const documentId = `${get(doc, 'name')} (${get(doc, 'upload.fileHandle.boxFileId')})`;
    const offeringId = get(campaignStore.campaign, 'keyTerms.shorthandBusinessName');
    accreditationStore.investorSelfVerifyAccreditedStatus(offeringId, documentId).then(() => {
      // this.setState({ loading: false });
    }).catch(() => this.setState({ loading: false }));
  }

  render() {
    const { currentUser } = this.props;
    const { SELF_ACCREDITATION_FRM, formChange } = this.props.accreditationStore;
    const headerMsg = 'This document is only available to accredited investors.';
    const paraMsg = <span>Please confirm that you are an accredited<br /> investor to view this document.</span>;
    return (!this.state.isSelfAccredited || !currentUser) ? (
      <section className={`no-updates center-align padded ${!currentUser ? 'pt-0 pb-0' : 'bg-offwhite'}`}>
        <Header as="h3" className="mb-20 mt-50">
          {headerMsg}
        </Header>
        {
          !currentUser
            ? <p>Please log in or create an account to view this document.</p>
            : <p>{paraMsg}</p>
        }
        {
          !currentUser
            ? <Button primary content="Log in / Sign Up" className="mt-20 mb-50" onClick={this.handleLoginAction} />
            : (
            <>
              {/* <Button as={Link} to="/dashboard/account-settings/investment-limits" primary content="Confirm Status" className="mt-20 mb-50" /> */}
              <Button primary content="Confirm Status" className="mt-20 mb-50" onClick={this.selfAccreditedHandle} />
            </>
              )}
      </section>
    ) : (
      <section className="no-updates padded plr-0">
        <Grid columns="2" stackable doubling>
          <Grid.Column>
            <Header as="h3" className="mb-20">
              {headerMsg}
            </Header>
            <p className="line-height-24">{paraMsg}</p>
          </Grid.Column>
          <Grid.Column>
            <FormCheckbox
              defaults
              fielddata={SELF_ACCREDITATION_FRM.fields.status}
              name="status"
              containerclassname="ui very relaxed list"
              changed={(e, res) => formChange(e, res, 'SELF_ACCREDITATION_FRM')}
              disabled={this.state.loading}
            />
            <Button loading={this.state.loading} primary content="Confirm" className="mt-20" disabled={SELF_ACCREDITATION_FRM.fields.status.value.length !== 2} onClick={e => this.investorSelfVerifyAccreditedStatus(e)} />
          </Grid.Column>
        </Grid>
      </section>
    );
  }
}

export default Disclosure;
