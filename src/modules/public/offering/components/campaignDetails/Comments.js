import React, { Component } from 'react';
import { Grid, Button, Comment, Label, TextArea, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Comments extends Component {
  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={12}>
            <div className="campaign-about-wrapper">
              <div>
                <p>
                  Note that both NextSeed and issuers are notified of all comments immediately,
                  but there may be a slight delay in response to questions submitted outside of
                  standard business hours (9am to 5pm CST, Monday through Friday). Most questions
                  will be answered by issuers in approximately two business days, although some
                  questions require more thorough analyses and will take additional time.
                </p>
                <p>
                  See our <Link to="/">community guidelines</Link> on posting. If you have any
                  technical questions or questions about NextSeed, please
                  email <Link to="/">support@nextseed.com</Link>.
                </p>
                <section className="center-align">
                  <p>
                  In order to leave comments, please sign up and verify your identity.
                  </p>
                  <Button secondary>Sign Up Now</Button>
                </section>
                {/* After sign up view - do not remove */}
                <Form reply className="public-form clearfix">
                  <TextArea placeholder="Write a comment..." />
                  <Button primary floated="right">Post Comment</Button>
                </Form>
                {/* end */}
              </div>
              <Comment.Group>
                <Comment>
                  <Comment.Content>
                    <Comment.Author>Terence</Comment.Author>
                    <Comment.Metadata className="text-uppercase">2 Hours Ago</Comment.Metadata>
                    {/* add after sign up - do not remove */}
                    <Comment.Actions>
                      <Comment.Action>Reply</Comment.Action>
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
                      <Comment.Action>Reply</Comment.Action>
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
                      <Comment.Action>Reply</Comment.Action>
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
                  <Comment.Group>
                    <Comment>
                      <Comment.Content>
                        <Comment.Author>John <Label color="blue" mini>ISSUER</Label></Comment.Author>
                        <Comment.Metadata className="text-uppercase">3 HOURS AGO</Comment.Metadata>
                        {/* add after sign up - do not remove */}
                        <Comment.Actions>
                          <Comment.Action>Reply</Comment.Action>
                        </Comment.Actions>
                        {/* end */}
                        <Comment.Text className="mt-20">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum convallis
                      orci urna, vel ornare lectus vehicula eu. Quisque sollicitudin tortor in
                      tellus tincidunt, at feugiat massa ultrices. Donec odio tortor, imperdiet eget
                      commodo semper, luctus non metus
                        </Comment.Text>
                      </Comment.Content>
                    </Comment>
                    {/* Add below div if signed up - do not remove */}
                    <div className="mt-20">
                      <p>
                    Note that both NextSeed and issuers are notified of all comments immediately,
                    but there may be a slight delay in response to questions submitted outside of
                    standard business hours (9am to 5pm CST, Monday through Friday). Most questions
                    will be answered by issuers in approximately two business days, although some
                    questions require more thorough analyses and will take additional time.
                      </p>
                      <p>
                        See our <Link to="/">community guidelines</Link> on posting. If you have any
                        technical questions or questions about NextSeed, please
                        email <Link to="/">support@nextseed.com</Link>.
                      </p>
                      <Form className="public-form" reply>
                        <TextArea placeholder="Write a comment..." />
                        <Button>Cancel</Button>
                        <Button primary floated="right">Post Comment</Button>
                      </Form>
                    </div>
                    {/* end */}
                  </Comment.Group>
                </Comment>
                <Comment>
                  <Comment.Content>
                    <Comment.Author>Karla</Comment.Author>
                    <Comment.Metadata>
                      <div>JUL 12</div>
                    </Comment.Metadata>
                    {/* add after sign up - do not remove */}
                    <Comment.Actions>
                      <Comment.Action>Reply</Comment.Action>
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
            </div>
          </Grid.Column>
          <Grid.Column width={4} />
        </Grid.Row>
      </Grid>
    );
  }
}

export default Comments;
