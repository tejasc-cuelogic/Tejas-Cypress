import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Grid, Header, Divider, Icon, Button } from 'semantic-ui-react';
import { NsModal } from '../../../theme/shared';
import { USER_TYPES_META } from '../../../constants/user';

const GetBtn = ({ type }) => {
  const BtnMeta = {
    investor: { label: 'Open account', to: '/register-investor' },
    'issuer-type1': { label: 'Start application process', to: '/business-application/business' },
    'issuer-type2': { label: 'Start application process', to: '/business-application/commercial-real-estate' },
  };
  return <Button disabled={!type} as={Link} to={type ? BtnMeta[type].to : '/register'} primary size="large" className="very relaxed" content={type ? BtnMeta[type].label : 'Open account'} />;
};

@inject('authStore', 'uiStore', 'navStore')
@observer
class signupInitial extends Component {
  constructor(props) {
    super(props);
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
      <NsModal
        closeOnDimmerClick={false}
        open
        onClose={this.handleCloseModal}
        modalClassName={`${this.props.match.params.type && 'tiny'}`}
        headerLogo
        borderedHeader
        isProgressHeaderDisable
        modalContentClass="signup-content"
      >
        <Grid centered stackable className={isMobile ? 'full-width mt-0' : 'mt-0'}>
          <Grid.Column width="8" className="pt-0">
            <Header as="h3" className="mb-40">Join the NextSeed community</Header>
            <Grid stackable textAlign="center" columns="1">
              {userTypes.map(type => !type.exclude.includes(this.props.match.params.type) && (
                <Grid.Column
                  onClick={e => signupChange(e, { name: 'role', value: type.value })}
                  key={type.key}
                >
                  <div className={`user-type ${(`${selectedType.value}-${type.subVal}` === `${type.value}-${type.subVal}` ? 'active' : '')}`}>
                    <Icon className={type.icon} />
                    <div className={isMobile ? 'left-align' : ''}>
                      <p><b>{type.text}</b></p>
                      <p>{type.desc}</p>
                    </div>
                    <Icon className="ns-chevron-right" />
                  </div>
                </Grid.Column>
              ))}
            </Grid>
            <p className="mt-40">Already have an account? <Link to="/login">Log in</Link></p>
          </Grid.Column>
        </Grid>
        <Divider hidden />
        <div className="center-align">
          <GetBtn type={selectedType.value} />
        </div>
      </NsModal>
    );
  }
}

export default signupInitial;
