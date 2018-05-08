import React from 'react';
import {
  Divider,
} from 'semantic-ui-react';

const ambassadors = () => (
  <div>
    <span className="title">NextSeed Ambassadors</span>
    <span className="infotext">
      Champions of local growth
    </span>
    <Divider inverted section />
    <p className="pageContent">
      {/* eslint-disable max-len */}
      We’re working with some of the best and brightest thought leaders and influencers in local communities around the country. Together, we’re collaborating to drive and promote growth from Main Street on up.
    </p>
  </div>
);

export default ambassadors;
