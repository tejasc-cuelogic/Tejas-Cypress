import React from 'react';
import { Container, Grid, Header, Checkbox, Form, Icon, Popup, Label } from 'semantic-ui-react';

const offerFilter = () => (
  <div className="offerfilter">
    <div className="offerFilterContainer">
      <Container>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={6}>
              <Header as="h6" dividing>
                Business Type
              </Header>
            </Grid.Column>
            <Grid.Column width={6}>
              <Header as="h6" dividing>
                Region
              </Header>
            </Grid.Column>
            <Grid.Column width={4}>
              <Header as="h6" dividing>
                Investment Type
              </Header>
              <div className="checkboxGroup">
                <Form>
                  <Form.Field>
                    <Checkbox
                      label="Revenue Sharing"
                    />
                    <Popup trigger={<Icon name="help circle" className="pull-right" />} content="Help!" position="top center" />
                  </Form.Field>
                  <Form.Field>
                    <Checkbox
                      label="Term Note"
                    />
                    <Popup trigger={<Icon name="help circle" className="pull-right" />} content="Help!" position="top center" />
                  </Form.Field>
                  <Form.Field>
                    <Checkbox
                      label="Equity"
                    />
                    <Popup trigger={<Icon name="help circle" className="pull-right" />} content="Help!" position="top center" />
                  </Form.Field>
                </Form>
              </div>
              <Header as="h6" dividing>
                Funding Type
              </Header>
              <div className="checkboxGroup">
                <Form>
                  <Form.Field>
                    <Checkbox
                      label="Reg A"
                    />
                    <Popup trigger={<Icon name="help circle" className="pull-right" />} content="Help!" position="top center" />
                  </Form.Field>
                  <Form.Field>
                    <Checkbox
                      label="Reg D"
                    />
                    <Popup trigger={<Icon name="help circle" className="pull-right" />} content="Help!" position="top center" />
                  </Form.Field>
                  <Form.Field>
                    <Checkbox
                      label="Reg CF"
                    />
                    <Popup trigger={<Icon name="help circle" className="pull-right" />} content="Help!" position="top center" />
                  </Form.Field>
                  <Form.Field>
                    <Checkbox
                      label="Reg F"
                    />
                    <Popup trigger={<Icon name="help circle" className="pull-right" />} content="Help!" position="top center" />
                  </Form.Field>
                </Form>
              </div>
              <Header as="h6" dividing>
                More Options
              </Header>
              <div className="checkboxGroup">
                <Icon name="eye" />
                <Label> Funded Campaigns </Label>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  </div>
);

export default offerFilter;
