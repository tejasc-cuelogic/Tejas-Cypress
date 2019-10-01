import React, { Component } from 'react';
// import { get } from 'lodash';
import { Card, Button, Form, Grid, Divider, Confirm } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { FormDropDown } from '../../../../../../theme/form';
import DynamicFormInput from './dynamicFormInput';
// FormTextarea

@inject('factoryStore')
@withRouter
@observer
export default class RequestFactory extends Component {
  // state = {
  //   formData: {},
  // };

  constructor(props) {
    super(props);
    this.props.factoryStore.resetForm('REQUESTFACTORY_FRM');
    this.props.factoryStore.inProgress.requestFactory = false;
  }

  onSubmit = () => {
    this.props.factoryStore.requestFactoryPluginTrigger();
  }

  addMore = (e, formName, arrayName) => {
    e.preventDefault();
    this.props.factoryStore.addMore(formName, arrayName);
  }

  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.factoryStore.toggleConfirmModal(index, formName);
  }

  removeData = (confirmModalName, arrayName = 'payload') => {
    this.props.factoryStore.removeData(confirmModalName, arrayName);
  }

  handlePluginChange = (e, resp) => {
    e.preventDefault();
    // const { createDynamicFormFields } = this.props.factoryStore;
    console.log(resp.fielddata);
    console.log(resp.fielddata.values);
    console.log(resp.fielddata.values.pluginInput);
    // const pluginInputArr = get(resp, 'fielddata.values.pluginInput');
    // createDynamicFormFields(resp.fielddata.values.pluginInput);
  }

  // selectInput = (e, resp) => {
  //   e.preventDefault();
  //   console.log(resp);
  // }

  render() {
    const { factoryStore } = this.props;
    const {
      REQUESTFACTORY_FRM, formChange, inProgress,
      confirmModal, confirmModalName, removeIndex,
    } = factoryStore;
    return (
      <Card fluid className="elastic-search">
        <Card.Content header="Trigger Request Factory Plugin" />
        <Card.Content>
          <Card.Description>
            <Form onSubmit={this.onSubmit}>
              <Form.Group>
                <Grid className="full-width mlr-0" stackable>
                  <Grid.Column width={8}>
                    <FormDropDown
                      fielddata={REQUESTFACTORY_FRM.fields.plugin}
                      selection
                      containerclassname="dropdown-field mlr-0"
                      options={REQUESTFACTORY_FRM.fields.plugin.values}
                      placeholder="Choose here"
                      name="plugin"
                      // onChange={"(e, result) => formChange(e, result, 'REQUESTFACTORY_FRM'); (e, resp) => this.handlePluginChange(e, resp)"}
                      onChange={(e, result) => formChange(e, result, 'REQUESTFACTORY_FRM')}
                    />
                    <FormDropDown
                      fielddata={REQUESTFACTORY_FRM.fields.invocationType}
                      selection
                      containerclassname="dropdown-field mlr-0"
                      options={REQUESTFACTORY_FRM.fields.invocationType.values}
                      placeholder="Choose here"
                      name="invocationType"
                      onChange={(e, result) => formChange(e, result, 'REQUESTFACTORY_FRM')}
                    />
                    <Divider section hidden />
                    <Button className="mt-80 ml-10" primary content="Submit" disabled={inProgress.requestFactory || !REQUESTFACTORY_FRM.meta.isValid} loading={inProgress.requestFactory} />
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <DynamicFormInput {...this.props} />
                    {/* <FormTextarea
                      name="payload"
                      fielddata={REQUESTFACTORY_FRM.fields.payload}
                      changed={(e, result) => formChange(e, result, 'REQUESTFACTORY_FRM')}
                      containerclassname="secondary huge"
                    /> */}
                  </Grid.Column>
                </Grid>
              </Form.Group>
            </Form>
            <Confirm
              header="Confirm"
              content={`Are you sure you want to remove this parameter ${removeIndex + 1}?`}
              open={confirmModal}
              onCancel={this.toggleConfirmModal}
              onConfirm={() => this.removeData(confirmModalName, 'payload')}
              size="mini"
              className="deletion"
            />
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
