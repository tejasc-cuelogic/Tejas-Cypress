import React, { Component } from 'react';
import { Grid, Card, Button, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { FormInput } from '../../../../../theme/form';
import { FieldError } from '../../../../../theme/shared';

@inject('elasticSearchStore', 'uiStore')
@withRouter
@observer
export default class Data extends Component {
  componentWillMount() {
    this.props.elasticSearchStore.setFieldValue('boxMsg', '');
  }

  onSubmit = () => {
    const { uiStore, elasticSearchStore } = this.props;
    uiStore.setProgress();
    elasticSearchStore.submitStorageDetails().then(() => {
      // document.getElementsByName('userId')[0].value = '';
    }).catch(e => console.log(e));
  }

  render() {
    const { elasticSearchStore, uiStore } = this.props;
    const { STORAGE_DETAILS_SYNC_FRM, storageDetailsChange, boxMsg } = elasticSearchStore;
    const { inProgress } = uiStore;

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
                      fielddata={STORAGE_DETAILS_SYNC_FRM.fields.userId}
                      changed={(e, result) => storageDetailsChange(e, result)}
                    />
                    <Form.Field width={4}>
                      <Button primary fluid content="Sync Storage Details" disabled={!STORAGE_DETAILS_SYNC_FRM.meta.isValid} loading={inProgress} />
                    </Form.Field>
                    { boxMsg &&
                    <FieldError error={boxMsg === 'True' ? '' : boxMsg} />
                    }
                  </Form.Group>
                </Form>
                <Button disabled primary className="mt-30" content="Sync All Investors" />
              </Card.Description>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    );
  }
}
