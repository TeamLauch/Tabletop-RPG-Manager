/**
 * Creates a Default List for the Gamemaster Menu
 *
 * @param children Children of this Component
 * @param title Title of the List
 * @param topBar Additional Buttons and Functions
 * @returns
 */
export default function DnDGamemasterDefaulListCP({
  children,
  title,
  topBar,
  width,
  style,
}: {
  children: any;
  title: string;
  topBar: any;
  width?: string;
  style?: any;
}) {
  return (
    <div
      style={{
        display: "flex",
        border: "1px solid rgba(0, 0, 0, 0.3)",
        boxShadow: "3px 3px rgba(0,0,0,0.25)",
        backgroundColor: "#F5F5F5",
        flexDirection: "column",
        width: width ?? "30.5%",
        height: "100%",
        overflow: "auto",
        margin: "1%",
        borderRadius: "5px",
        fontSize: "18pt",
        ...style,
      }}
    >
      <div style={{ fontSize: "25pt" }}>
        <b>{title}</b>
        {topBar}
      </div>
      {children}
    </div>
  );
}
