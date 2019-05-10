import React, { Component } from 'react';
import { Container, Menu, Dropdown, Responsive } from 'semantic-ui-react';
import Aux from 'react-aux';
import { Link, NavLink, matchPath } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { NsCarousel, InlineLoader, Image64 } from '../../../../theme/shared';
import InsightArticlesList from '../components/insightArticlesList';


const isMobile = document.documentElement.clientWidth < 768;
@inject('articleStore')
@observer
export default class Insights extends Component {
  state = {
    sortAsc: false,
  };
  componentWillMount() {
    if (this.props.match.params && this.props.match.params.id) {
      this.props.articleStore.requestAllArticles(true, false, this.props.match.params.id);
    } else {
      this.props.articleStore.requestAllArticles(true, false);
      this.props.articleStore.featuredRequestArticles();
      this.props.articleStore.getCategoryList(true);
    }
    // this.props.articleStore.featuredRequestArticlesByCategoryId();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params && nextProps.match.params.id) {
      this.props.articleStore
        .requestAllArticles(true, this.state.sortAsc, nextProps.match.params.id);
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
  requestAllArticles = (isPublic, sortBy) => {
    this.setState({
      sortAsc: sortBy,
    });
    this.props.articleStore.requestAllArticles(isPublic, this.state.sortAsc);
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
                <Image64
                  centered
                  srcUrl={i.featuredImage ? i.featuredImage : null}
                  key={i}
                  fluid
                  as={Link}
                  to={`/resources/insights/${i.slug}`}
                />
                {/* <Image fluid as={Link} to={`/resources/insights/${i.slug}`}
              src={i.featuredImage} key={i} /> */}
                <Link to={`/resources/insights/${i.slug}`} className="image-caption">
                  <p className="news-category">
                    Featured
                  </p>
                  <p className="news-title">
                    {i.title}
                  </p>
                </Link>
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
              <Dropdown item>
                <Dropdown.Menu>
                  <Dropdown.Item
                    key="newest"
                    as={Link}
                    to="#"
                    onClick={() => this.requestAllArticles(true, false)}
                    className={this.state.sortAsc ? 'active' : ''}
                  >Newest
                  </Dropdown.Item>
                  <Dropdown.Item
                    key="oldest"
                    as={Link}
                    to="#"
                    onClick={() => this.requestAllArticles(true, true)}
                    className={this.state.sortAsc ? '' : 'active'}
                  >Oldest
                  </Dropdown.Item>
                  {/* <Dropdown.Item as={Link} to="/">Popular</Dropdown.Item> */}
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </Container>
        </Responsive>
        <Responsive maxWidth={1199} as={Menu} className={`${sliderInsightFeaturedArticles.length === 0 ? 'mt-30' : ''} mobile-dropdown-menu container`}>
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
