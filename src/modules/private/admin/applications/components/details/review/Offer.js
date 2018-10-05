import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Header, Form, Confirm, Divider } from 'semantic-ui-react';
import OffersPanel from '../../../../../shared/offerings/components/shared/OffersPanel';
import ManagerOverview from './ManagerOverview';
import ButtonGroup from './ButtonGroup';

@inject('businessAppReviewStore', 'businessAppStore', 'userStore')
@observer
export default class Offer extends Component {
  componentWillMount() {
    this.props.businessAppReviewStore.setFormData('OFFERS_FRM', 'offers');
    this.props.businessAppReviewStore.setFormData('MANAGERS_FRM', 'offers.managerOverview');
  }
  toggleConfirmModal = (e, index) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleConfirmModal(index, 'OFFERS_FRM');
  }
  addNewOffer = (e) => {
    e.preventDefault();
    this.props.businessAppReviewStore.addMore('OFFERS_FRM', 'offer');
  }
  submit = () => {
    this.props.businessAppReviewStore.saveReviewForms('OFFERS_FRM');
  }
  submitWithApproval = (form, action) => {
    this.props.businessAppReviewStore.saveReviewForms(form, action);
  }
  render() {
    const {
      OFFERS_FRM, formChangeWithIndex, maskChangeWithIndex, confirmModal,
      confirmModalName, removeData,
    } = this.props.businessAppReviewStore;
    const { roles } = this.props.userStore.currentUser;
    const isManager = roles && roles.includes('manager');
    const { businessApplicationDetailsAdmin } = this.props.businessAppStore;
    const { offers } = businessApplicationDetailsAdmin;
    const submitted = (offers && offers.submitted) ? offers.submitted : null;
    const approved = (offers && offers.approved) ? offers.approved : null;
    const isReadonly = ((((approved && approved.status) || (submitted && !approved))
    && !isManager) || (isManager && approved && approved.status));
    return (
      <Aux>
        <Form onSubmit={this.submit}>
          <ManagerOverview isManager={isManager} formName="OFFERS_FRM" approved={approved} isReadonly={isReadonly} isValid={OFFERS_FRM.meta.isValid} />
          <Header as="h4">
            Offers
            {!isReadonly && OFFERS_FRM.fields.offer.length < 4 &&
            <Link to={this.props.match.url} className="link pull-right" onClick={this.addNewOffer}><small>+ Add new offer</small></Link>
            }
          </Header>
          <Divider hidden />
          <OffersPanel
            OFFERS_FRM={OFFERS_FRM}
            formChangeWithIndex={formChangeWithIndex}
            maskChangeWithIndex={maskChangeWithIndex}
            isReadonly={isReadonly}
            match={this.props.match}
            refModule="admin"
          />
          <ButtonGroup
            formName="OFFERS_FRM"
            isReadonly={isReadonly}
            isManager={isManager}
            submitted={submitted}
            approved={approved}
            formValid={OFFERS_FRM.meta.isValid}
            submitWithApproval={this.submitWithApproval}
          />
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this offer?"
          open={confirmModal}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => removeData(confirmModalName, 'offer')}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
