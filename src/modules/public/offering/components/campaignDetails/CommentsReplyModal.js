import React, { Component } from 'react';
import { Modal, Comment, Label, Form, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class CommentsReplyModal extends Component {
  handleClose = () => this.props.history.goBack();

  render() {
    return (
      <Modal
        open
        onClose={this.handleClose}
        size="large"
        closeIcon
      >
        <Modal.Header>Reply</Modal.Header>
        <Modal.Content scrolling>
          <Comment.Group className="comments-modal">
            <Comment>
              <Comment.Content>
                <Comment.Author>John <Label color="blue" size="mini">ISSUER</Label></Comment.Author>
                <Comment.Metadata className="text-uppercase">3 HOURS AGO</Comment.Metadata>
                <Comment.Text className="mt-20">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum convallis
                  orci urna, vel ornare lectus vehicula eu. Quisque sollicitudin tortor in
                  tellus tincidunt, at feugiat massa ultrices. Donec odio tortor, imperdiet eget
                  commodo semper, luctus non metus...<a href="">Read More</a>
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
                email <a href="mailto:support@nextseed.com">support@nextseed.com</a>.
              </p>
              <Form className="public-form mt-30" reply>
                <Form.TextArea className="secondary" placeholder="Write a reply..." />
                <Button>Cancel</Button>
                <Button primary floated="right">Post Comment</Button>
              </Form>
            </div>
            {/* end */}
          </Comment.Group>
        </Modal.Content>
      </Modal>
    );
  }
}

export default CommentsReplyModal;
