/* eslint-disable @next/next/no-img-element */
import { MouseEventHandler } from "react";
/**
 *
 * @param label Name of the Item
 * @param amount Amount of the Item
 * @param onClick onClickEvent
 * @returns
 */
export default function DnDItemBar({
  label,
  amount,
  onClick,
}: {
  label: string;
  amount: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      style={{
        width: "31%",
        marginBottom: "3px",
        display: "flex",
        flexFlow: "row",
        marginLeft: "1%",
        marginRight: "1%",
        alignItems: "center",
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      <div
        style={{
          width: "calc(100% - 15px)",
          minHeight: "24px",
          borderStyle: "solid",
          borderRadius: "5px",
          borderWidth: "1px",
          borderColor: "black",
          fontSize: "20px",
          marginTop: "2px",
          backgroundColor: "lightgray",
        }}
      >
        <div
          style={{
            marginTop: "-2px",
            marginLeft: "3px",
            marginRight: "20px",
            textAlign: "justify",
          }}
        >
          {label}
        </div>
      </div>
      <div
        style={{
          width: "30px",
          height: "30px",
          borderStyle: "solid",
          borderRadius: "15px",
          borderWidth: "1px",
          borderColor: "black",
          fontSize: "20px",
          marginLeft: "-15px",
          alignContent: "center",
          textAlign: "center",
          backgroundColor: "lightgray",
        }}
      >
        {amount}
      </div>
    </div>
  );
}
