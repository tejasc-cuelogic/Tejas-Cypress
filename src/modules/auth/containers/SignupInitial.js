import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Form, Grid } from 'semantic-ui-react';
import { NsModal } from '../../../theme/shared';
import { FormArrowButton } from '../../../theme/form';

const redirectByRole = {
  investor: { to: '/register-investor' },
  'issuer-type1': { to: '/business-application' },
};

@inject('authStore', 'uiStore', 'navStore')
@observer
class signupInitial extends Component {
  constructor(props) {
    super(props);
    this.props.uiStore.clearErrors();
    this.props.authStore.resetForm('SIGNUP_FRM');
    window.logger(this.props.uiStore.authRef);
  }

  componentWillUnmount() {
    this.props.uiStore.setFieldvalue('authRef', '');
  }

  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.push(this.props.uiStore.authRef || '/');
  }

  handleSignupChange = (e, result) => {
    this.props.authStore.signupChange(e, result);
    this.props.history.push(redirectByRole[result.value].to);
  }

  render() {
    const { SIGNUP_FRM } = this.props.authStore;
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
          <Grid.Column mobile={16} tablet={12} computer={8} className="pt-0">
            <Header as="h3">Welcome! Let{'\''}s get started.</Header>
            <Form error className={isMobile ? '' : 'account-type-tab'}>
              <FormArrowButton
                name="role"
                fielddata={SIGNUP_FRM.fields.role}
                changed={(e, result) => this.handleSignupChange(e, result)}
                classname="icon-arrow-button"
                ignoreValues={['issuer-type2']}
              />
            </Form>
            <p className="mt-40">Already have an account? <Link to="/login">Log in</Link></p>
          </Grid.Column>
        </Grid>
      </NsModal>
    );
  }
}

export default signupInitial;
