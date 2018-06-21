import React from 'react';
import Aux from 'react-aux';
import { Header, Divider } from 'semantic-ui-react';

const team = () => (
  <Aux>
    <Header as="h1">About Us
      <Header.Subheader>
        Our Mission is to Connect Businesses and Individuals to Build Vibrant Communities
      </Header.Subheader>
    </Header>
    <Divider inverted section />
    <p className="pageContent">
      By using the latest crowdfunding laws and technology, NextSeed is creating new opportunities
      for businesses and everyday investors to grow together. Through NextSeed, small businesses
      have access to a source of debt financing that is all around them.
    </p>
  </Aux>
);

export default team;
