import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Header, Grid, Reveal, Image, Icon, Modal, Item } from 'semantic-ui-react';
import teamMember from '../../../../assets/images/team-member.jpg';
import campainAboutImg from '../../../../assets/images/campaign_about.png';

class team extends Component {
  state = { modalOpen: false }
  handleOpen = () => this.setState({ modalOpen: true })
  handleClose = () => this.setState({ modalOpen: false })
  render() {
    return (
      <Aux>
        <Grid stackable columns={2}>
          <Grid.Column>
            <Grid centered>
              <Grid.Column width={8}>
                <Header as="h2">Meet our team.</Header>
                <p>
                  We&apos;re a team of entrepreneurs with backgrounds in business, finance,
                  law, marketing and technology. We&apos;re here to empower business owners
                  and everyday people to invest in one another.
                </p>
              </Grid.Column>
            </Grid>
          </Grid.Column>
          <Grid.Column>
            <Grid columns={3} className="team-gallery">
              <Grid.Column>
                <Reveal animated="fade" onClick={this.handleOpen}>
                  <Reveal.Content hidden>
                    <div className="team-overlay">
                      <p><b>Abe Chu</b></p>
                      <p>Co-founder, CMO</p>
                    </div>
                  </Reveal.Content>
                  <Reveal.Content visible>
                    <Image src={teamMember} />
                  </Reveal.Content>
                </Reveal>
              </Grid.Column>
              <Grid.Column>
                <Reveal animated="fade">
                  <Reveal.Content hidden>
                    <div className="team-overlay">
                      <p><b>Abe Chu</b></p>
                      <p>Co-founder, CMO</p>
                    </div>
                  </Reveal.Content>
                  <Reveal.Content visible>
                    <Image src={teamMember} />
                  </Reveal.Content>
                </Reveal>
              </Grid.Column>
              <Grid.Column>
                <Reveal animated="fade">
                  <Reveal.Content hidden>
                    <div className="team-overlay">
                      <p><b>Abe Chu</b></p>
                      <p>Co-founder, CMO</p>
                    </div>
                  </Reveal.Content>
                  <Reveal.Content visible>
                    <Image src={teamMember} />
                  </Reveal.Content>
                </Reveal>
              </Grid.Column>
              <Grid.Column>
                <Reveal animated="fade">
                  <Reveal.Content hidden>
                    <div className="team-overlay">
                      <p><b>Abe Chu</b></p>
                      <p>Co-founder, CMO</p>
                    </div>
                  </Reveal.Content>
                  <Reveal.Content visible>
                    <Image src={teamMember} />
                  </Reveal.Content>
                </Reveal>
              </Grid.Column>
              <Grid.Column>
                <Reveal animated="fade">
                  <Reveal.Content hidden>
                    <div className="team-overlay">
                      <p><b>Abe Chu</b></p>
                      <p>Co-founder, CMO</p>
                    </div>
                  </Reveal.Content>
                  <Reveal.Content visible>
                    <Image src={teamMember} />
                  </Reveal.Content>
                </Reveal>
              </Grid.Column>
              <Grid.Column>
                <Reveal animated="fade">
                  <Reveal.Content hidden>
                    <div className="team-overlay">
                      <p><b>Abe Chu</b></p>
                      <p>Co-founder, CMO</p>
                    </div>
                  </Reveal.Content>
                  <Reveal.Content visible>
                    <Image src={teamMember} />
                  </Reveal.Content>
                </Reveal>
              </Grid.Column>
              <Grid.Column>
                <Reveal animated="fade">
                  <Reveal.Content hidden>
                    <div className="team-overlay">
                      <p><b>Abe Chu</b></p>
                      <p>Co-founder, CMO</p>
                    </div>
                  </Reveal.Content>
                  <Reveal.Content visible>
                    <Image src={teamMember} />
                  </Reveal.Content>
                </Reveal>
              </Grid.Column>
              <Grid.Column>
                <Reveal animated="fade">
                  <Reveal.Content hidden>
                    <div className="team-overlay">
                      <p><b>Abe Chu</b></p>
                      <p>Co-founder, CMO</p>
                    </div>
                  </Reveal.Content>
                  <Reveal.Content visible>
                    <Image src={teamMember} />
                  </Reveal.Content>
                </Reveal>
              </Grid.Column>
              <Grid.Column>
                <Reveal animated="fade">
                  <Reveal.Content hidden>
                    <div className="team-overlay">
                      <p><b>Abe Chu</b></p>
                      <p>Co-founder, CMO</p>
                    </div>
                  </Reveal.Content>
                  <Reveal.Content visible>
                    <Image src={teamMember} />
                  </Reveal.Content>
                </Reveal>
              </Grid.Column>
              <Grid.Column>
                <Reveal animated="fade">
                  <Reveal.Content hidden>
                    <div className="team-overlay">
                      <p><b>Abe Chu</b></p>
                      <p>Co-founder, CMO</p>
                    </div>
                  </Reveal.Content>
                  <Reveal.Content visible>
                    <Image src={teamMember} />
                  </Reveal.Content>
                </Reveal>
              </Grid.Column>
              <Grid.Column>
                <Reveal animated="fade">
                  <Reveal.Content hidden>
                    <div className="team-overlay">
                      <p><b>Abe Chu</b></p>
                      <p>Co-founder, CMO</p>
                    </div>
                  </Reveal.Content>
                  <Reveal.Content visible>
                    <Image src={teamMember} />
                  </Reveal.Content>
                </Reveal>
              </Grid.Column>
              <Grid.Column>
                <Reveal animated="fade">
                  <Reveal.Content visible>
                    <div className="team-overlay">
                      <Header as="h4" textAlign="center">
                        Join our team
                        <Header.Subheader as={Link} to="/">
                          <Icon color="green" className="ns-arrow-right" />
                          See open positions
                        </Header.Subheader>
                      </Header>
                    </div>
                  </Reveal.Content>
                  <Reveal.Content hidden />
                </Reveal>
              </Grid.Column>
            </Grid>
          </Grid.Column>
          <Modal
            open={this.state.modalOpen}
            onClose={this.handleClose}
            closeIcon
            size="large"
          >
            <Modal.Content scrolling>
              <Item.Group>
                <Item>
                  <Image src={campainAboutImg} />
                  <Item.Content verticalAlign="middle">
                    <Header as="h3">
                      Abe Chu
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
                  </Item.Content>
                </Item>
              </Item.Group>
            </Modal.Content>
          </Modal>
        </Grid>
      </Aux>
    );
  }
}

export default team;
