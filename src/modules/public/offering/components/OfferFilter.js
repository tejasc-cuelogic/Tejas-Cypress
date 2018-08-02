import React from 'react';
import { Container, Grid, Header, Checkbox, Form, Icon, Popup } from 'semantic-ui-react';

const offerFilter = () => (
  <div className="offer-filter">
    <div className="offer-filter-container">
      <Container>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={6}>
              <Header as="h6" dividing>
                Business Type
              </Header>
            </Grid.Column>
            <Grid.Column width={5}>
              <Header as="h6" dividing>
                Investment Type
              </Header>
              <div className="checkbox-group">
                <Form>
                  <Form.Field>
                    <Checkbox
                      label="Revenue Sharing"
                    />
                    <Popup trigger={<Icon color="green" name="help circle" className="pull-right" />} content="Help!" position="top center" />
                  </Form.Field>
                  <Form.Field>
                    <Checkbox
                      label="Term Note"
                    />
                    <Popup trigger={<Icon color="green" name="help circle" className="pull-right" />} content="Help!" position="top center" />
                  </Form.Field>
                  <Form.Field>
                    <Checkbox
                      label="Equity"
                    />
                    <Popup trigger={<Icon color="green" name="help circle" className="pull-right" />} content="Help!" position="top center" />
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
                    <Popup trigger={<Icon color="green" name="help circle" className="pull-right" />} content="Help!" position="top center" />
                  </Form.Field>
                  <Form.Field>
                    <Checkbox
                      label="Regulation A+"
                    />
                    <Popup trigger={<Icon color="green" name="help circle" className="pull-right" />} content="Help!" position="top center" />
                  </Form.Field>
                  <Form.Field>
                    <Checkbox
                      label="Regulation D"
                    />
                    <Popup trigger={<Icon color="green" name="help circle" className="pull-right" />} content="Help!" position="top center" />
                  </Form.Field>
                </Form>
              </div>
            </Grid.Column>
            <Grid.Column width={5}>
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
);

export default offerFilter;
