import {
  Button,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import DnDGamemasterCharacterEditor from "./DnDGamemasterCharacterEditor";
import { useCallback, useEffect, useMemo, useState } from "react";
import DnDContextMenu from "../basic/DnDContextMenu";
import {
  Add,
  CalendarToday,
  Delete,
  Edit,
  PunchClock,
} from "@mui/icons-material";
import { saveGame } from "@/utils/game";
import { generateUUID } from "three/src/math/MathUtils";
import DnDCustomCalenderCP from "./DnDCustomCalenderCP";
import { useWorld, useWorlds } from "@/utils/customHooks";

export function DnDWorldSelector({
  game,
  onSave,
}: {
  game: any;
  onSave: (id: string) => void;
}) {
  const worlds = useWorlds();
  const [selection, setSelection] = useState();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "400px",
        border: "1px solid black",
        borderRadius: "5px",
        backgroundColor: "#F5F5F5",
      }}
    >
      <Select
        size="small"
        sx={{ marginTop: "5px", marginBottom: "5px" }}
        value={selection ?? ""}
        onChange={(e: any) => {
          setSelection(e.target.value);
        }}
      >
        {worlds.map((item) => {
          return (
            <MenuItem value={item.id} key={item.id}>
              {item.name}
            </MenuItem>
          );
        })}
      </Select>
      <Button
        variant="contained"
        onClick={async () => {
          onSave(selection);
        }}
      >
        Speichern
      </Button>
    </div>
  );
}

