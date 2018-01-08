import React from 'react';

// Authorization HOC
// TODO: Figure out how to route back the user if he is unauthorized i.e.
// Send to UnauthorisedComponent and clear the route

const Authorization = (allowedRoles, UnauthorizedComponent) => (
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
      const allowed = Object.keys(context.userStore.currentUser.roles).map(role =>
        allowedRoles.includes(role));

      if (allowed) {
        return <WrappedComponent {...this.props} />;
      }
      return <UnauthorizedComponent {...this.props} />;
    }
    return <UnauthorizedComponent {...this.props} />;
  }
};

export default Authorization;
