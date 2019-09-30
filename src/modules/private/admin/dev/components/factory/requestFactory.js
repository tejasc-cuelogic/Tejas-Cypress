import React, { Component } from 'react';
import { Card, Button, Form, Grid, Divider, Header, Icon, Confirm } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { FormDropDown, FormInput } from '../../../../../../theme/form';
// FormTextarea

@inject('factoryStore')
@withRouter
@observer
export default class RequestFactory extends Component {
  state = {
    open: false,
  };

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

  // selectInput = (e, resp) => {
  //   e.preventDefault();
  //   console.log(resp);
  // }

  render() {
    const { factoryStore } = this.props;
    const {
      REQUESTFACTORY_FRM, formChange, inProgress, formArrayChange,
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
                    {/* <FormTextarea
                      name="payload"
                      fielddata={REQUESTFACTORY_FRM.fields.payload}
                      changed={(e, result) => formChange(e, result, 'REQUESTFACTORY_FRM')}
                      containerclassname="secondary huge"
                    /> */}
                    <Header as="h4">
                      Payload
                      <Link to={this.props.match.url} className="link" onClick={e => this.addMore(e, 'REQUESTFACTORY_FRM', 'payload')}><small>+ Add payload parameters</small></Link>
                    </Header>
                    {
                      REQUESTFACTORY_FRM.fields.payload.map((exp, index2) => (
                        <>
                          <Header as="h6">
                            {`Parameter ${index2 + 1}`}
                            {REQUESTFACTORY_FRM.fields.payload.length > 1
                              && (
                                <Link to={this.props.match.url} className="link" onClick={e => this.toggleConfirmModal(e, index2, 'REQUESTFACTORY_FRM')}>
                                  <Icon className="ns-close-circle" color="grey" />
                                </Link>
                              )
                            }
                          </Header>
                          <div className="featured-section">
                            {/* <FormDropDown
                              fielddata={REQUESTFACTORY_FRM.fields.inputType}
                              selection
                              containerclassname="dropdown-field mlr-0"
                              options={REQUESTFACTORY_FRM.fields.inputType.values}
                              placeholder="Choose here"
                              name="inputType"
                              onChange={(e, result) => this.selectInput(e, result)}
                            /> */}
                            <Form.Group widths={2}>
                              {
                                ['key', 'value'].map(field => (
                                  <FormInput
                                    name={field}
                                    fielddata={exp[field]}
                                    changed={(e, result) => formArrayChange(e, result, 'REQUESTFACTORY_FRM', 'payload', index2, 0)}
                                  />
                                ))
                              }
                            </Form.Group>
                          </div>
                        </>
                      ))
                    }
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
