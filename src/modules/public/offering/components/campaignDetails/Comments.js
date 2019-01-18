import React, { Component } from 'react';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Button, Comment, Form, Segment, Header, Label } from 'semantic-ui-react';
import { Link, Route, Switch } from 'react-router-dom';
import moment from 'moment';
import CommentsReplyModal from './CommentsReplyModal';
import CommunityGuideline from './CommunityGuideline';
import { FormTextarea } from '../../../../../theme/form';

// const isMobile = document.documentElement.clientWidth < 768;

@inject('campaignStore', 'authStore', 'uiStore', 'userStore', 'userDetailsStore', 'navStore', 'messageStore')
@observer
class Comments extends Component {
  state={ readMore: false, readMoreInner: false }
  componentWillMount() {
    this.props.messageStore.resetMessageForm();
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
  send = (scope, campaignSlug) => {
    this.props.messageStore.createNewComment(scope, campaignSlug);
  }
  readMore = (e, field, id) => { e.preventDefault(); this.setState({ [field]: id }); }
  render() {
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
    // this.props.messageStore.setDataValue('currentMessageId',
    // !this.props.match.params.messageType ? this.props.match.params.id : null);
    this.props.messageStore.setDataValue('currentOfferingId', campaignId);
    return (
      <div className="campaign-content-wrapper">
        <Header as="h3" className="mb-30">Comments</Header>
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
        {comments && comments.length ?
          <Aux>
            {!isRightToPostComment ?
              <section className="bg-offwhite center-align mt-30">
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
                  {/* <Button onClick={this.handleClose}>Cancel</Button> */}
                  <Button floated="right" loading={buttonLoader === 'PUBLIC'} onClick={() => this.send('PUBLIC', campaignSlug)} disabled={!MESSAGE_FRM.meta.isValid} secondary compact content="Post Comment" />
                </Form>
                {/* <Form reply className="public-form clearfix">
                  <Button primary onClick={this.postNewComment}>
                    Post Comment
                  </Button>
                </Form> */}
              </Aux>
            }
            {comments &&
              comments.map(c => (((c.createdUserInfo && c.createdUserInfo.id === issuerId
                && c.approved) ||
                (c.createdUserInfo && c.createdUserInfo.id !== issuerId)) && c.scope === 'PUBLIC' && (
                <Segment color="green" className="mt-50 offering-comment">
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
                          <Comment.Action as={Link} to={`${this.props.match.url}/${c.id}`} >Reply</Comment.Action>
                        </Comment.Actions>
                        }
                        <Comment.Text className="mt-20">
                          {this.state.readMore === c.id ?
                          c.comment : c.comment.substr(0, readMoreLength)}
                          {(c.comment.length > readMoreLength) && <Link to="/" onClick={e => this.readMore(e, 'readMore', this.state.readMore !== c.id ? c.id : false)}> {this.state.readMore !== c.id ? '...ReadMore' : 'ReadLess'}</Link>}
                        </Comment.Text>
                      </Comment.Content>
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
                              <Comment.Text className="mt-20">
                                {this.state.readMoreInner === tc.id ?
                                tc.comment : tc.comment.substr(0, readMoreLength)}
                                {(tc.comment.length > readMoreLength) && <Link to="/" onClick={e => this.readMore(e, 'readMoreInner', this.state.readMoreInner !== tc.id ? tc.id : false)}> {this.state.readMoreInner !== tc.id ? '...Read More' : 'Read Less'}</Link>}
                              </Comment.Text>
                            </Comment.Content>
                          </Comment>
                        ))}
                      </Comment.Group>
                    </Comment>
                  </Comment.Group>
                </Segment>
              )))
            }
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
