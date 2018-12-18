import React, { Component } from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';
import { Popup, Icon } from 'semantic-ui-react';
import Helper from '../../../../../helper/utility';

const dataRef = [
  { amount: 0, fill: '#20C86D' },
  { amount: 0, fill: '#1781FB' },
];

export default class CampaignProgress extends Component {
  renderLegend = () => (
    <p>
      <h4>{Helper.CurrencyFormat(this.props.data.collected, 0)}</h4>
      <span>of {Helper.CurrencyFormat(this.props.data.needed, 0)} {this.props.amountType}
        <Popup
          trigger={<Icon name="help circle" color="grey" />}
          content="Lorem Ipsum"
          position="top center"
        />
      </span>
    </p>
  );
  render() {
    const data = [...dataRef];
    data[0].amount = this.props.data.needed;
    data[1].amount = this.props.data.collected;
    return (
      <ResponsiveContainer className="progress-bar" height={220}>
        <RadialBarChart innerRadius="75%" outerRadius="100%" barSize={8.5} data={data}>
          <RadialBar minAngle={15} background={{ fill: '#3A4049' }} clockWise dataKey="amount" />
          <Legend layout="vertical" verticalAlign="middle" align="center" content={this.renderLegend} />
        </RadialBarChart>
      </ResponsiveContainer>
    );
  }
}
