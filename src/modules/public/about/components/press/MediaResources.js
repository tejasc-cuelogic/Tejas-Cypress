import React from 'react';
import { List, Divider, Icon } from 'semantic-ui-react';

const MediaResources = ({ title, resources }) => (
  <List link relaxed="very">
    <List.Header>{title}</List.Header>
    <Divider />
    {resources.map(r => (
      <List.Item as="a">
        <Icon className="ns-download" />
        {r}
      </List.Item>
    ))}
  </List>
);

export default MediaResources;
