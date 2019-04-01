import React from 'react';
import { Helmet } from 'react-helmet';
import { map } from 'lodash';

const MetaTagGenerator = ({ metaTagsData }) => (
  <Helmet>
    <link rel="canonical" href={window.location.href} />
    {map(metaTagsData, d => (
      d.type === 'meta' ?
        <meta key={new Date().getTime()} name={d.name} content={d.content} />
      : d.type === 'ogTag' ?
        <meta property={d.property} content={d.content} />
      : null
    ))}
  </Helmet>
);

export default MetaTagGenerator;
