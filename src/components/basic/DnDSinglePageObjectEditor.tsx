import { getFieldData } from "@/utils/dataHelper";
import { Search } from "@mui/icons-material";
import {
    Autocomplete,
  Button,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { MouseEventHandler, useEffect, useMemo, useState } from "react";

/**
 * 
 * @param w Width of the NavBar
 * @param title Title of the Dialog
 * @param bodys Field of the Dialog
 * @param onSave Saves Data
 * @param onCancel Cancels Data
 * @returns 
 */
export function DnDSinglePageObjectEditor({
    title,
    bodys,
    oldData,
    onSave,
    onCancel,
  }: {
    title: any;
    oldData?: any;
    bodys: {
      multiline?: boolean;
      type: "string" | "boolean" | "number" | "selection";
      selections?: string[];
      label: string;
      key: string;
    }[];
    onSave: (data: any) => void;
    onCancel: () => void;
  }) {
    const [data, setData] = useState<any>({});
  
    useEffect(() => {
      if(!oldData){
          return;
      }
      setData(oldData);
    }, [oldData]);
  
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: "40%",
          }}
        >
          <Typography component="h1" variant="h4">
            {title}
          </Typography>
          {bodys.map((item, index) => {
            if (item.type == "string" || item.type == "number") {
              return (
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  size="small"
                  type={item.type == "number" ? "number" : "text"}
                  key={item.key + "_" + index}
                  multiline={item.multiline}
                  value={data[item.key]}
                  onChange={(e) => {
                    setData((prev: any) => ({
                      ...prev,
                      [item.key]: e.target.value,
                    }));
                  }}
                  label={item.label}
                />
              );
            }
            if (item.type == "boolean") {
              return (
                <Select
                  key={item.key + "_" + index}
                  value={
                    typeof data[item.key] == "undefined"
                      ? "0"
                      : data[item.key]
                      ? "true"
                      : "false"
                  }
                  onChange={(e) => {
                    setData((prev: any) => ({
                      ...prev,
                      [item.key]: e.target.value == "true",
                    }));
                  }}
                >
                  <MenuItem value="0" disabled>
                    {item.label}
                  </MenuItem>
                  <MenuItem value={"true"}>Ja</MenuItem>
                  <MenuItem value={"false"}>Nein</MenuItem>
                </Select>
              );
            }
            if (item.type == "selection") {
              return (
                <Autocomplete
                  fullWidth
                  key={item.key + "_" + index}
                  sx={{ marginBottom: "10px", marginLeft: "3px" }}
                  options={item.selections ?? []}
                  onChange={(event, newValue: any) => {
                      setData((prev: any) => ({
                          ...prev,
                          [item.key]: newValue,
                        }));
                  }}
                  size="small"
                  value={data[item.key]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={item.label}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              );
            }
          })}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
            }}
          ></div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              width: "100%",
              marginTop: 20,
            }}
          >
            <Button
              onClick={() => {
                onSave(data);
              }}
              variant="contained"
              color="primary"
              sx={{
                marginBottom: 1,
                width: "30%",
              }}
            >
              Speichern
            </Button>
            <Button
              variant="outlined"
              color="primary"
              sx={{
                marginBottom: 1,
                width: "30%",
              }}
              onClick={() => {
                onCancel();
              }}
            >
              Abbrechen
            </Button>
          </div>
        </Paper>
      </div>
    );
  }