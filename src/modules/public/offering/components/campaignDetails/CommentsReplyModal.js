import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { Modal, Comment, Label, Form, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { FormTextarea } from '../../../../../theme/form';
// import { InlineLoader } from '../../../../../theme/shared';

@inject('messageStore')
@observer
class CommentsReplyModal extends Component {
  state={ readMore: false }
  componentWillMount() {
    this.props.messageStore.resetMessageForm();
    this.props.messageStore.setDataValue('currentMessageId', !this.props.match.params.messageType ? this.props.match.params.id : null);
    this.props.messageStore.setDataValue('currentOfferingId', this.props.campaignId);
  }
  readMore = (e, id) => { e.preventDefault(); this.setState({ readMore: id }); }
  handleClose = () => this.props.history.push(this.props.refLink);
  send = (scope) => {
    this.props.messageStore.createNewComment(scope);
    this.handleClose();
  }
  render() {
    const readMoreLength = 50;
    const { messageStore, match } = this.props;
    const { messageType } = match.params;
    const {
      MESSAGE_FRM, msgEleChange, buttonLoader, getSelectedMessage,
    } = messageStore;
    const message = getSelectedMessage;
    const date = message && message.updated ?
      message.updated.date : message && message.created.date;
    return (
      <Modal
        open
        onClose={this.handleClose}
        size="large"
        closeIcon
      >
        <Modal.Header>{messageType ? 'Post New Comment' : 'Reply'}</Modal.Header>
        <Modal.Content scrolling>
          <Comment.Group className="comments-modal">
            {!messageType && message &&
              <Comment className="issuer-comment">
                <Comment.Content>
                  <Comment.Author>{get(message, 'createdUserInfo.info.firstName')} {this.props.issuerId === get(message, 'createdUserInfo.id') && <Label color="blue" size="mini">ISSUER</Label>}</Comment.Author>
                  <Comment.Metadata className="text-uppercase"><span className="time-stamp">{moment(date).format('LL')}</span></Comment.Metadata>
                  <Comment.Text className="mt-20">
                    {this.state.readMore === message.id ?
                      message.comment : message.comment.substr(0, readMoreLength)}
                    {message.comment.length > readMoreLength && <Link to="/" onClick={e => this.readMore(e, this.state.readMoreInner !== message.id ? message.id : false)}> {this.state.readMoreInner !== message.id ? '...Read More' : 'Read Less'}</Link>}
                  </Comment.Text>
                </Comment.Content>
              </Comment>
            }
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
                <FormTextarea
                  fielddata={MESSAGE_FRM.fields.comment}
                  name="comment"
                  changed={msgEleChange}
                />
                <Button onClick={this.handleClose}>Cancel</Button>
                <Button floated="right" loading={buttonLoader === 'PUBLIC'} onClick={() => this.send('PUBLIC')} disabled={!MESSAGE_FRM.meta.isValid} primary content="Post Comment" />
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
