import React, { Component } from 'react';
import { Card, Button, Form, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import beautify from 'json-beautify';
import { withRouter } from 'react-router-dom';
import { FormInput, MaskedInput } from '../../../../../../theme/form';

@inject('dataStore', 'uiStore')
@withRouter
@observer
export default class ImageProcessingRequest extends Component {
  componentWillMount() {
    this.setState({ result: '' });
    this.props.dataStore.resetForm('IMAGEPROCESSINGREQUES_FRM');
    this.props.dataStore.inProgress.imageProcessingRequest = false;
  }

  onSubmit = () => {
    this.props.dataStore.imageProcessingRequest().then((res) => {
      this.setState({ result: res });
    }).catch(() => {
      this.setState({ result: '' });
    });
  }

  render() {
    const { dataStore } = this.props;
    const {
      IMAGEPROCESSINGREQUES_FRM, formChange, inProgress, formDataChange,
    } = dataStore;
    return (
      <Card fluid className="elastic-search">
        <Card.Content header="Image Processing Request" />
        <Card.Content>
        <Header as="h6">Note: Below form submited without filling any data, then the action executes on root folder.</Header>
          <Card.Description>
            <Form onSubmit={this.onSubmit}>
              <Form.Group className="bottom-aligned">
              {['key', 'folderName'].map(field => (
                <FormInput
                  type="text"
                  name={field}
                  showerror
                  fielddata={IMAGEPROCESSINGREQUES_FRM.fields[field]}
                  changed={(e, result) => formChange(e, result, 'IMAGEPROCESSINGREQUES_FRM')}
                  containerwidth="8"
                />
              ))
                }
                {['waitingTime', 'concurrency', 'queueLimit'].map(field => (
                  <MaskedInput
                    key={field}
                    name={field}
                    allowNegative={false}
                    label={IMAGEPROCESSINGREQUES_FRM.fields[field].label}
                    number
                    containerwidth="8"
                    showerror
                    fielddata={IMAGEPROCESSINGREQUES_FRM.fields[field]}
                    changed={(e, result) => formDataChange(e, result, 'IMAGEPROCESSINGREQUES_FRM', 'mask')}
                    disabled={inProgress.imageProcessingRequest}
                  />
                ))
                }
                <Form.Field width={16}>
                  <Button primary content="Submit" loading={inProgress.imageProcessingRequest} />
                </Form.Field>
              </Form.Group>
            </Form>
            {this.state.result
              ? (
                <>
                  <b>Result:</b>
                  <p className="break-text">{beautify(this.state.result)}</p>
                </>
              )
              : ''}
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
