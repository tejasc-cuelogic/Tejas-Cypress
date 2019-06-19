import React from 'react';
import { Header, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import NSImage from './NSImage';

export default class NotFound extends React.Component {
  render() {
    return (
      <div className="error-page">
        <NSImage path="not-found.svg" centered />
        <Divider hidden section />
        <Header as="h2">Page Not Found</Header>
        <p>
          Yeesh. Well, this is awkward. Either this page doesn&apos;t exist or you
          don&apos;t have permission to access it.
          <br />
          Either way, let&apos;s head to the <Link to="/">HOME</Link> page or{' '}
          <Link to="/offerings">BROWSE</Link> some campaigns.
        </p>
      </div>
    );
  }
}
