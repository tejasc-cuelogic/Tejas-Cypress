import React, { Component } from 'react';
import Aux from 'react-aux';
// import { Link } from 'react-router-dom';
import { Container, Grid, Menu, Image, Header, Checkbox, Form, Icon, Popup, List, Button } from 'semantic-ui-react';
// import BusinessType from './BusinessType';
import Slider from 'react-slick';
import { ASSETS_URL } from '../../../../../constants/aws';
import { BUSINESS_INDUSTRIES } from '../../../../../services/constants/offering';

const isMobile = document.documentElement.clientWidth < 768;
export default class Filters extends Component {
  state = {
    activeSlide: 0,
    BusinessTypes: BUSINESS_INDUSTRIES,
    MoreOptions: [{
      label: 'Show Funded Deals',
      checkStatus: true,
    }],
    InvestmentTypes: [
      { label: 'Revenue Sharing Note', checkStatus: true },
      { label: 'Term Note', checkStatus: true },
      { label: 'Preferred Equity', checkStatus: false },
    ],
    FundingTypes: [
      { label: 'Regulation Crowdfunding', checkStatus: false },
      { label: '506(c)', checkStatus: false },
    ],
  }

  settings = {
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    infinite: false,
    afterChange: current => this.setState({ activeSlide: current }),
  };

  setProp = (c) => {
    this.slider = c;
  }
  toggleColor = (index) => {
    const { BusinessTypes } = this.state;
    BusinessTypes[index].color = BusinessTypes[index].color === 'green' ? null : 'green';
    this.setState({ BusinessTypes });
  }

