/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { toJS } from 'mobx';
import { withRouter, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider, Button } from 'semantic-ui-react';
import { FormInput, MaskedInput, FormDropDown } from '../../../../../../../theme/form';
import { InlineLoader } from '../../../../../../../theme/shared';
import OtherInformation from './OtherInformation';

@inject('userDetailsStore', 'userStore', 'uiStore')
@withRouter
@observer
export default class Admin extends Component {
  componentWillMount() {
    this.props.userDetailsStore.setFormData('USER_BASIC', false);
  }
  toggleDisplayMode = (val) => {
    this.props.userDetailsStore.setFieldValue('displayMode', val);
  }
  updateUserData = (e) => {
    e.preventDefault();
    this.props.userDetailsStore.updateUserBasicInfo().then(() => {
      this.toggleDisplayMode(true);
    });
  }
  render() {
    const {
      USER_BASIC, formChange, displayMode, maskChange, userEleChange, detailsOfUser,
    } = this.props.userDetailsStore;
    const formName = 'USER_BASIC';
    const { capabilitiesMeta } = this.props.userStore;
    const { inProgress } = this.props.uiStore;
    const details = toJS({ ...detailsOfUser.data.user });
    if (inProgress) {
      return (<InlineLoader />);
    }
    return (
      <Form>
        <Header as="h4">
          User{"'"}s profile data
        </Header>
        <Header as="h6">
          Personal info
          {displayMode ?
            <Link to={`${this.props.match.url}`} className="link pull-right regular-text" onClick={() => this.toggleDisplayMode(false)}><small>Edit information</small></Link>
            :
            <Button.Group floated="right" size="mini" compact>
              <Button as={Link} content="Cancel" to={`${this.props.match.url}`} onClick={() => this.toggleDisplayMode(true)} />
              <Button
                primary
                onClick={this.updateUserData}
                // disabled={!USER_BASIC.meta.isValid} // temporary disabled
              >
                Update
              </Button>
            </Button.Group>
          }
        </Header>
        <Form.Group widths={4}>
          {
          ['firstName', 'lastName'].map(field => (
            <FormInput
              key={field}
              name={field}
              fielddata={USER_BASIC.fields[field]}
              changed={(e, result) => formChange(e, result, formName)}
              displayMode={displayMode}
            />
          ))
          }
          <MaskedInput
            key="number"
            name="number"
            fielddata={USER_BASIC.fields.number}
            changed={(values, field) => maskChange(values, formName, field)}
            // changed={(values, name) => formChange(values, formName, name)}
            phoneNumber
            format="(###) ###-####"
            displayMode={displayMode}
          />
          <FormInput
            key="address"
            name="address"
            fielddata={USER_BASIC.fields.address}
            changed={(e, result) => formChange(e, result, formName)}
            displayMode={displayMode}
          />
        </Form.Group>
        <Divider />
        <Header as="h6">Role and Capabilities</Header>
        <Form.Group widths={2}>
          <Form.Input fluid label="Role" placeholder="Address" value="Admin" readOnly className="display-only" />
          <div className="field display-only">
            <label>Capabilities</label>
            {displayMode ?
              <div className="ui fluid input">
                {USER_BASIC.fields.capabilities.value.join(', ')}
              </div> :
              <FormDropDown
                name="capabilities"
                fielddata={USER_BASIC.fields.capabilities}
                options={capabilitiesMeta}
                search
                multiple
                selection
                fluid
                containerclassname="dropdown-field"
                onChange={(e, res) => userEleChange(e, res, 'dropdown')}
              />
            }
          </div>
        </Form.Group>
        <Divider />
        <OtherInformation details={details} />
        <Divider />
      </Form>
    );
  }
}
