import React from 'react';
import { List, Image, Item, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import ProfilePicTemp from '../../../../assets/images/james-wright.png';
import DateTimeFormat from '../../../../theme/common/DateTimeFormat';

const MessagesList = props => (
  <List divided selection relaxed="very" verticalAlign="middle">
    {
      props.messages.map(msg => (
        <List.Item
          as={Link}
          to={`${props.match.url}/${msg.id}`}
          key={msg.id}
          className={props.message.id === msg.id ? 'active' : ''}
        >
          <Item.Extra>
            <Label size="mini" color="red" horizontal>New</Label>
            <DateTimeFormat fromNow datetime={msg.updatedAt} />
          </Item.Extra>
          <Image avatar src={ProfilePicTemp} />
          <List.Content>
            <List.Header as="h4">Sarah Gainsborough</List.Header>
          </List.Content>
          <List.Content>
            <List.Header>{msg.subject}</List.Header>
            <List.Description>{msg.body}</List.Description>
          </List.Content>
        </List.Item>
      ))
    }
  </List>
);

export default MessagesList;
