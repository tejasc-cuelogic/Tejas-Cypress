import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Grid, Header, Icon, Transition } from 'semantic-ui-react';
import { USER_TYPES_META } from './../../../constants/user';

const GetBtn = ({ type }) => {
  const BtnMeta = {
    investor: { label: 'Open account', to: '/auth/register-investor' },
    issuer: { label: 'Open account', to: '/auth/register-investor' },
  };
  return <Button disabled={!type} as={Link} to={type ? BtnMeta[type].to : '/auth/register'} primary size="large" className="relaxed" content={type ? BtnMeta[type].label : 'Open account'} />;
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
          <Header as="h3">Join the NextSeed community</Header>
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
                  <h4>{type.text}</h4>
                  <Transition visible={selectedType.value === type.value} animation="scale" duration={500}>
                    <p>{type.desc}</p>
                  </Transition>
                </div>
              </Grid.Column>
            ))}
            <Grid.Row>
              <Grid.Column>
                <GetBtn type={selectedType.value} />
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
