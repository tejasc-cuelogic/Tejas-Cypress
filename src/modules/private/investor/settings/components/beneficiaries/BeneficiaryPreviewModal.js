import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import moment from 'moment';
import { Modal, Button, Header, Divider, Message, Grid, Card } from 'semantic-ui-react';
import { ListErrors, DateTimeFormat, InlineLoader } from '../../../../../../theme/shared';

@inject('beneficiaryStore', 'uiStore')
@withRouter
@observer
export default class BeneficiaryPreviewModal extends Component {
  componentWillMount() {
    if (this.props.beneficiaryStore.BENEFICIARY_META.fields.beneficiary.length === 0 ||
      this.props.beneficiaryStore.BENEFICIARY_META.fields.beneficiary[0].firstName.value === '') {
      this.props.history.push(this.props.refLink);
    }
  }
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
    this.props.history.push(this.props.refLink);
  }

  render() {
    const { inProgress } = this.props.uiStore;
    const { BENEFICIARY_META } = this.props.beneficiaryStore;
    const { errors } = this.props.uiStore;
    return (
      <Modal size="small" open closeIcon onClose={this.handleCloseModal} closeOnRootNodeClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Summary</Header>
          <Divider />
        </Modal.Header>
        <Modal.Content className="signup-content">
          {
            BENEFICIARY_META.fields.beneficiary.length ?
            BENEFICIARY_META.fields.beneficiary.map(beneficiary => (
              <Grid stackable celled="internally" padded="horizontally">
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Card.Content>
                      <dl className="dl-horizontal">
                        <dt>Full Name</dt>
                        <dd>{`${beneficiary.firstName.value} ${beneficiary.lastName.value}`}</dd>
                        <dt>Date of birth</dt>
                        <dd>
                          <DateTimeFormat
                            format="MM/DD/YYYY"
                            datetime={moment(beneficiary.dob.value, 'MM/DD/YYYY')}
                          />
                        </dd>
                        <dt>Relationship</dt>
                        <dd>{beneficiary.relationship.value}</dd>
                        <dt>Legal Address</dt>
                        <dd>
                          {`${beneficiary.residentalStreet.value}`}, {`${beneficiary.city.value} ${beneficiary.state.value} ${beneficiary.zipCode.value}`}
                        </dd>
                        <dt>Shares %</dt>
                        <dd>{`${beneficiary.share.value}%`}</dd>
                      </dl>
                    </Card.Content>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            )) :
            <InlineLoader />
          }
          {errors &&
            <Message error>
              <ListErrors errors={[errors]} />
            </Message>
          }
          <div className="center-align mt-30">
            <Button color="red" content="Cancel" as={Link} to={this.props.refLink} />
            <Button primary content="Submit" loading={inProgress} onClick={this.submit} disabled={!BENEFICIARY_META.meta.isValid} />
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}
