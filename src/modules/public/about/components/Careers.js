import React from 'react';
import { Header, Container, Grid, Divider, Responsive } from 'semantic-ui-react';
import NSImage from '../../../shared/NSImage';

const isMobile = document.documentElement.clientWidth < 768;
const Careers = () => (
  <>
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
              NextSeed Inc. (<a href="https://www.nextseed.com">www.nextseed.com</a>) is a
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
              Contact info: Submit your resume to <a href="mailto:jobs@nextseed.com">jobs@nextseed.com</a>
              and indicate position in the subject line.
            </p>
            <Divider section hidden />
            <Header as="h4" className="mb-30">Current Positions</Header>
            <Grid columns={3} stackable doubling centered>
              <Grid.Column textAlign="center" className="mb-20">
                <Header as="h5" className="mb-10">
                  <a href="/">Investment Banking Director</a>
                </Header>
                <Header.Subheader>
                  Houston, TX
                </Header.Subheader>
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid>
      </Container>
    </section>
  </>
);

export default Careers;
