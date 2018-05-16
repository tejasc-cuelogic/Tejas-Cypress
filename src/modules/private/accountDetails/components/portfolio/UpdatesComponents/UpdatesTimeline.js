import React from 'react';
import { NavLink } from 'react-router-dom';
import { Header, List } from 'semantic-ui-react';
import Aux from 'react-aux';

const UpdatesTimeline = props => (
  <Aux>
    <Header as="h3">{props.heading}</Header>
    <List relaxed="very">
      {
        props.list.map(item => (
          <List.Item key={item.id} to={`${props.match.url}/${item.id}`} as={NavLink}>{item.date}</List.Item>
        ))
      }
    </List>
  </Aux>
);

export default UpdatesTimeline;
