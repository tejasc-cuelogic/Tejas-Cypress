import React from 'react';
// import { Message } from 'semantic-ui-react';

export default class NotFound extends React.Component {
  render() {
    return (
      // <div className="content-spacer">
      //   <Message info>
      //     <Message.Header>Was this what you wanted?</Message.Header>
      //     <p>Did you know it`s been a while?</p>
      //   </Message>
      // </div>
      <div className="ui one column grid">
        <div className="column nsContent" style={{ margin: '50px' }}>
          <div>
            <span className="title">Page Not Found</span>
            <p className="pageContent">
              The page you were trying to reach could not be found.
              This could be because:
              <ul>
                <li>The page does not exists.</li>
                <li>The page exists, but you do not have permission to access it.</li>
              </ul>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
