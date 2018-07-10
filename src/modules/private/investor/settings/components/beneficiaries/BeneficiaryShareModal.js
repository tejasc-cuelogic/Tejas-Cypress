import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { Modal, Button, Header, Form, Divider, Message } from 'semantic-ui-react';
import { MaskedInput2 } from '../../../../../../theme/form';
import { ListErrors, FieldError } from '../../../../../../theme/shared';

@inject('beneficiaryStore', 'uiStore')
@withRouter
@observer
export default class BeneficiaryShareModal extends Component {
  componentWillMount() {
    this.props.beneficiaryStore.setShareModalData(false);
    this.props.beneficiaryStore.updateBeneficiaryRules();
  }

  submit = (e) => {
    e.preventDefault();
    this.props.beneficiaryStore.setShareModalData(true);
    const location = `${this.props.refLink}/preview`;
    this.props.history.push(location);
  }

  handleCloseModal = (e) => {
    e.preventDefault();
    this.props.beneficiaryStore.setShareModalData(true);
    this.props.beneficiaryStore.updateBeneficiaryRules();
    this.props.history.goBack();
  }

  render() {
    const { inProgress } = this.props.uiStore;
    const {
      BENEFICIARY_META,
      beneficiaryShareChange,
    } = this.props.beneficiaryStore;
    const { errors } = this.props.uiStore;
    const showError = BENEFICIARY_META.fields.beneficiary.length ?
      BENEFICIARY_META.fields.beneficiary[0].share.error : false;
    return (
      <Modal size="small" open closeIcon onClose={this.handleCloseModal} closeOnRootNodeClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Please enter share % for beneficiaries</Header>
          <Divider />
        </Modal.Header>
        <Modal.Content className="signup-content">
          {errors &&
            <Message error>
              <ListErrors errors={[errors]} />
            </Message>
          }
          <Form error onSubmit={this.submit}>
            {showError &&
              <FieldError error="The sum of percentages must be 100" icon="warning circle" />
            }
            <dl className="dl-horizontal">
              {
                BENEFICIARY_META.fields.beneficiary.length ?
                BENEFICIARY_META.fields.beneficiary.map((beneficiary, index) => (
                  <Aux>
                    <dt>{`${beneficiary.firstName.value} ${beneficiary.lastName.value}`}</dt>
                    <dd>
                      <MaskedInput2
                        percentage
                        showErrorOnField
                        tooltip={beneficiary.share.tooltip}
                        type="text"
                        name="share"
                        fielddata={beneficiary.share}
                        changed={values => beneficiaryShareChange(values, index)}
                      />
                    </dd>
                  </Aux>
                )) :
                <p>loading...</p>
              }
            </dl>
            <div className="center-align">
              <Button loading={inProgress} disabled={!BENEFICIARY_META.meta.isValid} color="green" >Proceed</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
