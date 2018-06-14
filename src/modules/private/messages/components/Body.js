import React from 'react';
import { Label, Item } from 'semantic-ui-react';
import ProfilePicTemp from '../../../../assets/images/james-wright.png';

const Avatar = () => <Item.Image size="mini" avatar src={ProfilePicTemp} />;
const MsgContent = ({ body }) => (
  <Item.Content>
    <Item.Description>
      <p>{body}</p>
    </Item.Description>
  </Item.Content>
);
const Extra = ({ sent, read }) => (
  <Item.Extra>
    {!sent && read === '1' &&
      <Label size="mini" color="red">New</Label>
    }
    <span className="time-stamp">3:43 PM</span>
  </Item.Extra>
);
// const dateSeparator = () => <Item className="date-stamp">April 7, 2018</Item>;

const Body = props => (
  <div className="message-body">
    <Item.Group className="messages">
      {
        props.thread.map(msg => (msg.messageDetails.from !== props.current ? (
          <Item>
            <Avatar />
            <MsgContent body={msg.body} />
            <Extra />
          </Item>
        ) : (
          <Item className="sent">
            <Extra sent read={msg.messageDetails.read} />
            <MsgContent body={msg.body} />
            <Avatar />
          </Item>
        )))
      }
    </Item.Group>
  </div>
);

export default Body;
