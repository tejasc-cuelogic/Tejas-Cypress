import React, { Component } from 'react';
import Loadable from 'react-loadable';
import { inject, observer } from 'mobx-react';
import upperFirst from 'lodash/upperFirst';

@inject('authStore', 'uiStore')
@observer
class AuthWizard extends Component {
  render() {
    const module = upperFirst(this.props.authWizardStep) || 'SignupInitial';
    const AuthModule = Loadable({
      loader: () => import(`../components/${module}`),
      loading() {
        return <div>Loading...</div>;
      },
    });

    return (
      <div>
        <AuthModule {...this.props} />
      </div>
    );
  }
}

export default AuthWizard;
