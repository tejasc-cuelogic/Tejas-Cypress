import React, { Component } from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';

const data = [
  { name: '18-24', uv: 31.47, fill: '#20C86D' },
  { name: '25-29', uv: 26.69, fill: '#1781FB' },
];

export default class CampaignProgress extends Component {
  renderLegend = () => (
    <p>
      <h4>$750,250</h4>
      <span>of $1,000,000 max</span>
    </p>
  );
  render() {
    return (
      <ResponsiveContainer className="progress-bar" height={220}>
        <RadialBarChart innerRadius="75%" outerRadius="100%" barSize={8.5} data={data}>
          <RadialBar minAngle={15} background={{ fill: '#3A4049' }} clockWise dataKey="uv" />
          <Legend layout="vertical" verticalAlign="middle" align="center" content={this.renderLegend} />
        </RadialBarChart>
      </ResponsiveContainer>
    );
  }
}
