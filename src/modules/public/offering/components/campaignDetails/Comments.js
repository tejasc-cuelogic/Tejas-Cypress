import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Comment, Form, Grid, Segment, Header, Label, Divider } from 'semantic-ui-react';
import { Link, Route } from 'react-router-dom';
import moment from 'moment';
import CommentsReplyModal from './CommentsReplyModal';

const isMobile = document.documentElement.clientWidth < 768;

@inject('campaignStore', 'authStore', 'uiStore', 'userStore', 'userDetailsStore')
@observer
class Comments extends Component {
  state={ readMore: false, readMoreInner: false }
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
  readMore = (e, field, id) => { e.preventDefault(); this.setState({ [field]: id }); }
  render() {
    const { isUserLoggedIn } = this.props.authStore;
    const { currentUser } = this.props.userStore;
    const { activeAccounts } = this.props.userDetailsStore.signupStatus;
    const isRightToPostComment = isUserLoggedIn && (currentUser.roles.includes('investor') && activeAccounts && activeAccounts.length);
    const readMoreLength = 50;
    const { campaign } = this.props.campaignStore;
    const comments = campaign && campaign.comments;
    const campaignId = campaign && campaign.id;
    const issuerId = campaign && campaign.issuerId;
    return (
      <div className="campaign-content-wrapper">
        {comments && comments.length ?
          <Grid stackable reversed="computer">
            <Grid.Column computer={6} tablet={16} mobile={16}>
              <div className="sticy-sidebar comment-sidebar">
                <Segment padded>
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
                  <p>See our <Link to="/">community guidelines</Link> on posting.</p>
                  <p>
                    If you have any technical questions or questions about NextSeed, please
                    email <a href="mailto:support@nextseed.com">support@nextseed.com</a>.
                  </p>
                  {!isRightToPostComment ?
                    <section className="center-align mt-80 mb-80">
                      <p>In order to leave comments, please sign up and verify your identity.</p>
                      <Form reply className="public-form clearfix">
                        <Link to="/auth/register-investor" className="ui button secondary">Sign Up Now</Link>
                      </Form>
                    </section>
                    :
                    <section className="center-align mt-80 mb-80">
                      {!isMobile &&
                        <Header as="h4" className="mb-30">Post New Comment</Header>
                      }
                      <Form reply className="public-form clearfix">
                        <Button primary onClick={this.postNewComment}>
                          Post Comment
                        </Button>
                      </Form>
                    </section>
                  }
                </Segment>
              </div>
            </Grid.Column>
            <Grid.Column computer={10} tablet={16} mobile={16}>
              <Segment padded>
                <Comment.Group minimal>
                  {comments &&
                    comments.map(c => (
                      c.scope === 'PUBLIC' &&
                      <Comment>
                        <Comment.Content>
                          <Comment.Author>{c && c.createdUserInfo && c.createdUserInfo.info && `${c.createdUserInfo.info.firstName} ${c.createdUserInfo.info.firstName}`}</Comment.Author>
                          <Comment.Metadata className="text-uppercase"><span className="time-stamp">{moment(c && c.updated ? c.updated.date : c && c.created.date).format('LL')}</span></Comment.Metadata>
                          {isUserLoggedIn &&
                          <Comment.Actions>
                            <Comment.Action as={Link} to={`${this.props.match.url}/${c.id}`} >Reply</Comment.Action>
                          </Comment.Actions>
                          }
                          <Comment.Text className="mt-20">
                            {this.state.readMore === c.id ?
                            c.comment : c.comment.substr(0, readMoreLength)}
                            {c.comment.length > readMoreLength && <Link to="/" onClick={e => this.readMore(e, 'readMore', this.state.readMore !== c.id ? c.id : false)}> {this.state.readMore !== c.id ? '...ReadMore' : 'ReadLess'}</Link>}
                          </Comment.Text>
                        </Comment.Content>
                        <Divider />
                        <Comment.Group>
                          {c.threadComment &&
                          c.threadComment.map(tc => (
                            ((tc.createdUserInfo && tc.createdUserInfo.id === issuerId
                              && tc.approved) ||
                              (tc.createdUserInfo && tc.createdUserInfo.id !== issuerId)) &&
                              <Comment className={`${tc.createdUserInfo && tc.createdUserInfo.id === issuerId ? 'issuer-comment' : 'reply-comment'}`}>
                                <Comment.Content>
                                  <Comment.Author>
                                    {tc && tc.createdUserInfo && tc.createdUserInfo.info && `${tc.createdUserInfo.info.firstName} ${tc.createdUserInfo.info.firstName}`}
                                    {tc.createdUserInfo && tc.createdUserInfo.id === issuerId && <Label color="blue" size="mini">ISSUER</Label>}
                                  </Comment.Author>
                                  <Comment.Metadata className="text-uppercase"><span className="time-stamp">{moment(tc && tc.updated ? tc.updated.date : tc && tc.created.date).format('LL')}</span></Comment.Metadata>
                                  <Comment.Text className="mt-20">
                                    {this.state.readMoreInner === tc.id ?
                                    tc.comment : tc.comment.substr(0, readMoreLength)}
                                    {c.comment.length > readMoreLength && <Link to="/" onClick={e => this.readMore(e, 'readMoreInner', this.state.readMoreInner !== tc.id ? tc.id : false)}> {this.state.readMoreInner !== tc.id ? '...Read More' : 'Read Less'}</Link>}
                                  </Comment.Text>
                                </Comment.Content>
                              </Comment>
                          ))}
                        </Comment.Group>
                      </Comment>
                    ))
                  }
                </Comment.Group>
              </Segment>
            </Grid.Column>
          </Grid> :
          <Grid stackable>
            <Grid.Column>
              <Segment padded className="center-align">
                <div className="segment-container no-comments">
                  <Header as="h3">Leave your questions and encouragement here.</Header>
                  <Button onClick={this.postNewComment} primary fluid={isMobile} className={isMobile && 'mt-20'}>Post Comment</Button>
                </div>
                <Grid centered>
                  <Grid.Column width={14} textAlign={!isMobile && 'center'}>
                    <p>
                      Note that both NextSeed and issuers are notified of all comments immediately,
                      but there may be a slight delay in response to questions submitted outside of
                      standard business hours (9am to 5pm CST, Monday through Friday).
                    </p>
                    <p>
                      Most questions will be answered by issuers in approximately two business days,
                      although some questions require more thorough
                      analyses and will take additional
                      time.
                    </p>
                    <p>See our <Link to="/">community guidelines</Link> on posting.</p>
                    <p>
                      If you have any technical questions or questions about NextSeed, please
                      email <a href="mailto:support@nextseed.com">support@nextseed.com</a>.
                    </p>
                  </Grid.Column>
                </Grid>
              </Segment>
            </Grid.Column>
          </Grid>
        }
        <Route path={`${this.props.match.url}/:id/:messageType?`} render={props => <CommentsReplyModal campaignId={campaignId} refLink={this.props.match.url} {...props} />} />
      </div>
    );
  }
}

export default Comments;
