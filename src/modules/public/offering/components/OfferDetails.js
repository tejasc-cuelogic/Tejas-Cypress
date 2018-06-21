import React from 'react';
import { Header } from 'semantic-ui-react';

const offerDetails = () => (
  <div className="offerDetails">
    <Header as="h3">Bravery Chef Hall</Header>
    <Header as="h6">Houston, TX</Header>
    <ul className="pageContent">
      <li>First-of-its-kind “chef hall” – a next generation food hall with a chef-driven focus</li>
      <li>Five chef-driven concepts plus three bars, all under one roof</li>
      <li>
        Created by the founders of Conservatory Underground Beer Garden &
        Food Hall and Pax Americana
      </li>
      <li>
        Bravery is the anchor tenant in the new Aris Market Square luxury
        high-rise, directly across from Market Square Park
      </li>
      <li>This investment is secured by a blanket lien on all assets of the business</li>
    </ul>
    <Header as="h4">Company Description</Header>
    <p className="pageContent">
      As the next generation of the food hall, Bravery Chef Hall will be the first of its kind
      venue, providing chef-driven concepts with the structure and environment to experiment
      and develop a business through a leading-edge model.
    </p>
  </div>
);

export default offerDetails;
