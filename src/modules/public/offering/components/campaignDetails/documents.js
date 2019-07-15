/* eslint-disable */
import React, { Component } from 'react';
import { Route, withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Header, Grid, Segment, Button, Divider } from 'semantic-ui-react';
import { IframeModal } from '../../../../../theme/shared';


@inject('campaignStore')
@withRouter
@observer
class LegalDoc extends Component {
  state = { embedUrl: null };
  componentWillMount() {
    const { docId } = this.props.match.params;
    const { campaign } = this.props.campaignStore;
    const regulation = get(campaign, 'regulation');
    const offeringRegulationArr = (regulation && regulation.split('_')) || '';
    const regulationType = get(offeringRegulationArr, '[0]');
    const accountType = regulationType === 'BD' ? 'SECURITIES' : 'SERVICES';
    this.getBoxUrl(docId, accountType);
  }
  getBoxUrl = (boxId) => {
    this.props.campaignStore.setFieldValue('docLoading', true);
    this.props.campaignStore.getBoxLink(boxId).then((res) => {
      this.setState({
        embedUrl: res.data.getBoxEmbedLink,
      });
      this.props.campaignStore.setFieldValue('docLoading', false);
    });
  }
  close = () => this.props.history.push(this.props.match.url);
  render() {
    const { docLoading } = this.props.campaignStore;
    return (
      <IframeModal
        srcUrl={this.state.embedUrl}
        loading={docLoading}
        open
        close={this.close}
      />
    );
  }
}
@inject('campaignStore', 'uiStore')
@withRouter
@observer
export default class Documents extends Component {
  render() {
    const { dataRoomDocs } = this.props.campaignStore;
    return (
      <>
        <Header as="h3" className="mt-20 mb-30 anchor-wrap">
            Documents
            <span className="anchor" />
            </Header>
        <Divider hidden />
        <Grid columns={3} stackable doubling>
          {
            dataRoomDocs.length && dataRoomDocs.map(l => (
              <Grid.Column>
                <Segment padded textAlign="center" className="legal-documents">
                  <p>{l.name}</p>
                  <Button
                    as={Link}
                    to={`${this.props.match.url}/${l.upload.fileId}`}
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
          <Route path={`${this.props.match.url}/:docId`} component={LegalDoc} />
      </>
    );
  }
}
