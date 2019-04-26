import React from 'react';
import moment from 'moment';
import Aux from 'react-aux';
import { get } from 'lodash';
import Parser from 'html-react-parser';
import { Link } from 'react-router-dom';
import { Label, Item, Header, Icon } from 'semantic-ui-react';
import { InlineLoader, UserAvatar } from '../../../../../../theme/shared';
import { OFFERING_COMMENTS_SCOPE } from '../../../../../../constants/offering';

const MsgContent = ({
  body, extra, edit, classes,
}) => (
  <Item.Content className={classes}>
    {extra}
    <Item.Description><p>{body}</p></Item.Description>
    {edit}
  </Item.Content>
);
const Extra = ({
  date, scope, isIssuer, approved, showApproval, direction,
}) => (
  <Item.Extra>
    <span className="time-stamp">{date}</span>
    {scope === 'PUBLIC' && approved ?
      <Label basic size="small" className="approve">
        Approved
        <Icon className="ns-check-circle" color="green" />
      </Label>
    : (scope === 'PUBLIC' && !approved) ? showApproval ? <Label circular basic size="mini" color="green">Approval Pending</Label> : null
    : <Label circular size="mini" color={OFFERING_COMMENTS_SCOPE[scope].color}>{scope === 'ISSUER' ? isIssuer ? direction === 'to' ? OFFERING_COMMENTS_SCOPE[scope].titleITo : OFFERING_COMMENTS_SCOPE[scope].titleIFrom : direction === 'to' ? OFFERING_COMMENTS_SCOPE[scope].titleTo : OFFERING_COMMENTS_SCOPE[scope].titleFrom : OFFERING_COMMENTS_SCOPE[scope].title}</Label>
    }
  </Item.Extra>
);

const Body = props => (
  <div className="message-body">
    <Item.Group className="messages comments">
      {props.thread && props.thread.length ?
        props.thread.map((msg) => {
          const date = msg.updated ? msg.updated.date : msg.created.date;
          const msgDate = moment(date).format('ll');
          const userFullName = `${get(msg, 'createdUserInfo.info.firstName')} ${get(msg, 'createdUserInfo.info.lastName')}`;
          const userInfo = {
            firstName: get(msg, 'createdUserInfo.info.firstName'),
            lastName: get(msg, 'createdUserInfo.info.lastName'),
            avatarUrl: get(msg, 'createdUserInfo.info.avatar.url') || null,
            roles: [get(msg, 'createdUserInfo.roles[0].name')],
          };
          const classes = msg.scope === 'NEXTSEED' ? 'private' : (msg.scope === 'PUBLIC' && msg.approved ? 'approved' : ((msg.scope === 'PUBLIC' && !msg.approved && props.isIssuer && get(msg, 'createdUserInfo.id') === props.currentOfferingIssuerId) || (msg.scope === 'PUBLIC' && !props.isIssuer && get(msg, 'createdUserInfo.id') === props.currentOfferingIssuerId && !msg.approved)) ? 'approval-pending' : msg.scope === 'ISSUER' ? 'note-comment' : '');
          return (((props.isIssuer && msg.scope === 'NEXTSEED') || msg.isSample) ? false : get(msg, 'createdUserInfo.id') !== props.currentUserId ? (
            <Aux>
              <Item className="in">
                <UserAvatar size="mini" UserInfo={userInfo} />
                <MsgContent
                  classes={classes}
                  body={Parser(msg.comment)}
                  extra={
                    <Aux>
                      <Header as="h6">{userFullName}</Header>
                      <Extra
                        direction="from"
                        showApproval={!props.isIssuer &&
                          get(msg, 'createdUserInfo.id') === props.currentOfferingIssuerId}
                        approved={msg.approved}
                        isIssuer={props.isIssuer}
                        date={msgDate}
                        scope={msg.scope}
                      />
                    </Aux>
                  }
                  edit={
                    <div className="comment-actions">
                      {msg.scope === 'PUBLIC' && !props.isIssuer && get(msg, 'createdUserInfo.id') === props.currentOfferingIssuerId && !msg.approved ?
                        <Aux>
                          <Link to="/" className="link" onClick={e => props.commentEditHandler(e, msg.id, msg.comment, msg.scope)}>Edit</Link>{' | '}
                          <Link to="/" className="link" loading={props.buttonLoader === msg.id} onClick={e => props.approveComment(e, msg.id)}>Approve</Link>{' | '}
                        </Aux>
                      : msg.scope === 'PUBLIC' && !props.isIssuer && get(msg, 'createdUserInfo.id') === props.currentOfferingIssuerId && msg.approved &&
                      <Aux>
                        <Link to="/" className="link" onClick={e => props.commentEditHandler(e, msg.id, msg.comment, msg.scope)}>Edit</Link>{' | '}
                      </Aux>
                      }
                      {!props.isIssuer &&
                        <Link to="/" className="link negative-text" onClick={e => props.deleteCommentHandler(e, msg.id)}>Delete</Link>
                      }
                    </div>
                  }
                />
              </Item>
            </Aux>
          ) : (
            <Aux>
              <Item className="sent">
                <MsgContent
                  classes={classes}
                  body={Parser(msg.comment)}
                  extra={
                    <Aux>
                      <Header as="h6">{userFullName}</Header>
                      <Extra
                        direction="to"
                        showApproval={props.isIssuer}
                        approved={msg.approved}
                        isIssuer={props.isIssuer}
                        date={msgDate}
                        scope={msg.scope}
                      />
                    </Aux>
                  }
                  edit={
                    msg.scope === 'PUBLIC' && props.isIssuer && !msg.approved &&
                    <div className="comment-actions">
                      <Link to="/" className="link" onClick={e => props.commentEditHandler(e, msg.id, msg.comment, msg.scope)}>Edit</Link>
                      {!props.isIssuer &&
                      <Aux>{' | '}
                        <Link to="/" className="link negative-text" onClick={e => props.deleteCommentHandler(e, msg.id)}>Delete</Link>
                      </Aux>
                      }
                    </div>
                  }
                />
                <UserAvatar size="mini" UserInfo={userInfo} />
              </Item>
            </Aux>
          ));
        }) : <InlineLoader text="No data found." />
      }
    </Item.Group>
  </div>
);

export default Body;
