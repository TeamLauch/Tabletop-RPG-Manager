import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import {
  Delete,
  LocationOn,
  RotateLeft,
  SwapHoriz,
  Transform,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import DnDGamemasterPlayerItemCP from "./DnDGamemasterPlayerItemCP";
import { useMemo, useState } from "react";
import DnDContextMenu from "../basic/DnDContextMenu";
import {
  moveNPCToMap,
  movePlayerToMap,
  saveGame,
  savePlayer,
} from "@/utils/game";
import { useUsernames } from "@/utils/customHooks";
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
    let ret = [];
    for (let u of users) {
      ret.push(u.username);
    }
    return ret;
  }, [users]);

  const getPlayersById = (ids: any[]) => {
    let p = [];
    for (let p1 of game.playerData) {
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
            onClick={(e) => {
              e.stopPropagation();
              openPopup(
                3,
                {
                  players:
                    selectedPlayer && selectedPlayer.length > 0
                      ? getPlayersById(selectedPlayer)
                      : getPlayersById([customContext.target]),
                  npcs: npcs,
                },
                async (data) => {
                  if (!data || !data.players || !data.npc) {
                    return;
                  }
                  for (let p of data.players) {
                    await savePlayer(game.id, {
                      ...p,
                      hp: data.npc.hp,
                      spellSlots: data.npc.data.magic
                        ? (data.npc.data.magic.slot ?? undefined)
                        : undefined,
                      transformData: {
                        hp: data.npc.hp,
                        rk: data.npc.rk,
                        name: data.npc.name,
                        weapons: data.npc.data.weapons ?? [],
                        attributes: {
                          ...data.npc.attributes,
                          kon: undefined,
                        },
                        spellText:
                          data.npc.data.magic && data.npc.data.magic.text
                            ? data.npc.data.magic.text
                            : undefined,
                        legend: data.npc.data.legend ?? undefined,
                        conditionImmunity:
                          data.npc.data.conditionImmunity ?? [],
                        damageResistance: data.npc.data.damageResistance ?? [],
                        damageEmpfind: data.npc.data.damageEmpfind ?? [],
                        damageImmunity: data.npc.data.damageImmunity ?? [],
                        ubungsBonus: data.npc.ubungsBonus,
                        abilities: data.npc.abilities ?? [],
                        ubungRW: data.npc.ubungRW,
                        ubungAB: data.npc.ubungAB,
                        bewegungsrate: data.npc.data.bewegungsrate,
                        spellSlots: data.npc.data.magic
                          ? (data.npc.data.magic.slot ?? undefined)
                          : undefined,
                        spells: data.npc.data.magic
                          ? (data.npc.data.magic.spells ?? [])
                          : [],
                        allwaysSpells: data.npc.data.magic
                          ? (data.npc.data.magic.allwaysSpells ?? [])
                          : [],
                        tricks: data.npc.data.magic
                          ? (data.npc.data.magic.tricks ?? [])
                          : [],
                        traits: data.npc.data.traits ?? undefined,
                        actions: data.npc.data.actions ?? undefined,
                      },
                    });
                  }
                }
              );
              setCustomContext(undefined);
            }}
          >
            <ListItemIcon>
              <Transform></Transform>
            </ListItemIcon>
            <ListItemText>Verwandle Spieler</ListItemText>
          </MenuItem>
          <MenuItem
            disabled={
              selectedPlayer.length == 0 &&
              (!customContext.target ||
                !getPlayersById([customContext.target])[0].transformData)
            }
            onClick={async (e) => {
              e.stopPropagation();
              if (selectedPlayer && selectedPlayer.length > 0) {
                for (let p of getPlayersById(selectedPlayer)) {
                  await savePlayer(game.id, {
                    ...p,
                    transformData: undefined,
                  });
                }
                updateTick();
                setCustomContext(undefined);
                return;
              }
              if (customContext.target) {
                await savePlayer(game.id, {
                  ...getPlayersById([customContext.target])[0],
                  transformData: undefined,
                });
                updateTick();
                setCustomContext(undefined);
              }
            }}
          >
            <ListItemIcon>
              <RotateLeft></RotateLeft>
            </ListItemIcon>
            <ListItemText>Zurückverwandeln</ListItemText>
          </MenuItem>
          <MenuItem
            disabled={selectedPlayer.length == 0 && !customContext.target}
            onClick={async (e) => {
              e.stopPropagation();
              if (selectedPlayer && selectedPlayer.length > 0) {
                for (let p of getPlayersById(selectedPlayer)) {
                  await savePlayer(game.id, {
                    ...p,
                    disabled: true,
                  });
                }
                setSelectedPlayer([]);
                setCustomContext(undefined);
                updateTick();
                return;
              }
              if (customContext.target) {
                await savePlayer(game.id, {
                  ...getPlayersById([customContext.target])[0],
                  disabled: true,
                });
                setCustomContext(undefined);
                updateTick();
              }
            }}
          >
            <ListItemIcon>
              <VisibilityOff></VisibilityOff>
            </ListItemIcon>
            <ListItemText>Spieler ausblenden</ListItemText>
          </MenuItem>
          <MenuItem
            disabled={selectedPlayer.length == 0 && !customContext.target}
            onClick={async (e) => {
              e.stopPropagation();
              openPopup(
                10,
                {
                  mapData: game.mapData,
                  ids: (selectedPlayer.length != 0
                    ? selectedPlayer
                    : [customContext.target]
                  ).map((item) => ({
                    id: item,
                    npc: false,
                  })),
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
                let playerData = game.playerData.filter(
                  (value) => !selectedPlayer.includes(value.id)
                );
                await saveGame({
                  ...game,
                  playerData: playerData,
                });
                updateTick();
                setSelectedPlayer([]);
                setCustomContext(undefined);
                return;
              }
              if (customContext.target) {
                let playerData = game.playerData.filter(
                  (value) => value.id != customContext.target
                );
                await saveGame({
                  ...game,
                  playerData: playerData,
                });
                updateTick();
              }
              setCustomContext(undefined);
            }}
          >
            <ListItemIcon>
              <Delete></Delete>
            </ListItemIcon>
            <ListItemText>Spieler löschen</ListItemText>
          </MenuItem>
          <MenuItem
            disabled={!customContext.target}
            onClick={async (e) => {
              e.stopPropagation();
              if (customContext.target) {
                openPopup(
                  13,
                  {
                    users: usernames,
                  },
                  async (data) => {
                    if (!data || !data.user) {
                      return;
                    }
                    await savePlayer(game.id, {
                      ...getPlayersById([customContext.target])[0],
                      owner: data.user,
                    });
                    updateTick();
                  }
                );
                setCustomContext(undefined);
              }
            }}
          >
            <ListItemIcon>
              <SwapHoriz></SwapHoriz>
            </ListItemIcon>
            <ListItemText>Spieler zuteilen</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={async (e) => {
              e.stopPropagation();
              openPopup(
                4,
                {
                  players: game.playerData.filter((item: any) => {
                    return item && item.disabled;
                  }),
                },
                async (data) => {
                  if (!data || !data.player) {
                    return;
                  }
                  await savePlayer(game.id, {
                    ...data.player,
                    disabled: false,
                  });
                }
              );
              setCustomContext(undefined);
            }}
          >
            <ListItemIcon>
              <Visibility></Visibility>
            </ListItemIcon>
            <ListItemText>Spieler anzeigen</ListItemText>
          </MenuItem>
        </DnDContextMenu>
      ) : (
        <></>
      )}
      {game.playerData ? (
        game.playerData.map((item: any, index: number) => {
          if (!item || item.disabled) {
            return <></>;
          }
          return (
            <DnDGamemasterPlayerItemCP
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
