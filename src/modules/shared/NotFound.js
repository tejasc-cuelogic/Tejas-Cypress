import React from 'react';
import { Header, Divider } from 'semantic-ui-react';

export default class NotFound extends React.Component {
  render() {
    return (
      <div className="error-page">
        <Header as="h1">
          4 0 4
          <Header.Subheader>Page Not Found</Header.Subheader>
        </Header>
        <p>
          The page you were trying to reach could not be found.
          This could be because:
        </p>
        <p className="small">The page does not exists.</p>
        <Divider horizontal>or</Divider>
        <p className="small">The page exists, but you do not have permission to access it.</p>
      </div>
    );
  }
}
