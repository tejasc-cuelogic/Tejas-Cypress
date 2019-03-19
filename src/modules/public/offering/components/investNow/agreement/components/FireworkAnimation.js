import React from 'react';
import sizeMe from 'react-sizeme';
import Confetti from 'react-confetti';

const Firework = sizeMe({
  monitorHeight: true,
  monitorWidth: true,
})(class Firework extends React.PureComponent {
  render() {
    return (
      <div className="animation-container">
        <Confetti {...this.props.size} recycle />
      </div>
    );
  }
});

export default Firework;

