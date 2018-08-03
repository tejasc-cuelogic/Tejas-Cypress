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
    <Grid columns={columns} className={className}>
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
      <Grid.Column>
        <Reveal animated="fade">
          <div className="team-overlay">
            <Header as="h4" textAlign="center">
               Join our team
              <Header.Subheader as={Link} to="/">
                <Icon color="green" className="ns-arrow-right" />
              See open positions
              </Header.Subheader>
            </Header>
          </div>
        </Reveal>
      </Grid.Column> }
    </Grid>
  </Grid.Column>
);

export default TeamList;

