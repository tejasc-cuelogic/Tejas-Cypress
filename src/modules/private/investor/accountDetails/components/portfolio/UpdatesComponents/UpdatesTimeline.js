import React from 'react';
import { NavLink } from 'react-router-dom';
import { List } from 'semantic-ui-react';

const UpdatesTimeline = props => (
  <>
    {/* <Header as="h4">{props.heading}</Header> */}
    <List relaxed="very">
      {
        props.list.map(item => (
          <List.Item key={item.id} to={`${props.match.url}/${item.id}`} as={NavLink}>
            <span>{item.title}</span>
            {item.date}
          </List.Item>
        ))
      }
    </List>
  </>
);

export default UpdatesTimeline;
