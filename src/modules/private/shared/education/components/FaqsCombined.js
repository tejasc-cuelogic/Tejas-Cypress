import React, { Component } from 'react';
import Aux from 'react-aux';
import { Input, Form, Accordion } from 'semantic-ui-react';

const level1Panels = [
  {
    key: 'panel-1a',
    title: 'Who can invest on NextSeed?',
    content: 'Anyone over the age of 18 with a U.S. social security number or tax identification number and U.S. residential address can make investments on NextSeed. This is because you’ll need to open an investment account at our partner U.S. bank to make investments and receive any payments from businesses.  ',
  },
  {
    key: 'panel-ba',
    title: 'Can I invest if I am under 18 years old?',
    content: 'Level 1B Contents',
  },
];

const Level1Content = (
  <div>
    Welcome to level 1
    <Accordion.Accordion panels={level1Panels} />
  </div>
);

const level2Panels = [
  { key: 'panel-2a', title: 'Level 2A', content: 'Level 2A Contents' },
  { key: 'panel-2b', title: 'Level 2B', content: 'Level 2B Contents' },
];

const Level2Content = (
  <div>
    Welcome to level 2
    <Accordion.Accordion panels={level2Panels} />
  </div>
);

const rootPanels = [
  { key: 'panel-1', title: 'Investor Qualification', content: { content: Level1Content } },
  { key: 'panel-2', title: 'Investment Guidelines', content: { content: Level2Content } },
];

export default class FaqsCombined extends Component {
  render() {
    return (
      <Aux>
        <Form>
          <Input icon="search" placeholder="Search" />
        </Form>
        <section>
          <Accordion defaultActiveIndex={0} panels={rootPanels} styled />
        </section>
      </Aux>
    );
  }
}
