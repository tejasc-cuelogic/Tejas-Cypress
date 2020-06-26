import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Grid, Responsive } from 'semantic-ui-react';
import { NsModal } from '../../../theme/shared';
import { FormArrowButton } from '../../../theme/form';

const redirectByRole = {
  'issuer-type1': { to: '/business-application/business' },
  'issuer-type2': { to: '/business-application/commercial-real-estate' },
};

@inject('authStore', 'uiStore', 'navStore')
@observer
class signupBusiness extends Component {
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
            <Header as="h3">Would you like to raise capital for a business or a commercial real <Responsive as="br" /> estate project?</Header>
            <Form error className={isMobile ? '' : 'account-type-tab'}>
              <FormArrowButton
                name="role"
                fielddata={SIGNUP_FRM.fields.role}
                changed={(e, result) => this.handleSignupChange(e, result)}
                classname="icon-arrow-button"
                ignoreValues={['investor']}
                business
              />
            </Form>
          </Grid.Column>
        </Grid>
      </NsModal>
    );
  }
}

export default signupBusiness;