export default function DnDGamemasterCalenderCP({
  game,
  setCustomContext,
  customContext,
  openPopup,
  updateTick,
  tick,
}: {
  setCustomContext: any;
  customContext: any;
  game: any;
  updateTick: any;
  openPopup: (id: number, data: any, onSave: (data) => void) => void;
  tick: any;
}) {
  const world = useWorld(game.worldData.id, tick);
  const [clickedDate, setClickedDate] = useState({
    day: -1,
    month: 1,
    year: 0,
  });

  const worldDateToDateNumber = useCallback(
    (date: { day: number; month: number; year: number }) => {
      if (!world) {
        return 0;
      }
      let daysPerYear = 0;
      for (let m of world.month) {
        daysPerYear += parseInt(m.days);
      }
      let d = date.year * daysPerYear + date.day;
      for (let i = 1; i < date.month; i++) {
        d += parseInt(world.month[i - 1].days);
      }

      return d;
    },
    [world]
  );

  const dateNumberToWorldDate = useCallback(
    (date: number) => {
      if (!world) {
        return undefined;
      }
      let daysPerYear = 0;
      for (let m of world.month) {
        daysPerYear += parseInt(m.days);
      }
      let year = Math.floor(date / daysPerYear);
      date = date % daysPerYear;

      if (date == 0) {
        return { day: 1, month: 1, year: year };
      }
      let i = 0;
      let month = 1;
      let day = 1;
      for (let m of world.month) {
        i++;
        if (date - parseInt(m.days) > 0) {
          date -= parseInt(m.days);
          continue;
        }
        month = i;
        day = date;
        break;
      }

      return {
        day,
        month,
        year,
      };
    },
    [world]
  );
  const [worldData, currentDate] = useMemo(() => {
    return [
      game.worldData,
      dateNumberToWorldDate(game.worldData.currentDate ?? 0),
    ];
  }, [dateNumberToWorldDate, game.worldData]);

  const [selectedDate, setSelectedDate] = useState<any>();

  useEffect(() => {
    if (!selectedDate && currentDate) {
      setSelectedDate(currentDate);
    }
  }, [currentDate, selectedDate]);

  if (!world) {
    return (
      <div
        style={{
          width: "98%",
          marginLeft: "0.5%",
          minHeight: window.innerHeight / 1.5 + "px",
          marginTop: "1%",
          border: "1px solid black",
          borderRadius: "5px",
          backgroundColor: "#F5F5F5",
          padding: "5px",
        }}
      >
        <Typography>Es wurde noch keine Welt ausgewählt.</Typography>
        <DnDWorldSelector
          game={game}
          onSave={async (id) => {
            await saveGame({
              ...game,
              worldData: {
                id: id,
                currentDate: "0",
                currentTime: "0",
              },
            });
            updateTick();
          }}
        ></DnDWorldSelector>
      </div>
    );
  }
  if (!selectedDate) {
    return (
      <div
        style={{
          width: "98%",
          marginLeft: "0.5%",
          minHeight: window.innerHeight / 1.5 + "px",
          marginTop: "1%",
          border: "1px solid black",
          borderRadius: "5px",
          backgroundColor: "#F5F5F5",
          padding: "5px",
        }}
      ></div>
    );
  }

  return (
    <div
      style={{
        width: "98%",
        marginLeft: "0.5%",
        minHeight: window.innerHeight / 1.5 + "px",
        marginTop: "1%",
        backgroundColor: "#F5F5F5",
        padding: "5px",
      }}
    >
      {customContext ? (
        <DnDContextMenu posX={customContext.posX} posY={customContext.posY}>
          <>
            <MenuItem
              disabled={!customContext.target}
              onClick={async (e) => {
                e.stopPropagation();
                await saveGame({
                  ...game,
                  worldData: {
                    ...worldData,
                    currentDate: worldDateToDateNumber({
                      day: customContext.target,
                      month: selectedDate.month,
                      year: selectedDate.year,
                    }),
                  },
                });
                setSelectedDate({
                  day: customContext.target,
                  month: selectedDate.month,
                  year: selectedDate.year,
                });
                updateTick();
                setCustomContext(undefined);
              }}
            >
              <ListItemIcon>
                <CalendarToday></CalendarToday>
              </ListItemIcon>
              <ListItemText>Setze Datum</ListItemText>
            </MenuItem>
            <MenuItem
              disabled={!customContext.target}
              onClick={async (e) => {
                e.stopPropagation();
                updateTick();
                setCustomContext(undefined);
                let date = dateNumberToWorldDate(worldData.currentDate);
                openPopup(
                  18,
                  { datum: date.day + "." + date.month + "." + date.year },
                  async (data) => {
                    if (!data || !data.datum) {
                      return;
                    }
                    let datum = data.datum;
                    if (datum.split(".").length < 3) {
                      return;
                    }
                    await saveGame({
                      ...game,
                      worldData: {
                        ...worldData,
                        currentDate: worldDateToDateNumber({
                          day: parseInt(datum.split(".")[0]),
                          month: parseInt(datum.split(".")[1]),
                          year: parseInt(datum.split(".")[2]),
                        }),
                      },
                    });

                    setSelectedDate({
                      day: parseInt(datum.split(".")[0]),
                      month: parseInt(datum.split(".")[1]),
                      year: parseInt(datum.split(".")[2]),
                    });
                  }
                );
              }}
            >
              <ListItemIcon>
                <CalendarToday></CalendarToday>
              </ListItemIcon>
              <ListItemText>Setze Datum (Dialog)</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={async (e) => {
                e.stopPropagation();
                openPopup(
                  16,
                  {
                    minutes: parseInt(worldData.currentTime ?? 0) % 60,
                    hours: Math.floor(
                      parseInt(worldData.currentTime ?? 0) / 60
                    ),
                  },
                  async (data) => {
                    await saveGame({
                      ...game,
                      worldData: {
                        ...worldData,
                        currentTime:
                          parseInt(data.hours) * 60 +
                          parseInt(data.minutes) +
                          "",
                      },
                    });
                    updateTick();
                  }
                );
                setCustomContext(undefined);
              }}
            >
              <ListItemIcon>
                <PunchClock></PunchClock>
              </ListItemIcon>
              <ListItemText>Setze Uhrzeit</ListItemText>
            </MenuItem>
          </>
        </DnDContextMenu>
      ) : (
        <></>
      )}
      <DnDCustomCalenderCP
        onStyle={(date) => {
          if (
            selectedDate.month != clickedDate.month ||
            selectedDate.year != clickedDate.year
          ) {
            return {};
          }
          if (clickedDate.day == date) {
            return { backgroundColor: "DADAFA" };
          }
          return {};
        }}
        currentDate={currentDate}
        selectedDate={selectedDate}
        world={world}
        setCustomContext={setCustomContext}
        title={
          world.month[selectedDate.month - 1].name + " " + selectedDate.year
        }
        onClick={(date) => {
          setClickedDate({
            day: date,
            month: selectedDate.month,
            year: selectedDate.year,
          });
        }}
        onMoveLeft={() => {
          setSelectedDate((prev) => ({
            ...prev,
            month: prev.month - 1 < 1 ? world.month.length : prev.month - 1,
            year: prev.month - 1 < 1 ? prev.year - 1 : prev.year,
          }));
        }}
        onMoveRight={() => {
          setSelectedDate((prev) => ({
            ...prev,
            month: prev.month + 1 > world.month.length ? 1 : prev.month + 1,
            year:
              prev.month + 1 > world.month.length ? prev.year + 1 : prev.year,
          }));
        }}
      ></DnDCustomCalenderCP>
    </div>
  );
}
