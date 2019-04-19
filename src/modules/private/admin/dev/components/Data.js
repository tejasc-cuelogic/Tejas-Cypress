import React, { Component } from 'react';
import { Grid, Card, Button, Confirm, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { FormInput } from '../../../../../theme/form';
// import ActivityHistory from '../../../shared/ActivityHistory';
// import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';

// const elasticSearchModules = [
//   { module: 'user', title: 'Users Index' },
//   { module: 'crowdPay', title: 'CrowdPay Index' },
//   { module: 'accreditation', title: 'Accreditation Index' },
//   { module: 'linkedBank', title: 'LinkedBank Index' },
//   { module: 'offerings', title: 'Offerings Index' },
// ];

@inject('elasticSearchStore')
@withRouter
@observer
export default class Data extends Component {
  state = { confirmModal: false, title: '', mutation: null };
  onSubmit = (e) => {
    e.preventDefault();
    this.props.elasticSearchStore.submitStorageDetails();
  }
  elasticSearchHandler = (mutation) => {
    this.cancelConfirmModal();
    this.props.elasticSearchStore.elasticSearchHandler(mutation);
  }
  toggleConfirmModal = (mutation, title) => {
    this.setState({ confirmModal: true, mutation, title });
  }
  cancelConfirmModal = () => {
    this.setState({ confirmModal: false, mutation: null, title: '' });
  }

  render() {
    const { elasticSearchStore } = this.props;
    const { STORAGE_DETAILS_SYNC_FRM, storageDetailsChange } = elasticSearchStore;
    // const navItems = [
    //   { title: 'Activity History', to: '' },
    // ];
    return (
      <Grid>
        <Grid.Column>
          <Card fluid className="elastic-search">
            <Card.Content header="Box Audit" />
            <Card.Content>
              <Card.Description>
                <Form error onSubmit={this.onSubmit}>
                  <Form.Group>
                    <FormInput
                      key="userId"
                      type="text"
                      name="userId"
                      width="12"
                      fielddata={STORAGE_DETAILS_SYNC_FRM.fields.userId}
                      changed={(e, result) => storageDetailsChange(e, result)}
                    />
                    <Form.Field width={4}>
                      <Button primary fluid content="Sycn Storage Details" />
                    </Form.Field>
                  </Form.Group>
                </Form>
                <Button primary className="mt-30" content="Sync All Investors" />
              </Card.Description>
            </Card.Content>
          </Card>
        </Grid.Column>
        <Confirm
          header="Confirm"
          cancelButton="No"
          confirmButton="Yes"
          content={`Are you sure to proceed with ${this.state.title}.`}
          open={this.state.confirmModal}
          onCancel={this.cancelConfirmModal}
          onConfirm={() => this.elasticSearchHandler(this.state.mutation)}
          size="mini"
          className="deletion"
        />
      </Grid>
    );
  }
}
