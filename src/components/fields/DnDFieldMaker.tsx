import { FIELD_TYPES } from "@/utils/constants";
import { Add, Delete } from "@mui/icons-material";
import {
  Tooltip,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import { useState } from "react";
/**
 *
 * @param param0
 * @returns
 */
export default function DnDFieldMaker({
  fields,
  setFields,
}: Readonly<{ fields: any[]; setFields: (fields: any) => void }>) {
  const [addValue, setAddValue] = useState<any>({
    type: "none",
    location: "",
    title: "",
    description: "",
    tab: "extra",
  });

  const updateData = (index: number, value: any, key: string) => {
    if (index == -1) {
      setAddValue((o: any) => ({ ...o, [key]: value }));
      return;
    }

    if (fields.length <= index || index < 0) {
      return;
    }
    let arr = [...fields];
    arr[index] = { ...arr[index], [key]: value };
    setFields(arr);
  };

  return (
    <>
      <TableContainer
        style={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%", // Set width to 100%
        }}
      >
        <Table>
          <TableRow sx={{ textAlign: "center" }}>
            <TableCell sx={{ width: "80px" }}>Aktionen</TableCell>
            <TableCell sx={{ width: "400px" }}>Location</TableCell>
            <TableCell sx={{ width: "300px" }}>Title</TableCell>
            <TableCell sx={{ width: "300px" }}>Beschreibung</TableCell>
            <TableCell sx={{ width: "200px" }}>Type</TableCell>
            <TableCell sx={{ width: "200px" }}>Tab</TableCell>
            <TableCell sx={{}} />
          </TableRow>
          {fields.map((item: any, index: any) => {
            return (
              <TableRow key={item + "bqubcdwaqz" + index}>
                <TableCell>
                  <Tooltip title="Löschen">
                    <IconButton
                      onClick={() => {
                        setFields(
                          fields.filter((item: any, i: any) => {
                            return i != index;
                          })
                        );
                      }}
                    >
                      {" "}
                      <Delete></Delete>
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <TextField
                    onChange={(e) => {
                      updateData(index, e.target.value, "location");
                    }}
                    label="Location"
                    fullWidth
                    size="small"
                    value={item.location}
                  ></TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    onChange={(e) => {
                      updateData(index, e.target.value, "title");
                    }}
                    label="Title"
                    fullWidth
                    size="small"
                    value={item.title}
                  ></TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    onChange={(e) => {
                      updateData(index, e.target.value, "description");
                    }}
                    label="Beschreibung"
                    multiline
                    fullWidth
                    size="small"
                    value={item.description}
                  ></TextField>
                </TableCell>
                <TableCell>
                  <Select
                    size="small"
                    fullWidth
                    value={item.type}
                    onChange={(e) => {
                      updateData(index, e.target.value, "type");
                    }}
                  >
                    <MenuItem value="none" disabled>
                      Type
                    </MenuItem>
                    {FIELD_TYPES.map((item) => {
                      return (
                        <MenuItem value={item} key={item + "fieldTypewdkn"}>
                          {item}
                        </MenuItem>
                      );
                    })}
                    {FIELD_TYPES.map((item) => {
                      return (
                        <MenuItem
                          value={item + "[]"}
                          key={item + "[]" + "fieldTypewdni"}
                        >
                          {item + "[]"}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </TableCell>
                <TableCell>
                  <TextField
                    onChange={(e) => {
                      updateData(index, e.target.value, "tab");
                    }}
                    label="Tab"
                    fullWidth
                    size="small"
                    value={item.tab}
                  ></TextField>
                </TableCell>

                <TableCell />
              </TableRow>
            );
          })}
          <TableRow key={"add1wefafascas"}>
            <TableCell>
              <Tooltip title="Hinzufügen">
                <IconButton
                  onClick={() => {
                    setFields([...fields, addValue]);
                    setAddValue({
                      type: "none",
                      location: "",
                      title: "",
                      description: "",
                      tab: "extra",
                    });
                  }}
                >
                  {" "}
                  <Add></Add>
                </IconButton>
              </Tooltip>
            </TableCell>
            <TableCell>
              <TextField
                onChange={(e) => {
                  setAddValue((prev: any) => ({
                    ...prev,
                    location: e.target.value,
                  }));
                }}
                label="Location"
                fullWidth
                size="small"
                value={addValue.location}
              ></TextField>
            </TableCell>
            <TableCell>
              <TextField
                onChange={(e) => {
                  updateData(-1, e.target.value, "title");
                }}
                label="Title"
                fullWidth
                size="small"
                value={addValue.title}
              ></TextField>
            </TableCell>
            <TableCell>
              <TextField
                onChange={(e) => {
                  updateData(-1, e.target.value, "description");
                }}
                label="Beschreibung"
                multiline
                fullWidth
                size="small"
                value={addValue.description}
              ></TextField>
            </TableCell>
            <TableCell>
              <Select
                size="small"
                value={addValue.type}
                fullWidth
                onChange={(e) => {
                  setAddValue((prev: any) => ({
                    ...prev,
                    type: e.target.value,
                  }));
                }}
              >
                <MenuItem value="none" disabled>
                  Type
                </MenuItem>
                {FIELD_TYPES.map((item) => {
                  return (
                    <MenuItem value={item} key={item + "fieldTypewdkwdn"}>
                      {item}
                    </MenuItem>
                  );
                })}
                {FIELD_TYPES.map((item) => {
                  return (
                    <MenuItem
                      value={item + "[]"}
                      key={item + "[]" + "fieldTypewfwdni"}
                    >
                      {item + "[]"}
                    </MenuItem>
                  );
                })}
              </Select>
            </TableCell>
            <TableCell>
              <TextField
                onChange={(e) => {
                  setAddValue((prev: any) => ({
                    ...prev,
                    tab: e.target.value,
                  }));
                }}
                label="Tab"
                fullWidth
                size="small"
                value={addValue.tab}
              ></TextField>
            </TableCell>
            <TableCell />
          </TableRow>
        </Table>
      </TableContainer>
    </>
  );
}
