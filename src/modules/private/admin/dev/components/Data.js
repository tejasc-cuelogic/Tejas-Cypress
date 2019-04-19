import React, { Component } from 'react';
import { Grid, Card, Button, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { FormInput } from '../../../../../theme/form';

@inject('elasticSearchStore', 'uiStore')
@withRouter
@observer
export default class Data extends Component {
  componentWillMount() {
    this.props.elasticSearchStore.setFieldValue('boxMsg', '');
  }
  onSubmit = (e) => {
    e.preventDefault();
    const { uiStore, elasticSearchStore } = this.props;
    uiStore.setProgress();
    elasticSearchStore.submitStorageDetails().finally(uiStore.setProgress(false));
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
                  </Form.Group>
                </Form>
                {boxMsg ?
                  <p className="highlight-text">{boxMsg === 'True' ? 'Box folder details not found, creation has been initiated, please check after some time.' : boxMsg}</p> : ''
                }
                <Button primary className="mt-30" content="Sync All Investors" />
              </Card.Description>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    );
  }
}
