/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import sizeMe from 'react-sizeme';
import Confetti from 'react-confetti';

const Firework = sizeMe({
  monitorHeight: true,
  monitorWidth: true,
})(class Firework extends React.PureComponent {
  static propTypes = {
    size: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
    }),
  }
  render() {
    return (
      <div className="animation-container">
        <Confetti {...this.props.size} recycle={false} />
      </div>
    );
  }
});
// const Firework = sizeMe({
//   monitorHeight: true,
//   monitorWidth: true,
// })(class Firework extends React.PureComponent {
//   render() {
//     return (
//       <div className="animation-container">
//         <Confetti {...this.props.size} recycle />
//       </div>
//     );
//   }
// });

export default Firework;

