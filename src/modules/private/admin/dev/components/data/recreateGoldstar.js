import React, { Component } from 'react';
import { Card, Button, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { FormInput } from '../../../../../../theme/form';

@inject('dataStore')
@withRouter
@observer
export default class RecreateGoldstar extends Component {
  componentWillMount() {
    this.props.dataStore.resetForm('RECREATEGOLDSTAR_FRM');
  }
  onSubmit = () => {
    this.props.dataStore.adminProcessCip();
  }
  render() {
    const { dataStore } = this.props;
    const {
      RECREATEGOLDSTAR_FRM, formChange, inProgress,
    } = dataStore;
    return (
      <Card fluid className="elastic-search">
        <Card.Content header="Recreate GoldStar Account" />
        <Card.Content>
          <Form onSubmit={this.onSubmit}>
            <Form.Group className="bottom-aligned">
              {['userId', 'accountId'].map(field => (
                <FormInput
                  type="text"
                  key={field}
                  name={field}
                  containerwidth="6"
                  showerror
                  fielddata={RECREATEGOLDSTAR_FRM.fields[field]}
                  changed={(e, result) => formChange(e, result, 'RECREATEGOLDSTAR_FRM')}
                />))
              }
              <Form.Field width={4}>
                <Button primary fluid content="Submit" disabled={!RECREATEGOLDSTAR_FRM.meta.isValid || inProgress.adminProcessCip} loading={inProgress.adminProcessCip} />
              </Form.Field>
            </Form.Group>
          </Form>
        </Card.Content>
      </Card>
    );
  }
}
