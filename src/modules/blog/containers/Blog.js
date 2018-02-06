import React, { Component } from 'react';
import GridListing from '../../../theme/ui/GridListing';
import BlogPost from '../components/BlogPost';

class Blog extends Component {
  caseStudies = [
    {
      title: 'this is post 01',
      description: 'A bar-style, fast casual restaurant bringing a unique and pot dining experience.',
    },
    {
      title: 'this is post 02',
      description: 'GastroLounge and high end event space in up-and-coming East Downtown Houstan.',
    },
    {
      title: 'this is post 03',
      description: 'Next evolution of the food hall. Bravery Chef Hall will feature 5 concepts.',
    },
    {
      title: 'this is post 04',
      description: 'Houstan Bravery is launching new Buffbrew and over 40 beers on tap.',
    },
  ];

  render() {
    let pageContent = null;
    if (this.props.match.params.postId) {
      pageContent = <BlogPost postId={this.props.match.params.postId} />;
    } else {
      pageContent = <GridListing listItems={this.caseStudies} details="blog/details" />;
    }

    return (
      <div className="ui one column grid">
        <div className="column nsContent">
          <span className="title">NextSeed Blog</span>
          <span className="infotext">Let your community invest in your success</span>
          {pageContent}
        </div>
      </div>
    );
  }
}

export default Blog;
