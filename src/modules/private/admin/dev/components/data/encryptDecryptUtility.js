import React, { Component } from 'react';
import { Card, Button, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { FormInput } from '../../../../../../theme/form';

@inject('dataStore')
@withRouter
@observer
export default class EncryptDecryptUtility extends Component {
  constructor(props) {
    super(props);
    this.state = { result: '' };
    this.props.dataStore.resetForm('ENCRYPTDECRYPTUTILITY_FRM');
  }

  onSubmit = (e, type) => {
    this.props.dataStore.encryptOrDecryptValue(type).then((res) => {
      this.setState({
        result: res,
      });
    }).catch(() => {
      this.setState({
        result: '',
      });
    });
  }

  render() {
    const { dataStore } = this.props;
    const {
      ENCRYPTDECRYPTUTILITY_FRM, formChange, inProgress,
    } = dataStore;
    return (
      <Card fluid className="elastic-search">
        <Card.Content header="Encrypt/Decrypt" />
        <Card.Content>
          <Form>
            <Form.Group className="bottom-aligned">
              {['userId', 'text'].map(field => (
                <FormInput
                  type="text"
                  key={field}
                  name={field}
                  containerwidth="8"
                  showerror
                  fielddata={ENCRYPTDECRYPTUTILITY_FRM.fields[field]}
                  changed={(e, result) => formChange(e, result, 'ENCRYPTDECRYPTUTILITY_FRM')}
                />
              ))
              }

              <Form.Field>
                <Button primary content="Encrypt" disabled={!ENCRYPTDECRYPTUTILITY_FRM.meta.isValid || inProgress.encryptOrDecryptValue} loading={inProgress.encryptOrDecryptValue === 'ENCRYPT'} onClick={e => this.onSubmit(e, 'ENCRYPT')} />
                <Button secondary content="Decrypt" disabled={!ENCRYPTDECRYPTUTILITY_FRM.meta.isValid || inProgress.encryptOrDecryptValue} loading={inProgress.encryptOrDecryptValue === 'DECRYPT'} onClick={e => this.onSubmit(e, 'DECRYPT')} />
              </Form.Field>
            </Form.Group>
            {this.state.result
              ? (
              <>
                <b>Result:</b>
                <p className="break-text">{this.state.result}</p>
              </>
              )
              : ''}
          </Form>
        </Card.Content>
      </Card>
    );
  }
}
