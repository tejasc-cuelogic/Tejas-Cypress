import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { Modal, Grid, List, Accordion, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

const isMobile = document.documentElement.clientWidth < 768;
@inject('updatesStore')
@observer
class SummaryModal extends Component {
  state = { activeIndex: 0 }
  handleClose = () => this.props.history.goBack();

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { activeIndex } = this.state;
    return (
      <Modal
        open
        onClose={this.handleClose}
        size="large"
        closeIcon
      >
        <Modal.Header>Revenue Sharing Summary*</Modal.Header>
        <Modal.Content scrolling>
          <p>
            This investment has a 6-month startup period during which no cash payments will
            be made. The startup period commences the first full month after the offering’s
            close.
          </p>
          <p>
            After the end of the startup period or once the Issuer commences operations
            (whichever comes later), the Issuer will share a percentage of each month’s gross
            revenue with the investors as a group until they are paid in full. The total amount
            raised by the offering will determine the Investment Multiple and the monthly
            Revenue Sharing Percentage.
          </p>
          <Grid stackable doubling columns={2} verticalAlign="top" className="summary-modal">
            <Grid.Column>
              <p><b>Total Raise Amount: $250,000–$400,000</b></p>
              <List as="ul" bulleted className={!isMobile && 'mb-30'}>
                <List.Item as="li">Investment Multiple: 1.70x</List.Item>
                <List.Item as="li">Monthly Revenue Sharing Percentage (first year): 4.0%</List.Item>
                <List.Item as="li">Monthly Revenue Sharing Percentage (years 2–6): 4.0%</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column>
              <p><b>Total Raise Amount: $400,100–$600,000</b></p>
              <List as="ul" bulleted className={!isMobile && 'mb-30'}>
                <List.Item as="li">Investment Multiple: 1.70x</List.Item>
                <List.Item as="li">Monthly Revenue Sharing Percentage (first year): 4.0%</List.Item>
                <List.Item as="li">Monthly Revenue Sharing Percentage (years 2–6): 7.0%</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column>
              <p><b>Total Raise Amount: $600,100–$800,000</b></p>
              <List as="ul" bulleted className={!isMobile && 'mb-30'}>
                <List.Item as="li">Investment Multiple: 1.80x</List.Item>
                <List.Item as="li">Monthly Revenue Sharing Percentage (first year): 4.0%</List.Item>
                <List.Item as="li">Monthly Revenue Sharing Percentage (years 2–6): 10.25%</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column>
              <p><b>Total Raise Amount: $800,100–$1,000,000</b></p>
              <List as="ul" bulleted>
                <List.Item as="li">Investment Multiple: 1.90x</List.Item>
                <List.Item as="li">Monthly Revenue Sharing Percentage (first year): 4.0%</List.Item>
                <List.Item as="li">Monthly Revenue Sharing Percentage (years 2–6): 13.5%</List.Item>
              </List>
            </Grid.Column>
          </Grid>
          <p className={isMobile && 'mt-20'}>
            Each investor will receive its proportionate share of the monthly payments made
            to the investors as a group.
          </p>
          <Accordion className="faq-accordion">
            <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
              Scenario 1
              <Icon className="ns-chevron-down" />
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 0}>
              <Grid centered className="mt-30 mb-30">
                <Grid.Column width={6} textAlign="center">
                  <p><b>Total Raise Amount:</b></p>
                  <p>$2,000,000</p>
                </Grid.Column>
                <Grid.Column width={6} textAlign="center">
                  <p><b>You Invest:</b></p>
                  <p>$2,000,000</p>
                </Grid.Column>
              </Grid>
              <p>
                Based on the Total Raise Amount, the Issuer will share 4.0% of its revenues
                for the first 12 months of operations and then 7.0% of revenues thereafter,
                until the 1.70x Investment Multiple is reached.
              </p>
              <p className="mb-30">
                Let’s assume that the Issuer generated $100,000 in revenues in month 9. The
                issuer will make a $4,000 payment ($100,000 x 4% = $4,000) to investors.
                Since you invested with 1% of the total amount raised ($5,000 / $500,000 =
                1.0%), you would receive a $40 payment.
              </p>
            </Accordion.Content>
            <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
              Scenario 2
              <Icon className="ns-chevron-down" />
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 1}>
              <Grid centered className="mt-30 mb-30">
                <Grid.Column width={6} textAlign="center">
                  <p><b>Total Raise Amount:</b></p>
                  <p>$1,000,000</p>
                </Grid.Column>
                <Grid.Column width={6} textAlign="center">
                  <p><b>You Invest:</b></p>
                  <p>$1,000,000</p>
                </Grid.Column>
              </Grid>
              <p>
                Based on the Total Raise Amount, the Issuer will share 4.0% of its revenues
                for the first 12 months of operations and then 7.0% of revenues thereafter,
                until the 1.70x Investment Multiple is reached.
              </p>
              <p className="mb-30">
                Let’s assume that the Issuer generated $100,000 in revenues in month 9. The
                issuer will make a $4,000 payment ($100,000 x 4% = $4,000) to investors.
                Since you invested with 1% of the total amount raised ($5,000 / $500,000 =
                1.0%), you would receive a $40 payment.
              </p>
            </Accordion.Content>
          </Accordion>
          {/* <p className="mt-20 note">
          * The calculations above are mathematical illustration only and may not reflect
          actual performance. They do not take into account NextSeed fees of 1% on each
          payment made to investors... <Link to="/">Read More</Link>
          </p> */}
        </Modal.Content>
      </Modal>
    );
  }
}

export default SummaryModal;
