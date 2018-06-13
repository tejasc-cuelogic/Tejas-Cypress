import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Grid, Header, Icon } from 'semantic-ui-react';
import { USER_TYPES_META } from './../../../constants/user';

const GetBtn = ({ type }) => {
  const BtnMeta = {
    investor: { label: 'Start', to: '/auth/register-investor' },
    bowner: { label: 'Start application process', to: '/business-application' },
  };
  return <Button as={Link} to={BtnMeta[type].to} primary size="large" className="very relaxed" content={BtnMeta[type].label} />;
};

@inject('authStore', 'uiStore')
@observer
class signupInitial extends Component {
  chooseType = type => this.props.authStore.updatesignupFlow('type', type);
  render() {
    const userTypes = USER_TYPES_META.slice();
    const selectedType = this.props.authStore.signupFlow.type;
    return (
      <Modal size="tiny" open onClose={() => this.props.history.push('/')}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">How can NextSeed Help you?</Header>
          <p>Do you want to invest or apply for funding?</p>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Grid stackable textAlign="center">
            {userTypes.map(type => (
              <Grid.Column
                onClick={() => this.chooseType(type.value)}
                key={type.key}
                computer={8}
                tablet={16}
                mobile={16}
              >
                <div className={(selectedType === type.value ? 'user-type active' : 'user-type')}>
                  <Icon className={type.icon} size="huge" />
                  <h3>{type.text}</h3>
                  <p>{selectedType === type.value ? type.desc : ''}</p>
                </div>
              </Grid.Column>
            ))}
            <Grid.Row>
              <Grid.Column>
                {selectedType ? <GetBtn type={selectedType} /> : ''}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions className="signup-actions">
          <p>Already have an account? <Link to="/auth/login">Log in</Link></p>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default signupInitial;
