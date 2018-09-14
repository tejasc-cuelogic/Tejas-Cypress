import React, { Component } from 'react';
import { Header, Grid, Segment, Label, List, Image } from 'semantic-ui-react';
import noEarlyBird from '../../../../../assets/images/illustration.png';

class BonusRewards extends Component {
  render() {
    return (
      <div className="campaign-about-wrapper">
        <Header as="h3">Bonus Rewards</Header>
        <Grid stackable doubling columns={3}>
          <Grid.Row>
            <Grid.Column>
              <Segment padded className="reward-block">
                <Header as="h6">Early Bird Reward
                  <Image circular src={noEarlyBird} floated="right" />
                  <Header.Subheader>
                    <Label size="small" color="green" className="text-uppercase">49 remaining</Label>
                  </Header.Subheader>
                </Header>
                <Header as="h5" className="intro-text">First 100 investors who invest $1,000 or more will receive:</Header>
                <List as="ul" className="rewards">
                  <List.Item as="li">
                    <List.Header>Complimentary bottle</List.Header>
                    <List.Description>
                      on your birthday within our first year of opening and used during your
                      birthday month
                    </List.Description>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>$50 Gift Certificate</List.Header>
                  </List.Item>
                </List>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment padded>
                <Header as="h6">Invest</Header>
                <Header as="h3" className="highlight-text">$100+</Header>
                <List as="ul" className="rewards">
                  <List.Item as="li">
                    <List.Header>VIP Launch Party</List.Header>
                    <List.Description>2 private invitations</List.Description>
                  </List.Item>
                </List>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment padded>
                <Header as="h6">Invest</Header>
                <Header as="h3" className="highlight-text">$500+</Header>
                <List as="ul" className="rewards">
                  <List.Item as="li">
                    <List.Header>VIP Launch Party</List.Header>
                    <List.Description>4 private invitations</List.Description>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>$50 Gift Certificate</List.Header>
                  </List.Item>
                </List>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Segment padded>
                <Header as="h6">Invest</Header>
                <Header as="h3" className="highlight-text">$1,000+</Header>
                <List as="ul" className="rewards">
                  <List.Item as="li">
                    <List.Header>Pour Behaviour Silver Card <small>(see below)</small></List.Header>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>VIP Launch Party</List.Header>
                    <List.Description>6 private invitations</List.Description>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>$50 Gift Certificate</List.Header>
                  </List.Item>
                </List>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment padded>
                <Header as="h6">Invest</Header>
                <Header as="h3" className="highlight-text">$2,500+</Header>
                <List as="ul" className="rewards">
                  <List.Item as="li">
                    <List.Header>Pour Behaviour Gold Card <small>(see below)</small></List.Header>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>VIP Launch Party</List.Header>
                    <List.Description>
                      8 private invitations (table reservation if available)
                    </List.Description>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>$100 Gift Certificate</List.Header>
                  </List.Item>
                </List>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment padded>
                <Header as="h6">Invest</Header>
                <Header as="h3" className="highlight-text">$5,000+</Header>
                <List as="ul" className="rewards">
                  <List.Item as="li">
                    <List.Header>Pour Behaviour Gold Card <small>(see below)</small></List.Header>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>Complimentary bottle</List.Header>
                    <List.Description>On your birthday</List.Description>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>VIP Launch Party</List.Header>
                    <List.Description>
                      10 private invitations (table reservation if available)
                    </List.Description>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>$100 Gift Certificate</List.Header>
                  </List.Item>
                </List>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Segment padded>
                <Header as="h6">Invest</Header>
                <Header as="h3" className="highlight-text">$10,000+</Header>
                <List as="ul" className="rewards">
                  <List.Item as="li">
                    <List.Header>Free draft beer for LIFE!</List.Header>
                    <List.Description>1 per day in perpetuity</List.Description>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>
                      Pour Behaviour Platinum Card <small>(see below)</small>
                    </List.Header>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>VIP Launch Party</List.Header>
                    <List.Description>
                      15 private invitations (guaranteed table reservation)
                    </List.Description>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>$500 Gift Certificate</List.Header>
                  </List.Item>
                </List>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment padded>
                <Header as="h6">Invest</Header>
                <Header as="h3" className="highlight-text">$25,000+</Header>
                <List as="ul" className="rewards">
                  <List.Item as="li">
                    <List.Header>Name a Table</List.Header>
                    <List.Description>
                      In order of investment, pick a table to name which guarantees your section
                      for Fri/Sat/Special Events/Concerts (Name to be approved)
                    </List.Description>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>
                      Pour Behaviour Black Card <small>(see below)</small>
                    </List.Header>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>
                      Free draft beer for LIFE! <small>(1 per day in perpetuity)</small>
                    </List.Header>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>Complimentary bottle</List.Header>
                    <List.Description>On your birthday</List.Description>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>VIP Launch Party</List.Header>
                    <List.Description>
                      20 private invitations (guaranteed table reservation)
                    </List.Description>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>$1,000 Gift Certificate</List.Header>
                  </List.Item>
                </List>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment padded>
                <Header as="h6">Invest</Header>
                <Header as="h3" className="highlight-text">$10,000+</Header>
                <List as="ul" className="rewards">
                  <List.Item as="li">
                    <List.Header>Complimentary Tasting & Name a Cocktail</List.Header>
                    <List.Description>
                      Add your story to the menus as a description of the cocktail you name.
                      (Name to be approved)
                    </List.Description>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>Name a Table</List.Header>
                    <List.Description>
                      In order of investment, pick a table to name which guarantees your section
                      for Fri/Sat/Special Events/Concerts (Name to be approved)
                    </List.Description>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>Pour Behaviour Black Card <small>(see below)</small></List.Header>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>
                      Free draft beer for LIFE! <small>(1 per day in perpetuity)</small>
                    </List.Header>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>Complimentary bottle</List.Header>
                    <List.Description>On your birthday</List.Description>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>VIP Launch Party</List.Header>
                    <List.Description>
                      25 private invitations (guaranteed table reservation)
                    </List.Description>
                  </List.Item>
                  <List.Item as="li">
                    <List.Header>$2,000 Gift Certificate</List.Header>
                  </List.Item>
                </List>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
      // <Grid>
      //   <Grid.Row>
      //     <Grid.Column width={12}>
      //     </Grid.Column>
      //     <Grid.Column width={4} />
      //   </Grid.Row>
      // </Grid>
    );
  }
}

export default BonusRewards;
