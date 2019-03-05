import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Grid, Header, Divider, Icon } from 'semantic-ui-react';
import { USER_TYPES_META } from './../../../constants/user';

const GetBtn = ({ type }) => {
  const BtnMeta = {
    investor: { label: 'Open account', to: '/auth/register-investor' },
    'issuer-type1': { label: 'Start application process', to: '/business-application/business' },
    'issuer-type2': { label: 'Start application process', to: '/business-application/commercial-real-estate' },
  };
  return <Button disabled={!type} as={Link} to={type ? BtnMeta[type].to : '/auth/register'} primary size="large" className="very relaxed" content={type ? BtnMeta[type].label : 'Open account'} />;
};

@inject('authStore', 'uiStore', 'navStore')
@observer
class signupInitial extends Component {
  componentWillMount() {
    this.props.uiStore.clearErrors();
    this.props.authStore.resetForm('SIGNUP_FRM');
    console.log(this.props.uiStore.authRef);
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.push(this.props.uiStore.authRef || '/');
  }
  render() {
    const userTypes = USER_TYPES_META.slice();
    const { SIGNUP_FRM, signupChange } = this.props.authStore;
    const selectedType = SIGNUP_FRM.fields.role;
    const isMobile = document.documentElement.clientWidth < 768;
    return (
      <Modal closeOnDimmerClick={false} open closeIcon onClose={this.handleCloseModal} className={`${this.props.match.params.type && 'tiny'}`}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Join the NextSeed community</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Grid stackable textAlign="center" columns="equal">
            {userTypes.map(type => !type.exclude.includes(this.props.match.params.type) && (
              <Grid.Column
                onClick={e => signupChange(e, { name: 'role', value: type.value })}
                key={type.key}
              >
                <div className={`user-type ${(`${selectedType.value}-${type.subVal}` === `${type.value}-${type.subVal}` ? 'active' : '')}`}>
                  <Icon className={type.icon} size="huge" />
                  <div className={isMobile ? 'left-align' : ''}>
                    <Header as="h4">{type.text}</Header>
                    <p>{type.desc}</p>
                  </div>
                </div>
              </Grid.Column>
            ))}
          </Grid>
          <Divider hidden />
          <div className="center-align">
            <GetBtn type={selectedType.value} />
          </div>
        </Modal.Content>
        <Modal.Actions className="signup-actions">
          <p><b>Already have an account?</b> <Link to="/auth/login">Log in</Link></p>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default signupInitial;
