import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Form, Input, Card, List, Image, Item, Label, Header, Icon, Button } from 'semantic-ui-react';
import { DropdownFilter, DateRangeFilter } from '../../../../theme/form/Filters';
import { FormTextarea } from './../../../../theme/form/FormElements';
import PrivateLayout from '../../../../containers/common/PrivateHOC';
import ProfilePicTemp from '../../../../assets/images/james-wright.png';

@inject('messageStore')
@observer
export default class Messages extends Component {
  render() {
    return (
      <PrivateLayout {...this.props}>
        <Form>
          <Grid>
            <Grid.Row>
              <Grid.Column widescreen={8} largeScreen={8} computer={16} tablet={16} mobile={16}>
                <Form.Field>
                  {/* eslint-disable jsx-a11y/label-has-for  */}
                  <label className="invisible">Search by keyword or user’s name</label>
                  <Input fluid inverted icon={{ className: 'ns-search' }} iconPosition="left" placeholder="Search by keyword or user’s name" />
                </Form.Field>
              </Grid.Column>
              <Grid.Column widescreen={4} largeScreen={4} computer={16} tablet={16} mobile={16}>
                <DropdownFilter value="user type" name="User Type" isMultiple />
              </Grid.Column>
              <Grid.Column widescreen={4} largeScreen={4} computer={16} tablet={16} mobile={16}>
                <DateRangeFilter filters="" label="Creation date" name="createdAt" />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
        <Card fluid className="messages">
          <List divided selection relaxed="very" verticalAlign="middle">
            <List.Item className="active">
              <Item.Extra>
                <Label size="mini" color="red" horizontal>New</Label>
                3 days ago
              </Item.Extra>
              <Image avatar src={ProfilePicTemp} />
              <List.Content>
                <List.Header as="h4">Sarah Gainsborough</List.Header>
              </List.Content>
              <List.Content>
                <List.Header>Business Model (3)</List.Header>
                <List.Description>
                  Hello, I would like to know what is your business model. Lorem
                  ipsum dolor sit amet enim. Etiam ullamcorper....
                </List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <Item.Extra>
                4 days ago
              </Item.Extra>
              <Image avatar src={ProfilePicTemp} />
              <List.Content>
                <List.Header as="h4">Dolph Delphy</List.Header>
              </List.Content>
              <List.Content>
                <List.Header>$20 Credits for you and your friends</List.Header>
                <List.Description>
                  Hello, I would like to know what is your business model. Lorem
                  ipsum dolor sit amet enim. Etiam ullamcorper....
                </List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <Item.Extra>
                4 days ago
              </Item.Extra>
              <Image avatar src={ProfilePicTemp} />
              <List.Content>
                <List.Header as="h4">Martin Glastonbury</List.Header>
              </List.Content>
              <List.Content>
                <List.Header>I’d like to change my legal name</List.Header>
                <List.Description>
                  Hello, I would like to know what is your business model. Lorem
                  ipsum dolor sit amet enim. Etiam ullamcorper....
                </List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <Item.Extra>
                4 days ago
              </Item.Extra>
              <Image avatar src={ProfilePicTemp} />
              <List.Content>
                <List.Header as="h4">Dolph Delphy</List.Header>
              </List.Content>
              <List.Content>
                <List.Header>$20 Credits for you and your friends</List.Header>
                <List.Description>
                  Hello, I would like to know what is your business model. Lorem
                  ipsum dolor sit amet enim. Etiam ullamcorper....
                </List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <Item.Extra>
                3 days ago
              </Item.Extra>
              <Image avatar src={ProfilePicTemp} />
              <List.Content>
                <List.Header as="h4">Sarah Gainsborough</List.Header>
              </List.Content>
              <List.Content>
                <List.Header>Business Model (3)</List.Header>
                <List.Description>
                  Hello, I would like to know what is your business model. Lorem
                  ipsum dolor sit amet enim. Etiam ullamcorper....
                </List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <Item.Extra>
                4 days ago
              </Item.Extra>
              <Image avatar src={ProfilePicTemp} />
              <List.Content>
                <List.Header as="h4">Martin Glastonbury</List.Header>
              </List.Content>
              <List.Content>
                <List.Header>I’d like to change my legal name</List.Header>
                <List.Description>
                  Hello, I would like to know what is your business model. Lorem
                  ipsum dolor sit amet enim. Etiam ullamcorper....
                </List.Description>
              </List.Content>
            </List.Item>
          </List>
          <div className="message-wrap">
            <div className="message-head">
              <Button.Group className="pull-right">
                <Button icon className="link-button">
                  <Icon className="ns-replay" flipped="horizontally" />
                </Button>
                <Button icon className="link-button">
                  <Icon className="ns-trash" />
                </Button>
              </Button.Group>
              <Header as="h3">Business model</Header>
            </div>
            <div className="message-body">
              <Item.Group className="messages">
                <Item className="date-stamp">April 7, 2018</Item>
                <Item>
                  <Item.Image size="mini" avatar src={ProfilePicTemp} />
                  <Item.Content>
                    <Item.Description>
                      <p>Hello,<br />
                        Lorem ipsum dolor sit amet leo. Donec non ligula eleifend pede bibendum
                        tempus. Nullam wisi semper risus. Ut rhoncus laoreet purus lacinia lacus.
                        Nulla ut tortor. Maecenas elit odio, in dui. Vivamus nec elementum diam
                        aliquet eget, dui. Mauris?
                      </p>
                      <p>Curae, Duis lobortis, mi ligula, elementum at, nibh. Duis non ligula
                        accumsan urna, id eros. In tristique senectus et ultrices posuere
                        cubilia Curae, Duis hendrerit sollicitudin.
                      </p>
                      <p>
                        Thanks,<br />
                        <b>Sarah Gainsborough</b>
                      </p>
                    </Item.Description>
                  </Item.Content>
                  <Item.Extra>
                    <Label size="mini" color="red">New</Label>
                    <span className="time-stamp">3:43 PM</span>
                  </Item.Extra>
                </Item>
                <Item className="sent">
                  <Item.Extra>
                    <span className="time-stamp">4:58 PM</span>
                  </Item.Extra>
                  <Item.Content>
                    <Item.Description>
                      <p>Hello Sarah,<br />
                        Lorem ipsum dolor sit amet leo. Donec non ligula eleifend pede bibendum
                        tempus. Nullam wisi semper risus. Ut rhoncus laoreet purus lacinia lacus.
                        Nulla ut tortor. Maecenas elit odio, in dui. Vivamus nec elementum diam
                        aliquet eget, dui. Mauris?
                      </p>
                      <p>Curae, Duis lobortis, mi ligula, elementum at, nibh. Duis non ligula
                        accumsan urna, id eros. In tristique senectus et ultrices posuere
                        cubilia Curae, Duis hendrerit sollicitudin.
                      </p>
                      <p>
                        Thanks,<br />
                        <b>Isabel Ives</b>
                      </p>
                    </Item.Description>
                  </Item.Content>
                  <Item.Image size="mini" avatar src={ProfilePicTemp} />
                </Item>
              </Item.Group>

            </div>
            <div className="message-footer">
              <Form>
                <FormTextarea
                  fielddata={this.props.messageStore.MESSAGE_FRM.fields.messages}
                  name="messages"
                />
                <div>
                  <Button primary content="Send" />
                </div>
              </Form>
            </div>
          </div>
        </Card>
      </PrivateLayout>
    );
  }
}
