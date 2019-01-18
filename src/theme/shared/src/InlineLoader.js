import React from 'react';
import Parser from 'html-react-parser';

const pillersMeta = [
  { x: 0, rotate: 3, begin: 0 },
  { x: 17, rotate: 20, begin: 0.1 },
  { x: 40, rotate: 40, begin: 0.3 },
  { x: 60, rotate: 58, begin: 0.5 },
  { x: 80, rotate: 76, begin: 0.1 },
];

const InlineLoader = props => (
  <section className="center-align">
    {
      props.text ? (
        <h3 className="grey-header">{Parser(props.text) || ''}</h3>
      ) : (
        <svg
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 100 100"
          enableBackground="new 0 0 100 100"
          xmlSpace="preserve"
          style={{ height: '60px', width: '100px', display: 'inline-block' }}
        >
          {pillersMeta.map(p => (
            <rect fill="#20C86D" x={p.x} width="3" height="50" transform={`translate(0) rotate(180 ${p.rotate} 50)`}>
              <animate
                attributeName="height"
                attributeType="XML"
                dur="1s"
                values="10; 50; 10"
                repeatCount="indefinite"
                begin={`${p.begin}s`}
              />
            </rect>
          ))}
        </svg>
      )
    }
  </section>
);

export default InlineLoader;
