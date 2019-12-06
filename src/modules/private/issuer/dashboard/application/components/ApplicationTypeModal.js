import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Grid, Header, Icon } from 'semantic-ui-react';

const APPLICATION_TYPES_META = [
  {
    key: 'o', icon: 'ns-business', text: 'Business', value: 'business', desc: 'Apply for funding for your business', to: '/business-application/business',
  },
  {
    key: 'bo', icon: 'ns-appartment', text: 'Commercial Real Estate', value: 'commercial-real-estate', desc: 'Apply for real estate funding', to: '/business-application/commercial-real-estate',
  },
];

@inject('businessAppStore')
@observer
class ApplicationTypeModal extends Component {
  render() {
    const { setFieldvalue, currentApplicationType } = this.props.businessAppStore;
    return (
      <Modal size="tiny" open onClose={() => this.props.history.push('/app')}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Select Business Type</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Grid stackable textAlign="center" columns="equal">
            {APPLICATION_TYPES_META.map(type => (
              <Grid.Column
                onClick={() => setFieldvalue('currentApplicationType', type.value)}
                key={type.key}
              >
                <div className={`user-type ${currentApplicationType === type.value ? 'active' : ''}`}>
                  <Icon className={type.icon} size="huge" />
                  <Header as="h4">{type.text}</Header>
                  <p>{type.desc}</p>
                </div>
              </Grid.Column>
            ))}
            <Grid.Row>
              <Grid.Column>
                <Button disabled={!currentApplicationType} as={Link} to={`/app/business-application/${currentApplicationType}/new/pre-qualification`} primary size="large" className="relaxed" content="Continue" />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

export default ApplicationTypeModal;
