import React from 'react';
import { List, Item, Label, Button } from 'semantic-ui-react';
import { get } from 'lodash';
import { DateTimeFormat, UserAvatar } from '../../../../../../theme/shared';

const MessagesList = props => (
  <List divided selection relaxed="very" verticalAlign="middle">
    {
      props.messages.map(msg => ((props.isIssuer && msg.scope !== 'NEXTSEED') || (!props.isIssuer)) && (
        <List.Item
          onClick={() => props.messageSelectHandler(msg.id)}
          key={msg.id}
          className={props.currentMessageId === msg.id ? 'active' : ''}
        >
          {props.threadUsersList(msg.threadComments).length === 0 && !props.isIssuer &&
            <Item.Extra>
              <Label size="mini" color="red" horizontal circular>Response Needed</Label>
            </Item.Extra>
          }
          <div className="ui image">
            {props.threadUsersList(msg.threadComments).length === 1 &&
              <UserAvatar
                size="mini"
                UserInfo={{
                  firstName: get(msg, 'createdUserInfo.info.firstName'),
                  lastName: get(msg, 'createdUserInfo.info.lastName'),
                  avatarUrl: (get(msg, 'createdUserInfo.info.avatar.url') || null),
                  roles: [get(msg, 'createdUserInfo.roles.name')],
                }}
              />
            }
            {props.threadUsersList(msg.threadComments).length ?
            props.threadUsersList(msg.threadComments).map(u => (
              <UserAvatar
                size="mini"
                UserInfo={{
                  firstName: get(u, 'createdUserInfo.info.firstName'),
                  lastName: get(u, 'createdUserInfo.info.lastName'),
                  avatarUrl: (get(u, 'createdUserInfo.info.avatar.url') || null),
                  roles: [get(u, 'createdUserInfo.roles.name')],
                }}
              />
            )) :
            <UserAvatar
              size="mini"
              UserInfo={{
                firstName: get(msg, 'createdUserInfo.info.firstName'),
                lastName: get(msg, 'createdUserInfo.info.lastName'),
                avatarUrl: (get(msg, 'createdUserInfo.info.avatar.url') || null),
                roles: [get(msg, 'createdUserInfo.roles.name')],
              }}
            />
          }
          </div>
          <List.Content>
            <List.Header as="h5">{props.threadUsersList(msg.threadComments).length ? (props.threadUsersList(msg.threadComments).map(u => (u.createdUserInfo.info && `${u.createdUserInfo.info.firstName}`))).join(', ') : msg.createdUserInfo.info && `${msg.createdUserInfo.info.firstName}`}</List.Header>
          </List.Content>
          <List.Content>
            <List.Header><DateTimeFormat format="ll" datetime={msg.created.date} /></List.Header>
            <List.Description>{msg.comment.substr(0, 40)}</List.Description>
          </List.Content>
        </List.Item>
      ))
    }
    {props.messages.length ?
      <div className="sticky-wrap">
        <Button color="blue" size="small" className="link-button" content="Post new Comment" onClick={props.newPostComment} />
      </div> : null
    }
  </List>
);

export default MessagesList;
