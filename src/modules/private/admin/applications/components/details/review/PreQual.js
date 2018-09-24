import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Form, Header, Button, Confirm } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';
import ManagerOverview from './ManagerOverview';

@inject('businessAppReviewStore')
@observer
export default class PreQual extends Component {
  componentWillMount() {
    this.props.businessAppReviewStore.setFormData('JUSTIFICATIONS_FRM', 'review.preQualification.justifications');
  }
  addJustification = (e) => {
    e.preventDefault();
    this.props.businessAppReviewStore.addMore('JUSTIFICATIONS_FRM');
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleConfirmModal(index, formName);
  }
  submit = () => {
    this.props.businessAppReviewStore.saveReviewForms('JUSTIFICATIONS_FRM');
  }
  render() {
    const {
      JUSTIFICATIONS_FRM, JUSTIFICATIONS_MANAGER_FRM,
      toggleConfirmModal, confirmModal, confirmModalName,
      formChangeWithIndex, removeData,
    } = this.props.businessAppReviewStore;
    return (
      <Aux>
        <Form onSubmit={this.submit}>
          <Header as="h4">
            Justifications
            <Link to={this.props.match.url} className="link" onClick={e => this.addJustification(e)}><small>+Add Justification</small></Link>
          </Header>
          {
            JUSTIFICATIONS_FRM.fields.data.map((justifications, index) => (
              <Aux>
                <FormTextarea
                  name="justifications"
                  label={`Justification ${index + 1}`}
                  fielddata={justifications.justifications}
                  changed={(e, result) => formChangeWithIndex(e, result, 'JUSTIFICATIONS_FRM', 'data', index)}
                  removed={e => this.toggleConfirmModal(e, index, 'JUSTIFICATIONS_FRM')}
                  linkto={this.props.match.url}
                  containerclassname="secondary"
                />
              </Aux>
            ))
          }
          <div className="right-align">
            <Button disabled={!(JUSTIFICATIONS_FRM.meta.isValid && JUSTIFICATIONS_FRM.fields.data.length)} primary className="relaxed" >Approved</Button>
          </div>
          <ManagerOverview form={JUSTIFICATIONS_MANAGER_FRM} formName="JUSTIFICATIONS_MANAGER_FRM" />
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this justification?"
          open={confirmModal}
          onCancel={toggleConfirmModal}
          onConfirm={() => removeData(confirmModalName)}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
