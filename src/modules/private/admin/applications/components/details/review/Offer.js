import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Header, Form, Confirm, Divider, Table } from 'semantic-ui-react';
import OffersPanel from '../../../../../shared/offerings/components/shared/OffersPanel';
import ManagerOverview from './ManagerOverview';
import ButtonGroup from './ButtonGroup';
import { DropZoneConfirm as DropZone, MaskedInput } from '../../../../../../../theme/form';
import { InlineLoader } from '../../../../../../../theme/shared';

@inject('businessAppReviewStore', 'businessAppStore', 'userStore')
@observer
export default class Offer extends Component {
  componentWillMount() {
    this.props.businessAppReviewStore.setFieldvalue('showGeneratePA', true);
    if (!this.props.businessAppReviewStore.initLoad.includes('OFFERS_FRM')) {
      this.props.businessAppReviewStore.setFormData('OFFERS_FRM', 'offers');
    }
    this.props.businessAppReviewStore.setFormData('MANAGERS_FRM', 'offers.managerOverview');
  }
  onFileDrop = (files, name) => {
    this.props.businessAppReviewStore.setFileUploadData('OFFERS_FRM', '', name, files);
  }
  handleDelDoc = (field) => {
    this.props.businessAppReviewStore.removeUploadedData('OFFERS_FRM', field);
  }
  toggleConfirmModal = (e, index, modalName) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleConfirmModal(index, modalName);
  }
  addMore = (e, array) => {
    e.preventDefault();
    this.props.businessAppReviewStore.addMore('OFFERS_FRM', array);
  }
  // addSectionCount = () => {
  //   this.props.businessAppReviewStore.addSectionCount();
  // }
  submit = () => {
    this.props.businessAppReviewStore.saveReviewForms('OFFERS_FRM');
  }
  submitWithApproval = (form, action) => {
    this.props.businessAppReviewStore.saveReviewForms(form, action);
  }
  maskChangeWithIndex = (values, form, arrayName, field, index) => {
    this.props.businessAppReviewStore.maskChangeWithIndex(values, form, arrayName, field, index);
  }
  render() {
    const {
      OFFERS_FRM, formChangeWithIndex, maskChangeWithIndex, confirmModal,
      assignAdditionalTermsValue, addAdditionalTermsToFormData,
      confirmModalName, removeData, inProgress, expAnnualRevCount,
      // checkAllStepsIsApproved,
    } = this.props.businessAppReviewStore;
    const access = this.props.userStore.myAccessForModule('APPLICATIONS');
    const isManager = access.asManager;
    const {
      businessApplicationDetailsAdmin, applicationReviewLoading,
    } = this.props.businessAppStore;
    const { offers, applicationStatus } = businessApplicationDetailsAdmin;
    const submitted = (offers && offers.submitted) ? offers.submitted : null;
    const approved = (offers && offers.approved) ? offers.approved : null;
    const isReadonly = ((((approved && approved.status) || (submitted))
      && !isManager) || (isManager && approved && approved.status));
    if (applicationReviewLoading) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        <Form onSubmit={this.submit}>
          <ManagerOverview applicationStatus={applicationStatus} title="Submit offer" submitted={submitted} isManager={isManager} formName="OFFERS_FRM" approved={approved} isReadonly={isReadonly} isValid={OFFERS_FRM.meta.isValid} />
          <Header as="h4">
            Offers
            {!isReadonly && OFFERS_FRM.fields.offer.length < 4 &&
            <Link to={this.props.match.url} className="link pull-right" onClick={e => this.addMore(e, 'offer')}><small>+ Add new offer</small></Link>
            }
          </Header>
          <Divider hidden />
          <OffersPanel
            assignAdditionalTermsValue={assignAdditionalTermsValue}
            addAdditionalTermsToFormData={addAdditionalTermsToFormData}
            OFFERS_FRM={OFFERS_FRM}
            formChangeWithIndex={formChangeWithIndex}
            maskChangeWithIndex={maskChangeWithIndex}
            isReadonly={isReadonly}
            match={this.props.match}
            refModule="admin"
            toggleConfirmModal={this.toggleConfirmModal}
          />
          <Table basic compact className="mt-30 form-table">
            <Table.Body>
              <Table.Row>
                <Table.Cell collapsing>
                  <Header as="h6">Term Note portal agreement</Header>
                </Table.Cell>
                <Table.Cell>
                  <DropZone
                    size="small"
                    containerclassname={isReadonly ? 'display-only' : ''}
                    disabled={isReadonly}
                    name="term"
                    fielddata={OFFERS_FRM.fields.term}
                    ondrop={this.onFileDrop}
                    onremove={this.handleDelDoc}
                    uploadtitle="Add Term Note portal agreement"
                  />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell collapsing>
                  <Header as="h6">Rev Sharing portal agreement</Header>
                </Table.Cell>
                <Table.Cell>
                  <DropZone
                    size="small"
                    containerclassname={isReadonly ? 'display-only' : ''}
                    disabled={isReadonly}
                    name="rev"
                    fielddata={OFFERS_FRM.fields.rev}
                    ondrop={this.onFileDrop}
                    onremove={this.handleDelDoc}
                    uploadtitle="Add Rev Sharing portal agreement"
                  />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          <Divider hidden />
          <Header as="h4">
            Expected Annual Revenue
            {!isReadonly &&
            <Link to={this.props.match.url} className="link" onClick={e => this.addMore(e, 'expectedAnnualRevenue')}><small>+ Add Another Year</small></Link>
            }
          </Header>
          <div className="bg-offwhite">
            <Form.Group widths={2}>
              {
                OFFERS_FRM.fields.expectedAnnualRevenue.map((expectedAnnualRevenue, index) => (
                  <Aux>
                    <MaskedInput
                      removed={(!isReadonly && OFFERS_FRM.fields.expectedAnnualRevenue.length > expAnnualRevCount && (OFFERS_FRM.fields.expectedAnnualRevenue.length - 1 === index)) ? e => this.toggleConfirmModal(e, index, 'expectedAnnualRevenue') : false}
                      containerclassname={isReadonly ? 'display-only' : ''}
                      readOnly={isReadonly}
                      prefix="$"
                      currency
                      name="year"
                      linkto="/"
                      label={expectedAnnualRevenue.label.value}
                      fielddata={expectedAnnualRevenue.year}
                      changed={(values, field) => this.maskChangeWithIndex(values, 'OFFERS_FRM', 'expectedAnnualRevenue', field, index)}
                    />
                  </Aux>
              ))
            }
            </Form.Group>
          </div>
          <ButtonGroup
            inProgress={inProgress}
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
          content={`Are you sure you want to remove this ${confirmModalName === 'offer' ? 'offer' : 'year'}?`}
          open={confirmModal}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => removeData('OFFERS_FRM', confirmModalName)}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
