import React from 'react';
import Aux from 'react-aux';
// import { Link } from 'react-router-dom';
import { Header, Grid, Container, Item } from 'semantic-ui-react';
import NSImage from '../../../shared/NSImage';

// const isMobile = document.documentElement.clientWidth < 768;

const AllInclusive = () => (
  <Aux>
    <section className="content-spacer">
      <Container>
        <Grid relaxed padded="vertically">
          <Grid.Row>
            <Grid.Column computer={10} tablet={16} mobile={16} verticalAlign="middle" className="side-section">
              <Header as="h2">Reach your goals with full-service support included.</Header>
              <p className="mb-60">
              Our one-time fee comes with everything you need to launch, promote and service
              your campaign. Best of all, we only charge you if your offering is successful.
              </p>
              <Item.Group className="horizontal-items">
                <Item>
                  <div className="ui mini image">
                    <NSImage path="business/marketing.svg" />
                  </div>
                  <Item.Content>
                    <Item.Header as="h5">Marketing</Item.Header>
                    <Item.Meta>Expert advertising, marketing and PR resources.</Item.Meta>
                  </Item.Content>
                </Item>
                <Item>
                  <div className="ui mini image">
                    <NSImage path="business/escrow.svg" />
                  </div>
                  <Item.Content>
                    <Item.Header as="h5">Escrow</Item.Header>
                    <Item.Meta>Handling all banking, escrow and processing fees.</Item.Meta>
                  </Item.Content>
                </Item>
                <Item>
                  <div className="ui mini image">
                    <NSImage path="business/campaign.svg" />
                  </div>
                  <Item.Content>
                    <Item.Header as="h5">Campaign Development</Item.Header>
                    <Item.Meta>Design and content creation services.</Item.Meta>
                  </Item .Content>
                </Item>
                <Item>
                  <div className="ui mini image">
                    <NSImage path="business/payment.svg" />
                  </div>
                  <Item.Content>
                    <Item.Header as="h5">Payment Processing</Item.Header>
                    <Item.Meta>Collecting commitments and distributing funds.</Item.Meta>
                  </Item.Content>
                </Item>
                <Item>
                  <div className="ui mini image">
                    <NSImage path="business/questions.svg" />
                  </div>
                  <Item.Content>
                    <Item.Header as="h5">Q&A</Item.Header>
                    <Item.Meta>Facilitating investor questions during the offering.</Item.Meta>
                  </Item.Content>
                </Item>
                <Item>
                  <div className="ui mini image">
                    <NSImage path="business/preparation.svg" />
                  </div>
                  <Item.Content>
                    <Item.Header as="h5">Disclosure Preparation</Item.Header>
                    <Item.Meta>Legal templates and Regulatory filing assistance.</Item.Meta>
                  </Item.Content>
                </Item>
                <Item>
                  <div className="ui mini image">
                    <NSImage path="business/services.svg" />
                  </div>
                  <Item.Content>
                    <Item.Header as="h5">Investor Services</Item.Header>
                    <Item.Meta>Servicing payments to investors.</Item.Meta>
                  </Item.Content>
                </Item>
                <Item>
                  <div className="ui mini image">
                    <NSImage path="business/tax.svg" />
                  </div>
                  <Item.Content>
                    <Item.Header as="h5">Tax Form Preparation</Item.Header>
                    <Item.Meta>Distributing year-end documents to investors.</Item.Meta>
                  </Item.Content>
                </Item>
              </Item.Group>
              {/* <Divider hidden section />
              <List horizontal={!isMobile} relaxed className="learn-more-list">
                <List.Item>
                  <List.Header>Learn more</List.Header>
                  <List.Content>NextSeed and <a href="/">Small businesses</a></List.Content>
                </List.Item>
                <List.Item>
                  {!isMobile &&
                    <List.Header>&nbsp;</List.Header>
                  }
                  <List.Content>NextSeed and <a href="/">Commercial real estate</a></List.Content>
                </List.Item>
              </List>
              <Divider /> */}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </section>
  </Aux>
);

export default AllInclusive;
