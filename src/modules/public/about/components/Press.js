import React from 'react';
import Aux from 'react-aux';
import { Header, Container, Grid, Image, Divider, List, Icon, Segment } from 'semantic-ui-react';
import press from '../../../../assets/images/press.png';
import press1 from '../../../../assets/images/press1.png';
import press2 from '../../../../assets/images/press2.png';
import press3 from '../../../../assets/images/press3.jpg';

const Press = () => (
  <Aux>
    <Container>
      <section className="press-news">
        <Header as="h2">In the news</Header>
        <Grid>
          <Grid.Row stretched>
            <Grid.Column width={10}>
              <Segment>
                <div className="news">
                  <Image src={press} />
                  <div className="image-caption">
                    <p className="news-category">
                      News
                    </p>
                    <p className="news-title">
                      Making a splash in D.C.
                    </p>
                  </div>
                </div>
              </Segment>
            </Grid.Column>
            <Grid.Column width={6}>
              <Segment>
                <div className="news">
                  <Image src={press1} />
                  <div className="image-caption">
                    <p className="news-category">
                      News
                    </p>
                    <p className="news-title">
                      Press title here.
                    </p>
                  </div>
                </div>
              </Segment>
              <Segment>
                <div className="news">
                  <Image src={press2} />
                  <div className="image-caption">
                    <p className="news-category">
                      News
                    </p>
                    <p className="news-title">
                      Press title here.
                    </p>
                  </div>
                </div>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </section>
      <Divider fitted as={Container} />
      <section>
        <Grid>
          <Grid.Column width={8}>
            <Image src={press3} />
          </Grid.Column>
          <Grid.Column width={8}>
            <Header as="h2">History</Header>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam facilisis lacus orci,
            a mollis erat blandit id. Aenean quis erat at libero efficitur consectetur. In non
            nulla sollicitudin risus efficitur aliquet. Etiam maximus feugiat velit. Maecenas ut
            velit quam. Maecenas pellentesque feugiat maximus. Orci varius natoque penatibus et
            magnis dis parturient montes, nascetur ridiculus mus.
Quisque interdum elit sapien,
            sit amet aliquam odio tempus quis. Pellentesque iaculis massa leo, vel feugiat felis
            ornare a. Quisque sagittis purus nec lectus congue, et lobortis sagittis.
            Ineu pharetra lectus.
            </p>
          </Grid.Column>
        </Grid>
      </section>
      <Divider fitted as={Container} />
      <section>
        <Grid>
          <Grid.Column width={10}>
            <Header as="h2">Media Resources</Header>
            <p className="mb-30">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam facilisis lacus orci,
            a mollis erat blandit id. Aenean quis erat at libero efficitur consectetur. In non
            nulla sollicitudin risus efficitur aliquet. Etiam maximus feugiat velit. Maecenas ut
            velit quam. Maecenas pellentesque feugiat maximus. Orci varius natoque penatibus et
            magnis dis parturient montes, nascetur ridiculus mus.
            </p>
            <address>
              <p><b>Media Contact: <br />Vivian Kim</b></p>
              <p>Director of Marketing <br />+1 243 567 8901<br />email@nextseed.com</p>
            </address>
          </Grid.Column>
          <Grid.Column width={6} className="bg-offwhite">
            <div className="press-list">
              <List link relaxed="very">
                <List.Header>Documentation</List.Header>
                <Divider />
                <List.Item as="a"><Icon className="ns-download" /> History</List.Item>
                <List.Item as="a"><Icon className="ns-download" /> Press Releases</List.Item>
                <List.Item as="a"><Icon className="ns-download" /> White Papers</List.Item>
              </List>
              <List link relaxed="very">
                <List.Header>Brand Assets</List.Header>
                <Divider />
                <List.Item as="a"><Icon className="ns-download" /> Brand Guide</List.Item>
                <List.Item as="a"><Icon className="ns-download" /> Logos</List.Item>
                <List.Item as="a"><Icon className="ns-download" /> Photography</List.Item>
              </List>
            </div>
          </Grid.Column>
        </Grid>
      </section>
    </Container>
  </Aux>
);

export default Press;
