import React from 'react';
import sizeMe from 'react-sizeme';
import Confetti from 'react-confetti';

const DimensionedExample = sizeMe({
  monitorHeight: true,
  monitorWidth: true,
})(class DimensionedExample extends React.PureComponent {
  render() {
    return (
      <div className="animation-container">
        <Confetti {...this.props.size} recycle={false} />
      </div>
    );
  }
});

export default DimensionedExample;

