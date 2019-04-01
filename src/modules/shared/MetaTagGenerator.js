import React from 'react';
import { Helmet } from 'react-helmet';
import { map } from 'lodash';

const MetaTagGenerator = ({ metaTagsData }) => (
  <Helmet>
    <link rel="canonical" href={window.location.href} />
    {map(metaTagsData, d => (
      d.type === 'meta' ?
        <meta name={d.name} key={d.type} content={d.content} />
      : d.type === 'ogTag' ?
        <meta property={d.property} key={d.type} content={d.content} />
      : null
    ))}
  </Helmet>
);

export default MetaTagGenerator;
