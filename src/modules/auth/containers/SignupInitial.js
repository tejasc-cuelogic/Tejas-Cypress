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

@inject('authStore')
@observer
class signupInitial extends Component {
  render() {
    const userTypes = USER_TYPES_META.slice();
    const { SIGNUP_FRM, signupChange } = this.props.authStore;
    const selectedType = SIGNUP_FRM.fields.role;
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
                onClick={e => signupChange(e, { name: 'role', value: type.value })}
                key={type.key}
                computer={8}
                tablet={16}
                mobile={16}
              >
                <div className={`user-type ${(selectedType.value === type.value ? 'active' : '')}`}>
                  <Icon className={type.icon} size="huge" />
                  <h3>{type.text}</h3>
                  <p>{selectedType.value === type.value ? type.desc : ''}</p>
                </div>
              </Grid.Column>
            ))}
            <Grid.Row>
              <Grid.Column>
                {selectedType.value ? <GetBtn type={selectedType.value} /> : ''}
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
