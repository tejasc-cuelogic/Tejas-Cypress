import React from 'react';
import { Header, Grid, Popup, List, Card, Button } from 'semantic-ui-react';

const BonusRewards = () => (
  <div className="inner-content-spacer">
    <Header as="h3">Your investment</Header>
    <Grid columns="equal" textAlign="center" className="investment-scale">
      <div className="invested">
        <span className="investment-progress" style={{ width: '58%' }} />
        <div className="amount" style={{ left: '58%' }}>Your investment <span>$7000</span></div>
      </div>
      <Grid.Row>
        <Grid.Column className="crossed">
          <Popup
            trigger={<span>$500</span>}
            position="bottom center"
            className="reward-info"
            wide
          >
            <Popup.Content>
              <Header as="h3" className="mb-half">Invest $500 or more</Header>
              <Header as="h5">Cooking Class</Header>
              <List bulleted>
                <List.Item>$50 Gift Card</List.Item>
                <List.Item>Invitation for 2 to the Launch Party</List.Item>
              </List>
            </Popup.Content>
          </Popup>
        </Grid.Column>
        <Grid.Column className="crossed">
          <Popup
            trigger={<span>$1000</span>}
            position="bottom center"
            className="reward-info"
            wide
          >
            <Popup.Content>
              <Header as="h3" className="mb-half">Invest $1000 or more</Header>
              <Header as="h5">Cooking Class</Header>
              <List bulleted>
                <List.Item>$50 Gift Card</List.Item>
                <List.Item>Invitation for 2 to the Launch Party</List.Item>
              </List>
            </Popup.Content>
          </Popup>
        </Grid.Column>
        <Grid.Column className="crossed">
          <Popup
            trigger={<span>$2,500</span>}
            position="bottom center"
            className="reward-info"
            wide
          >
            <Popup.Content>
              <Header as="h3" className="mb-half">Invest $2,500 or more</Header>
              <Header as="h5">Cooking Class</Header>
              <List bulleted>
                <List.Item>$50 Gift Card</List.Item>
                <List.Item>Invitation for 2 to the Launch Party</List.Item>
              </List>
            </Popup.Content>
          </Popup>
        </Grid.Column>
        <Grid.Column className="crossed">
          <Popup
            trigger={<span>$5,000</span>}
            position="bottom center"
            className="reward-info"
            wide
          >
            <Popup.Content>
              <Header as="h3" className="mb-half">Invest $5,000 or more</Header>
              <Header as="h5">Cooking Class</Header>
              <List bulleted>
                <List.Item>$50 Gift Card</List.Item>
                <List.Item>Invitation for 2 to the Launch Party</List.Item>
              </List>
            </Popup.Content>
          </Popup>
        </Grid.Column>
        <Grid.Column>
          <Popup
            trigger={<span>$10,000</span>}
            position="bottom center"
            className="reward-info"
            wide
          >
            <Popup.Content>
              <Header as="h3" className="mb-half">Invest $10,000 or more</Header>
              <Header as="h5">Cooking Class</Header>
              <List bulleted>
                <List.Item>$50 Gift Card</List.Item>
                <List.Item>Invitation for 2 to the Launch Party</List.Item>
              </List>
            </Popup.Content>
          </Popup>
        </Grid.Column>
        <Grid.Column>
          <Popup
            trigger={<span>$25,000</span>}
            position="bottom center"
            className="reward-info"
            wide
          >
            <Popup.Content>
              <Header as="h3" className="mb-half">Invest $25,000 or more</Header>
              <Header as="h5">Cooking Class</Header>
              <List bulleted>
                <List.Item>$50 Gift Card</List.Item>
                <List.Item>Invitation for 2 to the Launch Party</List.Item>
              </List>
            </Popup.Content>
          </Popup>
        </Grid.Column>
        <Grid.Column>
          <Popup
            trigger={<span>$50,000</span>}
            position="bottom center"
            className="reward-info"
            wide
          >
            <Popup.Content>
              <Header as="h3" className="mb-half">Invest $50,000 or more</Header>
              <Header as="h5">Cooking Class</Header>
              <List bulleted>
                <List.Item>$50 Gift Card</List.Item>
                <List.Item>Invitation for 2 to the Launch Party</List.Item>
              </List>
            </Popup.Content>
          </Popup>
        </Grid.Column>
      </Grid.Row>
    </Grid>
    <Header as="h3">Your rewards</Header>
    <Card.Group itemsPerRow={3}>
      <Card>
        <Card.Content>
          <Card.Header>$50 Gift Card</Card.Header>
          <Card.Description>
            Lorem ipsum dolor sit amet enim. Etiam ullamcorper.
          </Card.Description>
          <Button color="green">Redeem Reward</Button>
        </Card.Content>
      </Card>
      <Card>
        <Card.Content>
          <Card.Header>Invitation to the Launch Party</Card.Header>
          <Card.Description>
            Lorem ipsum dolor sit amet enim. Etiam ullamcorper.
          </Card.Description>
        </Card.Content>
      </Card>
      <Card>
        <Card.Content>
          <Card.Header>Cooking Classes</Card.Header>
          <Card.Description>
            Lorem ipsum dolor sit amet enim. Etiam ullamcorper.
          </Card.Description>
          <Button inverted color="green">Download voucher</Button>
          <div className="action-meta">Exp. date<br /><b>02-20-2019</b></div>
        </Card.Content>
      </Card>
    </Card.Group>
  </div>
);

export default BonusRewards;
