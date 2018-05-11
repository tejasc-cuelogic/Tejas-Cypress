import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Grid, Card, Table, Icon, Accordion, Header } from 'semantic-ui-react';

export default class Statements extends Component {
  render() {
    return (
      <div>
        <Grid>
          <Grid.Column widescreen={3} largeScreen={4} computer={4} tablet={4} mobile={16}>
            <Menu secondary vertical>
              <Menu.Item as="a" to="" className="active">
                Monthly Statements
              </Menu.Item>
              <Menu.Item as="a" to="">
                Tax Forms
              </Menu.Item>
            </Menu>
          </Grid.Column>
          <Grid.Column floated="right" widescreen={12} largeScreen={11} computer={12} tablet={12} mobile={16}>
            <Grid>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Card fluid>
                    <div singleLine className="table-wrapper">
                      <Table singleLine className="investment-details">
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell>Statement Date</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Download as</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          <Table.Row>
                            <Table.Cell>Dec 2017</Table.Cell>
                            <Table.Cell>Monthly Statements</Table.Cell>
                            <Table.Cell>
                              <Link to="" className="action"><Icon className="ns-file" /> PDF</Link>
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>Nov 2017</Table.Cell>
                            <Table.Cell>Monthly Statements</Table.Cell>
                            <Table.Cell>
                              <Link to="" className="action"><Icon className="ns-file" /> PDF</Link>
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>Oct 2017</Table.Cell>
                            <Table.Cell>Monthly Statements</Table.Cell>
                            <Table.Cell>
                              <Link to="" className="action"><Icon className="ns-file" /> PDF</Link>
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>Sep 2017</Table.Cell>
                            <Table.Cell>Monthly Statements</Table.Cell>
                            <Table.Cell>
                              <Link to="" className="action"><Icon className="ns-file" /> PDF</Link>
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>Aug 2017</Table.Cell>
                            <Table.Cell>Monthly Statements</Table.Cell>
                            <Table.Cell>
                              <Link to="" className="action"><Icon className="ns-file" /> PDF</Link>
                            </Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table>
                    </div>
                  </Card>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column widescreen={12} largeScreen={12} computer={12} tablet={16} mobile={16}>
                  <Card fluid>
                    <Card.Content>
                      <Header as="h3">Tax Forms FAQs</Header>
                      <Accordion>
                        <Accordion.Title active>
                          <Icon name="dropdown" />
                          Lorem ipsum dolor sit amet enim ullamcorper?
                        </Accordion.Title>
                        <Accordion.Content active>
                          <p>
                            Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum
                            dapibus, mauris nec malesuada fames ac turpis Pellentesque facilisis.
                            Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec
                            malesuada fames ac turpis
                          </p>
                        </Accordion.Content>
                      </Accordion>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
