import React, { Component } from 'react';
import Aux from 'react-aux';
// import { Link } from 'react-router-dom';
import { Container, Grid, Menu, Image, Header, Checkbox, Form, Icon, Popup, List, Button } from 'semantic-ui-react';
// import BusinessType from './BusinessType';
import Slider from 'react-slick';
import filterIcon from '../../../../../assets/images/icons/icon_filter.png';
import closeIcon from '../../../../../assets/images/icons/icon_close.png';

const isMobile = document.documentElement.clientWidth < 768;
export default class Filters extends Component {
  state = {
    activeSlide: 0,
    BusinessTypes: [
      { content: 'Commercial Real Estate', color: 'green', iconName: 'building' },
      { content: 'Restaurant & Bar', color: 'green', iconName: 'food' },
      { content: 'Brewery & Pub', color: 'green', iconName: 'bar' },
      { content: 'Hospitality', iconName: 'bed' },
      { content: 'Health & Wellness', iconName: 'heartbeat' },
      { content: 'Fitness', iconName: 'bicycle' },
      { content: 'Office', iconName: 'fax' },
      { content: 'Other', iconName: 'ellipsis horizontal' },
    ],
    MoreOptions: {
      content: 'Funded Campaigns',
      color: null,
      iconName: 'eye',
    },
    InvestmentTypes: [
      { label: 'Revenue Sharing', checkStatus: true },
      { label: 'Term Note', checkStatus: true },
      { label: 'Equity', checkStatus: false },
      { label: 'Convertible Note', checkStatus: false },
    ],
    FundingTypes: [
      { label: 'Regulation Crowdfunding', checkStatus: false },
      { label: 'Regulation A+', checkStatus: false },
      { label: 'Regulation D', checkStatus: false },
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
    MoreOptions.color = null;

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
        <Header as="h6" dividing>Business Type</Header>
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
        <Header as="h6" dividing>
          Investment Type
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
        <Header as="h6" dividing>
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
        <Header as="h6" dividing>
          More Options
        </Header>
        <List relaxed="very">
          <List.Item onClick={() => this.toggleColor2()}>
            <List.Icon
              color={this.state.MoreOptions.color}
              name={this.state.MoreOptions.iconName}
            />
            <List.Content>{this.state.MoreOptions.content}</List.Content>
          </List.Item>
        </List>
      </Aux>);
    return (
      <Aux>
        <div className="filter-menu">
          <Container>
            <Menu text>
              <Menu.Item name="filter" onClick={this.props.toggleFilters} className="text-uppercase">
                <Image src={filterIcon} className="filterIcon" />
                 Filter
              </Menu.Item>
              {this.props.status ? (
                <Menu.Item name="clear all" onClick={this.clearAll} position="right">
                  CLEAR ALL
                  {!isMobile &&
                    <Image src={closeIcon} className="closeIcon" />
                  }
                </Menu.Item>
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
                              className="link-button"
                            >
                              DONE
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
