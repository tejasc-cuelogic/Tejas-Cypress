import React from 'react';
import { Grid, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const gridListing = props => (
  <Grid relaxed="very">
    <Grid.Row columns={4}>
      {
        props.listItems.map(offer => (
          <Grid.Column key={offer.title}>
            <div className="offeringList">
              <h4>{offer.title}</h4>
              <p>{offer.description}</p>
              <p><Menu.Item as={Link} to={props.details}>view details</Menu.Item></p>
            </div>
          </Grid.Column>
        ))
      }
    </Grid.Row>
  </Grid>
  // <div style={{ marginTop: '11px' }} >
  // </div>
);

export default gridListing;
