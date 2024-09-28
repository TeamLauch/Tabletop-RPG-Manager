import { MouseEventHandler } from "react";

/**
 *
 * @param colorOne Main Color
 * @param colorTwo Background Color
 * @param maxValue MaximumValue
 * @param currenValue Current Value
 * @returns A Vertical Bar for indicating Some sort of Precentage
 */
export default function DnDVerticalBar({
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
        width: "30px",
        height: "100%",
        borderRadius: "10px",
        backgroundColor: colorTwo,
        borderColor: "black",
        borderStyle: "solid",
        borderWidth: "1px",
        display: "flex",
        alignItems: "end",
        marginLeft: "3px",
        marginRight: "3px",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      onClick={onClick}
    >
      <div
        style={{
          width: "100%",
          visibility: currentValue == 0 ? "hidden" : "visible",
          borderRadius:
            currentValue == 0
              ? "0px"
              : currentValue == maxValue
                ? "10px"
                : "2px 2px  10px  10px",
          backgroundColor: colorOne,
          transition: "height 0.5s ease-out",
          height: Math.floor((currentValue / maxValue) * 100) + "%",
        }}
      ></div>
    </div>
  );
}
