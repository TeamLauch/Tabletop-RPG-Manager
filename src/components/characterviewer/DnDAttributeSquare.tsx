import { MouseEventHandler } from "react";

/**
 *
 * @param value Attribute Value of the Attributew
 * @param label Name of the Attribute
 * @param backgroundColor Background of the Attribute
 * @returns
 */
export default function DnDAttributeSquare({
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
        marginLeft: "1%",
        marginRight: "1%",
        width: "48%",
        marginBottom: "2%",
        marginTop: "2%",
      }}
    >
      <div
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "15px",
          borderStyle: "solid",
          borderColor: "black",
          borderWidth: "1px",
          backgroundColor: backgroundColor,
          alignContent: "center",
          textAlign: "center",
          fontSize: "30pt",
          cursor: onClick ? "pointer" : "default",
        }}
        onClick={onClick}
      >
        <div style={{ fontSize: "9pt", marginTop: "-15px" }}>{label}</div>
        {Math.floor((value - 10) / 2) > 0
          ? "+" + Math.floor((value - 10) / 2)
          : Math.floor((value - 10) / 2)}
      </div>
      <div
        style={{
          width: "50px",
          height: "50px",
          marginTop: "-25px",
          marginLeft: "25px",
          borderRadius: "25px",
          borderColor: "black",
          borderWidth: "1px",
          borderStyle: "solid",
          backgroundColor: "lightgray",
          alignContent: "center",
          textAlign: "center",
          fontSize: "15pt",
        }}
      >
        {value}
      </div>
    </div>
  );
}
