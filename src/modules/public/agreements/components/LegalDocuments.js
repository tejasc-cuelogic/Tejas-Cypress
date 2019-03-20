/* eslint-disable */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { Route, withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Header, Grid, Segment, Button, Divider } from 'semantic-ui-react';
import { InlineLoader, IframeModal } from '../../../../theme/shared';

// const isSmallScreen = document.documentElement.clientWidth >= 1024
// && document.documentElement.clientWidth < 1200;

const legalDocsMeta = [
  {
    id: 1, docName: (<Aux>NextSeed Securities LLC Privacy Policy</Aux>), refEnum: 'SECURITIES_PRIVACY_POLICY',
  },
  {
    id: 2, docName: (<Aux>NextSeed Securities LLC BCP Disclosure Statement</Aux>), refEnum: 'SECURITIES_BCP_DISCLOSURE',
  },
  {
    id: 3, docName: (<Aux>NextSeed Securities LLC CIP Notice</Aux>), refEnum: 'SECURITIES_CIP_NOTICE',
  },
  {
    id: 4, docName: (<Aux>NextSeed Securities LLC Brokercheck Notice</Aux>), refEnum: 'SECURITIES_BROKER_CHECK',
  },
  {
    id: 5, docName: (<Aux>NextSeed Securities LLC Investor Agreement</Aux>), refEnum: 'SECURITIES_INVESTOR_AGREEMENT',
  },
  {
    id: 6, docName: (<Aux>NextSeed US LLC Membership Agreement</Aux>), refEnum: 'MEMBERSHIP_AGREEMENT',
  },
];

@inject('agreementsStore')
@withRouter
@observer
class LegalDoc extends Component {
  state = { embedUrl: null };
  componentWillMount() {
    const { docKey } = this.props.match.params;
    const { legalDocs } = this.props.agreementsStore;
    const legalDoc = legalDocs.find(d => d.refEnum.toLowerCase() === docKey);
    if (legalDoc) {
      this.getBoxUrl(legalDoc.boxId);
    }
  }
  getBoxUrl = (boxId) => {
    this.props.agreementsStore.setField('docLoading', true);
    this.props.agreementsStore.getBoxLink(boxId).then((res) => {
      this.setState({
        embedUrl: res.data.getBoxEmbedLink,
      });
      this.props.agreementsStore.setField('docLoading', false);
    });
  }
  close = () => this.props.history.push('/agreements/legal/legal-documents');
  render() {
    const { docIdsLoading, docLoading } = this.props.agreementsStore;
    return (
      <IframeModal
        srcUrl={this.state.embedUrl}
        loading={docIdsLoading || docLoading}
        open
        close={this.close}
      />
    );
  }
}
@inject('agreementsStore')
@observer
export default class LegalDocuments extends Component {
  state = { loaded: false };
  componentWillMount() {
    const {
      getLegalDocsFileIds, setFileIdsData, legalDocsList,
    } = this.props.agreementsStore;
    if (!legalDocsList.length) {
      getLegalDocsFileIds().then((res) => {
        setFileIdsData(legalDocsMeta, res.getLegalDocsFileIds);
        this.setState({ loaded: true });
      });
    } else {
      this.setState({ loaded: true });
    }
  }
  componentWillUnmount() {
    this.props.agreementsStore.setField('alreadySet', false);
  }
  render() {
    const { legalDocsList, docIdsLoading } = this.props.agreementsStore;
    if (docIdsLoading) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        <Header as="h2">Legal Documents</Header>
        <Divider hidden />
        <Grid columns={3} stackable doubling>
          {
            legalDocsList.map(l => (
              <Grid.Column key={l.id}>
                <Segment padded textAlign="center" className="legal-documents">
                  <p>{l.docName}</p>
                  <Button
                    as={Link}
                    to={`${this.props.match.url}/${l.refEnum.toLowerCase()}`}
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
        {this.state.loaded &&
          <Route path={`${this.props.match.url}/:docKey`} component={LegalDoc} />
        }
      </Aux>
    );
  }
}
