import ReactDOM from 'react-dom';
import promiseFinally from 'promise.prototype.finally';
import React from 'react';
import { useStrict } from 'mobx';
import { Provider, inject, observer } from 'mobx-react';
import { withRouter, BrowserRouter } from 'react-router-dom';
import { Container, Segment, List } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import NavBar from './components/common/NavBar';
import PrivateApp from './app/private/PrivateApp';
import PublicApp from './app/public/PublicApp';
import * as stores from './stores/stores';
import './assets/custom.css';
import './assets/main.css';
/**
 * Main react component
 */
@inject('userStore', 'commonStore', 'authStore')
@withRouter
@observer
class App extends React.Component {
  componentWillMount() {
    console.log('Loading App Component...');
  }

  render() {
    return (
      <div className="site">
        <NavBar
          appName={this.props.commonStore.appName}
          currentUser={this.props.userStore.currentUser}
        />
        <Container text className="site-content">
          <PrivateApp />
          <PublicApp />
        </Container>
        <Segment
          inverted
          vertical
          color="green"
          style={{ margin: '2em 0em 0em', padding: '1em 0em' }}
        >
          <Container textAlign="center">
            <List horizontal inverted divided link>
              <List.Item as="a" href="#">
                Site Map
              </List.Item>
              <List.Item as="a" href="#">
                Contact Us
              </List.Item>
              <List.Item as="a" href="#">
                Terms and Conditions
              </List.Item>
              <List.Item as="a" href="#">
                Privacy Policy
              </List.Item>
            </List>
          </Container>
        </Segment>
      </div>
    );
  }
}

// For easier debugging
window.APP_STATE = stores;

promiseFinally.shim();
useStrict(true);

ReactDOM.render(
  <Provider {...stores}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
