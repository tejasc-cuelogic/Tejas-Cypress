import React, { Component } from 'react';
import { Container, Image, Menu, Dropdown, Responsive } from 'semantic-ui-react';
import Aux from 'react-aux';
import { Link, NavLink, matchPath } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { NsCarousel, InlineLoader } from '../../../../theme/shared';
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
    this.props.articleStore.featuredRequestArticlesByCategoryId();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params && nextProps.match.params.id) {
      this.props.articleStore.requestArticlesByCategoryId(nextProps.match.params.id);
    } else {
      this.props.articleStore.requestAllArticles();
    }
  }
  activeText = () => {
    const { InsightCategories } = this.props.articleStore;
    const { location } = this.props;
    const refMatch = { url: '/resources/insights' };
    if (InsightCategories.length !== 0) {
      const active = InsightCategories.find((i) => {
        const path = `${refMatch.url}/${i.to}`;
        return matchPath(location.pathname, { path, exact: true });
      });
      return active ? active.title : 'All';
    }
    return 'All';
  }
  render() {
    const {
      InsightCategories,
      loading,
      InsightFeaturedArticles,
    } = this.props.articleStore;
    const settings = {
      slidesToShow: isMobile ? '1' : 3,
      slidesToScroll: isMobile ? '1' : 3,
    };
    const sliderInsightFeaturedArticles =
        InsightFeaturedArticles && InsightFeaturedArticles.length ?
          InsightFeaturedArticles.slice(0, 5) : [];
    return (
      <Aux>
        <NsCarousel {...settings}>
          {
            sliderInsightFeaturedArticles &&
            sliderInsightFeaturedArticles.map(i => (
              <div className="insight-image-wrapper">
                <Image fluid as={Link} to={`/resources/insights/${i.id}`} src={i.featuredImage} key={i} />
                <div className="image-caption">
                  <Link to={`/resources/insights/${i.id}`} className="news-category">
                    Featured
                  </Link>
                  <Link to={`/resources/insights/${i.id}`} className="news-title">
                    {i.title}
                  </Link>
                </div>
              </div>
            ))
          }
        </NsCarousel>
        <Responsive secondary minWidth={1200} as={Menu} className="menu-secondary-fixed insight-menu">
          <Container>
            <Menu.Menu secondary className="menu-secondary">
              <Menu.Item as={Link} to="/resources/insights">All</Menu.Item>
              {InsightCategories &&
                InsightCategories.map(item => (
                  <Menu.Item as={NavLink} to={`/resources/insights/${item.to}`}>{item.title}</Menu.Item>
                ))}
            </Menu.Menu>
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
          </Container>
        </Responsive>
        <Responsive maxWidth={1199} as={Menu} className="mobile-dropdown-menu container">
          <Dropdown item text={this.activeText()}>
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
            {loading ? <InlineLoader /> : <InsightArticlesList />}
          </Container>
        </section>
      </Aux>
    );
  }
}
