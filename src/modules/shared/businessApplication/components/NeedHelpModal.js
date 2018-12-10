import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Modal, Button, Header, Form, Message } from 'semantic-ui-react';
import Helper from '../../../../helper/utility';
import { FormInput, MaskedInput, FormTextarea } from '../../../../theme/form';
import { ListErrors } from '../../../../theme/shared';

@inject('uiStore', 'businessAppStore')
@withRouter
@observer
export default class NeedHelpModal extends Component {
  componentWillMount() {
    const { match } = this.props;
    if (match.isExact) {
      this.props.businessAppStore.needHelpFormReset();
    }
  }
  handleCloseModal = (e) => {
    e.preventDefault();
    this.props.uiStore.setErrors(null);
    this.props.history.goBack();
  }
  submit = (e) => {
    e.preventDefault();
    this.props.businessAppStore.needHelpFormSubmit().then(() => {
      Helper.toast('Business application saved!', 'success');
      this.props.history.goBack();
    });
  }

  render() {
    const { inProgress } = this.props.uiStore;
    const { errors } = this.props.uiStore;
    const {
      NEED_HELP_FRM, businessAppEleChange, businessAppEleMaskChange,
    } = this.props.businessAppStore;
    const { fields } = NEED_HELP_FRM;
    return (
      <Modal size="mini" open closeIcon onClose={this.handleCloseModal} closeOnRootNodeClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h4">Need Help / Have Questions?</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form error onSubmit={this.submit}>
            {['name', 'email'].map(field => (
              <FormInput
                key={field}
                type="text"
                name={field}
                fielddata={fields[field]}
                changed={(e, res) => businessAppEleChange(e, res, 'NEED_HELP_FRM')}
              />
            ))}
            <MaskedInput
              name="phone"
              fielddata={fields.phone}
              changed={(values, field) => businessAppEleMaskChange(values, field, 'NEED_HELP_FRM')}
            />
            <FormTextarea
              type="text"
              name="question"
              fielddata={fields.question}
              containerclassname="secondary"
              changed={(e, res) => businessAppEleChange(e, res, 'NEED_HELP_FRM')}
            />
            {!errors &&
              <Message error>
                <p>Test Error</p>
                <ListErrors errors={[errors]} />
              </Message>
            }
            <div className="center-align">
              <Button.Group widths="2" className="inline">
                <Button inverted color="red" className="relaxed" content="Cancel" onClick={this.handleCloseModal} />
                <Button primary className="relaxed" content="Send" disabled={!NEED_HELP_FRM.meta.isValid} loading={inProgress} />
              </Button.Group>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
