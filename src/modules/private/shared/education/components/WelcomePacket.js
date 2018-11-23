import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';

const boxRef = {
  demo: 'https://nextseed.box.com/s/v7damnl8jh75ize4xrbu8dl0lj0rvxja',
  develop: 'https://nextseed.box.com/s/qda0prkhki8pk9lxr8dc4vlstwgmia5b',
  qa: 'https://nextseed.box.com/s/rbiewvvoyz787xempqimccrzxgjism7l',
};
export default class WelcomePacket extends Component {
  render() {
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column className="welcome-packet">
              <div className="pdf-viewer">
                <iframe width="100%" height="100%" title="agreement" src={boxRef[process.env.REACT_APP_DEPLOY_ENV] || boxRef.develop} />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
