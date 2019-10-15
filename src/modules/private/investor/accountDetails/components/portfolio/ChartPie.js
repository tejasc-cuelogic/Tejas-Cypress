import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label, Legend, Sector } from 'recharts';
import { get } from 'lodash';
// import Helper from '../../../../../helper/utility';

/*
  Reference:
  http://recharts.org/en-US/examples/CustomActiveShapePieChart
*/
const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, value,
  } = props;

  return (
    <g>
      <text x={cx} y={cy + 20} dy={13} textAnchor="middle" className="datavalue">{value}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius - 1}
        outerRadius={outerRadius + 7}
        fill={fill}
      />
    </g>
  );
};

export default class ChartPie extends Component {
  state = {
    activeIndex: -1,
    title: '',
  }

  onPieLeave = () => this.setState({ activeIndex: -1, title: '' });

  onPieEnter = (data, index) => {
    this.setState({
      activeIndex: index,
      title: data.name,
    });
  }

  renderLegend = (props) => {
    const hasIcons = !!this.props.icons;
    return (
      <ul className="chartLegends">
        {
          props && props.data.map((entry, indx) => {
            const icon = get(entry, 'key');
            return (
              <li style={{ color: this.props.colors[indx] }} key={`item-${entry.name}`}>
                <span>
                  {hasIcons && <Icon className={this.props.icons[icon]} />}
                  {entry.name}
                </span>
              </li>
            );
          })
        }
      </ul>
    );
  };

  render() {
    const { data, title, colors } = this.props;
    const isMobile = document.documentElement.clientWidth < 768;
    const CustomLegend = () => (
      <Legend
        wrapperStyle={{ position: isMobile ? 'bottom' : 'absolute' }}
        layout={isMobile ? 'horizontal' : 'vertical'}
        verticalAlign={isMobile ? 'bottom' : 'middle'}
        align="right"
        data={data}
        content={this.renderLegend}
      />
    );
    return (
      <>
        <ResponsiveContainer height={220}>
          <PieChart>
            {!isMobile && <Legend layout="vertical" verticalAlign="middle" align="right" data={data} content={this.renderLegend} />}
            <Pie
              dataKey="value"
              activeIndex={this.state.activeIndex}
              activeShape={renderActiveShape}
              data={data}
              innerRadius="85%"
              outerRadius="100%"
              startAngle={0}
              endAngle={360}
              type="circle"
              fill="#8884d8"
              paddingAngle={0}
              onMouseEnter={this.onPieEnter}
              onMouseLeave={this.onPieLeave}
              icon={this.props.icon}
            >
              {
                data.map((entry, index) => (
                  <Cell key={colors[index % colors.length]} fill={colors[index % colors.length]} />
                ))
                }
              <Label value={this.state.title || title} offset={0} position="center" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {isMobile && <CustomLegend />}
      </>
    );
  }
}
