/* eslint-disable */
import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Header, Grid, Segment, Button, Divider } from 'semantic-ui-react';
import DocumentModal from './DataRoom/DocumentModal';

@inject('campaignStore', 'uiStore', 'accreditationStore', 'authStore')
@withRouter
@observer
export default class Documents extends Component {
  state = {
    doc: null,
  }
  componentWillMount() {
    if (this.props.authStore.isUserLoggedIn
      && isEmpty(this.props.accreditationStore.userData)) {
      this.props.accreditationStore.getUserAccreditation();
    }
  }
  openDocument = (doc) => {
    this.setState({ doc });
  }

  close = () => this.setState({ doc: null });

  render() {
    const { dataRoomDocs } = this.props.campaignStore;
    return (
      <div>
        <Header as="h3" className={`${this.props.newLayout ? 'mt-40' : 'mt-20'} anchor-wrap mb-30`}>
          Documents
          <span className="anchor" id="data-room" />
        </Header>
        <Divider hidden />
        <Grid columns={3} stackable doubling>
          {
            dataRoomDocs.length && dataRoomDocs.map(l => (
              <Grid.Column>
                <Segment padded textAlign="center" className="legal-documents">
                  <p>{l.name}</p>
                  <Button
                    onClick={() => this.openDocument(l)}
                    className="relaxed"
                    primary
                    compact
                  >
                    View
                  </Button>
                </Segment>
              </Grid.Column>
            ))
          }
        </Grid>
        {this.state.doc
        &&
        <DocumentModal doc={this.state.doc} close={this.close} />
        }
      </div>
    );
  }
}
