import React from "react";
import Svg, { Path } from "react-native-svg";

const MenuIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width={props.width || 24}
    height={props.height || 24}
    {...props}
  >
    <Path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeMiterlimit={10}
      strokeWidth={48}
      d="M88 152h336M88 256h336M88 360h336"
    />
  </Svg>
);

export default MenuIcon;
