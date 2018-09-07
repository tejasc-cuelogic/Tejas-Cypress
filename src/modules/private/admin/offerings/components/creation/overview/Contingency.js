/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { observer, inject } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Header, Checkbox, Button, label } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';

@withRouter
@inject('offeringCreationStore')
@observer
export default class Contingency extends Component {
  setContingencyForm = () => {
    const { formName, offeringCreationStore } = this.props;
    offeringCreationStore.setContingencyFormSelected(formName);
  }
  render() {
    const {
      form,
      formName,
      formChangeWithIndex,
      match,
    } = this.props;
    return (
      <Aux>
        <Header as="h4">
          {formName === 'LAUNCH_CONTITNGENCIES_FRM' ? 'Launch Contingencies' : 'Closing Contingencies'}
          <Link onClick={() => this.setContingencyForm()} to={`${match.url}/add-new-contingency`} className="link"><small>+ Add {formName === 'LAUNCH_CONTITNGENCIES_FRM' ? 'Launch' : 'Closing'} Contingency</small></Link>
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
                <Button.Group compact size="small">
                  <Button inverted color="blue" content="Edit" />
                  <Button color="red" content="Delete" />
                  {/* <Button as="span" className="time-stamp">
                  <Icon className="ns-check-circle" color="green" />
                  Submited 2/16/18 by Aaron Adams</Button>
                  */}
                </Button.Group>
              </div>
            </div>
          )) : 'No data found'
        }
      </Aux>
    );
  }
}
