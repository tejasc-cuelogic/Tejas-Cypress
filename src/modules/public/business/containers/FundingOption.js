import React, { Component } from 'react';
import { Header, Container, Menu, Segment, Grid, List } from 'semantic-ui-react';
import Aux from 'react-aux';

class FundingOption extends Component {
  render() {
    return (
      <Aux>
        <Container>
          <section>
            <Header as="h2">Choose a funding option that fits your business.</Header>
            <p className="mb-50 center-align">
              Whether you need working capital for your existing business,
              expansion projects or a new venture, our financial products
              put you in control. Grow your business on your own terms.
            </p>
            <Menu tabular>
              <Menu.Item name="Term Notes" active />
              <Menu.Item name="Revenue Sharing" />
              <Menu.Item name="Equity Loans" />
              <Menu.Item name="Tab Option 4" />
            </Menu>
            <Segment attached="bottom" padded>
              {/* <Grid doubling columns={2}>
                <Grid.Column>
                  <Header as="h4">Term Notes</Header>
                  <Header as="h3" color="blue">Raise $50,000—$1 Million</Header>
                  <div className="mb-10">
                    <Header as="h5" attached="top">
                      What are the benefits?
                    </Header>
                    <Segment attached>
                      Term notes offer fixed monthly payments at a set interest rate.
                      Each month, your payments are steady and predictable. Plus,
                      with no prepayment penalty, you can pay off the entire balance
                      early without incurring a fee.
                    </Segment>
                  </div>
                  <div className="mb-20">
                    <Header as="h5" attached="top">
                      Who is this option best for?
                    </Header>
                    <Segment attached>
                    This is great for businesses with steady cash flow and the ability
                    to start making payments immediately.
                    </Segment>
                  </div>
                  <List horizontal>
                    <List.Item>
                      <List.Header>Learn more</List.Header>
                      <List.Icon name="arrow right" color="green" />
                      <List.Content as="a">
                        Why fundraise on NextSeed?
                      </List.Content>
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column />
              </Grid> */}
              <Grid doubling columns={2}>
                <Grid.Column>
                  <Header as="h4">Revenue Sharing Notes</Header>
                  <Header as="h3" color="blue">Raise $100,000—$1 Million</Header>
                  <div className="mb-10">
                    <Header as="h5" attached="top">
                      What are the benefits?
                    </Header>
                    <Segment attached>
                      Term notes offer fixed monthly payments at a set interest rate.
                      Each month, your payments are steady and predictable. Plus,
                      with no prepayment penalty, you can pay off the entire balance
                      early without incurring a fee.
                    </Segment>
                  </div>
                  <div className="mb-20">
                    <Header as="h5" attached="top">
                      Who is this option best for?
                    </Header>
                    <Segment attached>
                    This is great for businesses with steady cash flow and the ability
                    to start making payments immediately.
                    </Segment>
                  </div>
                  <List horizontal>
                    <List.Item>
                      <List.Header>Learn more</List.Header>
                      <List.Icon name="arrow right" color="green" />
                      <List.Content as="a">
                        Why fundraise on NextSeed?
                      </List.Content>
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column />
              </Grid>
            </Segment>
          </section>
        </Container>
      </Aux>
    );
  }
}

export default FundingOption;
