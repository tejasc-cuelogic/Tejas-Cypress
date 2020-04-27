import React, { Component } from 'react';
import { Header, Container, Grid, Responsive, Divider, List } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import NSImage from '../../../shared/NSImage';
import { InlineLoader, IframeModal } from '../../../../theme/shared';
import TeamList from './TeamList';

@inject('teamStore', 'uiStore', 'publicStore', 'campaignStore')
@observer
class Team extends Component {
  constructor(props) {
    super(props);
    props.teamStore.initRequest();
    props.publicStore.getJobListing();
    this.state = {
      open: false,
      embedUrl: '',
    };
  }

  closeModal = () => {
    this.setState({ open: false });
  }

  openDoc = (id) => {
    this.setState({ loading: true, open: true });
    this.props.campaignStore.getBoxLink(id, 'SERVICES').then((res) => {
      this.setState({ embedUrl: res, loading: false });
    });
   }

  render() {
    const { teamMembers, loading } = this.props.teamStore;
    const { responsiveVars } = this.props.uiStore;
    const { jobsList } = this.props.publicStore;
    const teamInfo = (
      <Grid centered className="team-list">
        <TeamList
          columns={4}
          hasJob={jobsList.length}
          className="team-gallery"
          match={this.props.match}
          joinColumn={responsiveVars.isMobile}
        />
      </Grid>
    );
    return (
      <>
        <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
          <Container>
            <Grid centered>
              <Grid.Column textAlign={responsiveVars.isMobile ? 'left' : 'center'} computer={15} tablet={14} mobile={16}>
                <Header as="h2" className={responsiveVars.isMobile ? 'mb-10' : 'mb-30'}>Meet our team</Header>
                <p className={`${responsiveVars.isMobile ? 'mb-40' : 'mb-60'} neutral-text`}>
                  We{'\''}re a team of entrepreneurs with backgrounds in business, finance, law, marketing and technology.<Responsive minWidth={992} as="br" /> We{'\''}re here to empower business owners and everyday people to invest in one another.
                </p>
                {loading ? (<InlineLoader />)
                  : teamMembers.length === 0 ? <section className="center-align"><h3 style={{ color: '#31333d' }}>No Records to Display</h3></section>
                    : teamInfo}
              </Grid.Column>
            </Grid>
          </Container>
        </section>
        <Divider fitted as={Container} />
        <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
          <Container>
            <Grid centered reversed="mobile">
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="left">
                <Header as="h2" className="mb-30">Democratize finance. <Responsive minWidth={992} as="br" />Create change. <Responsive minWidth={992} as="br" />Join our team.</Header>
                {responsiveVars.isMobile
                  && <NSImage path="collage.jpg" className="mb-30" fluid />}
                <p>
                  We’re just getting started in our journey to shape the future of finance in local communities. We’re looking for talented and motivated individuals who are seeking an adventure to learn new skills and cover new ground.
                </p>
                {!responsiveVars.isMobile
                  && <Divider hidden />}
                <p>
                  If you are a self-starter and love working in a dynamic environment, NextSeed may be the place for you.
                </p>
                <Divider hidden />
                <p>
                  <b>Contact info:</b> Submit your resume to <a target="_blank" rel="noreferrer noopener" href="mailto:jobs@nextseed.com">jobs@nextseed.com</a> <br />and indicate position in the subject line.
                </p>
              </Grid.Column>
              {!responsiveVars.isMobile
                && (
                  <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} verticalAlign="middle">
                    <NSImage path="collage.jpg" fluid />
                  </Grid.Column>
                )}
                <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="left">
                {loading
                  ? (<InlineLoader />)
                  : (
                    <div id="job-position">
                      <Header as="h3" className={responsiveVars.isMobile ? 'mt-40' : 'mt-50'}>Current Positions</Header>
                      <List divided relaxed="very" className="job-list">
                        {jobsList.map(i => (
                          <List.Item>
                            <List.Content>
                              <List.Header style={{ cursor: 'pointer' }} onClick={() => this.openDoc(i.BOX_FILE_ID)} className="highlight-text">{i.POSITION}</List.Header>
                              <List.Description className="neutral-text">{`${i.CITY} ${i.STATE}`}</List.Description>
                            </List.Content>
                          </List.Item>
                        ))
                        }
                      </List>
                    </div>
                  )
                }
                </Grid.Column>
            </Grid>
          </Container>
        </section>
        <Divider fitted as={Container} />
        <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
          <Container>
            <Grid centered stackable>
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 8}>
                {responsiveVars.uptoTablet
                  && <Header as="h2" className="mb-30">Our Offices</Header>}
                <NSImage path="map.png" fluid />
              </Grid.Column>
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="right" verticalAlign="middle" textAlign="left">
                {!responsiveVars.uptoTablet
                  && <Header as="h2" className="mb-30">Our Offices</Header>}
                <p>
                  We are headquartered in Houston, TX with satellite offices in Austin, New York and Los Angeles.
                </p>
              </Grid.Column>
            </Grid>
          </Container>
        </section>
        <IframeModal
          open={this.state.open}
          close={this.closeModal}
          srcUrl={this.state.embedUrl}
          loading={this.state.loading}
        />
      </>
    );
  }
}
export default Team;
