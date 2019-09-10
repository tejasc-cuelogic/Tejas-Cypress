import React, { Component } from 'react';
import { Header, Container, Grid, Divider, Responsive, Button } from 'semantic-ui-react';
import { observer, inject } from 'mobx-react';
import NSImage from '../../../shared/NSImage';
import { InlineLoader, IframeModal } from '../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;


@inject('publicStore', 'campaignStore')
@observer
class Careers extends Component {
  state = {
    showModal: false,
    srcUrl: '',
    docLoading: false,
  }

  constructor(props) {
    super(props);
    props.publicStore.getJobListing();
  }

  openDoc = (boxFileId) => {
    this.setState({ srcUrl: '', docLoading: true, showModal: true });
    this.props.campaignStore.getBoxLink(boxFileId).then((res) => {
      this.setState({ srcUrl: res, docLoading: false });
    });
  }

  closeModal = () => {
    this.setState({ srcUrl: '', docLoading: false, showModal: false });
  }

  render() {
    const { jobsList, loading } = this.props.publicStore;
    return (
    <section>
      <Container>
        <Grid centered>
          <Grid.Column textAlign={isMobile ? 'left' : 'center'} computer={12} tablet={12} mobile={16}>
            <Header as="h2">
              Democratize finance. Create change.<Responsive minWidth={992} as="br" />
              Join our team.
            </Header>
            <p className="mt-30">
              We’re just getting started in our journey to shape the future of finance in
              local communities. We’re looking for talented and motivated individuals who
              are seeking an adventure to learn new skills and cover new ground. If you are
              a self-starter and love working in a dynamic environment, NextSeed may be
              the place for you.
            </p>
            {/* <div className="center-align mt-30 mb-50">
              <Button
                onClick={() => window.open('https://nextseed.workable.com/', '_blank')}
                primary
              >
              See Job Listings
              </Button>
            </div> */}
            <NSImage path="collage.jpg" className="careers-banner mt-40 mb-50" />
            <Divider hidden section />
            <Header as="h4">About NextSeed</Header>
            <p>
              NextSeed Inc. (<a target="_blank" rel="noreferrer noopener" href="https://www.nextseed.com">www.nextseed.com</a>) is a
              financial technology company designed to empower mainstream entrepreneurs with
              financing needs and connect them to investors (whether individuals or firms)
              looking to invest directly into local businesses and commercial real estate
              projects as a differentiated private asset class. We have developed a unique
              online marketplace that enables entrepreneurs to fundraise through both accredited
              and non-accredited investors across the country. NextSeed Inc.’s affiliate,
              NextSeed Securities, is a registered broker dealer and FINRA member.
            </p>
            <p>
              We are headquartered in Houston, TX with satellite offices in Austin, New York
              and Los Angeles. As a rapidly growing startup that leverages cutting edge
              technologies to help us scale quickly, we are looking for highly motivated
              individuals to join the team.
            </p>
            <p>
              Contact info: Submit your resume to <a target="_blank" rel="noreferrer noopener" href="mailto:jobs@nextseed.com">jobs@nextseed.com</a>
              and indicate position in the subject line.
            </p>
            <Divider section hidden />
            {loading
              ? (<InlineLoader />)
              : (
                <>
                <Header as="h4" className="mb-30">Current Positions</Header>
                <Grid columns={3} stackable doubling centered>
                {jobsList.map(i => (
                <Grid.Column textAlign="center" className="mb-20">
                <Header as="h5" className="mb-10">
                  <Button className="link-button highlight-text" onClick={() => this.openDoc(i.BOX_FILE_ID)}>{i.POSITION}</Button>
                </Header>
                <Header.Subheader>
                  {`${i.CITY} ${i.STATE}`}
                </Header.Subheader>
              </Grid.Column>
                ))
                }
            </Grid>
                </>
              )
            }
          </Grid.Column>
        </Grid>
      </Container>
      <IframeModal open={this.state.showModal} srcUrl={this.state.srcUrl} loading={this.state.docLoading} close={this.closeModal} />
    </section>
    );
  }
}

export default Careers;
