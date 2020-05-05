import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
import { get } from 'lodash';
import { Responsive, Menu, Dropdown, Icon, Header } from 'semantic-ui-react';
import { MobileDropDownNav } from '../shared';

const DragHandle = sortableHandle(() => <Icon className="ns-drag-holder mr-10 ml-10" />);
const DraggableItems = SortableElement(({ dragHandle, item, navCustomClick, addon, match }) => (
  <div className="row-wrap drag-menu">
    {dragHandle
      && <DragHandle />
    }
    <Menu.Item className="mlr-0" target={item.forced ? '_blank' : false} key={item.to} onClick={navCustomClick} as={NavLink} to={item.forced || `${match.url}/${item.to}`}>
      {addon && addon.pos === 'left' && addon.data[item.to]}
      {item.title}
      {addon && addon.pos !== 'left' && addon.data[item.to]}
    </Menu.Item>
  </div>
));

const DraggableContainer = SortableContainer(({
  isActive, location, navItems, navClick, match, addon, navCustomClick, onSortEnd,
}) => (
    <div>
      {navItems.map((item, index) => (
        <DraggableItems
          // eslint-disable-next-line react/no-array-index-key
          key={`item-${index}`}
          index={index}
          item={item}
          isActive={isActive}
          navCustomClick={navCustomClick}
          addon={addon}
          location={location}
          match={match}
          navClick={navClick}
          onSortEnd={onSortEnd}
          dragHandle
        />
      ))}
    </div>
  ));

@withRouter
class DraggableMenu extends Component {
  navClick = (e, { name }) => {
    console.log('navclick inside');
    if (e.target && e.target.name !== 'byPass') {
      this.props.history.replace(`${this.props.match.url}/${name}`);
    }
  };

  isActive = (to, location) => (location.pathname.startsWith(`${this.props.match.url}/${to}`));

  render() {
    const {
      navItems, match, refMatch, location, vertical,
      noinvert, attached, className, stepsStatus, addon, heading,
      force2ary, navCustomClick, responsiveVars, onSortEnd,
    } = this.props;
    let options = [];
    const showMoreMenuLength = (get(responsiveVars, 'isTabletLand') || get(responsiveVars, 'isSmallScreen')) ? 5 : 8;
    const showMoreMenu = !get(responsiveVars, 'isMobile') && this.props.offering && navItems && navItems.length > showMoreMenuLength;
    if (showMoreMenu) {
      const dropOptions = navItems.splice(showMoreMenuLength, navItems.length - showMoreMenuLength);
      options = dropOptions.map(o => ({ key: o.to, text: o.title, value: o.to }));
    }
    return (
      <>
        <Responsive minWidth={768} as={React.Fragment}>
          {heading
            && <Header as="h6">{heading}</Header>
          }
          <Menu
            className={className || ''}
            celled={!vertical}
            horizontal={!vertical}
            inverted={(!noinvert && !vertical)}
            secondary={force2ary || vertical}
            vertical={vertical}
            attached={attached}
          >
            <DraggableContainer
              addon={addon}
              isActive={this.isActive}
              location={this.props.location}
              navItems={navItems}
              navClick={this.navClick}
              match={refMatch || match}
              stepsStatus={stepsStatus}
              navCustomClick={navCustomClick}
              onSortEnd={onSortEnd}
              lockAxis="y"
              pressDelay={100}
              useDragHandle
            />
            {showMoreMenu && <Dropdown selectOnBlur={false} onChange={(e, data) => this.props.history.push(data.value)} text="More..." options={options} className="more-items link item" />}
            {this.props.rightLabel}
          </Menu>
        </Responsive>
        <Responsive className="secondary-menu" maxWidth={767} as={React.Fragment}>
          {match.url === '/legal'
            ? (
              <MobileDropDownNav
                inverted
                refMatch={refMatch || match}
                navItems={navItems}
                location={location}
                className="legal-menu"
              />
            )
            : (
              <MobileDropDownNav
                className="private-secondary-menu"
                refMatch={refMatch || match}
                navItems={navItems}
                location={location}
                useIsActive
                isBonusReward={this.props.isBonusReward}
                bonusRewards={this.props.bonusRewards}
              />
            )
          }
        </Responsive>
      </>
    );
  }
}

export default DraggableMenu;
