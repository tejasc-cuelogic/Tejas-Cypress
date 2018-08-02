import React, { Component } from 'react';
import { Header, Icon, Grid, Image, Embed, List, Divider, Breadcrumb, Segment, Reveal, Modal } from 'semantic-ui-react';
import videoPoster from '../../../../../assets/images/636206632.webp';
import campainAboutImg from '../../../../../assets/images/campaign_about.png';
import teamMember1 from '../../../../../assets/images/james-wright.png';
import teamMember2 from '../../../../../assets/images/owner-1.jpg';
import teamMember3 from '../../../../../assets/images/owner-2.jpg';
import businessModel from '../../../../../assets/images/business_model.png';
import interiorView from '../../../../../assets/images/interior-view-patio-garden.jpg';

const nsvideos = {
  embed: '218642510',
};

class AboutCompany extends Component {
  state = { modalOpen: false }
  handleOpen = () => this.setState({ modalOpen: true })
  handleClose = () => this.setState({ modalOpen: false })
  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={12}>
            <div className="campaign-about-wrapper">
              <div className="carousel">
                <Image src={videoPoster} />
              </div>
              <Header as="h3">Buffbrew Taproom LLC</Header>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae vitae
                dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                sit aspernatur aut odit aut fugit, sed quia consequuntur magni
                dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
                quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                adipisci velit, sed quia non numquam eius modi tempora incidunt ut
                labore et dolore magnam aliquam quaerat voluptatem. Sed ut perspiciatis
                unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem
                quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
                magni dolores eos qui ratione voluptatem sequi nesciunt.
              </p>
              <Divider section />
              <Grid columns={2} stackable>
                <Grid.Column verticalAlign="middle" textAlign="center">
                  <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi.
                  </p>
                </Grid.Column>
                <Grid.Column>
                  <Embed
                    id={nsvideos.embed}
                    placeholder={videoPoster}
                    source="vimeo"
                  />
                </Grid.Column>
              </Grid>
              <Divider section />
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae vitae
                dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                sit aspernatur aut odit aut fugit, sed quia consequuntur magni
                dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
                quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                adipisci velit, sed quia non numquam eius modi tempora incidunt ut
                labore et dolore magnam aliquam quaerat voluptatem.
              </p>
              <Image src={campainAboutImg} centered />
              <p className="note">
                Caption. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Vivamus dignissim vitae odio nec pellentesque.
              </p>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae vitae
                dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                sit aspernatur aut odit aut fugit, sed quia consequuntur magni
                dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
                quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                adipisci velit, sed quia non numquam eius modi tempora incidunt ut
                labore et dolore magnam aliquam quaerat voluptatem.
              </p>
              <Header as="h5">
                Breaking ground this winter, the Buffbrew Taproom is expected to open at Sawyer
                Yards at the end of 2018.
              </Header>

