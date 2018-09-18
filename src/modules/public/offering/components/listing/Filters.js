import React, { Component } from 'react';
import Aux from 'react-aux';
import { Container, Grid, Menu, Image, Header, Checkbox, Form, Icon, Popup } from 'semantic-ui-react';
import BusinessType from './BusinessType';
import filterIcon from '../../../../../assets/images/icons/icon_filter.png';
import closeIcon from '../../../../../assets/images/icons/icon_close.png';

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
                  <Image src={closeIcon} className="closeIcon" />
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
                        <Header as="h6" dividing>
                          Business Type
                        </Header>
                        <BusinessType />
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
