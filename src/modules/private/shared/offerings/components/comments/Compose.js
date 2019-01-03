import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { Form, Button } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../theme/form';

@inject('messageStore')
@observer
export default class Compose extends Component {
  componentWillMount() {
    this.reset();
  }
  send = scope => this.props.messageStore.createNewComment(scope);
  reset = () => this.props.messageStore.resetMessageForm();
  render() {
    const { isIssuer, messageStore } = this.props;
    const {
      MESSAGE_FRM, msgEleChange, buttonLoader, editScope, editMessageId, threadMainMessage,
    } = messageStore;
    const scope = get(threadMainMessage && threadMainMessage.length && threadMainMessage[0], 'scope') || null;
    const isPublic = scope === 'PUBLIC' || (threadMainMessage && threadMainMessage.length === 0);
    const isPrivate = scope === 'NEXTSEED';
    return (
      <div className="message-footer">
        <Form>
          <FormTextarea
            clear
            name="comment"
            fielddata={MESSAGE_FRM.fields.comment}
            changed={msgEleChange}
          />
          <div>
            {editMessageId ?
              <Button.Group compact vertical size="small">
                <Button loading={buttonLoader === editScope} onClick={() => this.send(editScope)} disabled={!MESSAGE_FRM.meta.isValid} primary content="Update" />
                <Button onClick={this.reset} inverted color="red" content="Cancel" />
              </Button.Group>
            :
            isIssuer ?
              <Button.Group compact vertical size="small">
                {!isPrivate &&
                <Button loading={buttonLoader === 'ISSUER'} onClick={() => this.send('ISSUER')} disabled={!MESSAGE_FRM.meta.isValid} content="Note to NS" secondary />
                }
                {isPublic &&
                <Button loading={buttonLoader === 'PUBLIC'} onClick={() => this.send('PUBLIC')} disabled={!MESSAGE_FRM.meta.isValid} primary content="Submit for Review" />
                }
              </Button.Group>
              :
              <Button.Group compact vertical size="small">
                <Button loading={buttonLoader === 'NEXTSEED'} onClick={() => this.send('NEXTSEED')} disabled={!MESSAGE_FRM.meta.isValid} color="orange" content="Note to NS" />
                {!isPrivate &&
                <Button loading={buttonLoader === 'ISSUER'} onClick={() => this.send('ISSUER')} disabled={!MESSAGE_FRM.meta.isValid} secondary content="Note to Issuer" />
                }
                {isPublic &&
                <Button loading={buttonLoader === 'PUBLIC'} onClick={() => this.send('PUBLIC')} disabled={!MESSAGE_FRM.meta.isValid} primary content="Publish to Public" />
                }
              </Button.Group>
            }
          </div>
        </Form>
      </div>
    );
  }
}