              <div className="history-section">
                <Header as="h3">History</Header>
                <List>
                  <List.Item>
                    <Icon name="flag outline" color="green" />
                    <List.Content>
                      <List.Header>January 2012</List.Header>
                      <List.Description>
                        Original Buffalo Bayou Brewery location on Nolda Street opens
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <Icon name="flag outline" color="green" />
                    <List.Content>
                      <List.Header>December 2012</List.Header>
                      <List.Description>
                        Barrel production of 750 during first year
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <Icon name="flag outline" color="green" />
                    <List.Content>
                      <List.Header>December 2012</List.Header>
                      <List.Description>
                        Barrel production of 750 during first year
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <Icon name="flag outline" color="green" />
                    <List.Content>
                      <List.Header>December 2012</List.Header>
                      <List.Description>
                        Barrel production of 750 during first year
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <Icon name="flag outline" color="green" />
                    <List.Content>
                      <List.Header>December 2012</List.Header>
                      <List.Description>
                        Barrel production of 750 during first year
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <Icon name="flag checkered" color="green" />
                    <List.Content>
                      <List.Header>
                        Winter 2018 Anticipated opening of Buffbrew Taproom at Sawyer Yard
                      </List.Header>
                    </List.Content>
                  </List.Item>
                </List>
              </div>
            </div>
          </Grid.Column>
          <Grid.Column width={4}>
            <div className="campaign-right-sidebar">
              <Segment padded>
                <Breadcrumb>
                  <Breadcrumb.Section>
                  Meet our team
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon="right chevron" />
                </Breadcrumb>
                <Grid doubling columns={3}>
                  <Grid.Column>
                    <Reveal animated="small fade">
                      <Reveal.Content hidden>
                        <div className="team-overlay">
                          <p>Lorem Ipsum</p>
                        </div>
                      </Reveal.Content>
                      <Reveal.Content visible>
                        <Image src={teamMember1} circular />
                      </Reveal.Content>
                    </Reveal>
                  </Grid.Column>
                  <Grid.Column>
                    <Reveal animated="fade">
                      <Reveal.Content hidden>
                        <div className="team-overlay">
                          <p>Lorem Ipsum</p>
                        </div>
                      </Reveal.Content>
                      <Reveal.Content visible>
                        <Image src={teamMember2} circular />
                      </Reveal.Content>
                    </Reveal>
                  </Grid.Column>
                  <Grid.Column>
                    <Reveal animated="fade">
                      <Reveal.Content hidden>
                        <div className="team-overlay">
                          <p>Lorem Ipsum</p>
                        </div>
                      </Reveal.Content>
                      <Reveal.Content visible>
                        <Image src={teamMember3} circular />
                      </Reveal.Content>
                    </Reveal>
                  </Grid.Column>
                  <Grid.Column>
                    <Reveal animated="fade">
                      <Reveal.Content hidden>
                        <div className="team-overlay">
                          <p>Lorem Ipsum</p>
                        </div>
                      </Reveal.Content>
                      <Reveal.Content visible>
                        <Image src={teamMember1} circular />
                      </Reveal.Content>
                    </Reveal>
                  </Grid.Column>
                  <Grid.Column>
                    <Reveal animated="fade">
                      <Reveal.Content hidden>
                        <div className="team-overlay">
                          <p>Lorem Ipsum</p>
                        </div>
                      </Reveal.Content>
                      <Reveal.Content visible>
                        <Image src={teamMember2} circular />
                      </Reveal.Content>
                    </Reveal>
                  </Grid.Column>
                </Grid>
              </Segment>
              <Segment padded>
                <Breadcrumb>
                  <Breadcrumb.Section onClick={this.handleOpen}>Business Model</Breadcrumb.Section>
                  <Breadcrumb.Divider icon="right chevron" />
                </Breadcrumb>
                <Image src={businessModel} />
              </Segment>
              <Segment padded>
                <Breadcrumb>
                  <Breadcrumb.Section>
                    Location Analysis
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon="right chevron" />
                </Breadcrumb>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.8980695673813!2d73.87562555088532!3d18.53350778733976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c0f824992459%3A0x4f126e7b4c0ac0f6!2sCuelogic+Technologies!5e0!3m2!1sen!2sin!4v1530687811942"
                  title="test"
                />
              </Segment>
            </div>
          </Grid.Column>
        </Grid.Row>

        <Modal
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeIcon
          size="large"
        >
          <Header as="h3">
          Business Model
          </Header>
          <Modal.Content image scrolling>
            <Image size="large" src={interiorView} wrapped />
            <Modal.Description>
              <p>
                The Buffbrew Taproom will generate revenue streams from restaurant sales, tap
                sales, beer garden sales and facility tour and event sales.
              </p>
              <p>
                Guests will stampede to the taproom to taste flavors and varieties of craft
                brews that just don’t exist elsewhere, putting more beer into more hands than
                ever before. The state-of-the-art facility will offer more than 40 Buffbrew taps.
              </p>
              <p>
                Operating 7 days a week, the space will be open for lunch and dinner daily with
                extended weekend hours. By comparison, the taproom at Nolda is currently open only
                twice a week and with less product and no food.
              </p>
              <p>
                There will be three distinct tap areas woven into the brewery at each level. On the
                first floor, a dedicated bar will be positioned next to the tanks to give visitors
                an old school brewery feel with access to a patio with outdoor seating. Situated on
                the building’s second floor, the main taproom is designed to be a fully immersive
                Buffbrew facility adventure. The brewing tanks will be centrally located to provide
                a theater-in-the-round experience. Large glass windows will allow guests to at once
                enjoy brews and view the brewing process. Finally, a third floor roof deck and VIP
                event space will maximize the position of the taproom. The views from the space will
                be a tremendous draw for private events and social gatherings. Reservations will be
                a source of business for the patio space and the party room.
              </p>
              <p>
                The taproom also sits adjacent to the full-service kitchen. The chef and menu have
                yet to be finalized, but the concept will feature an elevated bar menu that will
                seek to match the creativity of the brewery. Restaurant seating will accommodate
                over 200 guests with an additional 25 seats at the bar.
              </p>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </Grid>
    );
  }
}

export default AboutCompany;
