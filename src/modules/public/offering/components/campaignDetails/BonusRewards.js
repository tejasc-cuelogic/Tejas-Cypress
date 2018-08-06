import React, { Component } from 'react';
import { Header, Grid, List, Label } from 'semantic-ui-react';

class BonusRewards extends Component {
  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={12}>
            <div className="campaign-about-wrapper">
              <Header as="h3">Bonus Rewards</Header>
              <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum convallis
              orci urna, vel ornare lectus vehicula eu. Quisque sollicitudin tortor in tellus
              tincidunt, at feugiat massa ultrices. Donec odio tortor, imperdiet eget commodo
              semper, luctus non metus. Mauris quis lorem non nulla auctor eleifend sit amet
              id diam.
              </p>
              <p>
              Sed dignissim odio egestas justo sagittis gravida. Sed sodales posuere arcu
              quis pharetra. Suspendisse maximus dui eleifend mi dignissim placerat.
              </p>
              <section>
                <List as="ul" className="rewards">
                  <List.Item as="li">
                    <Header as="h4">
                      Early Bird Reward
                      <Header.Subheader>
                        <Label color="green">49 remaining</Label>
                      </Header.Subheader>
                    </Header>
                    <div className="box">
                      <List as="ul">
                        <p><b>First 100 investors who invest $1,000 or more will recieve:</b></p>
                        <List.Item as="li">
                        Two tickets to the 2018 &quot;Last Christmas in July on Noida&quot;
                        Brewery Party
                        </List.Item>
                        <List.Item as="li">
                        $50 gift Certificate to the Taproom
                        </List.Item>
                      </List>
                    </div>
                  </List.Item>
                  <List.Item as="li">
                    <Header as="h4">
                      Invest $100+
                    </Header>
                    <div className="box">
                      <List as="ul">
                        <List.Item as="li">
                        Dollar Beers on Your Birthday
                        </List.Item>
                        <List.Item as="li">
                        Photo on the Website Contributor Page
                        </List.Item>
                        <List.Item as="li">
                        Nameplate Engraving on contributor Wall
                        </List.Item>
                        <List.Item as="li">
                        Mysterious Buffbrew Challenge Coin
                        </List.Item>
                      </List>
                    </div>
                  </List.Item>
                  <List.Item as="li">
                    <Header as="h4">
                      Invest $500+
                    </Header>
                    <div className="box">
                      <List as="ul">
                        <List.Item as="li">
                        Custom Commemorative Buffbrew Tankard
                        </List.Item>
                      </List>
                    </div>
                  </List.Item>
                  <List.Item as="li">
                    <Header as="h4">
                      Invest $1,000+
                    </Header>
                    <div className="box">
                      <List as="ul">
                        <List.Item as="li">
                        Free Beer for Life: Yes. Life.<br />(1 beer per day in perpetuity)
                        </List.Item>
                        <List.Item as="li">
                        2 Tickets to the Friend and Family Pre-Opening Party
                        </List.Item>
                      </List>
                    </div>
                  </List.Item>
                  <List.Item as="li">
                    <Header as="h4">
                    Invest $2,500+
                    </Header>
                    <div className="box">
                      <List as="ul">
                        <List.Item as="li">
                        1 Year Membership to the Buffbrew Virtual Bomber Locker Club:
                        </List.Item>
                        <List.Item as="li">
                        Includes 2 bombers (22 fl oz bottles) of your choosing, per month for
                        1 year. To be consumed on premise.
                        </List.Item>
                        <List.Item as="li">
                        Mysterious Buffbrew Challenge Coin
                        </List.Item>
                      </List>
                    </div>
                  </List.Item>
                  <List.Item as="li">
                    <Header as="h4">
                    Invest $5,000+
                    </Header>
                    <div className="box">
                      <List as="ul">
                        <List.Item as="li">
                        Invitation to Buffbrew Beer Dinner #1
                        </List.Item>
                        <List.Item as="li">
                        Mysterious Buffbrew Challenge Coin
                        </List.Item>
                      </List>
                    </div>
                  </List.Item>
                  <List.Item as="li">
                    <Header as="h4">
                    Invest $10,000+
                    </Header>
                    <div className="box">
                      <List as="ul">
                        <List.Item as="li">
                        Brewmaster for a Day Package
                        </List.Item>
                        <List.Item as="li">
                        Mysterious Buffbrew Challenge Coin
                        </List.Item>
                      </List>
                    </div>
                  </List.Item>
                  <List.Item as="li">
                    <Header as="h4">
                      Invest $25,000+
                    </Header>
                    <div className="box">
                      <List as="ul">
                        <List.Item as="li">
                        Brew Your Own Beer
                        </List.Item>
                        <List.Item as="li">
                        Mysterious Buffbrew Challenge Coin
                        </List.Item>
                      </List>
                    </div>
                  </List.Item>
                </List>
              </section>
            </div>
          </Grid.Column>
          <Grid.Column width={4} />
        </Grid.Row>
      </Grid>
    );
  }
}

export default BonusRewards;
