import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Item, Header, Label, Button, Icon } from 'semantic-ui-react';
import { FormTextarea } from '../../../../theme/form/FormElements';
import ProfilePicTemp from '../../../../assets/images/james-wright.png';

@inject('messageStore')
@observer
export default class MessagesWrap extends Component {
  componentWillMount() {
    this.props.messageStore.getMessageDetails(this.props.match.params.id);
  }
  render() {
    // const { match } = this.props;
    // const { messages, loading, error } = messageStore;
    return (
      <div className="message-wrap">
        <div className="message-head">
          <Button.Group className="pull-right">
            <Button icon className="link-button">
              <Icon className="ns-replay" flipped="horizontally" />
            </Button>
            <Button icon className="link-button">
              <Icon className="ns-trash" />
            </Button>
          </Button.Group>
          <Header as="h3">Business model</Header>
        </div>
        <div className="message-body">
          <Item.Group className="messages">
            <Item className="date-stamp">April 7, 2018</Item>
            <Item>
              <Item.Image size="mini" avatar src={ProfilePicTemp} />
              <Item.Content>
                <Item.Description>
                  <p>Hello,<br />
                    Lorem ipsum dolor sit amet leo. Donec non ligula eleifend pede bibendum
                    tempus. Nullam wisi semper risus. Ut rhoncus laoreet purus lacinia lacus.
                    Nulla ut tortor. Maecenas elit odio, in dui. Vivamus nec elementum diam
                    aliquet eget, dui. Mauris?
                  </p>
                  <p>Curae, Duis lobortis, mi ligula, elementum at, nibh. Duis non ligula
                    accumsan urna, id eros. In tristique senectus et ultrices posuere
                    cubilia Curae, Duis hendrerit sollicitudin.
                  </p>
                  <p>
                    Thanks,<br />
                    <b>Sarah Gainsborough</b>
                  </p>
                </Item.Description>
              </Item.Content>
              <Item.Extra>
                <Label size="mini" color="red">New</Label>
                <span className="time-stamp">3:43 PM</span>
              </Item.Extra>
            </Item>
            <Item className="sent">
              <Item.Extra>
                <span className="time-stamp">4:58 PM</span>
              </Item.Extra>
              <Item.Content>
                <Item.Description>
                  <p>Hello Sarah,<br />
                    Lorem ipsum dolor sit amet leo. Donec non ligula eleifend pede bibendum
                    tempus. Nullam wisi semper risus. Ut rhoncus laoreet purus lacinia lacus.
                    Nulla ut tortor. Maecenas elit odio, in dui. Vivamus nec elementum diam
                    aliquet eget, dui. Mauris?
                  </p>
                  <p>Curae, Duis lobortis, mi ligula, elementum at, nibh. Duis non ligula
                    accumsan urna, id eros. In tristique senectus et ultrices posuere
                    cubilia Curae, Duis hendrerit sollicitudin.
                  </p>
                  <p>
                    Thanks,<br />
                    <b>Isabel Ives</b>
                  </p>
                </Item.Description>
              </Item.Content>
              <Item.Image size="mini" avatar src={ProfilePicTemp} />
            </Item>
          </Item.Group>
        </div>
        <div className="message-footer">
          <Form>
            <FormTextarea
              fielddata={this.props.messageStore.MESSAGE_FRM.fields.messages}
              name="messages"
            />
            <div>
              <Button primary content="Send" />
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
