import React from 'react';
import { List, Item, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { DateTimeFormat } from '../../../../../theme/shared';
import NSImage from '../../../../shared/NSImage';

const MessagesList = props => (
  <List divided selection relaxed="very" verticalAlign="middle">
    {
      props.messages.map(msg => (
        <List.Item
          as={Link}
          to={`${props.match.url}/${msg.id}`}
          key={msg.id}
          className={props.current.id === msg.id ? 'active' : ''}
        >
          <Item.Extra>
            {msg.messageDetails.read === '1' &&
              <Label size="mini" color="red" horizontal>New</Label>
            }
            <DateTimeFormat fromNow datetime={msg.updatedAt} />
          </Item.Extra>
          <NSImage avatar path="james-wright.png" />
          <List.Content>
            <List.Header as="h5">Sarah Gainsborough</List.Header>
          </List.Content>
          <List.Content>
            <List.Header>{msg.subject}</List.Header>
            <List.Description>{msg.body.substr(0, 40)}</List.Description>
          </List.Content>
        </List.Item>
      ))
    }
  </List>
);

export default MessagesList;
