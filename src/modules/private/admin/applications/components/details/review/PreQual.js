import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Divider, Form, Header, Button, Confirm } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';

@inject('businessAppReviewStore')
@observer
export default class PreQual extends Component {
  addJustification = (e) => {
    e.preventDefault();
    this.props.businessAppReviewStore.addMore('JUSTIFICATIONS_FRM');
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleConfirmModal(index, formName);
  }
  render() {
    const {
      MANAGERS_FRM, JUSTIFICATIONS_FRM,
      toggleConfirmModal, confirmModal, confirmModalName,
      managerEleChange, justificationEleChange, removeData,
    } = this.props.businessAppReviewStore;
    return (
      <Aux>
        <Form>
          <Header as="h4">
            Justifications
            <Link to={this.props.match.url} className="link" onClick={e => this.addJustification(e)}><small>+Add Justification</small></Link>
          </Header>
          {
            JUSTIFICATIONS_FRM.fields.data.length ?
            JUSTIFICATIONS_FRM.fields.data.map((justification, index) => (
              <Aux>
                <FormTextarea
                  name="justification"
                  label={`Justification ${index + 1}`}
                  fielddata={justification.justification}
                  changed={(e, result) => justificationEleChange(e, result, index)}
                  removed={index === 0 ? false : e => this.toggleConfirmModal(e, index, 'JUSTIFICATIONS_FRM')}
                  linkto={this.props.match.url}
                  containerclassname="secondary"
                />
              </Aux>
            )) : null
          }
          <div className="right-align">
            <Button disabled={!(MANAGERS_FRM.meta.isValid && JUSTIFICATIONS_FRM.meta.isValid)} primary className="relaxed" >Approved</Button>
          </div>
          <Divider section />
          <Header as="h4">Manager</Header>
          <FormTextarea
            name="managerOverview"
            fielddata={MANAGERS_FRM.fields.managerOverview}
            changed={managerEleChange}
            containerclassname="secondary"
          />
          <div className="right-align">
            <Button.Group>
              <Button disabled={!MANAGERS_FRM.meta.isValid} className="relaxed" secondary>Deny</Button>
              <Button disabled={!MANAGERS_FRM.meta.isValid} primary className="relaxed" type="button">Approve</Button>
            </Button.Group>
          </div>
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
