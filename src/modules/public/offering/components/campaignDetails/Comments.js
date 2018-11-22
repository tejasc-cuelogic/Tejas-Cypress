import React, { Component } from 'react';
import { Button, Comment, Form, Grid, Segment, Header } from 'semantic-ui-react';
import { Link, Route } from 'react-router-dom';
import CommentsReplyModal from './CommentsReplyModal';

const isMobile = document.documentElement.clientWidth < 768;

class Comments extends Component {
  handleClose = () => this.props.history.goBack();
  render() {
    return (
      <div className="campaign-content-wrapper">
        <Grid stackable reversed="computer">
          <Grid.Column computer={6} tablet={16} mobile={16}>
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
              {/* <section className="center-align">
                <p>In order to leave comments, please sign up and verify your identity.</p>
                <Button secondary>Sign Up Now</Button>
              </section> */}
              {/* After sign up view - do not remove */}
              <section className="center-align mt-80">
                {!isMobile &&
                  <Header as="h4" className="mb-30">Post New Comment</Header>
                }
                <Form reply className="public-form clearfix">
                  {/* <Form.TextArea className="secondary" placeholder="Write a comment..." /> */}
                  <Button primary>Post Comment</Button>
                </Form>
              </section>
              {/* end */}
            </Segment>
          </Grid.Column>
          <Grid.Column computer={10} tablet={16} mobile={16}>
            <Segment padded>
              <Comment.Group minimal>
                <Comment>
                  <Comment.Content>
                    <Comment.Author>Terence</Comment.Author>
                    <Comment.Metadata className="text-uppercase">2 Hours Ago</Comment.Metadata>
                    {/* add after sign up - do not remove */}
                    <Comment.Actions>
                      <Comment.Action as={Link} to={`${this.props.match.url}/commentsreply`} >Reply</Comment.Action>
                    </Comment.Actions>
                    {/* end */}
                    <Comment.Text className="mt-20">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum convallis
                    orci urna, vel ornare lectus vehicula eu. Quisque sollicitudin tortor in
                    tellus tincidunt, at feugiat massa ultrices. Donec odio tortor, imperdiet eget
                    commodo semper, luctus non metus. Mauris quis lorem non nulla auctor eleifend
                    sit amet id diam... <Link to="/">Read More</Link>
                    </Comment.Text>
                  </Comment.Content>
                </Comment>
                <Comment>
                  <Comment.Content>
                    <Comment.Author>Alan</Comment.Author>
                    <Comment.Metadata className="text-uppercase">JUL 24, 2018</Comment.Metadata>
                    {/* add after sign up - do not remove */}
                    <Comment.Actions>
                      <Comment.Action as={Link} to={`${this.props.match.url}/commentsreply`} >Reply</Comment.Action>
                    </Comment.Actions>
                    {/* end */}
                    <Comment.Text className="mt-20">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum convallis
                    orci urna, vel ornare lectus vehicula eu. Quisque sollicitudin tortor in tellus
                    tincidunt, at feugiat massa ultrices?
                    </Comment.Text>
                  </Comment.Content>
                </Comment>
                <Comment>
                  <Comment.Content>
                    <Comment.Author>Erick</Comment.Author>
                    <Comment.Metadata className="text-uppercase">JUL 30, 2018</Comment.Metadata>
                    {/* add after sign up - do not remove */}
                    <Comment.Actions>
                      <Comment.Action as={Link} to={`${this.props.match.url}/commentsreply`} >Reply</Comment.Action>
                    </Comment.Actions>
                    {/* end */}
                    <Comment.Text className="mt-20">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum convallis
                    orci urna, vel ornare lectus vehicula eu. Quisque sollicitudin tortor in
                    tellus tincidunt, at feugiat massa ultrices. Donec odio tortor, imperdiet eget
                    commodo semper, luctus non metus. Mauris quis lorem non nulla auctor eleifend
                    sit amet id diam?
                    </Comment.Text>
                  </Comment.Content>
                </Comment>
                <Comment>
                  <Comment.Content>
                    <Comment.Author>Karla</Comment.Author>
                    <Comment.Metadata className="text-uppercase">JUN 12,2018</Comment.Metadata>
                    {/* add after sign up - do not remove */}
                    <Comment.Actions>
                      <Comment.Action as={Link} to={`${this.props.match.url}/commentsreply`} >Reply</Comment.Action>
                    </Comment.Actions>
                    {/* end */}
                    <Comment.Text className="mt-20">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum convallis
                    orci urna, vel ornare lectus vehicula eu. Quisque sollicitudin tortor in
                    tellus tincidunt, at feugiat massa ultrices. Donec odio tortor, imperdiet eget
                    commodo semper, luctus non metus. Mauris quis lorem non nulla auctor eleifend
                    sit amet id diam... <Link to="/">Read More</Link>
                    </Comment.Text>
                  </Comment.Content>
                </Comment>
              </Comment.Group>
            </Segment>
          </Grid.Column>
        </Grid>
        <Route path={`${this.props.match.url}/commentsreply`} component={CommentsReplyModal} />
      </div>
    );
  }
}

export default Comments;
