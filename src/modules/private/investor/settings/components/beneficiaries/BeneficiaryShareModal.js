import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
// import Aux from 'react-aux';
import { Modal, Button, Header, Form, Divider, Message, Table } from 'semantic-ui-react';
import { MaskedInput } from '../../../../../../theme/form';
import { ListErrors, FieldError, InlineLoader } from '../../../../../../theme/shared';

@inject('beneficiaryStore', 'uiStore')
@withRouter
@observer
export default class BeneficiaryShareModal extends Component {
  componentWillMount() {
    if (!this.props.beneficiaryStore.BENEFICIARY_META.fields.beneficiary.length) {
      this.props.history.push(this.props.refLink);
    }
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
          <Header as="h3">Please enter the requested distribution of shares for each beneficiary.</Header>
          <Divider />
          <p>The sum of all shares should equal 100%</p>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form error onSubmit={this.submit}>
            {showError &&
              <FieldError error="The sum of percentages must be 100" icon="warning circle" />
            }
            <Table unstackable singleLine className="investment-details">
              <Table.Header>
                <Table.HeaderCell><b>Beneficiary</b></Table.HeaderCell>
                <Table.HeaderCell><b>% of Share</b></Table.HeaderCell>
              </Table.Header>
              <Table.Body>
                {
                  BENEFICIARY_META.fields.beneficiary.length ?
                  BENEFICIARY_META.fields.beneficiary.map((beneficiary, index) => (
                    <Table.Row>
                      <Table.Cell>{`${beneficiary.firstName.value} ${beneficiary.lastName.value}`}</Table.Cell>
                      <Table.Cell>
                        <MaskedInput
                          percentage
                          showErrorOnField
                          tooltip={beneficiary.share.tooltip}
                          type="text"
                          name="share"
                          fielddata={beneficiary.share}
                          changed={values => beneficiaryShareChange(values, index)}
                        />
                      </Table.Cell>
                    </Table.Row>
                  )) :
                  <InlineLoader />
                }
              </Table.Body>
            </Table>
            {errors &&
              <Message error className="mt-30">
                <ListErrors errors={[errors]} />
              </Message>
            }
            <div className="center-align mt-30">
              <Button as={Link} to={this.props.refLink} color="red" >Cancel</Button>
              <Button loading={inProgress} disabled={!BENEFICIARY_META.meta.isValid} color="green">Proceed</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
