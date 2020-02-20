import React, { Component } from 'react';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Button, Comment, Form, Segment, Header, Label, Divider, Message } from 'semantic-ui-react';
import { Link, Route, Switch, withRouter } from 'react-router-dom';
import CommentsReplyModal from './CommentsReplyModal';
import CommunityGuideline from './CommunityGuideline';
import { FormTextarea } from '../../../../../theme/form';
import HtmlEditor from '../../../../shared/HtmlEditor';
import { ListErrors } from '../../../../../theme/shared';
import { DataFormatter } from '../../../../../helper';

const isMobile = document.documentElement.clientWidth < 768;

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

  componentDidMount() {
    if (!this.props.newLayout && !isMobile) {
      const sel = 'anchor';
      document.querySelector(`.${sel}`).scrollIntoView(true);
    }
  }

  postNewComment = () => {
    const { isUserLoggedIn } = this.props.authStore;
    if (!isUserLoggedIn) {
      this.props.uiStore.setRedirectURL(this.props.history.location);
      this.props.uiStore.setAuthRef(this.props.refLink);
      this.props.history.push('/login');
    } else {
      this.props.history.push(`${this.props.match.url}/postComment/NEW`);
    }
  }

  handleLogin = (e) => {
    e.preventDefault();
    const { isUserLoggedIn } = this.props.authStore;
    const { currentUser } = this.props.userStore;
    if (!isUserLoggedIn) {
      this.props.uiStore.setAuthRef(`${this.props.refLink}${this.props.newLayout ? '' : '/comments'}`);
      this.props.uiStore.setRedirectURL({ pathname: `${this.props.refLink}${this.props.newLayout ? '' : '/comments'}` });
      this.props.history.push('/login');
    } else if (!(isUserLoggedIn && currentUser.roles.includes('investor'))) {
      this.props.history.push(`${this.props.refLink}/confirm-comment-login`);
    }
  }

  send = (scope, campaignSlug, currentMessage, campaignId) => {
    this.props.messageStore.createNewComment(scope, campaignSlug, currentMessage, campaignId);
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
  }

  readMore = (e, field, id) => { e.preventDefault(); this.setState({ [field]: id }); }

  render() {
    //  props destructuring
    const { visible, visiblePost } = this.state;
    const { isInvestorAccreditated, userAccreditationStatus } = this.props.userDetailsStore;
    const { isUserLoggedIn } = this.props.authStore;
    const { currentUser } = this.props.userStore;
    const { errors } = this.props.uiStore;
    const { activeAccounts, frozenAccounts } = this.props.userDetailsStore.signupStatus;
    const { MESSAGE_FRM, msgEleChange, buttonLoader } = this.props.messageStore;
    const { showOnlyOne, newLayout } = this.props;
    const { campaign, commentsMainThreadCount } = this.props.campaignStore;
    const { stepInRoute } = this.props.navStore;
    //  user & campaign status
    const loginOrSignup = stepInRoute;
    const loggedInAsInvestor = isUserLoggedIn && currentUser.roles.includes('investor');
    const accountStatusFull = activeAccounts.length;
    const canPostComment = loggedInAsInvestor && accountStatusFull;
    const campaignStage = get(campaign, 'stage');
    const accreditationStatus = ['REQUESTED', 'CONFIRMED', 'EXPIRED'].includes(userAccreditationStatus.accreditation);
    const passedProcessingDate = DataFormatter.getDateDifferenceInHoursOrMinutes(get(campaign, 'closureSummary.processingDate'), true, true).value <= 0;
    const disablePostComment = passedProcessingDate || !['CREATION', 'LIVE', 'LOCK', 'PROCESSING'].includes(campaignStage) || !accountStatusFull || frozenAccounts.length;
    //  comments & campaign data
    const campaignId = campaign && campaign.id;
    const campaignSlug = campaign && campaign.offeringSlug;
    const issuerId = campaign && campaign.issuerId;
    let comments = campaign && campaign.comments;
    comments = showOnlyOne ? [get(commentsMainThreadCount, '[0]')] : comments;
    this.props.messageStore.setDataValue('currentOfferingId', campaignId);
    const offeringRegulation = get(campaign, 'keyTerms.regulation');
    const readMoreLength = 250;
    return (
      <div className={newLayout ? '' : 'campaign-content-wrapper'}>
        <Header as="h3" className={`${(newLayout && isMobile) ? 'mt-40 mb-20' : newLayout ? 'mt-40 mb-30' : 'mt-20 mb-30'} anchor-wrap`}>
          Comments
          <span className="anchor" id="comments" />
        </Header>
        {
          // !showOnlyOne
          // && (
            <>
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
              <p>See our <Link to={`${this.props.match.url}/community-guidelines`}>community guidelines</Link> on posting.</p>
              <p>
                If you have any technical questions or questions about NextSeed, please
          email <a href="mailto:support@nextseed.com">support@nextseed.com</a>.
        </p>
            </>
          // )
          }
        {!canPostComment && !frozenAccounts.length
          ? (
            <section className={`${newLayout && isMobile ? 'custom-segment mt-0' : newLayout ? 'custom-segment mb-0' : 'mt-30'} center-align`}>
              {loggedInAsInvestor && !accountStatusFull
                ? (['BD_506C', 'BD_506B'].includes(offeringRegulation) && !isInvestorAccreditated.status)
                  ? <p>In order to leave a comment, please complete your account setup and verify your status as an accredited investor.</p>
                  : <p>In order to leave a comment, please complete your account setup.</p>
                : (['BD_506C', 'BD_506B'].includes(offeringRegulation) && !isInvestorAccreditated.status)
                  ? <p>In order to leave a comment, please {get(loginOrSignup, 'word')} and verify your status as an <br />accredited investor.</p>
                  : <p>In order to leave comments, please {get(loginOrSignup, 'word')} and verify your identity.</p>
              }
              <Form reply className="public-form clearfix">
                {loggedInAsInvestor && !accountStatusFull
                  ? <Link to="/dashboard/setup" className="ui button primary">Complete Account Setup</Link>
                  : <Link onClick={e => this.handleLogin(e, true)} to="/" className="ui button primary">{get(loginOrSignup, 'title')}</Link>
                }
              </Form>
            </section>
          )
          : (['BD_506C', 'BD_506B'].includes(offeringRegulation) && !isInvestorAccreditated.status)
            ? (accreditationStatus === 'REQUESTED')
                ? (
                  <section className={`${newLayout && isMobile ? 'custom-segment mt-0' : newLayout ? 'custom-segment mb-0' : 'mt-30'} center-align`}>
                    <p>In order to leave a comment, please complete verification of your status as an accredited investor.</p>
                  </section>
                  )
                : (
                  <section className={`${newLayout && isMobile ? 'custom-segment mt-0' : newLayout ? 'custom-segment mb-0' : 'mt-30'} center-align`}>
                    <p>In order to leave a comment, please complete verification of your status as an accredited investor.</p>
                    <Form reply className="public-form clearfix">
                      <Link to="/dashboard/account-settings/investment-limits/" className="ui button primary">Verify Status</Link>
                    </Form>
                  </section>
                  )
            : (!disablePostComment)
            && (
              <>
                {visiblePost
                  ? (
                    <Form className="public-form mt-30 clearfix" reply>
                      <FormTextarea
                        fielddata={MESSAGE_FRM.fields.comment}
                        name="comment"
                        changed={msgEleChange}
                        containerclassname="secondary"
                      />
                      <Button fluid={isMobile} loading={buttonLoader === 'PUBLIC'} onClick={() => this.send('PUBLIC', campaignSlug, null, campaignId)} disabled={!MESSAGE_FRM.meta.isValid || buttonLoader === 'PUBLIC'} primary content="Post Comment" />
                  </Form>
                  ) : ''
                }
              </>
            )
        }
        {errors
          && (
            <Message error className="mt-30">
              <ListErrors errors={errors.message ? [errors.message] : [errors]} />
            </Message>
          )
        }
        {(comments && commentsMainThreadCount.length)
          ? (
            <>
              <div color="green" className={`${newLayout ? 'mt-30' : 'mt-50'} offering-comment`}>
                {comments
                  && comments.map(c => (((c.createdUserInfo && c.createdUserInfo.id === issuerId
                    && c.approved)
                    || (c.createdUserInfo && c.createdUserInfo.id !== issuerId)) && c.scope === 'PUBLIC' && (
                      <Comment.Group minimal>
                        <Comment key={c.id} className={`${((get(c, 'createdUserInfo.id') === issuerId) || get(c, 'createdUserInfo.roles[0].name') === 'admin') ? 'issuer-co mment' : ''}`}>
                          <Comment.Content>
                            <Comment.Author>
                              {(get(c, 'createdUserInfo.id') === issuerId) ? get(campaign, 'keyTerms.shorthandBusinessName') : get(c, 'createdUserInfo.roles[0].name') === 'admin' ? 'NextSeed' : get(c, 'createdUserInfo.info.firstName')}
                              {((get(c, 'createdUserInfo.id') === issuerId) || get(c, 'createdUserInfo.roles[0].name') === 'admin') && <Label color={(get(c, 'createdUserInfo.id') === issuerId) ? 'green' : 'blue'} size="mini">{(get(c, 'createdUserInfo.id') === issuerId) ? 'ISSUER' : 'ADMIN'}</Label>}
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
                                      <Comment key={tc.id} className={`${((get(tc, 'createdUserInfo.id') === issuerId) || get(tc, 'createdUserInfo.roles[0].name') === 'admin') ? 'issuer-comment' : ''}`}>
                                        <Comment.Content>
                                          <Comment.Author>
                                            {(get(tc, 'createdUserInfo.id') === issuerId) ? get(campaign, 'keyTerms.shorthandBusinessName') : get(tc, 'createdUserInfo.roles[0].name') === 'admin' ? 'NextSeed' : get(tc, 'createdUserInfo.info.firstName')}
                                            {((get(tc, 'createdUserInfo.id') === issuerId) || get(tc, 'createdUserInfo.roles[0].name') === 'admin') && <Label color={(get(tc, 'createdUserInfo.id') === issuerId) ? 'green' : 'black'} size="mini">{(get(tc, 'createdUserInfo.id') === issuerId) ? 'ISSUER' : 'NEXTSEED'}</Label>}
                                          </Comment.Author>
                                          <Comment.Metadata><span className="time-stamp">{DataFormatter.getDateAsPerTimeZone(get(tc, 'updated') ? get(tc, 'updated.date') : get(tc, 'created.date'), true, true)}</span></Comment.Metadata>
                                          {/* {isUserLoggedIn && !disablePostComment && !showOnlyOne
                                            && (
                                              <Comment.Actions>
                                                <Comment.Action
                                                  onClick={() => this.toggleVisibility(tc.id)}
                                                  className="grey-header"
                                                >
                                                  Reply
                                                </Comment.Action>
                                              </Comment.Actions>
                                            )
                                          } */}
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
                                            <>
                                              <Form className="public-form mt-30" reply>
                                                <FormTextarea
                                                  fielddata={MESSAGE_FRM.fields.comment}
                                                  name="comment"
                                                  changed={msgEleChange}
                                                  containerclassname="secondary"
                                                />
                                              </Form>
                                              <Divider hidden />
                                              <p>
                                                Note that both NextSeed and issuers are notified of all
                                                comments immediately, but there may be a slight delay in
                                                response to questions submitted outside of standard
                                                business hours (9am to 5pm CST, Monday through Friday).Most
                                                questions will be answered by issuers in approximately two
                                                business days, although some questions require more thorough
                                                analyses and will take additional time.
                                    </p>
                                              <p>See our <Link to={`${this.props.match.url}/community-guidelines`}>community guidelines</Link> on posting. If you have any technical questions or questions about NextSeed,{' '}
                                                please email <a href="mailto:support@nextseed.com">support@nextseed.com</a>.
                                    </p>
                                            </>
                                          ) : ''}
                                        </Comment.Content>
                                      </Comment>
                                    ))}
                              </Comment.Group>
                            )
                          }
                          <Comment.Content>
                            {isUserLoggedIn && !disablePostComment && c.id !== this.state.commentId
                              && (
                                <Button className="mt-30" disabled={visible} fluid={isMobile} inverted color="green" onClick={() => this.toggleVisibility(c.id)} content="Reply" />
                              )
                            }
                            {visible && c.id === this.state.commentId ? (
                              <>
                                <Form className="public-form mt-30" reply>
                                  <FormTextarea
                                    fielddata={MESSAGE_FRM.fields.comment}
                                    name="comment"
                                    changed={msgEleChange}
                                    containerclassname="secondary"
                                    placeholder="Write a reply..."
                                  />
                                  {/* <Button size={isMobile && 'mini'} onClick={() => this.closeTextBox(c.id)} disabled={buttonLoader === 'PUBLIC'}>
                                    Cancel Reply
                                </Button> */}
                                  <Button fluid={isMobile} loading={buttonLoader === 'PUBLIC'} onClick={() => this.send('PUBLIC', campaignSlug, c.id, campaignId)} disabled={!MESSAGE_FRM.meta.isValid || buttonLoader === 'PUBLIC'} primary content="Post Comment" />
                                </Form>
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
                                <p>See our <Link to={`${this.props.match.url}/community-guidelines`}>community guidelines</Link> on posting. If you have any technical questions or questions about NextSeed,{' '}
                                  please email <a href="mailto:support@nextseed.com">support@nextseed.com</a>.
                              </p>
                              </>
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
          <Route exact path={`${this.props.match.url}/community-guidelines`} render={props => <CommunityGuideline refLink={this.props.match.url} {...props} />} />
          <Route path={`${this.props.match.url}/:id/:messageType?`} render={props => <CommentsReplyModal campaignSlug={campaignSlug} campaignId={campaignId} issuerId={issuerId} refLink={this.props.match.url} {...props} />} />
        </Switch>
      </div>
    );
  }
}

export default Comments;
