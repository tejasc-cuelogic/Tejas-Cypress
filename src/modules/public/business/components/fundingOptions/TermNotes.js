import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject } from 'mobx-react';
import { Header, Grid, Item, Divider, Button } from 'semantic-ui-react';
import RevenueChart from './RevenueChart';

const isMobile = document.documentElement.clientWidth < 768;
@inject('authStore')
export default class TermNotes extends Component {
  render() {
    const { isUserLoggedIn } = this.props.authStore;
    const link = '/auth/register/applynow';

    return (
      <Grid reversed="computer" doubling columns={2} relaxed="very">
        <Grid.Column>
          <RevenueChart chartFor="TermNote" />
          <p className="caption-note">
            {/* This example is for illustrative purposes only and does not reflect an actual
            deal or performance. The terms of each deal may differ. Payments are not
            guaranteed or insured and investors may lose some or all of the principal
            invested if the business cannot make its payments. */}
          </p>
        </Grid.Column>
        <Grid.Column>
          <Header as="h3">Term Notes</Header>
          {/* <Header as="h3" color="blue">Raise $50,000—$1 Million</Header> */}
          <Item.Group relaxed="very" className={!isMobile && 'question-list'}>
            <Item>
              <Item.Content>
                <Header as="h5">
                  How does it work?
                </Header>
                <Item.Description>
                  Term notes have fixed payments at a set interest rate, allowing
                  you to reliably forecast your cashflow. Plus, with no prepayment
                  penalty, you can pay off the entire balance early without incurring a fee.
                </Item.Description>
              </Item.Content>
            </Item>
            <Item>
              <Item.Content>
                <Header as="h5">
                  Who is this option best for?
                </Header>
                <Item.Description>
                  This is great for businesses with steady cash flow and the ability
                  to start making payments immediately.
                </Item.Description>
              </Item.Content>
            </Item>
          </Item.Group>
          <Divider hidden />
          {
            isUserLoggedIn ?
            '' :
            <Button as={Link} to={link} secondary>Apply Now</Button>
          }
          {/* <List horizontal className="learn-more-list mt-20">
            <List.Item>
              <List.Header>Learn more</List.Header>
              <List.Content>
                See how a <a href="/">Term Note Works</a>
              </List.Content>
            </List.Item>
          </List> */}
        </Grid.Column>
      </Grid>
    );
  }
}
