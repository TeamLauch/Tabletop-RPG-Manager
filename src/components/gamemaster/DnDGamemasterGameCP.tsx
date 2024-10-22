import {
  Button,
  FormControl,
  Icon,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import {
  addEvent,
  addEventToGame,
  addNoteToMap,
  createMap,
  deleteGame,
  moveNPCToMap,
  movePlayerToMap,
  saveFight,
  saveGame,
  saveItem,
  saveNPC,
  savePlayer,
  setColorOfToken,
} from "@/utils/game";
import {
  Delete,
  Edit,
  LocalFireDepartment,
  Map,
  Note,
  Person4,
  RotateLeft,
} from "@mui/icons-material";
import { generateUUID } from "three/src/math/MathUtils";
import {
  useCharacter,
  useNPC,
  useNPCPlayer,
  useNPCs,
  usePlayer,
  useUsernames,
} from "@/utils/customHooks";
import DnDGameMasterPopup from "./DnDGameMasterPopup";
import DnDGamemasterMapsCP from "./DnDGamemasterMapsCP";
import DnDGamemasterNPCListCP from "./DnDGamemasterNPCListCP";
import DnDGamemasterItemsListCP from "./DnDGamemasterItemsListCP";
import DnDGamemasterPlayerListCP from "./DnDGamemasterPlayerListCP";
import DnDModal from "../basic/DnDModal";
import axios from "axios";
import { User } from "@prisma/client";
import DnDCharacterSheetCP from "../characterviewer/DnDCharacterSheetCP";
import DnDGamemasterFightCP from "./DnDGamemasterFightCP";
import { resolveToValue } from "@/utils/dataHelper";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import DnDGamemasterCharacterCP from "./DnDGamemasterCharacterCP";
import DnDGamemasterCalenderCP from "./DnDGamemasterCalenderCP";
import DnDGamemasterQuestEditor from "./DnDGamemasterQuestEditor";
import DnDGamemasterQuestCP from "./DnDGamemasterQuestCP";
import DnDGamemasterEventCP from "./DnDGamemasterEventCP";
import { randomUUID } from "crypto";

/**
 *
 * @param game GameData
 * @param w Margin Left
 * @returns A Panel for Managing a Game as a GameMaster
 */
export default function DnDGamemasterGameCP({
  game,
  updateTick,
  tick,
  id,
  open,
  setOpen,
  user,
}: {
  game: any;
  updateTick: () => void;
  tick: number;
  id: any;
  open: any;
  setOpen: any;
  user: any;
}) {
  const [currentPlayerId, setCurrentPlayerId] = useState("-1");
  const [currentNPCId, setCurrentNPCId] = useState("-1");
  const [customContext, setCustomContext] = useState<any>();

  const staticGame = game;
  const player = usePlayer(game.id, tick, currentPlayerId);
  const character = useCharacter(player ? player.id : "");

  const npcPlayer = useNPCPlayer(game.id, currentNPCId, tick);
  const npc = useNPC(tick, npcPlayer ? (npcPlayer.parent ?? "") : "");
  const npcs = useNPCs();

  const [selected, setSelected] = useState<string | undefined>(undefined);
  let error: string = "";
  let addableUsers: User[] = [];
  const usernames = useUsernames();

  const [popupId, setPopupId] = useState(-1);
  const [popupData, setPopupData] = useState<any>();
  const [popupSave, setPopupSave] = useState<{ save: (data) => void }>();

  const openPopup = useCallback(
    (id: number, data: any, onSave: (data) => void) => {
      console.log(id, data, onSave);
      setPopupId(id);
      setPopupData(data);
      setPopupSave({ save: onSave });
    },
    []
  );

  const [tab, setTab] = useState("1");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleDelete = async (gamemasterToRemove: string) => {
    const lastIndex = staticGame.gamemasters.length;
    if (open == true && lastIndex > 1 && gamemasterToRemove != user.user) {
      if (gamemasterToRemove != staticGame.gamemaster) {
        await axios.post("/api/game/removeGamemaster", {
          id: game.id,
          gamemasterToRemove: gamemasterToRemove,
        });
        setOpen(false);
        updateTick();
        setOpen(true);
      } else {
        error =
          "Es ist nicht möglich den Owner eines Spiels als Gamemaster zu entfernen";
      }
    } else {
      error =
        "es ist nicht möglich sich selbst zu entfernen, bzw den letzten Gamemaster zu entfernen";
    }
  };

  const handleAdd = async () => {
    if (open == true && selected != null) {
      if (game.gamemasters.indexOf(selected) == -1) {
        await axios.post("/api/game/addGamemaster", {
          id: game.id,
          newGamemaster: selected,
        });
        const index = addableUsers.findIndex((x) => x.username == selected);
        if (index > -1) {
          addableUsers.splice(index, 1);
        }
        setSelected(null);
        setOpen(false);
        updateTick();
        setOpen(true);
      } else {
        error = "User ist bereits ein Gamemaster für dieses Spiel";
      }
    } else {
      error = "Bitte User auswählen";
    }
  };

  usernames.forEach((i) => {
    if (game.gamemasters.indexOf(i) == -1) {
      addableUsers.push(i);
    }
  });

  /**
   * Saves Data Inputed inside the Popup according to the ID of the Popup
   *
   * @param data Data given by the Popup
   * @returns
   */
  async function savePopup(data: any) {
    if (!popupSave || !popupSave.save) {
      setPopupSave(null);
      setPopupData({});
      setPopupId(-1);
      updateTick();
      return;
    }
    await popupSave.save(data);
    setPopupSave(null);
    setPopupData({});
    setPopupId(-1);
    updateTick();
  }

  if (currentNPCId != "-1" && npc) {
    return (
      <>
        <Button
          onClick={() => {
            setCurrentNPCId("-1");
          }}
        >
          Zurück
        </Button>
        <DnDCharacterSheetCP
          save={async (game: any, data: any) => {
            await saveNPC(game, data);
            updateTick();
          }}
          tick={tick}
          character={npc}
          gameId={game.id}
          player={npcPlayer}
          setUpdateTick={() => {
            updateTick();
          }}
        ></DnDCharacterSheetCP>
      </>
    );
  }

  if (currentPlayerId != "-1" && character) {
    return (
      <>
        <Button
          onClick={() => {
            setCurrentPlayerId("-1");
          }}
        >
          Zurück
        </Button>
        <DnDCharacterSheetCP
          save={async (game: any, data: any) => {
            await savePlayer(game, data);
            updateTick();
          }}
          tick={tick}
          character={character}
          gameId={game.id}
          player={player}
          setUpdateTick={() => {
            updateTick();
          }}
        ></DnDCharacterSheetCP>
      </>
    );
  }

  return (
    <div
      onContextMenu={(e) => {
        setCustomContext({
          posX: e.pageX,
          posY: e.pageY,
        });
        e.stopPropagation();
        e.preventDefault();
      }}
      onClick={(e) => {
        setCustomContext(undefined);
      }}
    >
      {/** TODO DELETE THIS AND MAKE IT TO POPUP */}
      <div>
        <DnDModal
          open={open}
          onClose={() => setOpen(false)}
          disableCommit={true}
          closeLable={"schließen"}
          children={
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "1em",
                  marginBottom: "1em",
                }}
              >
                <Typography variant="h4">Gamemaster Bearbeiten</Typography>
              </div>
              <div style={{ marginBottom: "1em" }}>Gamemaster Hinzufügen</div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "80%",
                  marginRight: "auto",
                  marginLeft: "auto",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id="UserSelect">Benutzer wählen</InputLabel>
                  <Select
                    labelId="UserSelect"
                    id="UserSelect"
                    value={selected}
                    label="Benutzer wählen"
                    onChange={(e) => setSelected(e.target.value)}
                  >
                    {addableUsers.map((item: User) => (
                      <MenuItem key={item.username} value={item.username}>
                        {item.username}
                      </MenuItem>
                    ))}
                  </Select>
                  <Button onClick={() => handleAdd()} variant="outlined">
                    Hinzufügen
                  </Button>
                </FormControl>
              </div>
              <div>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Benutzer</TableCell>
                      <TableCell>Löschen</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {staticGame.gamemasters.map((item: any) => {
                      return (
                        <TableRow key={item}>
                          <TableCell>{item}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={async () => handleDelete(item)}
                            >
                              <Delete></Delete>
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          }
        ></DnDModal>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <div></div>
        <Typography variant="h3">
          Spielleiter {game.name}
          <Tooltip title="Refresh">
            <IconButton
              onClick={() => {
                updateTick();
              }}
            >
              <RotateLeft></RotateLeft>
            </IconButton>
          </Tooltip>
          <Tooltip title="Spiel Löschen">
            <IconButton
              onClick={async () => {
                await deleteGame(game.id);
                window.location.href = "/games";
              }}
            >
              <Delete></Delete>
            </IconButton>
          </Tooltip>
          <Tooltip title="Spiel Bearbeiten">
            <IconButton
              disabled
              onClick={async () => {
                setPopupData({ game });
                setPopupId(7);
              }}
            >
              <Edit></Edit>
            </IconButton>
          </Tooltip>
          <Tooltip title="Gamemaster editieren">
            <IconButton onClick={() => handleOpen()}>
              <Person4></Person4>
            </IconButton>
          </Tooltip>
        </Typography>
        <div
          onClick={async () => {
            await saveGame({
              ...game,
              status: game.status == "open" ? "closed" : "open",
            });
            updateTick();
          }}
          style={{
            alignContent: "center",
            cursor: "pointer",
            textAlign: "center",
            width: "100px",
            marginRight: "10px",
            backgroundColor: game.status == "open" ? "lightgreen" : "red",
            marginTop: "5px",
            borderRadius: "10px",
            height: "50px",
          }}
        >
          {game.status == "open" ? "Offen" : "Geschlossen"}
        </div>
      </div>
      <TabContext value={tab}>
        <TabList
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
            width: "100%",
          }}
          onChange={(e, newValue) => {
            setTab(newValue);
          }}
        >
          <Tab
            value="1"
            label="Spieler"
            sx={{
              backgroundColor: tab == "1" ? "#F5F5F582" : undefined,
              backdropFilter: "blur(8px)",
              borderRadius: "10px 10px 0 0 ",
            }}
          />
          <Tab
            value="2"
            label="NPCs"
            sx={{
              backgroundColor: tab == "2" ? "#F5F5F582" : undefined,
              backdropFilter: "blur(8px)",
              borderRadius: "10px 10px 0 0 ",
            }}
          />
          <Tab
            value="3"
            label="Items"
            sx={{
              backgroundColor: tab == "3" ? "#F5F5F582" : undefined,
              backdropFilter: "blur(8px)",
              borderRadius: "10px 10px 0 0 ",
            }}
          />
          <Tab
            value="4"
            label="Karten"
            sx={{
              backgroundColor: tab == "4" ? "#F5F5F582" : undefined,
              backdropFilter: "blur(8px)",
              borderRadius: "10px 10px 0 0 ",
            }}
          />
          <Tab
            value="5"
            label="Kampf"
            sx={{
              backgroundColor: tab == "5" ? "#F5F5F582" : undefined,
              backdropFilter: "blur(8px)",
              borderRadius: "10px 10px 0 0 ",
            }}
          />
          <Tab
            value="6"
            label="Charactere"
            sx={{
              backgroundColor: tab == "6" ? "#F5F5F582" : undefined,
              backdropFilter: "blur(8px)",
              borderRadius: "10px 10px 0 0 ",
            }}
          />
          <Tab
            value="7"
            label="Kalender"
            sx={{
              backgroundColor: tab == "7" ? "#F5F5F582" : undefined,
              backdropFilter: "blur(8px)",
              borderRadius: "10px 10px 0 0 ",
            }}
          />
          <Tab
            value="8"
            label="Quests"
            sx={{
              backgroundColor: tab == "8" ? "#F5F5F582" : undefined,
              backdropFilter: "blur(8px)",
              borderRadius: "10px 10px 0 0 ",
            }}
          />
          <Tab
            value="9"
            label="Events"
            sx={{
              backgroundColor: tab == "9" ? "#F5F5F582" : undefined,
              backdropFilter: "blur(8px)",
              borderRadius: "10px 10px 0 0 ",
            }}
          />
        </TabList>
        <TabPanel
          value="1"
          sx={{
            backgroundColor: "#F5F5F582",
            backdropFilter: "blur(8px)",
            borderRadius: "0 0 10px 10px",
          }}
        >
          <DnDGamemasterPlayerListCP
            customContext={customContext}
            setCustomContext={setCustomContext}
            game={game}
            npcs={npcs}
            setCurrentPlayerId={setCurrentPlayerId}
            openPopup={openPopup}
            updateTick={updateTick}
          ></DnDGamemasterPlayerListCP>
        </TabPanel>

        <TabPanel
          value="2"
          sx={{
            backgroundColor: "#F5F5F582",
            backdropFilter: "blur(8px)",
            borderRadius: "0 0 10px 10px",
          }}
        >
          <DnDGamemasterNPCListCP
            customContext={customContext}
            setCustomContext={setCustomContext}
            game={game}
            npcs={npcs}
            setCurrentPlayerId={setCurrentNPCId}
            openPopup={openPopup}
            updateTick={updateTick}
          ></DnDGamemasterNPCListCP>
        </TabPanel>
        <TabPanel
          value="3"
          sx={{
            backgroundColor: "#F5F5F582",
            backdropFilter: "blur(8px)",
            borderRadius: "0 0 10px 10px",
          }}
        >
          <DnDGamemasterItemsListCP
            customContext={customContext}
            setCustomContext={setCustomContext}
            game={game}
            openPopup={openPopup}
            updateTick={updateTick}
          ></DnDGamemasterItemsListCP>
        </TabPanel>
        <TabPanel
          value="4"
          sx={{
            backgroundColor: "#F5F5F582",
            backdropFilter: "blur(8px)",
            borderRadius: "0 0 10px 10px",
          }}
        >
          <DnDGamemasterMapsCP
            game={game}
            npcs={npcs}
            customContext={customContext}
            setCurrentNPCId={setCurrentNPCId}
            setCurrentPlayerId={setCurrentPlayerId}
            setCustomContext={setCustomContext}
            openPopup={openPopup}
            tick={tick}
            updateTick={updateTick}
          ></DnDGamemasterMapsCP>
        </TabPanel>
        <TabPanel
          value="5"
          sx={{
            backgroundColor: "#F5F5F582",
            backdropFilter: "blur(8px)",
            borderRadius: "0 0 10px 10px",
          }}
        >
          <DnDGamemasterFightCP
            game={game}
            npcs={npcs}
            setCurrentNPCId={setCurrentNPCId}
            setCurrentPlayerId={setCurrentPlayerId}
            openPopup={openPopup}
            setCustomContext={setCustomContext}
            customContext={customContext}
            tick={tick}
            updateTick={updateTick}
          ></DnDGamemasterFightCP>
        </TabPanel>

        <TabPanel
          value="6"
          sx={{
            backgroundColor: "#F5F5F582",
            backdropFilter: "blur(8px)",
            borderRadius: "0 0 10px 10px",
          }}
        >
          <DnDGamemasterCharacterCP
            customContext={customContext}
            game={game}
            setCustomContext={setCustomContext}
            tick={tick}
            updateTick={updateTick}
          ></DnDGamemasterCharacterCP>
        </TabPanel>

        <TabPanel
          value="7"
          sx={{
            backgroundColor: "#F5F5F582",
            backdropFilter: "blur(8px)",
            borderRadius: "0 0 10px 10px",
          }}
        >
          <DnDGamemasterCalenderCP
            openPopup={openPopup}
            customContext={customContext}
            game={game}
            setCustomContext={setCustomContext}
            tick={tick}
            updateTick={updateTick}
          ></DnDGamemasterCalenderCP>
        </TabPanel>
        <TabPanel
          value="8"
          sx={{
            backgroundColor: "#F5F5F582",
            backdropFilter: "blur(8px)",
            borderRadius: "0 0 10px 10px",
          }}
        >
          <DnDGamemasterQuestCP
            customContext={customContext}
            game={game}
            setCustomContext={setCustomContext}
            tick={tick}
            updateTick={updateTick}
          ></DnDGamemasterQuestCP>
        </TabPanel>
        <TabPanel
          value="9"
          sx={{
            backgroundColor: "#F5F5F582",
            backdropFilter: "blur(8px)",
            borderRadius: "0 0 10px 10px",
          }}
        >
          <DnDGamemasterEventCP
            customContext={customContext}
            game={game}
            setCustomContext={setCustomContext}
            tick={tick}
            updateTick={updateTick}
          ></DnDGamemasterEventCP>
        </TabPanel>
      </TabContext>

      <DnDGameMasterPopup
        id={popupId}
        data={popupData}
        onClose={() => {
          setPopupData({});
          setPopupId(-1);
        }}
        onSave={savePopup}
      ></DnDGameMasterPopup>
    </div>
  );
}
