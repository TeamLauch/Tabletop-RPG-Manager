/* eslint-disable @next/next/no-img-element */
import { MouseEventHandler } from "react";
/**
 *
 * @param amount Amount of Money
 * @param label Name of the Currancy
 * @param color Color of the Icon
 * @param onClick handlesClick => undefined no Click possible
 * @returns A money Icon
 */
export default function DnDMoneyIcon({
  amount,
  label,
  color,
  onClick,
}: {
  amount: number;
  label: string;
  color: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      style={{
        height: "96%",
        aspectRatio: 1,
        marginLeft: "2px",
        marginRight: "2px",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div
        style={{
          textAlign: "center",
          alignContent: "center",
          fontSize: "20px",
          height: "96%",
          backgroundColor: color,
          borderRadius: "48%",
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: "black",
        }}
        onClick={onClick}
      >
        {amount}
      </div>
      <div
        style={{ fontSize: "14px", marginTop: "-20px", textAlign: "center" }}
      >
        {label}
      </div>
    </div>
  );
}
