import React, { Component } from 'react';
import Aux from 'react-aux';
import { Container, Grid, Menu, Image, Header, Checkbox, Form, Icon, Popup, List } from 'semantic-ui-react';
// import BusinessType from './BusinessType';
import filterIcon from '../../../../../assets/images/icons/icon_filter.png';
import closeIcon from '../../../../../assets/images/icons/icon_close.png';

const isMobile = document.documentElement.clientWidth < 768;
export default class Filters extends Component {
  render() {
    return (
      <Aux>
        <div className="filter-menu">
          <Container>
            <Menu text>
              <Menu.Item name="filter" onClick={() => this.props.toggle(true)} className="text-uppercase">
                <Image src={filterIcon} className="filterIcon" />
                 Filter
              </Menu.Item>
              {this.props.status ? (
                <Menu.Item name="clear all" onClick={() => this.props.toggle(false)} position="right">
                  CLEAR ALL
                  {!isMobile &&
                    <Image src={closeIcon} className="closeIcon" />
                  }
                </Menu.Item>
              ) : (
                <Menu.Item name="3 Results Found" position="right" />
              )
              }
            </Menu>
          </Container>
          {this.props.status && (
            <div className="offer-filter">
              <div className="offer-filter-container">
                <Container>
                  <Grid stackable>
                    <Grid.Row>
                      <Grid.Column width={8} className="donut-chart">
                        <Header as="h6" dividing>Business Type</Header>
                        {/* <Responsive minWidth={768} as={Aux}>
                          <BusinessType />
                        </Responsive>
                        <Responsive maxWidth={767} as={Aux}> */}
                        <List relaxed="very">
                          <List.Item>
                            <List.Icon color="green" name="building" />
                            <List.Content>Commercial Real Estate</List.Content>
                          </List.Item>
                          <List.Item>
                            <List.Icon color="green" name="food" />
                            <List.Content>Restaurant & Bar</List.Content>
                          </List.Item>
                          <List.Item>
                            <List.Icon color="green" name="bar" />
                            <List.Content>Brewery & Pub</List.Content>
                          </List.Item>
                          <List.Item>
                            <List.Icon name="bed" />
                            <List.Content>Hospitality</List.Content>
                          </List.Item>
                          <List.Item>
                            <List.Icon name="heartbeat" />
                            <List.Content>Health & Wellness</List.Content>
                          </List.Item>
                          <List.Item>
                            <List.Icon name="bicycle" />
                            <List.Content>Fitness</List.Content>
                          </List.Item>
                          <List.Item>
                            <List.Icon name="fax" />
                            <List.Content>Office</List.Content>
                          </List.Item>
                          <List.Item>
                            <List.Icon name="ellipsis horizontal" />
                            <List.Content>Other</List.Content>
                          </List.Item>
                        </List>
                        {/* </Responsive> */}
                      </Grid.Column>
                      <Grid.Column width={4}>
                        <Header as="h6" dividing>
                          Investment Type
                        </Header>
                        <div className="checkbox-group">
                          <Form>
                            <Form.Field>
                              <Checkbox
                                label="Revenue Sharing"
                              />
                              <Popup trigger={<Icon color="green" name="help circle" className="pull-right" />} content="Lorem Ipsum" position="top center" />
                            </Form.Field>
                            <Form.Field>
                              <Checkbox
                                label="Term Note"
                              />
                              <Popup trigger={<Icon color="green" name="help circle" className="pull-right" />} content="Lorem Ipsum" position="top center" />
                            </Form.Field>
                            <Form.Field>
                              <Checkbox
                                label="Equity"
                              />
                              <Popup trigger={<Icon color="green" name="help circle" className="pull-right" />} content="Lorem Ipsum" position="top center" />
                            </Form.Field>
                            <Form.Field>
                              <Checkbox
                                label="Convertible Note"
                              />
                            </Form.Field>
                          </Form>
                        </div>
                        <Header as="h6" dividing>
                          Funding Type
                        </Header>
                        <div className="checkbox-group">
                          <Form>
                            <Form.Field>
                              <Checkbox
                                label="Regulation Crowdfunding"
                              />
                              <Popup trigger={<Icon color="green" name="help circle" className="pull-right" />} content="Lorem Ipsum" position="top center" />
                            </Form.Field>
                            <Form.Field>
                              <Checkbox
                                label="Regulation A+"
                              />
                              <Popup trigger={<Icon color="green" name="help circle" className="pull-right" />} content="Lorem Ipsum" position="top center" />
                            </Form.Field>
                            <Form.Field>
                              <Checkbox
                                label="Regulation D"
                              />
                              <Popup trigger={<Icon color="green" name="help circle" className="pull-right" />} content="Lorem Ipsum" position="top center" />
                            </Form.Field>
                          </Form>
                        </div>
                      </Grid.Column>
                      <Grid.Column width={4}>
                        <Header as="h6" dividing>
                          More Options
                        </Header>
                        <div className="checkbox-group">
                          <Form>
                            <Form.Field>
                              <Checkbox
                                label="Show Funded Deals"
                              />
                            </Form.Field>
                          </Form>
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Container>
              </div>
            </div>
          )
          }
        </div>
      </Aux>
    );
  }
}
