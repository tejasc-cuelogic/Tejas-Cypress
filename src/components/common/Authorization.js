import React from 'react';

// Authorization HOC
// TODO: Figure out how to route back the user if he is unauthorized i.e.
// Send to UnauthorisedComponent and clear the route

import NotFound from './NotFound';

const Authorization = (allowedRoles, UnauthorizedComponent, adminOnly = false) => (
  WrappedComponent,
  context,
) => class WithAuthorization extends React.Component {
//   constructor(props) {
//     super(props);
//   }

  render() {
    // console.log(context);

    // Check if current user exists i.e. used is logged in
    if (context.userStore.currentUser) {
      const allowed = context.userStore.currentUser.roles.some(role =>
        allowedRoles.includes(role));

      if (allowed && adminOnly && context.userStore.currentUser.roles.includes('admin')) {
        return <WrappedComponent {...this.props} />;
      }
      return <UnauthorizedComponent {...this.props} />;
    }
    return <UnauthorizedComponent {...this.props} />;
  }
};

export const AdminAuthorization = Authorization(['admin', 'bowner', 'investor'], NotFound, true);
export const BusinessAuthorization = Authorization(['admin', 'bowner'], NotFound);
export const InvestorAuthorization = Authorization(['admin', 'investor'], NotFound);
