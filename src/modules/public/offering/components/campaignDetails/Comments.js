import React, { Component } from 'react';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Button, Comment, Form, Segment, Header, Label, Divider } from 'semantic-ui-react';
import { Link, Route, Switch } from 'react-router-dom';
import moment from 'moment';
import CommentsReplyModal from './CommentsReplyModal';
import CommunityGuideline from './CommunityGuideline';
import { FormTextarea } from '../../../../../theme/form';

const isMobile = document.documentElement.clientWidth < 768;
const isTablet = document.documentElement.clientWidth < 991;

@inject('campaignStore', 'authStore', 'uiStore', 'userStore', 'userDetailsStore', 'navStore', 'messageStore')
@observer
class Comments extends Component {
  state={
    readMore: false, readMoreInner: false, visible: false, commentId: null,
  }
  componentWillMount() {
    this.props.messageStore.resetMessageForm();
  }
  componentDidMount() {
    const sel = 'anchor-scroll';
    document.querySelector(`.${sel}`).scrollIntoView(true);
  }
  postNewComment = () => {
    const { isUserLoggedIn } = this.props.authStore;
    if (!isUserLoggedIn) {
      this.props.uiStore.setRedirectURL(this.props.history.location);
      this.props.uiStore.setAuthRef(this.props.refLink);
      this.props.history.push('/auth/login');
    } else {
      this.props.history.push(`${this.props.match.url}/postComment/NEW`);
    }
  }
  handleLogin = (e) => {
    e.preventDefault();
    const { isUserLoggedIn } = this.props.authStore;
    const { currentUser } = this.props.userStore;
    if (!isUserLoggedIn) {
      this.props.uiStore.setAuthRef(`${this.props.refLink}/comments`);
      this.props.uiStore.setRedirectURL({ pathname: `${this.props.refLink}/comments` });
      this.props.history.push('/auth/login');
    } else if (!(isUserLoggedIn && currentUser.roles.includes('investor'))) {
      this.props.history.push(`${this.props.refLink}/confirm-comment-login`);
    }
  }
  send = (scope, campaignSlug, currentMessage) => {
    this.props.messageStore.createNewComment(scope, campaignSlug, currentMessage);
  }
  toggleVisibility = (comment = null) => {
    if (!this.state.visible) {
      this.setState({ visible: true });
    }
    this.setState({ commentId: comment });
  }
  closeTextBox = (commentId) => {
    if (this.state.visible && commentId === this.state.commentId) {
      this.setState({ visible: false });
    }
  }
  readMore = (e, field, id) => { e.preventDefault(); this.setState({ [field]: id }); }
  render() {
    const { visible } = this.state;
    const { isUserLoggedIn } = this.props.authStore;
    const loginOrSignup = this.props.navStore.stepInRoute;
    const { currentUser } = this.props.userStore;
    const { activeAccounts } = this.props.userDetailsStore.signupStatus;
    const loggedInAsInvestor = isUserLoggedIn && currentUser.roles.includes('investor');
    const accountStatusFull = activeAccounts && activeAccounts.length;
    const isRightToPostComment = isUserLoggedIn && (currentUser.roles.includes('investor') && activeAccounts && activeAccounts.length);
    const readMoreLength = 50;
    const { campaign } = this.props.campaignStore;
    const comments = campaign && campaign.comments;
    const campaignId = campaign && campaign.id;
    const campaignSlug = campaign && campaign.offeringSlug;
    const issuerId = campaign && campaign.issuerId;
    const {
      MESSAGE_FRM, msgEleChange, buttonLoader,
    } = this.props.messageStore;
    this.props.messageStore.setDataValue('currentOfferingId', campaignId);
    return (
      <div className="campaign-content-wrapper">
        <Header as="h3" className="mt-10 mb-30 anchor-wrap">
          Comments
          <span className="anchor-scroll" />
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
        <p>See our <Link to={`${this.props.match.url}/community-guidelines`}>community guidelines</Link> on posting.</p>
        <p>
          If you have any technical questions or questions about NextSeed, please
          email <a href="mailto:support@nextseed.com">support@nextseed.com</a>.
        </p>
        {!isRightToPostComment ?
          <section className="center-align mt-30">
            {loggedInAsInvestor && !accountStatusFull ?
              <p>In order to leave comments, please create any type of account first.</p>
                : <p>In order to leave comments, please sign up and verify your identity.</p>
                }
            <Form reply className="public-form clearfix">
              {loggedInAsInvestor && !accountStatusFull ?
                <Link to="/app/summary" className="ui button secondary">Finish Account Setup</Link>
                  : <Link onClick={e => this.handleLogin(e, true)} to="/" className="ui button secondary">{get(loginOrSignup, 'title')}</Link>
                  }
            </Form>
          </section>
              :
          <Aux>
            <Form className="public-form mt-30 clearfix" reply>
              <FormTextarea
                fielddata={MESSAGE_FRM.fields.comment}
                name="comment"
                changed={msgEleChange}
                containerclassname="secondary"
              />
              <Button size={isMobile && 'mini'} fluid={isTablet} floated="right" loading={buttonLoader === 'PUBLIC'} onClick={() => this.send('PUBLIC', campaignSlug, null)} disabled={!MESSAGE_FRM.meta.isValid} secondary compact content="Post Comment" />
            </Form>
          </Aux>
        }
        {comments && comments.length ?
          <Aux>
            <Segment color="green" className="mt-50 offering-comment">
              {comments &&
                comments.map(c => (((c.createdUserInfo && c.createdUserInfo.id === issuerId
                  && c.approved) ||
                  (c.createdUserInfo && c.createdUserInfo.id !== issuerId)) && c.scope === 'PUBLIC' && (
                    <Comment.Group minimal>
                      <Comment key={c.id} className={`${c.createdUserInfo && c.createdUserInfo.id === issuerId ? 'issuer-comm ent' : ''}`}>
                        <Comment.Content>
                          <Comment.Author>
                            {(c.createdUserInfo && c.createdUserInfo.id === issuerId) ? get(campaign, 'keyTerms.shorthandBusinessName') : get(c, 'createdUserInfo.info.firstName')}
                            {(c.createdUserInfo && c.createdUserInfo.id === issuerId) && <Label color="blue" size="mini">ISSUER</Label>}
                          </Comment.Author>
                          <Comment.Metadata className="text-uppercase"><span className="time-stamp">{moment(get(c, 'updated') ? get(c, 'updated.date') : get(c, 'created.date')).format('ll')}</span></Comment.Metadata>
                          {isUserLoggedIn &&
                          <Comment.Actions>
                            <Comment.Action onClick={() => this.toggleVisibility(c.id)}>
                              Reply
                            </Comment.Action>
                          </Comment.Actions>
                          }
                          <Comment.Text className="mt-20">
                            {this.state.readMore === c.id ?
                            c.comment : c.comment.substr(0, readMoreLength)}
                            {(c.comment.length > readMoreLength) && <Link to="/" onClick={e => this.readMore(e, 'readMore', this.state.readMore !== c.id ? c.id : false)}> {this.state.readMore !== c.id ? '...ReadMore' : 'ReadLess'}</Link>}
                          </Comment.Text>
                          {visible && c.id === this.state.commentId ? (
                            <Aux>
                              <Form className="public-form mt-30" reply>
                                <FormTextarea
                                  fielddata={MESSAGE_FRM.fields.comment}
                                  name="comment"
                                  changed={msgEleChange}
                                  containerclassname="secondary"
                                />
                                <Button size={isMobile && 'mini'} onClick={() => this.closeTextBox(c.id)}>
                                  Cancel Reply
                                </Button>
                                <Button size={isMobile && 'mini'} floated="right" loading={buttonLoader === 'PUBLIC'} onClick={() => this.send('PUBLIC', campaignSlug, c.id)} disabled={!MESSAGE_FRM.meta.isValid} secondary content="Post Comment" />
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
                            </Aux>
                          ) : ''}
                        </Comment.Content>
                        {c.threadComment.length !== 0 &&
                        <Comment.Group className="reply-comments">
                          {c.threadComment &&
                          c.threadComment.map(tc =>
                            ((tc.createdUserInfo && tc.createdUserInfo.id === issuerId
                            && tc.approved) ||
                            (tc.createdUserInfo && tc.createdUserInfo.id !== issuerId)) && tc.scope === 'PUBLIC' && (
                            <Comment key={tc.id} className={`${tc.createdUserInfo && tc.createdUserInfo.id === issuerId ? 'issuer-comment' : ''}`}>
                              <Comment.Content>
                                <Comment.Author>
                                  {(tc.createdUserInfo && tc.createdUserInfo.id === issuerId) ? get(campaign, 'keyTerms.shorthandBusinessName') : get(tc, 'createdUserInfo.info.firstName')}
                                  {(tc.createdUserInfo && tc.createdUserInfo.id === issuerId) && <Label color="blue" size="mini">ISSUER</Label>}
                                </Comment.Author>
                                <Comment.Metadata className="text-uppercase"><span className="time-stamp">{moment(get(tc, 'updated') ? get(tc, 'updated.date') : get(tc, 'created.date')).format('ll')}</span></Comment.Metadata>
                                {isUserLoggedIn &&
                                <Comment.Actions>
                                  <Comment.Action
                                    onClick={() => this.toggleVisibility(tc.id)}
                                    className="grey-header"
                                  >
                                    Reply
                                  </Comment.Action>
                                </Comment.Actions>
                                }
                                <Comment.Text className="mt-20">
                                  {this.state.readMoreInner === tc.id ?
                                  tc.comment : tc.comment.length > readMoreLength ? `${tc.comment.substr(0, readMoreLength)}...` : tc.comment.substr(0, readMoreLength)}{' '}
                                  {(tc.comment.length > readMoreLength) && <Link to="/" onClick={e => this.readMore(e, 'readMoreInner', this.state.readMoreInner !== tc.id ? tc.id : false)}>{this.state.readMoreInner !== tc.id ? 'read more' : 'read less'}</Link>}
                                </Comment.Text>
                                {visible && tc.id === this.state.commentId ? (
                                  <Aux>
                                    <Form className="public-form mt-30" reply>
                                      <FormTextarea
                                        fielddata={MESSAGE_FRM.fields.comment}
                                        name="comment"
                                        changed={msgEleChange}
                                        containerclassname="secondary"
                                      />
                                      <Button size={isMobile && 'mini'} onClick={() => this.closeTextBox(tc.id)}>
                                        Cancel Reply
                                      </Button>
                                      <Button size={isMobile && 'mini'} floated="right" loading={buttonLoader === 'PUBLIC'} onClick={() => this.send('PUBLIC', campaignSlug, c.id)} disabled={!MESSAGE_FRM.meta.isValid} secondary content="Post Comment" />
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
                                  </Aux>
                                ) : ''}
                              </Comment.Content>
                            </Comment>
                          ))}
                        </Comment.Group>
                        }
                      </Comment>
                    </Comment.Group>
                )))
              }
            </Segment>
          </Aux>
          :
          <Segment color="green" className="mt-50 offering-comment">
            <section className="center-align mt-80 mb-80">
              <Header as="h3" className="grey-header">No Comments</Header>
            </section>
          </Segment>
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
