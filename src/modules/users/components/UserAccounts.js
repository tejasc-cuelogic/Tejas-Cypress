import React from 'react';
// import { Link } from 'react-router-dom';
// import { Grid, Icon, Form, Input, Label, Button } from 'semantic-ui-react';
import { Tab, List, Menu } from 'semantic-ui-react';

const panes = [
  {
    menuItem: <Menu.Item key="individual"><div className="account-type small full accredited">I</div> Individual</Menu.Item>,
    pane: (
      <Tab.Pane key="tab1">
        <h1>This tab has a complex content</h1>
        <h2>Apples</h2>
        <h2>Pears</h2>
        <h2>Oranges</h2>
        <h1>This tab has a complex content</h1>
        <h2>Apples</h2>
        {/* <h2>Pears</h2>
        <h2>Oranges</h2>
        <h1>This tab has a complex content</h1>
        <h2>Apples</h2>
        <h2>Pears</h2>
        <h2>Oranges</h2>
        <h1>This tab has a complex content</h1>
        <h2>Apples</h2>
        <h2>Pears</h2>
        <h2>Oranges</h2>
        <h1>This tab has a complex content</h1>
        <h2>Apples</h2>
        <h2>Pears</h2>
        <h2>Oranges</h2> */}
      </Tab.Pane>
    ),
  },
  {
    menuItem: <Menu.Item key="individual"><div className="account-type small locked">R</div> IRA</Menu.Item>,
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
    menuItem: <Menu.Item key="individual"><div className="account-type small partial">E</div> Entity</Menu.Item>,
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
    menuItem: <Menu.Item key="individual"><div className="account-type small full accredited">E</div> Entity</Menu.Item>,
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
];

const userAccounts = () => (
  <Tab className="tabular-wrap compact" menu={{ fluid: true, vertical: true, tabular: 'right' }} panes={panes} renderActiveOnly={false} />
);

export default userAccounts;
