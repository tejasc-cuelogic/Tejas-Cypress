import React, { Component } from 'react';
import { Card, Button, Form, Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { FormDropDown } from '../../../../../../theme/form';

@inject('factoryStore')
@withRouter
@observer
export default class CronFactory extends Component {
  constructor(props) {
    super(props);
    this.props.factoryStore.resetForm('CRONFACTORY_FRM');
    this.props.factoryStore.inProgress.cronFactory = false;
  }

  onSubmit = () => {
    this.props.factoryStore.cronFactoryPluginTrigger();
  }

  render() {
    const { factoryStore } = this.props;
    const {
      CRONFACTORY_FRM, formChange, inProgress,
    } = factoryStore;
    return (
      <Card fluid className="elastic-search">
        <Card.Content header="Manage Cron Factory" />
        <Card.Content>
          <Card.Description>
            <Form onSubmit={this.onSubmit}>
              <Form.Group>
                <Grid className="full-width" stackable>
                  <Grid.Column width={8}>
                    <FormDropDown
                      fielddata={CRONFACTORY_FRM.fields.plugin}
                      selection
                      containerclassname="dropdown-field mlr-0"
                      options={CRONFACTORY_FRM.fields.plugin.values}
                      placeholder="Choose here"
                      name="plugin"
                      onChange={(e, result) => formChange(e, result, 'CRONFACTORY_FRM')}
                    />
                  </Grid.Column>
                  <Grid.Column width={16}>
                      <Button primary content="Submit" disabled={inProgress.cronFactory || !CRONFACTORY_FRM.meta.isValid} loading={inProgress.cronFactory} />
                  </Grid.Column>
                </Grid>
              </Form.Group>
            </Form>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
