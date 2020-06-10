import React, { Component } from 'react';
import { get } from 'lodash';
import { Card, Button, Form, Grid, Divider } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import formHOC from '../../../../../../theme/form/formHOC';
import DynamicFormInput from './dynamicFormInput';
import ShowResponseModal from './showResponseModal';


const metaInfo = {
  store: 'factoryStore',
  form: 'REQUESTFACTORY_FRM',
};

@withRouter
@observer
class RequestFactory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prev: false,
      visibleProp: false,
    };
    this.props.factoryStore.resetForm('REQUESTFACTORY_FRM');
    this.props.factoryStore.setFieldValue('DYNAMCI_PAYLOAD_FRM', {}, 'REQUESTFACTORY');
    this.props.factoryStore.setFieldValue('inProgress', false, 'requestFactory');
    this.props.factoryStore.setFieldValue('factoryResponse', {});
    this.props.factoryStore.setFieldValue('REQUESTFACTORY_FRM', 'RequestResponse', 'fields.invocationType.value');
  }

  onSubmit = () => {
    this.props.factoryStore.requestFactoryPluginTrigger().then(() => {
      this.setState({ visibleProp: true });
    });
  }

  handleCloseModel = (e, val) => {
    e.preventDefault();
    this.setState({ prev: val });
    this.setState({ visibleProp: val });
    this.props.factoryStore.setFieldValue('factoryResponse', {});
  }

  showModel = (e, val) => {
    e.preventDefault();
    this.setState({ prev: val });
  }

  render() {
    const { factoryStore, smartElement } = this.props;
    const {
      REQUESTFACTORY_FRM, factoryResponse, formChangeForPlugin, pluginObj, inProgress, DYNAMCI_PAYLOAD_FRM, currentPluginSelected,
    } = factoryStore;
    return (
      <>
        <ShowResponseModal open={this.state.prev} factoryResponse={factoryResponse} handleCloseModel={this.handleCloseModel} />
        <Card fluid className="elastic-search">
          <Card.Content header="Trigger Request Factory Plugin" />
          <Card.Content>
            <Card.Description>
              <Form onSubmit={this.onSubmit}>
                <Form.Group>
                  <Grid className="full-width mlr-0" stackable>
                    <Grid.Column width={8}>
                      {['plugin', 'invocationType'].map(field => (
                        smartElement.FormDropDown(field, {
                          onChange: (e, result) => formChangeForPlugin(e, result, 'REQUESTFACTORY_FRM'),
                          containerclassname: 'dropdown-field mlr-0',
                          containerwidth: 16,
                          placeholder: 'Choose here',
                          search: true,
                          options: REQUESTFACTORY_FRM.fields[field].values,
                        })
                      ))}
                      <Divider section hidden />
                      <Button className="mt-80 ml-10" primary content="Submit" disabled={inProgress.requestFactory || !REQUESTFACTORY_FRM.meta.isValid || !get(DYNAMCI_PAYLOAD_FRM, 'REQUESTFACTORY.meta.isValid')} loading={inProgress.requestFactory} />
                      {this.state.visibleProp && <Link as={Button} className="mt-80 ml-10 ui button inverted green" to="/" onClick={e => this.showModel(e, true)} title="Show Response"> Show Response </Link>}

                    </Grid.Column>
                    <Grid.Column width={8}>
                      <DynamicFormInput {...this.props} listType="adminListRequestPlugins" pluginObj={pluginObj} formPayload={DYNAMCI_PAYLOAD_FRM.REQUESTFACTORY} formObj={{ parentForm: 'DYNAMCI_PAYLOAD_FRM', childForm: 'REQUESTFACTORY' }} selectedPlugin={currentPluginSelected} />
                    </Grid.Column>
                  </Grid>
                </Form.Group>
              </Form>
            </Card.Description>
          </Card.Content>
        </Card>
      </>
    );
  }
}

export default formHOC(RequestFactory, metaInfo);
