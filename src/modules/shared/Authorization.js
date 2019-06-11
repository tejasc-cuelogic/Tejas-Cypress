import React from 'react';

// Authorization HOC
// TODO: Figure out how to route back the user if he is unauthorized i.e.
// Send to UnauthorisedComponent and clear the route

import NotFound from './NotFound';

const Authorization = (allowedRoles, UnauthorizedComponent) => (
  WrappedComponent,
  context,
) => class WithAuthorization extends React.Component {
  render() {
    if (context.userStore.currentUser) {
      const allowed = context.userStore.currentUser.roles.some(role => allowedRoles.includes(role));

      if (allowed) {
        return <WrappedComponent {...this.props} />;
      }
      return <UnauthorizedComponent {...this.props} />;
    }
    return <UnauthorizedComponent {...this.props} />;
  }
};

export const AdminAuthorization = Authorization(['admin'], NotFound);
export const BusinessAuthorization = Authorization(['admin', 'issuer'], NotFound);
export const InvestorAuthorization = Authorization(['admin', 'investor'], NotFound);
export const UserAuthorization = Authorization(['admin', 'issuer', 'investor'], NotFound);
