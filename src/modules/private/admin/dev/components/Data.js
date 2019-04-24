import React, { Component } from 'react';
import { Grid, Card, Button, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import Aux from 'react-aux';
import { FormInput, MaskedInput } from '../../../../../theme/form';
import { FieldError } from '../../../../../theme/shared';

@inject('elasticSearchStore', 'uiStore')
@withRouter
@observer
export default class Data extends Component {
  componentWillMount() {
    this.props.elasticSearchStore.setFieldValue('boxMsg', '');
  }

  onSubmit = () => {
    this.props.elasticSearchStore.submitStorageDetails();
  }
  bulkFormOnSubmit = () => {
    this.props.elasticSearchStore.submitStorageDetailsinBulk();
  }

  render() {
    const { elasticSearchStore, uiStore } = this.props;
    const {
      STORAGE_DETAILS_SYNC_FRM, bulkStorageDetailsChange,
      BULK_STORAGE_DETAILS_SYNC_FRM, storageDetailsChange, countValues, bulkSyncLoader,
    } = elasticSearchStore;
    const { inProgress, errors } = uiStore;

    return (
      <Grid>
        <Grid.Column>
          <Card fluid className="elastic-search">
            <Card.Content header="Box Audit" />
            <Card.Content>
              <Card.Description>
                <Form error onSubmit={this.onSubmit}>
                  <Form.Group className="bottom-aligned">
                    <FormInput
                      key="userId"
                      type="text"
                      name="userId"
                      containerwidth="12"
                      showerror
                      fielddata={STORAGE_DETAILS_SYNC_FRM.fields.userId}
                      changed={(e, result) => storageDetailsChange(e, result)}
                      disabled={inProgress}
                    />
                    <Form.Field width={4}>
                      <Button primary fluid content="Sync Storage Details" disabled={!STORAGE_DETAILS_SYNC_FRM.meta.isValid || inProgress} loading={inProgress} />
                    </Form.Field>
                  </Form.Group>
                </Form>

                <Form error onSubmit={this.bulkFormOnSubmit}>
                  <Form.Group className="bottom-aligned">
                    <MaskedInput
                      key="limit"
                      name="limit"
                      allowNegative={false}
                      label={BULK_STORAGE_DETAILS_SYNC_FRM.fields.limit.label}
                      number
                      containerwidth="12"
                      showerror
                      fielddata={BULK_STORAGE_DETAILS_SYNC_FRM.fields.limit}
                      changed={(e, result) => bulkStorageDetailsChange(e, result, 'BULK_STORAGE_DETAILS_SYNC_FRM', 'mask')}
                      disabled={bulkSyncLoader}
                    />
                    <Form.Field width={4}>
                      <Button primary fluid content="Sync All Investors" disabled={!BULK_STORAGE_DETAILS_SYNC_FRM.meta.isValid || bulkSyncLoader} loading={bulkSyncLoader} />
                    </Form.Field>
                    { errors &&
                    <FieldError error={errors || ''} />
                    }
                  </Form.Group>
                </Form>
                { countValues && countValues.storageDetailsForInvestor &&
                <Aux>
                  <p className="hightlight-text" ><b>{get(countValues, 'storageDetailsForInvestor.count') || 0}</b> Users does not have folder structure created.</p>
                  <p className="hightlight-text" ><b>{get(countValues, 'storageDetailsForInvestor.createdCount') || 0}</b> User folders are created in current run.</p>
                </Aux>
                }
              </Card.Description>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    );
  }
}
