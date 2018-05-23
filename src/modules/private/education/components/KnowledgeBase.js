import React from 'react';
import { Grid, Header, Accordion, Responsive, Card } from 'semantic-ui-react';

const KnowledgeBase = () => (
  <div>
    <Grid>
      <Grid.Column widescreen={8} largeScreen={8} computer={16} tablet={16} mobile={16}>
        <Header as="h3">Table of Content</Header>
        <Accordion className="feed-view">
          <Accordion.Title active>
            Chapter 1
            <span>Lorem ipsum dolor sit amet enim ullamcorper?</span>
          </Accordion.Title>
          <Responsive as="div" className="content active" maxWidth={1199}>
            <p>
              Lorem ipsum dolor sit amet pede. Cras dignissim. Donec pulvinar odio. Morbi pede.
              Cras ut massa. Proin orci. Suspendisse luctus quam ante et quam tristique sodales.
              Vivamus imperdiet consequat. Quisque lorem id purus fringilla id, urna. Cras
              egestas dignissim, tellus. Donec consectetuer adipiscing elit. Aenean posuere
              cubilia Curae, Cras nec augue. Maecenas gravida, quam ultricies massa. Integer
              aliquam. Etiam non ligula eget diam magna tincidunt tempus. Pellentesque dolor sit
              amet interdum vehicula. Vivamus posuere vitae, mollis luctus. Aenean
              facilisis pharetra.<br /><br />
              Vestibulum scelerisque condimentum tempor, tortor id elit tincidunt risus sit amet,
              consectetuer viverra accumsan. Fusce nulla in faucibus eu, tristique dapibus,
              libero mollis nulla ut diam elementum eros ipsum, ultricies lacinia scelerisque,
              quam quis neque. Praesent odio eget tellus. Fusce gravida, eros lacus, suscipit a,
              pretium sit amet interdum ligula bibendum tempus. Pellentesque sed leo. Donec nec
              diam vel sollicitudin a, blandit libero. Sed lobortis venenatis, elit sit amet
              enim. Class aptent taciti sociosqu ad litora torquent per conubia noa.<br /><br />
              Lorem ipsum dolor sit amet pede. Cras dignissim. Donec pulvinar odio. Morbi pede.
              Cras ut massa. Proin orci. Suspendisse luctus quam ante et quam tristique sodales.
              Vivamus imperdiet consequat. Quisque lorem id purus fringilla id, urna. Cras
              egestas dignissim, tellus. Donec consectetuer adipiscing elit. Aenean posuere
              cubilia Curae, Cras nec augue. Maecenas gravida, quam ultricies massa. Integer
              aliquam. Etiam non ligula eget diam magna tincidunt tempus. Pellentesque dolor sit
              amet interdum vehicula. Vivamus posuere vitae, mollis luctus. Aenean
              facilisis pharetra.<br /><br />
              Vestibulum scelerisque condimentum tempor, tortor id elit tincidunt risus sit amet,
              consectetuer viverra accumsan. Fusce nulla in faucibus eu, tristique dapibus,
              libero mollis nulla ut diam elementum eros ipsum, ultricies lacinia scelerisque,
              quam quis neque. Praesent odio eget tellus. Fusce gravida, eros lacus, suscipit a,
              pretium sit amet interdum ligula bibendum tempus. Pellentesque sed leo. Donec nec
              diam vel sollicitudin a, blandit libero. Sed lobortis venenatis, elit sit amet
              enim. Class aptent taciti sociosqu ad litora torquent per conubia nostra.
            </p>
          </Responsive>
          <Accordion.Title>
            Chapter 2
            <span>
              Maecenas malesuada elit lectus felis, malesuada ultricies
              elit lectus felis, malesuada ultricies?
            </span>
          </Accordion.Title>
          <Responsive as="div" className="content" maxWidth={1199}>
            <p>
              Lorem ipsum dolor sit amet pede. Cras dignissim. Donec pulvinar odio. Morbi pede.
              Cras ut massa. Proin orci. Suspendisse luctus quam ante et quam tristique sodales.
              Vivamus imperdiet consequat. Quisque lorem id purus fringilla id, urna. Cras
              egestas dignissim, tellus. Donec consectetuer adipiscing elit. Aenean posuere
              cubilia Curae, Cras nec augue. Maecenas gravida, quam ultricies massa. Integer
              aliquam. Etiam non ligula eget diam magna tincidunt tempus. Pellentesque dolor sit
              amet interdum vehicula. Vivamus posuere vitae, mollis luctus. Aenean
              facilisis pharetra.<br /><br />
              Vestibulum scelerisque condimentum tempor, tortor id elit tincidunt risus sit amet,
              consectetuer viverra accumsan. Fusce nulla in faucibus eu, tristique dapibus,
              libero mollis nulla ut diam elementum eros ipsum, ultricies lacinia scelerisque,
              quam quis neque. Praesent odio eget tellus. Fusce gravida, eros lacus, suscipit a,
              pretium sit amet interdum ligula bibendum tempus. Pellentesque sed leo. Donec nec
              diam vel sollicitudin a, blandit libero. Sed lobortis venenatis, elit sit amet
              enim. Class aptent taciti sociosqu ad litora torquent per conubia noa.<br /><br />
              Lorem ipsum dolor sit amet pede. Cras dignissim. Donec pulvinar odio. Morbi pede.
              Cras ut massa. Proin orci. Suspendisse luctus quam ante et quam tristique sodales.
              Vivamus imperdiet consequat. Quisque lorem id purus fringilla id, urna. Cras
              egestas dignissim, tellus. Donec consectetuer adipiscing elit. Aenean posuere
              cubilia Curae, Cras nec augue. Maecenas gravida, quam ultricies massa. Integer
              aliquam. Etiam non ligula eget diam magna tincidunt tempus. Pellentesque dolor sit
              amet interdum vehicula. Vivamus posuere vitae, mollis luctus. Aenean
              facilisis pharetra.<br /><br />
              Vestibulum scelerisque condimentum tempor, tortor id elit tincidunt risus sit amet,
              consectetuer viverra accumsan. Fusce nulla in faucibus eu, tristique dapibus,
              libero mollis nulla ut diam elementum eros ipsum, ultricies lacinia scelerisque,
              quam quis neque. Praesent odio eget tellus. Fusce gravida, eros lacus, suscipit a,
              pretium sit amet interdum ligula bibendum tempus. Pellentesque sed leo. Donec nec
              diam vel sollicitudin a, blandit libero. Sed lobortis venenatis, elit sit amet
              enim. Class aptent taciti sociosqu ad litora torquent per conubia nostra.
            </p>
          </Responsive>
          <Accordion.Title>
            Chapter 3
            <span>Lorem ipsum dolor sit amet enim ullamcorper?</span>
          </Accordion.Title>
          <Responsive as="div" className="content" maxWidth={1199}>
            <p>
              Lorem ipsum dolor sit amet pede. Cras dignissim. Donec pulvinar odio. Morbi pede.
              Cras ut massa. Proin orci. Suspendisse luctus quam ante et quam tristique sodales.
              Vivamus imperdiet consequat. Quisque lorem id purus fringilla id, urna. Cras
              egestas dignissim, tellus. Donec consectetuer adipiscing elit. Aenean posuere
              cubilia Curae, Cras nec augue. Maecenas gravida, quam ultricies massa. Integer
              aliquam. Etiam non ligula eget diam magna tincidunt tempus. Pellentesque dolor sit
              amet interdum vehicula. Vivamus posuere vitae, mollis luctus. Aenean
              facilisis pharetra.<br /><br />
              Vestibulum scelerisque condimentum tempor, tortor id elit tincidunt risus sit amet,
              consectetuer viverra accumsan. Fusce nulla in faucibus eu, tristique dapibus,
              libero mollis nulla ut diam elementum eros ipsum, ultricies lacinia scelerisque,
              quam quis neque. Praesent odio eget tellus. Fusce gravida, eros lacus, suscipit a,
              pretium sit amet interdum ligula bibendum tempus. Pellentesque sed leo. Donec nec
              diam vel sollicitudin a, blandit libero. Sed lobortis venenatis, elit sit amet
              enim. Class aptent taciti sociosqu ad litora torquent per conubia noa.<br /><br />
              Lorem ipsum dolor sit amet pede. Cras dignissim. Donec pulvinar odio. Morbi pede.
              Cras ut massa. Proin orci. Suspendisse luctus quam ante et quam tristique sodales.
              Vivamus imperdiet consequat. Quisque lorem id purus fringilla id, urna. Cras
              egestas dignissim, tellus. Donec consectetuer adipiscing elit. Aenean posuere
              cubilia Curae, Cras nec augue. Maecenas gravida, quam ultricies massa. Integer
              aliquam. Etiam non ligula eget diam magna tincidunt tempus. Pellentesque dolor sit
              amet interdum vehicula. Vivamus posuere vitae, mollis luctus. Aenean
              facilisis pharetra.<br /><br />
              Vestibulum scelerisque condimentum tempor, tortor id elit tincidunt risus sit amet,
              consectetuer viverra accumsan. Fusce nulla in faucibus eu, tristique dapibus,
              libero mollis nulla ut diam elementum eros ipsum, ultricies lacinia scelerisque,
              quam quis neque. Praesent odio eget tellus. Fusce gravida, eros lacus, suscipit a,
              pretium sit amet interdum ligula bibendum tempus. Pellentesque sed leo. Donec nec
              diam vel sollicitudin a, blandit libero. Sed lobortis venenatis, elit sit amet
              enim. Class aptent taciti sociosqu ad litora torquent per conubia nostra.
            </p>
          </Responsive>
        </Accordion>
      </Grid.Column>
      <Grid.Column widescreen={8} largeScreen={8} only="large screen">
        <Card fluid>
          <Card.Content className="padded">
            <Header as="h3">Lorem ipsum dolor sit amet enim ullamcorper?</Header>
            <p>
              Lorem ipsum dolor sit amet pede. Cras dignissim. Donec pulvinar odio. Morbi pede.
              Cras ut massa. Proin orci. Suspendisse luctus quam ante et quam tristique sodales.
              Vivamus imperdiet consequat. Quisque lorem id purus fringilla id, urna. Cras
              egestas dignissim, tellus. Donec consectetuer adipiscing elit. Aenean posuere
              cubilia Curae, Cras nec augue. Maecenas gravida, quam ultricies massa. Integer
              aliquam. Etiam non ligula eget diam magna tincidunt tempus. Pellentesque dolor sit
              amet interdum vehicula. Vivamus posuere vitae, mollis luctus. Aenean
              facilisis pharetra.<br /><br />
              Vestibulum scelerisque condimentum tempor, tortor id elit tincidunt risus sit amet,
              consectetuer viverra accumsan. Fusce nulla in faucibus eu, tristique dapibus,
              libero mollis nulla ut diam elementum eros ipsum, ultricies lacinia scelerisque,
              quam quis neque. Praesent odio eget tellus. Fusce gravida, eros lacus, suscipit a,
              pretium sit amet interdum ligula bibendum tempus. Pellentesque sed leo. Donec nec
              diam vel sollicitudin a, blandit libero. Sed lobortis venenatis, elit sit amet
              enim. Class aptent taciti sociosqu ad litora torquent per conubia noa.<br /><br />
              Lorem ipsum dolor sit amet pede. Cras dignissim. Donec pulvinar odio. Morbi pede.
              Cras ut massa. Proin orci. Suspendisse luctus quam ante et quam tristique sodales.
              Vivamus imperdiet consequat. Quisque lorem id purus fringilla id, urna. Cras
              egestas dignissim, tellus. Donec consectetuer adipiscing elit. Aenean posuere
              cubilia Curae, Cras nec augue. Maecenas gravida, quam ultricies massa. Integer
              aliquam. Etiam non ligula eget diam magna tincidunt tempus. Pellentesque dolor sit
              amet interdum vehicula. Vivamus posuere vitae, mollis luctus. Aenean
              facilisis pharetra.<br /><br />
              Vestibulum scelerisque condimentum tempor, tortor id elit tincidunt risus sit amet,
              consectetuer viverra accumsan. Fusce nulla in faucibus eu, tristique dapibus,
              libero mollis nulla ut diam elementum eros ipsum, ultricies lacinia scelerisque,
              quam quis neque. Praesent odio eget tellus. Fusce gravida, eros lacus, suscipit a,
              pretium sit amet interdum ligula bibendum tempus. Pellentesque sed leo. Donec nec
              diam vel sollicitudin a, blandit libero. Sed lobortis venenatis, elit sit amet
              enim. Class aptent taciti sociosqu ad litora torquent per conubia nostra.
            </p>
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid>
  </div>
);

export default KnowledgeBase;
