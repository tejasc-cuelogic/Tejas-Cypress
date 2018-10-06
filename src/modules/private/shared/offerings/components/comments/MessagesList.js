import React from 'react';
import { List, Image, Item, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import user1 from '../../../../../../assets/images/user1.jpg';
import user2 from '../../../../../../assets/images/user2.jpg';
import { DateTimeFormat } from '../../../../../../theme/shared';

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
              <Label size="mini" color="red" horizontal circular>Response Needed</Label>
            }
          </Item.Extra>
          <div className="ui image">
            <Image avatar src={user1} />
            <Image avatar src={user2} />
          </div>
          <List.Content>
            <List.Header as="h5">Mehul G, Loren C</List.Header>
          </List.Content>
          <List.Content>
            <List.Header><DateTimeFormat fromNow datetime={msg.updatedAt} /></List.Header>
            <List.Description>{msg.body.substr(0, 40)}</List.Description>
          </List.Content>
        </List.Item>
      ))
    }
  </List>
);

export default MessagesList;
