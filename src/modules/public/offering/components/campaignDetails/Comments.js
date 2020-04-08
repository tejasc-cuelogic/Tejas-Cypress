import React, { Component } from 'react';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Button, Comment, Form, Segment, Header, Label, Divider, Message } from 'semantic-ui-react';
import { Link, Route, Switch, withRouter } from 'react-router-dom';
import CommentsReplyModal from './CommentsReplyModal';
import CommunityGuideline from './CommunityGuideline';
import HtmlEditor from '../../../../shared/HtmlEditor';
import { FormTextarea } from '../../../../../theme/form';
import { ListErrors } from '../../../../../theme/shared';
import { DataFormatter } from '../../../../../helper';

const readMoreLength = 250;

const CommentHeader = ({ newLayout, refLink, isMobile }) => (
  <>
    <Header as="h3" className={`${(newLayout && isMobile) ? 'mt-40 mb-20' : newLayout ? 'mt-40 mb-30' : 'mt-20 mb-30'} anchor-wrap`}>
      Comments
      <span className="anchor" id="comments" />
    </Header>
    <p>
      Note that both NextSeed and issuers are notified of all comments immediately,
      but there may be a slight delay in response to questions submitted outside of
      standard business hours (9am to 5pm CST, Monday through Friday).
      </p>
    <p>
      Most questions will be answered by issuers in approximately two business days,
      although some questions require more thorough analyses and will take additional
      time.
      </p>
    <p>See our <Link to={`${refLink}/community-guidelines`}>community guidelines</Link> on posting.</p>
    {/* <p>
      If you have any technical questions or questions about NextSeed, please
        email <a href="mailto:support@nextseed.com">support@nextseed.com</a>.
        </p> */}
  </>
);

const ReplyBox = ({ MESSAGE_FRM, msgEleChange, buttonLoader, isFormValid, btnHandler, showButton, showCopy, match, errors, isMobile, showCancelButton, closeBtnHandler, visiblePost }) => (
  <>
    <Form className="public-form mt-30 clearfix" reply>
      <FormTextarea
        clear
        fielddata={visiblePost && MESSAGE_FRM.fields.comment}
        name="comment"
        changed={msgEleChange}
        containerclassname="secondary"
        disabled={!(visiblePost)}
      />
      {showButton
        && <Button fluid={isMobile} loading={buttonLoader === 'PUBLIC'} onClick={btnHandler} disabled={!isFormValid || buttonLoader === 'PUBLIC' || !(visiblePost)} primary content="Post Comment" />}
      {showCancelButton
        && <Button fluid={isMobile} className={isMobile && 'mlr-0 mt-20 mb-30'} onClick={closeBtnHandler} disabled={buttonLoader === 'PUBLIC'} basic>Cancel</Button>}
    </Form>
    {errors
      && (
        <Message error className="mt-30">
          <ListErrors errors={errors.message ? [errors.message] : [errors]} />
        </Message>
      )
    }
    {showCopy
      && (
        <>
          <Divider hidden />
          <p>
            Note that both NextSeed and issuers are notified of all comments
            immediately, but there may be a slight delay in response to
            questions submitted outside of standard business hours (9am to
            5pm CST, Monday through Friday).Most questions will be answered
            by issuers in approximately two business days, although some
            questions require more thorough analyses and will take additional
            time.
          </p>
          <p>See our <Link to={`${match.url}/community-guidelines`}>community guidelines</Link> on posting. If you have any technical questions or questions about NextSeed,{' '}
            please email <a href="mailto:support@nextseed.com">support@nextseed.com</a>.
          </p>
        </>
      )
    }
  </>
);

// TODO: create a HOC for NsOvserverComponent
@inject('campaignStore', 'authStore', 'uiStore', 'userStore', 'userDetailsStore', 'navStore', 'messageStore')
@withRouter
@observer
class Comments extends Component {
  state = {
    readMore: false, readMoreInner: false, visible: false, commentId: null, visiblePost: true,
  }

  constructor(props) {
    super(props);
    this.props.messageStore.resetMessageForm();
  }

  handleLogin = (e) => {
    e.preventDefault();
    const { isUserLoggedIn } = this.props.authStore;
    const { currentUser } = this.props.userStore;
    if (!isUserLoggedIn) {
      this.props.uiStore.setAuthRef(`${this.props.refLink}${this.props.newLayout ? '#comments' : '/comments'}`);
      this.props.uiStore.setRedirectURL({ pathname: `${this.props.refLink}${this.props.newLayout ? '#comments' : '/comments'}` });
      this.props.history.push('/login');
    } else if (!(isUserLoggedIn && currentUser.roles.includes('investor'))) {
      this.props.history.push(`${this.props.refLink}/confirm-comment-login`);
    }
  }

  send = async (scope, campaignSlug, currentMessage, campaignId) => {
    const response = await this.props.messageStore.createNewComment(scope, campaignSlug, currentMessage, campaignId);
    if (response) {
      if (currentMessage) {
        this.closeTextBox(currentMessage);
      } else {
        this.props.messageStore.resetMessageForm();
      }
    }
  }

