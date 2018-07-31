import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Container, Grid, Image, Breadcrumb } from 'semantic-ui-react';
import InsightDetails from '../../../../assets/images/insight-details.jpg';

export default class InsightsDetails extends Component {
  render() {
    return (
      <Aux>
        <Container>
          <section>
            <Breadcrumb className="mb-30">
              <Breadcrumb.Section link>Insights</Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section link>Short Blog Title Here</Breadcrumb.Section>
            </Breadcrumb>
            <Grid>
              <Grid.Column width={12}>
                <Header as="h2">
                Headline lorem ipsum dolor set amet, consectetur one to two lines.
                </Header>
                <Image src={InsightDetails} className="mb-30 mt-30" />
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sit
                  amet magna non arcu molestie convallis. Nulla sit amet porta quam.
                  Praesent mollis, dolor eget iaculis rhoncus, orci lectus vestibulum ex,
                  at auctor justo tortor et ligula. Vivamus accumsan dictum libero non
                  sollicitudin. Fusce tempus iaculis mauris, nec faucibus ante pellentesque ut.
                  Nulla aliquet nisl ac mi luctus, nec fermentum lectus tempor. Ut orci arcu,
                  consectetur ac bibendum a, pretium a urna. Nunc id nisl vitae orci porta
                  gravida id vel est. Pellentesque tempor tristique nunc, in feugiat nulla
                  convallis efficitur. Praesent condimentum nunc a mauris mollis, ut eleifend
                  eros gravida.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sit
                  amet magna non arcu molestie convallis. Nulla sit amet porta quam.
                  Praesent mollis, dolor eget iaculis rhoncus, orci lectus vestibulum ex,
                  at auctor justo tortor et ligula. Vivamus accumsan dictum libero non
                  sollicitudin. Fusce tempus iaculis mauris, nec faucibus ante pellentesque ut.
                  Nulla aliquet nisl ac mi luctus, nec fermentum lectus tempor. Ut orci arcu,
                  consectetur ac bibendum a, pretium a urna. Nunc id nisl vitae orci porta
                  gravida id vel est. Pellentesque tempor tristique nunc, in feugiat nulla
                  convallis efficitur. Praesent condimentum nunc a mauris mollis, ut eleifend
                  eros gravida.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sit
                  amet magna non arcu molestie convallis. Nulla sit amet porta quam.
                  Praesent mollis, dolor eget iaculis rhoncus, orci lectus vestibulum ex,
                  at auctor justo tortor et ligula. Vivamus accumsan dictum libero non
                  sollicitudin. Fusce tempus iaculis mauris, nec faucibus ante pellentesque ut.
                  Nulla aliquet nisl ac mi luctus, nec fermentum lectus tempor. Ut orci arcu,
                  consectetur ac bibendum a, pretium a urna. Nunc id nisl vitae orci porta
                  gravida id vel est. Pellentesque tempor tristique nunc, in feugiat nulla
                  convallis efficitur. Praesent condimentum nunc a mauris mollis, ut eleifend
                  eros gravida.
                </p>
              </Grid.Column>
            </Grid>
          </section>
        </Container>
      </Aux>
    );
  }
}
