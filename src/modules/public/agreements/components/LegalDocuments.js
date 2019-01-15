import React, { Component } from 'react';
import Aux from 'react-aux';
import { observer, inject } from 'mobx-react';
import { Header, Grid, Segment, Button, Divider } from 'semantic-ui-react';
import { InlineLoader } from '../../../../theme/shared';

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
@observer
export default class LegalDocuments extends Component {
  componentWillMount() {
    const {
      setLoading, getLegalDocsFileIds, setFileIdsData, legalDocsList,
    } = this.props.agreementsStore;
    if (!legalDocsList.length) {
      setLoading(true);
      getLegalDocsFileIds().then((res) => {
        setLoading(false);
        setFileIdsData(legalDocsMeta, res.getLegalDocsFileIds);
      });
    }
  }
  getBoxUrl = (boxId) => {
    this.props.agreementsStore.setLoading(true);
    this.props.agreementsStore.getBoxLink(boxId).then((res) => {
      this.props.agreementsStore.setLoading(false);
      window.open(res.data.getBoxEmbedLink, '_blank');
    });
  }
  render() {
    const { legalDocsList, docLoading } = this.props.agreementsStore;
    if (docLoading) {
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
                  <Button className="relaxed" onClick={() => this.getBoxUrl(l.boxId)} primary compact>View</Button>
                </Segment>
              </Grid.Column>
            ))
          }
        </Grid>
      </Aux>
    );
  }
}
