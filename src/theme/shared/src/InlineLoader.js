import React from 'react';

const InlineLoader = props => (
  <section className="center-align" style={{ minHeight: 'calc(100vh - 396px)' }}>
    <h3 style={{ color: '#31333d7d' }}>{props.text || 'Loading...'}</h3>
  </section>
);

export default InlineLoader;
