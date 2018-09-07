/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { observer, inject } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Header, Button, Checkbox, Form } from 'semantic-ui-react';
import { FormTextarea, FormInput } from '../../../../../../../theme/form';

@withRouter
@inject('offeringCreationStore', 'userStore')
@observer
export default class Contingency extends Component {
  setContingencyForm = () => {
    const { formName, offeringCreationStore } = this.props;
    offeringCreationStore.setContingencyFormSelected(formName);
  }
  render() {
    const { roles } = this.props.userStore.currentUser;
    const { OFFERING_DETAILS_FRM } = this.props.offeringCreationStore;
    if (roles && roles.includes('manager')) {
      return null;
    }
    const {
      form,
      formName,
      formChange,
      formChangeWithIndex,
      match,
    } = this.props;
    return (
      <Aux>
        <Form>
          {(roles && roles.includes('support')) &&
          <Aux>
            <Header as="h4">
            Offering Details
            </Header>
            <Form.Group widths="equal">
              {
                ['offeringUrl', 'offeringReferralCode'].map(field => (
                  <FormInput
                    name={field}
                    fielddata={OFFERING_DETAILS_FRM.fields[field]}
                    changed={(e, result) => formChange(e, result, formName)}
                  />
                ))
              }
            </Form.Group>
          </Aux>
          }
          <Header as="h4">
            {formName === 'LAUNCH_CONTITNGENCIES_FRM' ? 'Launch Contingencies' : 'Closing Contingencies'}
            {(roles && roles.includes('manager')) ?
              <Link onClick={() => this.setContingencyForm()} to={`${match.url}/add-new-contingency`} className="link"><small>+ Add {formName === 'LAUNCH_CONTITNGENCIES_FRM' ? 'Launch' : 'Closing'} Contingency</small></Link>
          :
          null}
          </Header>
          {
          form.fields.data.length > 0 ?
          form.fields.data.map((contingency, index) => (
            <div className="featured-section collapsed-checkbox">
              <Checkbox
                label={
                  <label>
                    <Header as="h4">
                      {contingency.name.value}
                      <Header.Subheader>
                        {contingency.acceptanceCriteria.value}
                      </Header.Subheader>
                    </Header>
                  </label>
                }
              />
              <div className="checkbox-description">
                {/* <p>
                  {contingency.comment.value}
                </p> */}
                <FormTextarea
                  fielddata={contingency.comment}
                  name="comment"
                  containerclassname="secondary"
                  changed={(e, result) => formChangeWithIndex(e, result, formName, index)}
                />
                {(roles && roles.includes('manager')) ?
                  <Button.Group compact size="small">
                    <Button inverted color="blue" content="Edit" />
                    <Button color="red" content="Delete" />
                    {/* <Button as="span" className="time-stamp">
                  <Icon className="ns-check-circle" color="green" />
                  Submited 2/16/18 by Aaron Adams</Button>
                  */}
                  </Button.Group> :
                  <Button.Group compact size="small">
                    <Button color="blue" content="Submit" />
                    {/* <Button as="span" className="time-stamp">
                    <Icon className="ns-check-circle" color="green" />
                    Submited 2/16/18 by Aaron Adams</Button>
                    */}
                  </Button.Group>
                }
              </div>
            </div>
          )) :
          <div className="featured-section collapsed-checkbox">
            No data found
          </div>
        }
        </Form>
      </Aux>
    );
  }
}
