import React, { Component } from 'react';
import { Header, Grid, Segment, Label, List, Image } from 'semantic-ui-react';
import noEarlyBird from '../../../../../assets/images/illustration.png';
import card1 from '../../../../../assets/images/cards/pour_cards_black.jpg';
import card2 from '../../../../../assets/images/cards/pour_cards_gold.jpg';
import card3 from '../../../../../assets/images/cards/pour_cards_plat.jpg';
import card4 from '../../../../../assets/images/cards/pour_cards_silver.jpg';

const isTablet = document.documentElement.clientWidth >= 768
&& document.documentElement.clientWidth < 992;
const isTabletLand = document.documentElement.clientWidth >= 992
&& document.documentElement.clientWidth < 1200;
class BonusRewards extends Component {
  render() {
    return (
      <div className="campaign-content-wrapper">
        <Grid stackable>
          <Grid.Column>
            <Header as="h3">Bonus Rewards</Header>
          </Grid.Column>
        </Grid>
        <Grid stackable doubling columns={isTablet ? 1 : isTabletLand ? 2 : 3}>
          <Grid.Column>
            <Segment padded className="reward-block">
              <Header as="h6">Early Bird Reward
                <Image src={noEarlyBird} floated="right" />
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
        </Grid>
        <Grid stackable>
          <Grid.Column>
            <Segment padded>
              <Grid columns={isTablet || isTabletLand ? 2 : 4} className="vertical-gutter" stackable divided>
                <Grid.Column>
                  <Image src={card1} />
                  <Header as="h5">Black Card</Header>
                  <p>
                    One Premium bottle per year, VIP/Supercar Parking (with advanced notice), 25%
                    discount every visit and Skip the Line for you and up to 16 guests (Fridays and
                    Saturdays + Special Events)
                  </p>
                </Grid.Column>
                <Grid.Column>
                  <Image src={card3} />
                  <Header as="h5">Platinum Card</Header>
                  <p>
                    0% discount every visit and Skip the Line for you and up to 9 guests (Fridays
                    and Saturdays + Special Events)
                  </p>
                </Grid.Column>
                <Grid.Column>
                  <Image src={card2} />
                  <Header as="h5">Gold Card</Header>
                  <p>
                    15% discount every visit and Skip the Line for you and up to 9 guests (Fridays
                    and Saturdays + Special Events)
                  </p>
                </Grid.Column>
                <Grid.Column>
                  <Image src={card4} />
                  <Header as="h5">Silver Card</Header>
                  <p>10% discount every visit</p>
                </Grid.Column>
              </Grid>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default BonusRewards;
