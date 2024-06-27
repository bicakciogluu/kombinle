import React from 'react';
import Svg, { Path } from 'react-native-svg';

const LayoutThreeColumnsIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      stroke="#000000"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m22.5 21 0 -18c0 -0.82843 -0.6716 -1.5 -1.5 -1.5l-18 0c-0.82843 0 -1.5 0.67157 -1.5 1.5l0 18c0 0.8284 0.67157 1.5 1.5 1.5l18 0c0.8284 0 1.5 -0.6716 1.5 -1.5Z"
      strokeWidth="1.5"
    />
    <Path
      stroke="#000000"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m22.5 8.5 -21 0"
      strokeWidth="1.5"
    />
    <Path
      stroke="#000000"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m22.5 15.5 -21 0"
      strokeWidth="1.5"
    />
  </Svg>
);

export default LayoutThreeColumnsIcon;
