/* eslint-disable @next/next/no-img-element */
import { MouseEventHandler } from "react";
/**
 *
 * @param value Attribute Value of the Attributew
 * @param label Name of the Attribute
 * @param backgroundColor Background of the Attribute
 * @returns
 */
export default function DnDSubAttributeDialog({
  value,
  backgroundColor,
  label,
  onClick,
}: {
  onClick?: MouseEventHandler<HTMLDivElement>;
  value: number;
  backgroundColor: string;
  label: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "25px",
        display: "flex",
        flexDirection: "row",
        marginBottom: "2px",
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      <div
        style={{
          width: "25px",
          height: "25px",
          borderRadius: "12.5px",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "black",
          textAlign: "center",
          alignContent: "center",
          fontSize: "15px",
          backgroundColor: backgroundColor,
          zIndex: 2,
        }}
      >
        {value > 0 ? "+" + value : value}
      </div>
      <div
        style={{
          width: "95%",
          height: "21px",
          backgroundColor: backgroundColor,
          borderStyle: "solid",
          borderRadius: "5px",
          borderWidth: "1px",
          borderColor: "black",
          marginTop: "2px",
          marginLeft: "-10px",
          zIndex: 1,
          textAlign: "center",
          alignContent: "center",
          fontSize: "15px",
        }}
      >
        {label}
      </div>
    </div>
  );
}
