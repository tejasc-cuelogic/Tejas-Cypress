import React, { Component } from 'react';
import { Header, Divider } from 'semantic-ui-react';

class Blog extends Component {
  caseStudies = [
    {
      title: 'this is post 01',
      description: 'A bar-style, fast casual restaurant bringing a unique and pot dining experience.',
    },
    {
      title: 'this is post 02',
      description: 'GastroLounge and high end event space in up-and-coming East Downtown Houstan.',
    },
    {
      title: 'this is post 03',
      description: 'Next evolution of the food hall. Bravery Chef Hall will feature 5 concepts.',
    },
    {
      title: 'this is post 04',
      description: 'Houstan Bravery is launching new Buffbrew and over 40 beers on tap.',
    },
  ];

  render() {
    return (
      <>
        <Header as="h1">
NextSeed Blog
          <Header.Subheader>Let your community invest in your success</Header.Subheader>
        </Header>
        <Divider inverted section />
        lll
      </>
    );
  }
}

export default Blog;
