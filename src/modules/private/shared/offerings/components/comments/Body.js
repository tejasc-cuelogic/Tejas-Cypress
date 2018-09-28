import React from 'react';
import moment from 'moment';
import Aux from 'react-aux';
import { Label, Item } from 'semantic-ui-react';
import ProfilePicTemp from '../../../../../../assets/images/james-wright.png';

const D_FORMAT = 'MMMM D, YYYY';
const Avatar = () => <Item.Image size="mini" avatar src={ProfilePicTemp} />;
const MsgContent = ({ body, extra }) => (
  <Item.Content>
    {extra}
    <Item.Description><p>{body}</p></Item.Description>
  </Item.Content>
);
const Extra = ({ sent, read, time }) => (
  <Item.Extra>
    {!sent && read === '1' &&
      <Label size="mini" color="red">New</Label>
    }
    <span className="time-stamp">{time}</span>
  </Item.Extra>
);

const DateSeparator = ({ index, diff, date }) => (index === 0 || diff !== 0 ?
  <Item className="date-stamp">{date}</Item> :
  null);

const Body = props => (
  <div className="message-body">
    <Item.Group className="messages comments">
      {
        props.thread.map((msg, index) => {
          const d2 = moment(msg.updatedAt).format(D_FORMAT);
          const d1 = index ? moment(props.thread[index - 1].updatedAt).format(D_FORMAT) :
          moment(msg.updatedAt).subtract(1, 'day');
          const diff = moment(d2, D_FORMAT).diff(moment(d1, D_FORMAT), 'days');
          const time = moment(msg.updatedAt).format('h:mm A');
          return (msg.messageDetails.from !== props.current ? (
            <Aux>
              <DateSeparator index={index} diff={diff} date={d2} />
              <Item className={`${d2} in ${d1} ${diff}`}>
                <Avatar />
                <MsgContent
                  body={msg.body}
                  extra={<Extra time={time} />}
                />
              </Item>
            </Aux>
          ) : (
            <Aux>
              <DateSeparator index={index} diff={diff} date={d2} />
              <Item className={`${d2} sent ${d1} ${diff}`}>
                <MsgContent
                  body={msg.body}
                  extra={<Extra sent time={time} read={msg.messageDetails.read} />}
                />
                <Avatar />
              </Item>
            </Aux>
          ));
        })
      }
    </Item.Group>
  </div>
);

export default Body;
