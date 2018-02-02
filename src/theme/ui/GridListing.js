import React from 'react';
import { Grid, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const gridListing = props => (
  <div style={{ marginTop: '11px' }} >
    <Grid>
      <Grid.Row className="offeringList" columns={4}>
        {
          props.listItems.map(offer => (
            <Grid.Column key={offer.title} width={3}>
              <h4>{offer.title}</h4>
              <p>{offer.description}</p>
              <p><Menu.Item as={Link} to={props.details} >view details</Menu.Item></p>
            </Grid.Column>
          ))
        }
      </Grid.Row>
    </Grid>
  </div>
);

export default gridListing;
