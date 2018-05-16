import React from 'react';
import { Header, Embed } from 'semantic-ui-react';
import Aux from 'react-aux';
import videoPoster from '../../../../../../assets/images/683547643.webp';

const updates = {
  title: 'Featurette on Ben McPherson and BOH Pasta',
  date: 'Dec 17th 2017',
  embed: '131191237',
  description: `Check out our chef featurette video on Ben McPherson, Founder of Krisp Bird & Batter.
    He was inspired by trips with his father to Italy and is bringing the concept of BOH Pasta
    to the Bravery Chef Hall.`,
};

const UpdateDetails = () => (
  <Aux>
    <Header as="h3" className="mb-half">{updates.title}</Header>
    <Header as="h5">{updates.date}</Header>
    <Embed
      id={updates.embed}
      placeholder={videoPoster}
      source="vimeo"
    />
    <p>{updates.description}</p>
    <p>{updates.description}</p>
    <p>{updates.description}</p>
  </Aux>
);

export default UpdateDetails;
