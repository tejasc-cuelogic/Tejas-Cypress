import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { Button, Header, Grid } from 'semantic-ui-react';
import { FormCheckbox } from '../../../../../../theme/form';

@inject('accreditationStore', 'campaignStore', 'uiStore')
@withRouter
@observer
class Disclosure extends Component {
  state = {
    isSelfAccredited: false,
  };

  selfAccreditedHandle = () => {
    this.setState({ isSelfAccredited: true });
  }

  investorSelfVerifyAccreditedStatus = () => {
    const { accreditationStore, doc, campaignStore } = this.props;
    const documentId = get(doc, 'upload.fileHandle.boxFileId');
    const offeringId = get(campaignStore.campaign, 'id');
    accreditationStore.investorSelfVerifyAccreditedStatus(offeringId, documentId);
  }

  render() {
    const { currentUser, uiStore } = this.props;
    const { SELF_ACCREDITATION_FRM, formChange } = this.props.accreditationStore;
    const { inProgress } = uiStore;
    return !this.state.isSelfAccredited ? (
      <section className={`no-updates center-align padded ${!currentUser ? 'pt-0 pb-0' : 'bg-offwhite'}`}>
        <Header as="h3" className="mb-20 mt-50">
          This document is only available to accredited investors.
        </Header>
        {
          !currentUser
            ? <p>Please log in or create an account to view this document.</p>
            : <p>Please confirm your accredited investor status to access this Document.</p>
        }
        {
          !currentUser
            ? <Button as={Link} to="/login" primary content="Log in / Sign Up" className="mt-20 mb-50" />
            : (
            <>
              <Button as={Link} to="/dashboard/account-settings/investment-limits" primary content="Confirm Status" className="mt-20 mb-50" />
              <Button primary content="Self Accredited" className="mt-20 mb-50" onClick={this.selfAccreditedHandle} />
            </>
              )}
      </section>
    ) : (
      <section className="no-updates padded plr-0">
        <Grid columns="2">
          <Grid.Column>
            <Header as="h3" className="mb-20">
              This document is only available to accredited investors.
            </Header>
            <p>Please confirm your accredited investor status to access this Document.</p>
          </Grid.Column>
          <Grid.Column>
            <FormCheckbox
              defaults
              fielddata={SELF_ACCREDITATION_FRM.fields.status}
              name="status"
              containerclassname="ui very relaxed list"
              changed={(e, res) => formChange(e, res, 'SELF_ACCREDITATION_FRM')}
              disabled={inProgress}
            />
            <Button loading={inProgress} primary content="Self Accredited" className="mt-20" disabled={SELF_ACCREDITATION_FRM.fields.status.value.length !== 2} onClick={this.investorSelfVerifyAccreditedStatus} />
          </Grid.Column>
        </Grid>
      </section>
    );
  }
}

export default Disclosure;