  toggleColor2 = () => {
    const { MoreOptions } = this.state;
    MoreOptions.color = MoreOptions.color === 'green' ? null : 'green';
    this.setState({ MoreOptions });
  }
  next = () => {
    this.slider.slickNext();
  }
  previous = () => {
    this.slider.slickPrev();
  }
  clearAll = () => {
    const {
      BusinessTypes,
      MoreOptions,
      InvestmentTypes,
      FundingTypes,
    } = this.state;
    BusinessTypes.forEach((item, index) => {
      BusinessTypes[index].color = null;
    });
    InvestmentTypes.forEach((item, index) => {
      InvestmentTypes[index].checkStatus = false;
    });
    FundingTypes.forEach((item, index) => {
      FundingTypes[index].checkStatus = false;
    });
    MoreOptions.forEach((item, index) => {
      MoreOptions[index].checkStatus = false;
    });
    this.setState({
      BusinessTypes,
      MoreOptions,
      InvestmentTypes,
      FundingTypes,
    });
  }
  togglecheckbox = (arrayName, index) => {
    const obj = this.state[arrayName];
    obj[index].checkStatus = obj[index].checkStatus === false;
    this.setState({ obj });
  }
  done = () => {
    this.setState({ activeSlide: 0 });
    this.props.toggleFilters();
  }
  render() {
    const BusinessTypesComp = (
      <Aux>
        <Header as="h6" dividing className="text-uppercase">Business Type</Header>
        <List relaxed="very">
          {this.state.BusinessTypes.map((item, index) => (
            <List.Item key={item.content} onClick={() => this.toggleColor(index)}>
              <List.Icon color={item.color && item.color} name={item.iconName} />
              <List.Content>{item.content}</List.Content>
            </List.Item>
          ))}
        </List>
      </Aux>);
    const InvestAndFundingTypeComp = (
      <Aux>
        <Header as="h6" dividing className="text-uppercase">
          Investment Options
        </Header>
        <div className="checkbox-group">
          <Form>
            {this.state.InvestmentTypes.map((item, index) => (
              <Form.Field>
                <Checkbox
                  key={item.label}
                  label={item.label}
                  checked={item.checkStatus}
                  onChange={() => this.togglecheckbox('InvestmentTypes', index)}
                />
                <Popup trigger={<Icon color="green" name="help circle" className="pull-right" />} content="Lorem Ipsum" position="top center" />
              </Form.Field>
            ))}
          </Form>
        </div>
        <Header as="h6" dividing className={`${!isMobile && 'mt-80'} text-uppercase`}>
          Funding Type
        </Header>
        <div className="checkbox-group">
          <Form>
            {this.state.FundingTypes.map((item, index) => (
              <Form.Field>
                <Checkbox
                  key={item.label}
                  label={item.label}
                  checked={item.checkStatus}
                  onChange={() => this.togglecheckbox('FundingTypes', index)}
                />
                <Popup trigger={<Icon color="green" name="help circle" className="pull-right" />} content="Lorem Ipsum" position="top center" />
              </Form.Field>
            ))
            }
          </Form>
        </div>
      </Aux>);
    const OtherFiltersComp = (
      <Aux>
        <Header as="h6" dividing className={`${isMobile && 'mt-80'} text-uppercase`}>
          More Options
        </Header>
        <div className="checkbox-group">
          <Form>
            {this.state.MoreOptions.map((item, index) => (
              <Form.Field>
                <Checkbox
                  key={item.label}
                  label={item.label}
                  checked={item.checkStatus}
                  onChange={() => this.togglecheckbox('MoreOptions', index)}
                />
              </Form.Field>
            ))
            }
          </Form>
        </div>
      </Aux>);
    return (
      <Aux>
        <div className="filter-menu">
          <Container>
            <Menu text>
              <Menu.Item name="filter" onClick={this.props.toggleFilters} className="text-uppercase">
                <Image src={`${ASSETS_URL}images/icons/icon_filter.png`} className="filterIcon" />
                 Filter
              </Menu.Item>
              {this.props.status ? (
                <Menu.Menu position="right">
                  {isMobile ?
                    <Menu.Item name="clear all" onClick={this.clearAll}>CLEAR ALL</Menu.Item> :
                    <Menu.Item name="clear all">
                      <Image src={`${ASSETS_URL}images/icons/icon_close.png`} className="closeIcon" onClick={this.props.toggleFilters} />
                    </Menu.Item>
                  }
                </Menu.Menu>
                ) : (
                  <Menu.Item name="3 Results Found" position="right" />
                )
              }
            </Menu>
          </Container>
          {this.props.status && (
            <div className="offer-filter">
              <div className="offer-filter-container">
                <Container>
                  {!isMobile ?
                    <Grid stackable columns={3}>
                      <Grid.Column className="donut-chart">
                        {BusinessTypesComp}
                      </Grid.Column>
                      <Grid.Column>
                        {InvestAndFundingTypeComp}
                      </Grid.Column>
                      <Grid.Column>
                        {OtherFiltersComp}
                        <Button.Group>
                          <Button primary>Update</Button>
                          <Button basic onClick={this.clearAll}>Clear All</Button>
                        </Button.Group>
                      </Grid.Column>
                    </Grid> :
                    <div className="carousel">
                      <Slider ref={c => this.setProp(c)} {...this.settings}>
                        <Aux>
                          {BusinessTypesComp}
                        </Aux>
                        <Aux>
                          {InvestAndFundingTypeComp}
                          {OtherFiltersComp}
                        </Aux>
                      </Slider>
                      <div className="filter-buttons mt-10">
                        {this.state.activeSlide === 1 ?
                          <Button.Group>
                            <Button
                              onClick={this.previous}
                              floated="left"
                              className="link-button"
                              labelPosition="left"
                            >
                              <Icon className="ns-arrow-left" color="grey" />
                              BACK
                            </Button>
                            <Button
                              onClick={this.done}
                              floated="right"
                              className="link-button highlight-text"
                            >
                              UPDATE
                            </Button>
                          </Button.Group> :
                          <Button.Group>
                            <Button
                              onClick={this.next}
                              floated="right"
                              className="link-button"
                            >
                              NEXT
                              <Icon className="ns-arrow-right right" color="grey" />
                            </Button>
                          </Button.Group>
                        }
                      </div>
                    </div>
                  }
                </Container>
              </div>
            </div>
          )
          }
        </div>
      </Aux>
    );
  }
}
