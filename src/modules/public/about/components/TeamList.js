import React from 'react';
import { Header, Icon, Grid, Reveal, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';

const TeamList = ({
  members,
  columns,
  className,
  match,
  joinColumn,
}) => (
  <Grid.Column>
    <Grid columns={columns} className={className} doubling>
      { members.map(member => (
        <Grid.Column>
          <Reveal as={Link} to={`${match.url}/${member.id}`} animated="fade">
            <Reveal.Content hidden>
              <div className="team-overlay">
                <p><b>{member.memberName}</b></p>
                <p>{member.title}</p>
              </div>
            </Reveal.Content>
            <Reveal.Content visible>
              <LazyLoad height={100} >
                <Image src={member.avatar} />
              </LazyLoad>
            </Reveal.Content>
          </Reveal>
        </Grid.Column>))}
      { joinColumn &&
      <Grid.Column verticalAlign="middle" centered>
        <Link to="/about/careers">
          <Header as="h4" textAlign="center">
            Join our team
            <Header.Subheader className="mt-10">
              See open positions
              <Icon color="green" className="ns-arrow-right right" />
            </Header.Subheader>
          </Header>
        </Link>
      </Grid.Column> }
    </Grid>
  </Grid.Column>
);

export default TeamList;

