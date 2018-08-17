/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Divider, Form, Header, Button, Icon, Confirm } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';

@inject('businessAppReviewStore')
@observer
export default class PreQual extends Component {
  toggleConfirm = (e, index) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleJustificationConfirmModal(index);
  }
  removeJustification = () => {
    this.props.businessAppReviewStore.removeJustification();
  }
  render() {
    const {
      MANAGERS_FRM, JUSTIFICATIONS_FRM,
      addJustification, justificationConfirmModal,
      managerEleChange, justificationEleChange,
    } = this.props.businessAppReviewStore;
    return (
      <div className="inner-content-spacer">
        <Header as="h5">
          Manager
        </Header>
        <Form>
          <FormTextarea
            name="managerOverview"
            fielddata={MANAGERS_FRM.fields.managerOverview}
            changed={managerEleChange}
            containerclassname="secondary"
          />
          <Divider section />
          <Header as="h5">
            Justifications
            <Header.Subheader>
              <Button color="violet" className="ghost-button" onClick={addJustification}>+Add Justification</Button>
            </Header.Subheader>
          </Header>
          {
              JUSTIFICATIONS_FRM.fields.justifications.length ?
              JUSTIFICATIONS_FRM.fields.justifications.map((justification, index) => (
                <Form>
                  <label>{`Justification ${index + 1}`}</label>
                  <Link to={this.props.match.url} className="icon-link" onClick={e => this.toggleConfirm(e, index)}>
                    <Icon className="ns-close-circle" color="grey" />
                  </Link>
                  <FormTextarea
                    name="justification"
                    fielddata={justification.justification}
                    changed={(e, result) => justificationEleChange(e, result, index)}
                    containerclassname="secondary"
                    hidelabel
                  />
                </Form>
              )) : <p>...Loading</p>
          }
          <Button disabled={!(MANAGERS_FRM.meta.isValid && JUSTIFICATIONS_FRM.meta.isValid)} primary size="large" className="very relaxed pull-right" >APPROVED</Button>
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this justification?"
          open={justificationConfirmModal}
          onCancel={this.toggleConfirm}
          onConfirm={this.removeJustification}
          size="mini"
          className="deletion"
        />
      </div>
    );
  }
}
