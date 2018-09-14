import React, { Component } from 'react';
import { Container, Image, Menu, Dropdown, Responsive } from 'semantic-ui-react';
import Aux from 'react-aux';
import { Link, NavLink } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { NsCarousel, InlineLoader } from '../../../../theme/shared';
import Insight from '../../../../assets/images/insights2.jpg';
import InsightArticlesList from '../components/insightArticlesList';

const isMobile = document.documentElement.clientWidth < 768;
@inject('articleStore')
@observer
export default class Insights extends Component {
  componentWillMount() {
    if (this.props.match.params && this.props.match.params.id) {
      this.props.articleStore.requestArticlesByCategoryId(this.props.match.params.id);
    } else {
      this.props.articleStore.requestAllArticles();
    }
    this.props.articleStore.getCategoryList();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params && nextProps.match.params.id) {
      this.props.articleStore.requestArticlesByCategoryId(nextProps.match.params.id);
    } else {
      this.props.articleStore.requestAllArticles();
    }
  }
  render() {
    const {
      InsightCategories,
      loading,
    } = this.props.articleStore;
    const settings = {
      slidesToShow: isMobile ? '1' : 3,
      slidesToScroll: isMobile ? '1' : 3,
    };
    return (
      <Aux>
        <NsCarousel {...settings}>
          {
            [1, 2, 3, 4, 5].map(i => (
              <div className="insight-image-wrapper">
                <Image src={Insight} key={i} />
                <div className="image-caption">
                  <p className="news-category">
                  BUSINESS
                  </p>
                  <p className="news-title">
                  Bring the local food movement home with hyper local sourcing.
                  </p>
                </div>
              </div>
            ))
          }
        </NsCarousel>
        <Responsive secondary minWidth={768} as={Menu} className="menu-secondary-fixed insight-menu">
          <Container>
            <Menu.Menu secondary className="menu-secondary">
              <Menu.Item as={Link} to="/resources/insights">All</Menu.Item>
              {InsightCategories &&
              InsightCategories.map(item => (
                <Menu.Item as={NavLink} to={`/resources/insights/${item.to}`}>{item.title}</Menu.Item>
              ))}
            </Menu.Menu>
            <Responsive secondary minWidth={1024} as={Aux}>
              <Menu.Item position="right">
                SORT BY
                <Dropdown item text="NEWEST">
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/">Newest</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/">Oldest</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/">Popular</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Item>
            </Responsive>
          </Container>
        </Responsive>
        <Responsive maxWidth={767} as={Menu} className="mobile-dropdown-menu">
          <Dropdown item>
            <Dropdown.Menu>
              <Menu.Item as={Link} to="/resources/insights">All</Menu.Item>
              {InsightCategories &&
              InsightCategories.map(item => (
                <Menu.Item as={NavLink} to={`/resources/insights/${item.to}`}>{item.title}</Menu.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Responsive>
        <section>
          <Container>
            {loading ? <InlineLoader /> : <InsightArticlesList /> }
          </Container>
        </section>
      </Aux>
    );
  }
}