  toggleVisibility = (comment = null) => {
    this.props.messageStore.resetCommentField();
    if (!this.state.visible) {
      this.setState({ visible: true });
      this.setState({ visiblePost: false });
    }
    if (this.state.visiblePost) {
      this.setState({ visiblePost: false });
    }
    this.setState({ commentId: comment });
  }

  closeTextBox = (commentId) => {
    if (this.state.visible && commentId === this.state.commentId) {
      this.setState({ visible: false });
      this.props.messageStore.resetCommentField();
    }
    if (!this.state.visiblePost) {
      this.setState({ visiblePost: true });
    }
    this.setState({ commentId: null });
  }

  readMore = (e, field, id) => { e.preventDefault(); this.setState({ [field]: id }); }

  render() {
    const { visible, visiblePost } = this.state;
    const { showOnlyOne, newLayout, messageStore, campaignStore, uiStore, match } = this.props;
    const { errors, responsiveVars } = uiStore;
    const { isMobile } = responsiveVars;
    const { MESSAGE_FRM, msgEleChange, buttonLoader } = messageStore;
    const { campaign, commentsMainThreadCount, campaignCommentsMeta, isPostedNewComment } = campaignStore;

    const campaignId = get(campaign, 'id');
    const campaignSlug = get(campaign, 'offeringSlug');
    const issuerId = get(campaign, 'issuerId');
    let comments = get(campaign, 'comments');
    comments = showOnlyOne ? isPostedNewComment ? [get(comments, '[0]')] : [get(commentsMainThreadCount, '[0]')] : comments;
    messageStore.setDataValue('currentOfferingId', campaignId);
    const isNsAdmin = comment => get(comment, 'createdUserInfo.roles[0].name') === 'admin';
    const isIssuerComment = comment => get(comment, 'createdUserInfo.id') === issuerId;

    return (
      <div className={newLayout ? '' : 'campaign-content-wrapper'}>
        <CommentHeader refLink={match.url} newLayout={newLayout} isMobile={isMobile} />
        {/* action will trigger requirements users need to filfill prior to posting a comment:
            Log In, Verify Accreidted Status, Complete Account Setup (pass CIP), or if CIP Failed, FULL status on User */}
        {campaignCommentsMeta.action
          && (
            <section className={`${newLayout && isMobile ? 'custom-segment mt-0' : newLayout ? 'custom-segment mb-0' : 'mt-30'} center-align`}>
              {campaignCommentsMeta.content}
              {campaignCommentsMeta.action(this.handleLogin)}
            </section>
          )}
        {(campaignCommentsMeta.isValid)
          && (
            <ReplyBox
              MESSAGE_FRM={MESSAGE_FRM}
              msgEleChange={msgEleChange}
              buttonLoader={buttonLoader}
              isFormValid={MESSAGE_FRM.meta.isValid}
              showButton
              btnHandler={() => this.send('PUBLIC', campaignSlug, null, campaignId)}
              errors={errors}
              isMobile={isMobile}
              visiblePost={visiblePost}
            />
          )
        }
        {(comments && commentsMainThreadCount.length) || (isPostedNewComment && comments.length)
          ? (
            <>
              <div color="green" className={`${newLayout ? 'mt-30' : 'mt-50'} offering-comment`}>
                {comments
                  && comments.map(c => (((c.createdUserInfo && c.createdUserInfo.id === issuerId
                    && c.approved)
                    || (c.createdUserInfo && c.createdUserInfo.id !== issuerId)) && c.scope === 'PUBLIC' && (
                      <Comment.Group minimal key={`cG-${c.id}`}>
                        <Comment key={c.id} className={`${((isIssuerComment(c)) || isNsAdmin(c)) ? 'issuer-co mment' : ''}`}>
                          <Comment.Content>
                            <Comment.Author>
                              {(isIssuerComment(c)) ? get(campaign, 'keyTerms.shorthandBusinessName') : isNsAdmin(c) ? 'NextSeed' : get(c, 'createdUserInfo.info.firstName')}
                              {((isIssuerComment(c)) || isNsAdmin(c)) && <Label color={(isIssuerComment(c)) ? 'green' : 'blue'} size="mini">{(isIssuerComment(c)) ? 'ISSUER' : 'ADMIN'}</Label>}
                            </Comment.Author>
                            <Comment.Metadata><span className="time-stamp">{DataFormatter.getDateAsPerTimeZone(get(c, 'updated') ? get(c, 'updated.date') : get(c, 'created.date'), true, true)}</span></Comment.Metadata>
                            <Comment.Text className="mt-20">
                              <HtmlEditor
                                readOnly
                                content={this.state.readMore === c.id
                                  ? c.comment : `${c.comment.substr(0, readMoreLength)} ${(this.state.readMoreInner !== c.id && (c.comment.length > readMoreLength)) ? '...' : ' '}`}
                              />
                              {(c.comment.length > readMoreLength)
                                && (
                                  <Link
                                    to="/"
                                    onClick={e => this.readMore(e, 'readMore', this.state.readMore !== c.id ? c.id : false)}
                                  >{this.state.readMore !== c.id ? 'read more' : 'read less'}
                                  </Link>
                                )}
                            </Comment.Text>
                          </Comment.Content>
                          {(c.threadComments && c.threadComments.length !== 0)
                            && (
                              <Comment.Group className="reply-comments">
                                {c.threadComments
                                  && c.threadComments.map(tc => ((tc.createdUserInfo && tc.createdUserInfo.id === issuerId
                                    && tc.approved)
                                    || (tc.createdUserInfo && tc.createdUserInfo.id !== issuerId)) && tc.scope === 'PUBLIC' && (
                                      <Comment key={tc.id} className={`${((isIssuerComment(tc)) || isNsAdmin(tc)) ? 'issuer-comment' : ''}`}>
                                        <Comment.Content>
                                          <Comment.Author>
                                            {(isIssuerComment(tc)) ? get(campaign, 'keyTerms.shorthandBusinessName') : isNsAdmin(tc) ? 'NextSeed' : get(tc, 'createdUserInfo.info.firstName')}
                                            {((isIssuerComment(tc)) || isNsAdmin(tc)) && <Label color={(isIssuerComment(tc)) ? 'green' : 'black'} size="mini">{(isIssuerComment(tc)) ? 'ISSUER' : 'NEXTSEED'}</Label>}
                                          </Comment.Author>
                                          <Comment.Metadata><span className="time-stamp">{DataFormatter.getDateAsPerTimeZone(get(tc, 'updated') ? get(tc, 'updated.date') : get(tc, 'created.date'), true, true)}</span></Comment.Metadata>
                                          <Comment.Text className="mt-20">
                                            <HtmlEditor
                                              readOnly
                                              content={this.state.readMoreInner === tc.id
                                                ? tc.comment : `${tc.comment.substr(0, readMoreLength)} ${(this.state.readMoreInner !== tc.id && (tc.comment.length > readMoreLength)) ? '...' : ' '}`}
                                            />
                                            {(tc.comment.length > readMoreLength)
                                              && (
                                                <Link
                                                  to="/"
                                                  onClick={e => this.readMore(e, 'readMoreInner', this.state.readMoreInner !== tc.id ? tc.id : false)}
                                                >{this.state.readMoreInner !== tc.id ? 'read more' : 'read less'}
                                                </Link>
                                              )}
                                          </Comment.Text>
                                          {visible && tc.id === this.state.commentId ? (
                                            <ReplyBox
                                              MESSAGE_FRM={MESSAGE_FRM}
                                              msgEleChange={msgEleChange}
                                              showCopy
                                              match={match}
                                              errors={errors}
                                              isMobile={isMobile}
                                            />
                                          ) : ''}
                                        </Comment.Content>
                                      </Comment>
                                    ))}
                              </Comment.Group>
                            )
                          }
                          <Comment.Content>
                            {campaignCommentsMeta.isValid && c.id !== this.state.commentId
                              && (
                                <Button className="mt-30" disabled={visible} fluid={isMobile} inverted color="green" onClick={() => this.toggleVisibility(c.id)} content="Reply" />
                              )
                            }
                            {visible && c.id === this.state.commentId ? (
                              <ReplyBox
                                MESSAGE_FRM={MESSAGE_FRM}
                                msgEleChange={msgEleChange}
                                buttonLoader={buttonLoader}
                                isFormValid={MESSAGE_FRM.meta.isValid}
                                showButton
                                match={match}
                                showCopy
                                btnHandler={() => this.send('PUBLIC', campaignSlug, c.id, campaignId)}
                                showCancelButton
                                closeBtnHandler={() => this.closeTextBox(c.id)}
                                errors={errors}
                                isMobile={isMobile}
                                visiblePost={visible && c.id === this.state.commentId}
                              />
                            ) : ''}
                          </Comment.Content>
                        </Comment>
                      </Comment.Group>
                    )))
                }
              </div>
            </>
          )
          : (
            <Segment color="green" className={`${newLayout ? 'mt-30' : 'mt-50'} offering-comment`}>
              <section className={`${isMobile ? 'mt-40 mb-40' : 'mt-80 mb-80'} center-align`}>
                <Header as="h3" className="grey-header">No Comments</Header>
              </section>
            </Segment>
          )
        }
        <Switch>
          <Route exact path={`${match.url}/community-guidelines`} render={props => <CommunityGuideline refLink={match.url} {...props} />} />
          <Route path={`${match.url}/:id/:messageType?`} render={props => <CommentsReplyModal c={campaignSlug} campaignId={campaignId} issuerId={issuerId} refLink={match.url} {...props} />} />
        </Switch>
      </div>
    );
  }
}

export default Comments;
