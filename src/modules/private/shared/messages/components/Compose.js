import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../theme/form';

@inject('messageStore', 'uiStore')
@observer
export default class Compose extends Component {
  send = () => this.props.messageStore.send();

  render() {
    const { MESSAGE_FRM, msgEleChange } = this.props.messageStore;
    return (
      <div className="message-footer">
        <Form>
          <FormTextarea
            fielddata={MESSAGE_FRM.fields.body}
            name="body"
            changed={msgEleChange}
          />
          <div>
            <Button onClick={this.send} disabled={!MESSAGE_FRM.meta.isValid} primary content="Send" />
          </div>
        </Form>
      </div>
    );
  }
}
