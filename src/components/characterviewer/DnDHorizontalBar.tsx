/* eslint-disable @next/next/no-img-element */
import { MouseEventHandler } from "react";
/**
 *
 * @param colorOne Main Color
 * @param colorTwo Background Color
 * @param maxValue MaximumValue
 * @param currenValue Current Value
 * @returns A Horizontal Bar for indicating Some sort of Precentage
 */
export default function DnDHorizontalBar({
  colorOne,
  colorTwo,
  maxValue,
  currentValue,
  onClick,
  style,
}: {
  onClick?: MouseEventHandler<HTMLDivElement>;
  colorOne: string;
  colorTwo: string;
  maxValue: number;
  currentValue: number;
  style?: any;
}) {
  return (
    <div
      style={{
        width: "98%",
        height: "25px",
        borderRadius: "10px",
        backgroundColor: colorTwo,
        borderColor: "black",
        borderStyle: "solid",
        borderWidth: "1px",
        marginLeft: "1%",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      onClick={onClick}
    >
      <div
        style={{
          height: "100%",
          borderRadius:
            maxValue == currentValue ? "10px" : " 10px 2px  2px  10px",
          backgroundColor: colorOne,
          transition: "width 0.5s ease-out",
          width: Math.floor((currentValue / maxValue) * 100) + "%",
        }}
      ></div>
    </div>
  );
}
