/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Modal, Button, Header, Message } from 'semantic-ui-react';
import { ListErrors, InlineLoader } from '../../../theme/shared';
import HtmlEditor from '../../shared/HtmlEditor';

@inject('uiStore', 'commonStore')
@withRouter
@observer
export default class EmailContent extends Component {
  state = {
    emailContent: null,
    loading: false,
  }

  constructor(props) {
    super(props);
    const { commonStore, match } = this.props;
    const params = {
      id: match.params.id,
      requestDate: match.params.requestDate,
    };
    this.setState({ loading: true });
    commonStore.fetchEmailContent(params).then((res) => {
      console.log(res);
      this.setState({ emailContent: res });
      this.setState({ loading: false });
    }).catch((e) => {
      this.setState({ loading: false });
      console.log(e);
    });
  }

  componentDidMount() {
    const modal = document.querySelector('.show-top').closest('.page');
    modal.classList.add('show-top');
  }

  handleCloseModal = (e) => {
    e.preventDefault();
    this.props.history.push(this.props.refLink);
  }

  render() {
    if (this.state.loading) {
      return <InlineLoader />;
    }
    return (
      <Modal open closeOnDimmerClick size="small" className="show-top" closeIcon onClose={e => this.handleCancel(e)}>
        <Modal.Content className="center-align">
          <Header as="h3">Email Content</Header>
          {this.state.loading ? <InlineLoader />
            : (
              <HtmlEditor
                readOnly
                content={this.state.emailContent}
              />
            )
          }
          {!'errors'
            && (
              <Message error className="mb-40">
                <ListErrors errors={['']} />
              </Message>
            )
          }
          <div className="center-align">
            <Button.Group widths="2" className="inline">
              <Button primary content="Back" onClick={this.handleCancel} />
            </Button.Group>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}
