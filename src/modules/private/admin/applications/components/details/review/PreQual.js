/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Divider, Form, Header, Button, Icon, Confirm } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';

@inject('businessAppReviewStore')
@observer
export default class PreQual extends Component {
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleConfirmModal(index, formName);
  }
  render() {
    const {
      MANAGERS_FRM, JUSTIFICATIONS_FRM,
      addMore, toggleConfirmModal, confirmModal, confirmModalName,
      managerEleChange, justificationEleChange, removeData,
    } = this.props.businessAppReviewStore;
    return (
      <Aux>
        <Header as="h4">Manager</Header>
        <Form>
          <FormTextarea
            name="managerOverview"
            fielddata={MANAGERS_FRM.fields.managerOverview}
            changed={managerEleChange}
            containerclassname="secondary"
          />
          <Divider section />
          <Header as="h4">
            Justifications
            <Link to={this.props.match.url} className="link" onClick={() => addMore('JUSTIFICATIONS_FRM')}><small>+Add Justification</small></Link>
          </Header>
          {
            JUSTIFICATIONS_FRM.fields.data.length ?
            JUSTIFICATIONS_FRM.fields.data.map((justification, index) => (
              <Aux>
                <div className="mb-10">
                  <label>{`Justification ${index + 1}`}</label>
                  <Link to={this.props.match.url} className="icon-link" onClick={e => this.toggleConfirmModal(e, index, 'JUSTIFICATIONS_FRM')}>
                    <Icon className="ns-close-circle" color="grey" />
                  </Link>
                </div>
                <FormTextarea
                  name="justification"
                  fielddata={justification.justification}
                  changed={(e, result) => justificationEleChange(e, result, index)}
                  containerclassname="secondary"
                  hidelabel
                />
              </Aux>
            )) : null
          }
          <Button disabled={!(MANAGERS_FRM.meta.isValid && JUSTIFICATIONS_FRM.meta.isValid)} primary className="relaxed pull-right" >APPROVED</Button>
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
