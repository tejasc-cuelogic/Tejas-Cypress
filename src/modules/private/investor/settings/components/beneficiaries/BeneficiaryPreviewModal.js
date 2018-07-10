import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { Modal, Button, Header, Divider, Message, Grid, Card } from 'semantic-ui-react';
import { ListErrors, DateTimeFormat } from '../../../../../../theme/shared';

@inject('beneficiaryStore', 'uiStore')
@withRouter
@observer
export default class BeneficiaryPreviewModal extends Component {
  submit = (e) => {
    e.preventDefault();
    this.props.beneficiaryStore.resetFormData('OTP_VERIFY_META');
    this.props.beneficiaryStore.requestOtpForManageBeneficiary().then(() => {
      const location = `${this.props.refLink}/verify`;
      this.props.history.push(location);
    });
  }

  handleCloseModal = (e) => {
    e.preventDefault();
    this.props.history.goBack();
  }

  render() {
    const { inProgress } = this.props.uiStore;
    const { BENEFICIARY_META } = this.props.beneficiaryStore;
    const { errors } = this.props.uiStore;
    return (
      <Modal size="small" open closeIcon onClose={this.handleCloseModal} closeOnRootNodeClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Please confirm all the beneficiaries you have entered are correct.</Header>
          <Divider />
        </Modal.Header>
        <Modal.Content className="signup-content">
          {errors &&
            <Message error>
              <ListErrors errors={[errors]} />
            </Message>
          }
          <Grid stackable celled="internally" padded="horizontally">
            {
              BENEFICIARY_META.fields.beneficiary.length ?
              BENEFICIARY_META.fields.beneficiary.map(beneficiary => (
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Card.Content>
                      <dl className="dl-horizontal">
                        <dt>Names</dt>
                        <dd>{`${beneficiary.firstName.value} ${beneficiary.lastName.value}`}</dd>
                        <dt>DOB</dt>
                        <dd>
                          <DateTimeFormat
                            datetime={moment(beneficiary.dob.value, 'MM-DD-YYYY')}
                          />
                        </dd>
                        <dt>Relationship</dt>
                        <dd>{beneficiary.relationship.value}</dd>
                        <dt>Legal Address</dt>
                        <dd>
                          {`${beneficiary.residentalStreet.value}`}, {`${beneficiary.city.value} ${beneficiary.state.value} ${beneficiary.zipCode.value}`}
                        </dd>
                        <dt>Share</dt>
                        <dd>{`${beneficiary.share.value}%`}</dd>
                      </dl>
                    </Card.Content>
                  </Grid.Column>
                </Grid.Row>
              )) :
              <div>loading...</div>
            }
          </Grid>
          <div className="center-align mt-30">
            <Button loading={inProgress} onClick={this.submit} disabled={!BENEFICIARY_META.meta.isValid} color="green" >Confirm</Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}
