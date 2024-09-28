import DnDDefaultPage from "@/components/basic/DnDDefaultPage";
import DnDDialog from "@/components/basic/DnDDialog";
import DnDCharacterSheetCP from "@/components/characterviewer/DnDCharacterSheetCP";
import {
	useCharacter,
	useCharacters,
	useGame,
	useLoginData,
	useNPC,
	usePlayer,
	usePlayerNPCs,
	useTick,
} from "@/utils/customHooks";
import { registerCharacterAsPlayer, saveNPC, savePlayer } from "@/utils/game";
import { MenuItem, Select, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

/**
 *
 * @returns Site to Show a Character
 */
export default function LevelUp() {
	const router = useRouter();
	var id: any = router.query.id;

	const { loggedIn, ready, user } = useLoginData("user");
	const [error, setError] = useState("");

	const { tick, updateTick } = useTick(5);

	const [currentSelected, setCurrentSelected] = useState("");

	const player = usePlayer(id, tick);
	const character = useCharacter(player ? player.id : "");
	const npcs = usePlayerNPCs(id, tick);

	const playerToUse = useMemo(() => {
		for (let npc of npcs) {
			if (!npc || !npc.id) {
				continue;
			}
			if (npc.id == currentSelected) {
				return npc;
			}
		}
		return player;
	}, [npcs, player, currentSelected]);

	const npc = useNPC(tick, playerToUse ? playerToUse.parent : "");
	const characters = useCharacters();

	const charactersToUse = useMemo(() => {
		if (!playerToUse) {
			return character;
		}
		if (playerToUse.id != player.id) {
			return npc;
		}
		return character;
	}, [playerToUse]);

	const getCharacterNames = useCallback(() => {
		if (!characters) {
			return [];
		}
		let names = [];
		for (let c of characters) {
			names.push(c.characterName);
		}
		return names;
	}, [characters]);

	if (!player || !player.id || !character || !character.id) {
		return (
			<DnDDefaultPage
				error={error}
				setError={setError}
				children={
					<>
						<DnDDialog
							choices={getCharacterNames()}
							choiceDescription={() => {
								return "";
							}}
							choiceDescriptionType="none"
							description="Charakter mit dem du Spielen magst"
							onNext={async (selection) => {
								let c = {};
								for (let cha of characters) {
									if (cha.characterName == selection) {
										c = cha;
										break;
									}
								}
								await registerCharacterAsPlayer(id, c);
								updateTick();
							}}
							title="Charakter"
							type="single"
							onBack={() => (window.location.href = "/games")}
						></DnDDialog>
					</>
				}
				user={user}
				navBar={true}
			></DnDDefaultPage>
		);
	}

	if (
		!ready ||
		!playerToUse ||
		!playerToUse.id ||
		!charactersToUse ||
		!charactersToUse.id
	) {
		return (
			<DnDDefaultPage
				error={error}
				setError={setError}
				children={
					<>
						<Typography>Loading....</Typography>
					</>
				}
				user={user}
				navBar={false}
			></DnDDefaultPage>
		);
	}
	if ((ready && !loggedIn) || (ready && !user)) {
		window.location.href = "/";
		return <></>;
	}

	return (
		<DnDDefaultPage navBar user={user} error={error} setError={setError}>
			<DnDCharacterSheetCP
				tick={tick}
				title={
					<>
						<Select
							value={currentSelected ?? playerToUse.id}
							size="small"
							sx={{ margin: "5px" }}
							onChange={(e) => {
								setCurrentSelected(e.target.value);
								updateTick();
							}}
						>
							<MenuItem value={player.id}>{player.name}</MenuItem>
							{npcs.map((item: any) => {
								return (
									<MenuItem key={"npc_" + item.id} value={item.id}>
										{item.name ?? item.id}
									</MenuItem>
								);
							})}
						</Select>
					</>
				}
				save={async (game: any, data: any) => {
					if (player.id != playerToUse.id) {
						await saveNPC(game, data);
						updateTick();
						return;
					}
					await savePlayer(game, data);
					updateTick();
				}}
				setUpdateTick={updateTick}
				character={charactersToUse}
				gameId={id}
				player={playerToUse}
			></DnDCharacterSheetCP>
		</DnDDefaultPage>
	);
}
