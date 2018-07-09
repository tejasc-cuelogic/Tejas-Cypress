import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { Grid, Image, Header, Divider, Embed, Icon, List, Segment, Breadcrumb, Reveal, Modal } from 'semantic-ui-react';
import CampaignSideBar from './CampaignSideBar';
import videoPoster from '../../../../assets/images/636206632.webp';
import campainAboutImg from '../../../../assets/images/campaign_about.png';
import teamMember1 from '../../../../assets/images/james-wright.png';
import teamMember2 from '../../../../assets/images/owner-1.jpg';
import teamMember3 from '../../../../assets/images/owner-2.jpg';
import businessModel from '../../../../assets/images/business_model.png';


const nsvideos = {
  embed: '218642510',
};

class aboutOffer extends Component {
  state = { modalOpen: false }
  handleOpen = () => this.setState({ modalOpen: true })
  handleClose = () => this.setState({ modalOpen: false })
  render() {
    return (
      <div className="offer-details">
        <CampaignSideBar />
        <div className="offering-wrapper">
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
                      <Breadcrumb.Section onClick={this.handleOpen}>
                      Meet our team
                      </Breadcrumb.Section>
                      <Breadcrumb.Divider icon="right chevron" />
                    </Breadcrumb>
                    <Grid doubling columns={3}>
                      <Grid.Column>
                        <Reveal animated="fade">
                          <Reveal.Content hidden>
                            <p>Lorem Ipsum</p>
                          </Reveal.Content>
                          <Reveal.Content visible>
                            <Image src={teamMember1} circular />
                          </Reveal.Content>
                        </Reveal>
                      </Grid.Column>
                      <Grid.Column>
                        <Reveal animated="fade">
                          <Reveal.Content hidden>
                            <p>Lorem Ipsum</p>
                          </Reveal.Content>
                          <Reveal.Content visible>
                            <Image src={teamMember2} circular />
                          </Reveal.Content>
                        </Reveal>
                      </Grid.Column>
                      <Grid.Column>
                        <Reveal animated="fade">
                          <Reveal.Content hidden>
                            <p>Lorem Ipsum</p>
                          </Reveal.Content>
                          <Reveal.Content visible>
                            <Image src={teamMember3} circular />
                          </Reveal.Content>
                        </Reveal>
                      </Grid.Column>
                      <Grid.Column>
                        <Reveal animated="fade">
                          <Reveal.Content hidden>
                            <p>Lorem Ipsum</p>
                          </Reveal.Content>
                          <Reveal.Content visible>
                            <Image src={teamMember1} circular />
                          </Reveal.Content>
                        </Reveal>
                      </Grid.Column>
                      <Grid.Column>
                        <Reveal animated="fade">
                          <Reveal.Content hidden>
                            <p>Lorem Ipsum</p>
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
                      <Breadcrumb.Section>Business Model</Breadcrumb.Section>
                      <Breadcrumb.Divider icon="right chevron" />
                    </Breadcrumb>
                    <Image src={businessModel} />
                  </Segment>
                  <Segment padded>
                    <Breadcrumb>
                      <Breadcrumb.Section onClick={this.handleOpen}>
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
          </Grid>

          <Modal
            open={this.state.modalOpen}
            onClose={this.handleClose}
            closeIcon
            size="large"
          >
            <Header as="h3">
            Meet the Team
            </Header>
            <Modal.Content scrolling>
              <Grid doubling columns={2} className="compact" verticalAlign="middle">
                <Grid.Column>
                  <Image src={campainAboutImg} />
                </Grid.Column>
                <Grid.Column className="padded">
                  <Header as="h3">
                    Rassul Zainfar
                    <Header.Subheader>co-founder & ceo</Header.Subheader>
                  </Header>
                  <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                  nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <div>
                    <Icon color="green" name="twitter" />
                    <Icon color="green" name="linkedin in" />
                  </div>
                </Grid.Column>
                <Grid.Column className="padded">
                  <Header as="h3">
                    Alex Grigss
                    <Header.Subheader>co-founder & Director of projects</Header.Subheader>
                  </Header>
                  <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                  nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <div>
                    <Icon color="green" name="twitter" />
                    <Icon color="green" name="linkedin in" />
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <Image src={campainAboutImg} />
                </Grid.Column>
              </Grid>
            </Modal.Content>
          </Modal>
        </div>
      </div>
    );
  }
}
export default aboutOffer;
