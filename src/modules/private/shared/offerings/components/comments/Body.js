import React from 'react';
import moment from 'moment';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Label, Item, Header, Icon } from 'semantic-ui-react';
import { InlineLoader, UserAvatar } from '../../../../../../theme/shared';
import { OFFERING_COMMENTS_SCOPE } from '../../../../../../constants/offering';

const D_FORMAT = 'MMMM D, YYYY';
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
  date, scope, isIssuer, approved, showApproval,
}) => (
  <Item.Extra>
    <span className="time-stamp">{date}</span>
    {scope === 'PUBLIC' && approved ?
      <Label basic size="small" className="approve">
        Approved
        <Icon className="ns-check-circle" color="green" />
      </Label>
    : (scope === 'PUBLIC' && !approved) ? showApproval ? <Label circular basic size="mini" color="green">Approval Pending</Label> : null
    : <Label circular size="mini" color={OFFERING_COMMENTS_SCOPE[scope].color}>{scope === 'ISSUER' ? isIssuer ? OFFERING_COMMENTS_SCOPE[scope].titleI : OFFERING_COMMENTS_SCOPE[scope].title : OFFERING_COMMENTS_SCOPE[scope].title}</Label>
    }
  </Item.Extra>
);

const Body = props => (
  <div className="message-body">
    <Item.Group className="messages comments">
      {props.thread && props.thread.length ?
        props.thread.map((msg, index) => {
          const date = msg.updated ? msg.updated.date : msg.created.date;
          const lastThreadDate = index > 0 && props.thread[index - 1] &&
          props.thread[index - 1].updated ? props.thread[index - 1].updated.date :
            props.thread[index - 1] && props.thread[index - 1].created.date;
          const d2 = moment(date).format(D_FORMAT);
          const d1 = index ? moment(lastThreadDate).format(D_FORMAT) :
          moment(date).subtract(1, 'day');
          const diff = moment(d2, D_FORMAT).diff(moment(d1, D_FORMAT), 'days');
          const msgDate = moment(date).format('LL');
          const userFullName = msg.createdUserInfo.info && `${msg.createdUserInfo.info.firstName} ${msg.createdUserInfo.info.lastName}`;
          const userInfo = {
            firstName: msg.createdUserInfo.info.firstName,
            lastName: msg.createdUserInfo.info.lastName,
            avatarUrl: (msg.createdUserInfo.info && msg.createdUserInfo.info.avatar) ?
            msg.createdUserInfo.info.avatar.url : null,
            roles: [msg.createdUserInfo.roles.name],
          };
          const classes = msg.scope === 'NEXTSEED' ? 'private' : (msg.scope === 'PUBLIC' && msg.approved ? 'approved' : ((msg.scope === 'PUBLIC' && !msg.approved && !props.isIssuer && msg.createdUserInfo.id === props.currentOfferingIssuerId) || (msg.scope === 'PUBLIC' && !msg.approved && props.isIssuer)) ? 'approval-pending' : msg.scope === 'ISSUER' ? 'note-comment' : '');
          return ((props.isIssuer && msg.scope === 'NEXTSEED') ? false : msg.createdUserInfo.id !== props.currentUserId ? (
            <Aux>
              <Item className={`${d2} in ${d1} ${diff}`}>
                <UserAvatar size="mini" UserInfo={userInfo} />
                <MsgContent
                  classes={classes}
                  body={msg.comment}
                  extra={
                    <Aux>
                      <Header as="h6">{userFullName}</Header>
                      <Extra
                        showApproval={!props.isIssuer &&
                          msg.createdUserInfo.id === props.currentOfferingIssuerId}
                        approved={msg.approved}
                        isIssuer={props.isIssuer}
                        date={msgDate}
                        scope={msg.scope}
                      />
                    </Aux>
                  }
                  edit={
                    <div className="comment-actions">
                      {msg.scope === 'PUBLIC' && !props.isIssuer && msg.createdUserInfo.id === props.currentOfferingIssuerId && !msg.approved ?
                        <Aux>
                          <Link to="/" className="link" onClick={e => props.commentEditHandler(e, msg.id, msg.comment, msg.scope)}>Edit</Link>{' | '}
                          <Link to="/" className="link" loading={props.buttonLoader === msg.id} onClick={e => props.approveComment(e, msg.id)}>Approve</Link>{' | '}
                        </Aux>
                      : msg.scope === 'PUBLIC' && !props.isIssuer && msg.createdUserInfo.id === props.currentOfferingIssuerId && msg.approved &&
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
              <Item className={`${d2} sent ${d1} ${diff}`}>
                <MsgContent
                  classes={classes}
                  body={msg.comment}
                  extra={
                    <Aux>
                      <Header as="h6">{userFullName}</Header>
                      <Extra
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
                      <Link to="/" className="link" onClick={e => props.commentEditHandler(e, msg.id, msg.comment)}>Edit</Link>
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
