import {
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  Add,
  Delete,
  LocationOn,
  RotateLeft,
  SwapHoriz,
  Transform,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import DnDGamemasterDefaulListCP from "./DnDGamemasterDefaultListCP";
import DnDGamemasterPlayerItemCP from "./DnDGamemasterPlayerItemCP";
import { useMemo, useState } from "react";
import DnDContextMenu from "../basic/DnDContextMenu";
import {
  deleteNPC,
  moveNPCToMap,
  movePlayerToMap,
  saveGame,
  saveNPC,
  savePlayer,
} from "@/utils/game";
import { useUsernames } from "@/utils/customHooks";
import DnDGamemasterNPCItemCP from "./DnDGamemasterNPCItemCP";
import { generateUUID } from "three/src/math/MathUtils";
/**
 * A List of all Players in the Game
 *
 * @param npcs List of all NPCs
 * @param updateTick Updates all Data from Database
 * @param game Game Data
 * @param setPopupData Updates Data for Popup
 * @param setPopupId Chooses Current Popup to Show
 * @param setCurrentPlayerId Opens Character Viewer for given Player ID
 */
export default function DnDGamemasterPlayerListCP({
  npcs,
  updateTick,
  game,
  openPopup,
  setCurrentPlayerId,
  customContext,
  setCustomContext,
}: {
  updateTick: any;
  setCurrentPlayerId: any;
  npcs: any;
  game: any;
  setCustomContext: any;
  customContext: any;
  openPopup: (id: number, data: any, onSave: (data) => void) => void;
}) {
  const [selectedPlayer, setSelectedPlayer] = useState<string[]>([]);

  const users = useUsernames();
  const usernames = useMemo(() => {
    let ret = ["Niemand"];
    for (let u of users) {
      ret.push(u.username);
    }
    return ret;
  }, [users]);

  const getPlayersById = (ids: any[]) => {
    let p = [];
    for (let p1 of game.npcData) {
      if (!p1) {
        continue;
      }
      if (ids.includes(p1.id)) {
        p.push(p1);
      }
    }
    return p;
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "10px",
        gridRow: "auto",
      }}
      onClick={(e) => {
        if (!e.ctrlKey) {
          setSelectedPlayer([]);
        }
      }}
    >
      {customContext ? (
        <DnDContextMenu posX={customContext.posX} posY={customContext.posY}>
          <MenuItem
            disabled={selectedPlayer.length == 0 && !customContext.target}
            onClick={async (e) => {
              e.stopPropagation();
              if (selectedPlayer && selectedPlayer.length > 0) {
                for (let p of getPlayersById(selectedPlayer)) {
                  await saveNPC(game.id, {
                    ...p,
                    hidden: true,
                  });
                }
                updateTick();
                setSelectedPlayer([]);
                setCustomContext(undefined);
                return;
              }
              if (customContext.target) {
                await saveNPC(game.id, {
                  ...getPlayersById([customContext.target])[0],
                  hidden: true,
                });
                updateTick();
              }
              setCustomContext(undefined);
            }}
          >
            <ListItemIcon>
              <VisibilityOff></VisibilityOff>
            </ListItemIcon>
            <ListItemText>NPC ausblenden</ListItemText>
          </MenuItem>
          <MenuItem
            disabled={selectedPlayer.length == 0 && !customContext.target}
            onClick={async (e) => {
              e.stopPropagation();
              openPopup(
                10,
                {
                  mapData: game.mapData,
                  ids:
                    selectedPlayer.length != 0
                      ? selectedPlayer.map((item) => ({
                          id: item,
                          npc: true,
                        }))
                      : [{ id: customContext.target, npc: true }],
                },
                async (data) => {
                  if (!data || !data.mapId || !data.ids) {
                    return;
                  }
                  for (let id of data.ids) {
                    console.log(id);
                    if (id.npc) {
                      await moveNPCToMap(game, data.mapId, id.id);
                      continue;
                    }

                    await movePlayerToMap(game, data.mapId, id.id);
                  }
                }
              );
            }}
          >
            <ListItemIcon>
              <LocationOn></LocationOn>
            </ListItemIcon>
            <ListItemText>Auf Karte setzen</ListItemText>
          </MenuItem>
          <MenuItem
            disabled={selectedPlayer.length == 0 && !customContext.target}
            onClick={async (e) => {
              e.stopPropagation();
              if (selectedPlayer && selectedPlayer.length > 0) {
                for (let n of selectedPlayer) {
                  await deleteNPC(game.id, n);
                }
                updateTick();
                setSelectedPlayer([]);
                setCustomContext(undefined);
                return;
              }
              if (customContext.target) {
                await deleteNPC(game.id, customContext.target);
                updateTick();
              }
              setCustomContext(undefined);
            }}
          >
            <ListItemIcon>
              <Delete></Delete>
            </ListItemIcon>
            <ListItemText>NPC löschen</ListItemText>
          </MenuItem>
          <MenuItem
            disabled={selectedPlayer.length == 0 && !customContext.target}
            onClick={async (e) => {
              e.stopPropagation();
              if (selectedPlayer && selectedPlayer.length > 0) {
                openPopup(
                  13,
                  {
                    users: usernames,
                    onSave: async (user) => {
                      updateTick();
                    },
                  },
                  async (data) => {
                    if (!data || !data.user) {
                      return;
                    }
                    for (let npc of getPlayersById(selectedPlayer)) {
                      await saveNPC(game.id, {
                        ...npc,
                        owner: data.user == "Niemand" ? undefined : data.user,
                      });
                    }
                  }
                );
                setCustomContext(undefined);
                return;
              }
              if (customContext.target) {
                openPopup(
                  13,
                  {
                    users: usernames,
                    onSave: async (user) => {
                      updateTick();
                    },
                  },
                  async (data) => {
                    if (!data || !data.user) {
                      return;
                    }
                    await saveNPC(game.id, {
                      ...getPlayersById([customContext.target])[0],
                      owner: data.user == "Niemand" ? undefined : data.user,
                    });
                    updateTick();
                  }
                );
              }
              setCustomContext(undefined);
            }}
          >
            <ListItemIcon>
              <SwapHoriz></SwapHoriz>
            </ListItemIcon>
            <ListItemText>NPC zuteilen</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={async (e) => {
              e.stopPropagation();
              openPopup(
                1,
                {
                  npcs: game.npcData.filter((item: any) => {
                    return item && item.hidden;
                  }),
                },
                async (data) => {
                  if (!data.npc) {
                    return;
                  }
                  await saveNPC(game.id, {
                    ...data.npc,
                    hidden: false,
                  });
                }
              );
              setCustomContext(undefined);
            }}
          >
            <ListItemIcon>
              <Visibility></Visibility>
            </ListItemIcon>
            <ListItemText>NPC anzeigen</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={async (e) => {
              e.stopPropagation();
              openPopup(
                0,
                {
                  npcs: npcs.sort((a, b) => {
                    if (a.name < b.name) {
                      return -1;
                    }
                    if (a.name > b.name) {
                      return 1;
                    }
                    return 0;
                  }),
                },
                async (data) => {
                  let npc = data.npc;
                  if (!npc) {
                    return;
                  }
                  await saveNPC(game.id, {
                    diceAmount: npc.data.dice ? (npc.data.dice.amount ?? 0) : 0,
                    id: generateUUID(),
                    parent: npc.id,
                    rk: npc.rk,
                    hg: npc.data.hg ?? "",
                    volk: npc.volk ?? "",
                    name: data.name ?? npc.name,
                    hp: npc.hp,
                    spells: [],
                    items: [],
                    weapons: npc.data.weapons ?? [],
                    hidden: false,
                    spellSlots: {
                      "1":
                        npc.data.magic && npc.data.magic.slot
                          ? Number.parseInt(npc.data.magic.slot["1"] ?? 0)
                          : 0,
                      "2":
                        npc.data.magic && npc.data.magic.slot
                          ? Number.parseInt(npc.data.magic.slot["2"] ?? 0)
                          : 0,
                      "3":
                        npc.data.magic && npc.data.magic.slot
                          ? Number.parseInt(npc.data.magic.slot["3"] ?? 0)
                          : 0,
                      "4":
                        npc.data.magic && npc.data.magic.slot
                          ? Number.parseInt(npc.data.magic.slot["4"] ?? 0)
                          : 0,
                      "5":
                        npc.data.magic && npc.data.magic.slot
                          ? Number.parseInt(npc.data.magic.slot["5"] ?? 0)
                          : 0,
                      "6":
                        npc.data.magic && npc.data.magic.slot
                          ? Number.parseInt(npc.data.magic.slot["6"] ?? 0)
                          : 0,
                      "7":
                        npc.data.magic && npc.data.magic.slot
                          ? Number.parseInt(npc.data.magic.slot["7"] ?? 0)
                          : 0,
                      "8":
                        npc.data.magic && npc.data.magic.slot
                          ? Number.parseInt(npc.data.magic.slot["8"] ?? 0)
                          : 0,
                      "9":
                        npc.data.magic && npc.data.magic.slot
                          ? Number.parseInt(npc.data.magic.slot["9"] ?? 0)
                          : 0,
                    },
                  });
                }
              );
              setCustomContext(undefined);
            }}
          >
            <ListItemIcon>
              <Add></Add>
            </ListItemIcon>
            <ListItemText>NPC hinzufügen</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={async (e) => {
              e.stopPropagation();
              openPopup(
                2,
                {
                  npcs: npcs.sort((a, b) => {
                    if (a.name < b.name) {
                      return -1;
                    }
                    if (a.name > b.name) {
                      return 1;
                    }
                    return 0;
                  }),
                },
                async (data) => {
                  for (let a = 1; a <= parseInt(data.amount); a++) {
                    let npc = data.npc;
                    if (!npc) {
                      return;
                    }
                    await saveNPC(game.id, {
                      diceAmount: npc.data.dice
                        ? (npc.data.dice.amount ?? 0)
                        : 0,
                      id: generateUUID(),
                      parent: npc.id,
                      rk: npc.rk,
                      hg: npc.data.hg ?? "",
                      volk: npc.volk ?? "",
                      name: (data.name ?? npc.name) + " " + a,
                      hp: npc.hp,
                      spells: [],
                      items: [],
                      weapons: npc.data.weapons ?? [],
                      hidden: false,
                      spellSlots: {
                        "1":
                          npc.data.magic && npc.data.magic.slot
                            ? Number.parseInt(npc.data.magic.slot["1"] ?? 0)
                            : 0,
                        "2":
                          npc.data.magic && npc.data.magic.slot
                            ? Number.parseInt(npc.data.magic.slot["2"] ?? 0)
                            : 0,
                        "3":
                          npc.data.magic && npc.data.magic.slot
                            ? Number.parseInt(npc.data.magic.slot["3"] ?? 0)
                            : 0,
                        "4":
                          npc.data.magic && npc.data.magic.slot
                            ? Number.parseInt(npc.data.magic.slot["4"] ?? 0)
                            : 0,
                        "5":
                          npc.data.magic && npc.data.magic.slot
                            ? Number.parseInt(npc.data.magic.slot["5"] ?? 0)
                            : 0,
                        "6":
                          npc.data.magic && npc.data.magic.slot
                            ? Number.parseInt(npc.data.magic.slot["6"] ?? 0)
                            : 0,
                        "7":
                          npc.data.magic && npc.data.magic.slot
                            ? Number.parseInt(npc.data.magic.slot["7"] ?? 0)
                            : 0,
                        "8":
                          npc.data.magic && npc.data.magic.slot
                            ? Number.parseInt(npc.data.magic.slot["8"] ?? 0)
                            : 0,
                        "9":
                          npc.data.magic && npc.data.magic.slot
                            ? Number.parseInt(npc.data.magic.slot["9"] ?? 0)
                            : 0,
                      },
                    });
                  }
                }
              );
              setCustomContext(undefined);
            }}
          >
            <ListItemIcon>
              <Add></Add>
            </ListItemIcon>
            <ListItemText>NPC Gruppe hinzufügen</ListItemText>
          </MenuItem>
        </DnDContextMenu>
      ) : (
        <></>
      )}
      {game.npcData ? (
        game.npcData.map((item: any, index: number) => {
          if (!item || item.hidden) {
            return <></>;
          }
          return (
            <DnDGamemasterNPCItemCP
              setCustomContext={setCustomContext}
              onClick={(e) => {
                setCustomContext(undefined);
                if (e.ctrlKey) {
                  if (selectedPlayer.includes(item.id)) {
                    setSelectedPlayer(
                      selectedPlayer.filter((value) => value != item.id)
                    );
                  } else {
                    setSelectedPlayer((prev) => [...prev, item.id]);
                  }
                  return;
                }
                setCurrentPlayerId(item.id);
                e.stopPropagation();
              }}
              style={{
                backgroundColor: selectedPlayer.includes(item.id)
                  ? "#DADAFA"
                  : undefined,
              }}
              item={item}
              key={item.id + "view"}
            />
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
}
