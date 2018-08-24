import React from 'react';
import { Feed, Image, Transition } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../theme/shared/';
import UserOne from '../../../../../assets/images/owner-1.jpg';

const ActivityFeed = ({ loading, activities }) => (
  <Transition.Group animation="glow" className="activities" as={Feed} duration={900}>
    {loading ? <InlineLoader /> : (
      activities.length === 0 ? <InlineLoader text="No activity to display" /> :
      activities.map(a => (
        <Feed.Event key={a.id}>
          <Feed.Label>
            <Image src={UserOne} />
          </Feed.Label>
          <Feed.Content>
            <Feed.Meta>{a.userName} (5/5/2018  |  10:34am)</Feed.Meta>
            <Feed.Summary>{a.title}</Feed.Summary>
            <Feed.Extra text>{a.comment}</Feed.Extra>
          </Feed.Content>
        </Feed.Event>
      ))
    )}
  </Transition.Group>
);

export default ActivityFeed;
