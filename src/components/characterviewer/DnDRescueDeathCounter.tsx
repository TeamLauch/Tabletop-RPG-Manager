/**
 *
 * @param saves Amount of Saves
 * @param deads Amount of Fails
 * @param onClick Handels Click
 * @returns
 */
export default function DnDRescueDeadCounter({
  saves,
  deads,
  onClick,
}: {
  onClick: (saves: number, deads: number) => void;
  saves: number;
  deads: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        fontSize: "18pt",
      }}
    >
      Gerettet:
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          justifyItems: "center",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20pt",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            borderRadius: "15px",
            height: "30px",
            width: "30px",
            backgroundColor: saves < 1 ? "lightgray" : "lightgreen",
          }}
          onClick={() => {
            onClick(saves != 1 ? 1 : 0, deads);
          }}
        ></div>
        -
        <div
          style={{
            borderRadius: "15px",
            height: "30px",
            width: "30px",
            backgroundColor: saves < 2 ? "lightgray" : "lightgreen",
          }}
          onClick={() => {
            onClick(saves != 2 ? 2 : 1, deads);
          }}
        ></div>
        -
        <div
          style={{
            borderRadius: "15px",
            height: "30px",
            width: "30px",
            backgroundColor: saves < 3 ? "lightgray" : "lime",
          }}
          onClick={() => {
            onClick(saves != 3 ? 3 : 2, deads);
          }}
        ></div>
      </div>
      Versagt:
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          justifyItems: "center",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20pt",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            borderRadius: "15px",
            height: "30px",
            width: "30px",
            backgroundColor: deads < 1 ? "lightgray" : "lightsalmon",
          }}
          onClick={() => {
            onClick(saves, deads != 1 ? 1 : 0);
          }}
        ></div>
        -
        <div
          style={{
            borderRadius: "15px",
            height: "30px",
            width: "30px",
            backgroundColor: deads < 2 ? "lightgray" : "lightsalmon",
          }}
          onClick={() => {
            onClick(saves, deads != 2 ? 2 : 1);
          }}
        ></div>
        -
        <div
          style={{
            borderRadius: "15px",
            height: "30px",
            width: "30px",
            backgroundColor: deads < 3 ? "lightgray" : "red",
          }}
          onClick={() => {
            onClick(saves, deads != 3 ? 3 : 2);
          }}
        ></div>
      </div>
    </div>
  );
}
