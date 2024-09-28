import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { Paper } from "@mui/material";
import { Close } from "@mui/icons-material";

/**
 *
 * @param text Errormessage
 * @param setError To Close
 * @returns Opens a Error Message Popup
 */
export default function DnDErrorMessage({
  text,
  setError,
}: {
  text: string;
  setError: any;
}) {
  if (text == "") {
    return <></>;
  }
  return (
    <Paper
      sx={{
        width: "70%",
        position: "fixed",
        backgroundColor: "rgba(250, 70, 70,1)",
        marginLeft: "20%",
        marginTop: "10%",
        zIndex: "9",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "5px",
        }}
      >
        <Tooltip title="Close">
          <IconButton
            onClick={() => {
              setError("");
            }}
          >
            <Close></Close>
          </IconButton>
        </Tooltip>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Typography variant="h2">Fehler</Typography>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Typography variant="h4">{text}</Typography>
      </div>
    </Paper>
  );
}
