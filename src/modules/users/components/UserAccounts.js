import React from 'react';
import { Link } from 'react-router-dom';
import { Tab, List, Menu, Card, Statistic, Popup, Icon, Divider, Grid, Item, Table } from 'semantic-ui-react';

const panes = [
  {
    menuItem: <Menu.Item><div className="account-type small full accredited">I</div> Individual</Menu.Item>,
    pane: (
      <Tab.Pane key="tab1">
        <div className="horizontal-spacer">
          <h2>
            <div className="account-type medium full accredited">I</div>
            Individual
            <span className="meta-data">
              <span className="full-account">Full</span>
              <span>Not accredited</span>
            </span>
          </h2>
          <div className="main actions">
            <Link to=""><Icon name="ns-trash" />Delete Account</Link>
          </div>
          <List horizontal link>
            <List.Item as="a" active>Overview</List.Item>
            <List.Item as="a">Transactions</List.Item>
            <List.Item as="a">Statements</List.Item>
            <List.Item as="a">Agreements</List.Item>
          </List>
          <Grid stackable doubling columns={3}>
            <Grid.Column>
              <Card fluid raised>
                <Card.Content>
                  <Statistic>
                    <Statistic.Label>
                      Total Balance
                      <Popup
                        trigger={<Icon name="ns-help-circle outline" />}
                        content="Your total Balance as of today"
                        position="top center"
                        className="center-align"
                      />
                    </Statistic.Label>
                    <Statistic.Value>$5,800</Statistic.Value>
                  </Statistic>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card fluid raised>
                <Card.Content>
                  <Statistic>
                    <Statistic.Label>
                      Total invested amount
                      <Popup
                        trigger={<Icon name="ns-help-circle outline" />}
                        content="Your total invested amount till date"
                        position="top center"
                        className="center-align"
                      />
                    </Statistic.Label>
                    <Statistic.Value>$12,800</Statistic.Value>
                  </Statistic>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card fluid raised>
                <Card.Content>
                  <Statistic>
                    <Statistic.Label>
                      Total revenue
                      <Popup
                        trigger={<Icon name="ns-help-circle outline" />}
                        content="Your total revenue on investments till date"
                        position="top center"
                        className="center-align"
                      />
                    </Statistic.Label>
                    <Statistic.Value>$1,370</Statistic.Value>
                  </Statistic>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid>
          <Divider section />
          <Grid stackable>
            <Grid.Column mobile={16} tablet={16} computer={8}>
              <Card fluid raised className="editable">
                <Card.Content>
                  <div className="actions">
                    <Link to=""><Icon name="ns-pencil" />Edit</Link>
                  </div>
                  <Card.Header>
                    Account status
                    <span className="meta-data">
                      <span className="full-account">Full</span>
                    </span>
                  </Card.Header>
                </Card.Content>
              </Card>
              <Card fluid raised className="editable">
                <Card.Content>
                  <div className="actions">
                    <Link to=""><Icon name="ns-pencil" />Edit</Link>
                  </div>
                  <Card.Header>
                    Accreditation
                    <span className="meta-data">
                      <span>Not accreditation</span>
                    </span>
                  </Card.Header>
                  <Card.Description>
                    <Card.Meta>Steps required to aquire accreditation</Card.Meta>
                    <List relaxed className="check-list">
                      <List.Item>
                        <List.Icon name="check circle large" />
                        <List.Content verticalAlign="middle">Lorem ipsum</List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Icon name="check circle large" />
                        <List.Content verticalAlign="middle">Dolor sit amet consectetur</List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Icon name="circle large" />
                        <List.Content verticalAlign="middle">Adipisci</List.Content>
                      </List.Item>
                    </List>
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={16} computer={8}>
              <Card fluid raised>
                <Card.Content className="bank-details">
                  <Card.Header>Bank account connected</Card.Header>
                  <Card.Description>
                    <Grid columns="equal" stackable>
                      <Grid.Row>
                        <Grid.Column>
                          <Item>
                            <Item.Content>
                              <Item.Meta>Bank Name</Item.Meta>
                              <Item.Description>
                                <p>Bank of America</p>
                              </Item.Description>
                            </Item.Content>
                          </Item>
                        </Grid.Column>
                        <Grid.Column>
                          <Item>
                            <Item.Content>
                              <Item.Meta>Card Ending</Item.Meta>
                              <Item.Description>
                                <p>...7598</p>
                              </Item.Description>
                            </Item.Content>
                          </Item>
                        </Grid.Column>
                        <Grid.Column>
                          <Item>
                            <Item.Content>
                              <Item.Meta>Date connected</Item.Meta>
                              <Item.Description>
                                <p>October 13, 2016</p>
                              </Item.Description>
                            </Item.Content>
                          </Item>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid>
        </div>
        <Divider section />
        <div className="table-wrapper">
          <Table striped sortable singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Transaction Date</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Amount</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Balance</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>02-21-2017</Table.Cell>
                <Table.Cell>
                  <strong>Deposit</strong>
                </Table.Cell>
                <Table.Cell>
                  <strong>($500)</strong>
                </Table.Cell>
                <Table.Cell>Complete</Table.Cell>
                <Table.Cell>$4,540.30</Table.Cell>
                <Table.Cell><Link to="" className="action">Update Status</Link></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>02-21-2017</Table.Cell>
                <Table.Cell>
                  <strong>Deposit</strong>
                </Table.Cell>
                <Table.Cell>
                  <strong>($500)</strong>
                </Table.Cell>
                <Table.Cell>Complete</Table.Cell>
                <Table.Cell>$4,540.30</Table.Cell>
                <Table.Cell><Link to="" className="action">Update Status</Link></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>02-21-2017</Table.Cell>
                <Table.Cell>
                  <strong>Deposit</strong>
                </Table.Cell>
                <Table.Cell>
                  <strong>($500)</strong>
                </Table.Cell>
                <Table.Cell>Complete</Table.Cell>
                <Table.Cell>$4,540.30</Table.Cell>
                <Table.Cell><Link to="" className="action">Update Status</Link></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>02-21-2017</Table.Cell>
                <Table.Cell>
                  <strong>Deposit</strong>
                </Table.Cell>
                <Table.Cell>
                  <strong>($500)</strong>
                </Table.Cell>
                <Table.Cell>Complete</Table.Cell>
                <Table.Cell>$4,540.30</Table.Cell>
                <Table.Cell><Link to="" className="action">Update Status</Link></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>02-21-2017</Table.Cell>
                <Table.Cell>
                  <strong>Deposit</strong>
                </Table.Cell>
                <Table.Cell>
                  <strong>($500)</strong>
                </Table.Cell>
                <Table.Cell>Complete</Table.Cell>
                <Table.Cell>$4,540.30</Table.Cell>
                <Table.Cell><Link to="" className="action">Update Status</Link></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>02-21-2017</Table.Cell>
                <Table.Cell>
                  <strong>Deposit</strong>
                </Table.Cell>
                <Table.Cell>
                  <strong>($500)</strong>
                </Table.Cell>
                <Table.Cell>Complete</Table.Cell>
                <Table.Cell>$4,540.30</Table.Cell>
                <Table.Cell><Link to="" className="action">Update Status</Link></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>02-21-2017</Table.Cell>
                <Table.Cell>
                  <strong>Deposit</strong>
                </Table.Cell>
                <Table.Cell>
                  <strong>($500)</strong>
                </Table.Cell>
                <Table.Cell>Complete</Table.Cell>
                <Table.Cell>$4,540.30</Table.Cell>
                <Table.Cell><Link to="" className="action">Update Status</Link></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>02-21-2017</Table.Cell>
                <Table.Cell>
                  <strong>Deposit</strong>
                </Table.Cell>
                <Table.Cell>
                  <strong>($500)</strong>
                </Table.Cell>
                <Table.Cell>Complete</Table.Cell>
                <Table.Cell>$4,540.30</Table.Cell>
                <Table.Cell><Link to="" className="action">Update Status</Link></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
        <Divider section />
        <div className="horizontal-spacer">
          <Grid stackable>
            <Grid.Column mobile={16} tablet={16} computer={8}>
              <Card fluid raised>
                <Card.Content>
                  <Card.Header>Tax Statements</Card.Header>
                  <Card.Description>
                    <div className="table-wrapper">
                      <Table striped sortable singleLine className="statment-tables">
                        <Table.Body>
                          <Table.Row>
                            <Table.Cell>2016</Table.Cell>
                            <Table.Cell>
                              <strong>NextSeed TX</strong>
                              <Icon name="file pdf outline large" />
                            </Table.Cell>
                            <Table.Cell collapsing>
                              <Link to="" className="action"><Icon name="ns-pencil large" /></Link>
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>2017</Table.Cell>
                            <Table.Cell>
                              <strong>NextSeed</strong>
                              <Icon name="file pdf outline large" />
                            </Table.Cell>
                            <Table.Cell collapsing>
                              <Link to="" className="action"><Icon name="ns-pencil large" /></Link>
                            </Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table>
                    </div>
                  </Card.Description>
                  <Link to="">+ ADD NEW TAX STATEMENT</Link>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={16} computer={8}>
              <Card fluid raised>
                <Card.Content>
                  <Card.Header>Account Statements</Card.Header>
                  <Card.Description>
                    <div className="table-wrapper">
                      <Table striped sortable singleLine className="statment-tables">
                        <Table.Body>
                          <Table.Row>
                            <Table.Cell>2016</Table.Cell>
                            <Table.Cell>
                              <strong>Lorem Ipsum</strong>
                              <Icon name="file pdf outline large" />
                            </Table.Cell>
                            <Table.Cell collapsing>
                              <Link to="" className="action"><Icon name="ns-pencil large" /></Link>
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>2017</Table.Cell>
                            <Table.Cell>
                              <strong>Dolleramit</strong>
                              <Icon name="file pdf outline large" />
                            </Table.Cell>
                            <Table.Cell collapsing>
                              <Link to="" className="action"><Icon name="ns-pencil large" /></Link>
                            </Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table>
                    </div>
                  </Card.Description>
                  <Link to="">+ ADD NEW TAX STATEMENT</Link>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid>
        </div>
      </Tab.Pane>
    ),
  },
  {
    menuItem: <Menu.Item><div className="account-type small locked">R</div> IRA</Menu.Item>,
    pane: (
      <Tab.Pane key="tab2">
        <h1>This tab has a complex content</h1>
        <h2>Apples</h2>
        <h2>Pears</h2>
        <h2>Oranges</h2>
      </Tab.Pane>
    ),
  },
  {
    menuItem: <Menu.Item><div className="account-type small partial">E</div> Entity</Menu.Item>,
    pane: (
      <Tab.Pane key="tab3">
        <p>This tab has a complex content</p>
        <List>
          <List.Item>Apples</List.Item>
          <List.Item>Pears</List.Item>
          <List.Item>Oranges</List.Item>
        </List>
      </Tab.Pane>
    ),
  },
  {
    menuItem: <Menu.Item><div className="account-type small full accredited">E</div> Entity</Menu.Item>,
    pane: (
      <Tab.Pane key="tab4">
        <p>This tab has a complex content</p>
        <List>
          <List.Item>Apples</List.Item>
          <List.Item>Pears</List.Item>
          <List.Item>Oranges</List.Item>
        </List>
      </Tab.Pane>
    ),
  },
];

const userAccounts = () => (
  <Tab className="tabular-wrap compact" menu={{ fluid: true, vertical: true, tabular: 'left' }} panes={panes} renderActiveOnly={false} />
);

export default userAccounts;
