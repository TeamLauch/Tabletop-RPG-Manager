import { Button } from "@mui/material";
import { useMemo, useState } from "react";
import { useCharacters, useTick } from "@/utils/customHooks";
import { saveCharacter } from "@/utils/character";
import DnDCharacterListItem from "./DnDCharacterListItem";
import DnDEditCharacter from "./DnDEditCharacter";

/**
 *
 * @param own Only Characters made by one self
 * @param w Margin Navbar
 * @param setError Displays Error Popup
 * @returns CharacterLIst
 */
export default function DnDCharacterCP({
	own = true,
	setError,
}: {
	own: boolean;
	setError: any;
}) {
	const { tick, updateTick } = useTick();
	const characters = useCharacters(tick, !own);
	const [showEdit, setShowEdit] = useState(false);
	const [showCharacter, setShowCharacter] = useState(false);

	const [currenCharacter, setCurrentCharacter] = useState<any>({});

	/**
	 * Sorts Abilities By Names
	 */
	const sortedCharacters = useMemo(() => {
		if (!characters) {
			return [];
		}
		return characters.sort((a: any, b: any) => {
			if (a.characterName.toLowerCase() < b.characterName.toLowerCase()) {
				return -1;
			}
			if (a.characterName.toLowerCase() > b.characterName.toLowerCase()) {
				return 1;
			}
			return 0;
		});
	}, [characters]);

	/**
	 * Closes the Menu
	 */
	const closeMenu = () => {
		setShowCharacter(false);
		setShowEdit(false);
		updateTick();
	};

	/**
	 *
	 * Opens Edit menu
	 *
	 * @param c Character to Edit
	 */
	const setEdit = (c: any) => {
		setShowEdit(true);
		setCurrentCharacter(c);
	};

	return (
		<>
			{showEdit ? (
				<DnDEditCharacter
					character={currenCharacter}
					close={closeMenu}
					save={async (data: any) => {
						await saveCharacter(data);
						closeMenu();
					}}
				></DnDEditCharacter>
			) : (
				<></>
			)}
			{showCharacter ? <></> : <></>}
			{!showEdit && !showCharacter ? (
				<>
					<div
						style={{
							marginTop: "10px",
							width: "98%",
							marginLeft: "1%",
							display: "flex",
							justifyContent: "flex-end",
						}}
					>
						<Button
							variant="contained"
							color="primary"
							onClick={() => {
								window.location.href = "characterCreator";
							}}
						>
							Neuer Charakter
						</Button>
					</div>
					<div>
						{sortedCharacters.map((item: any) => {
							return (
								<DnDCharacterListItem
									c={item}
									key={item.characterName}
									setEdit={setEdit}
									own={own}
								></DnDCharacterListItem>
							);
						})}
					</div>
				</>
			) : (
				<></>
			)}
		</>
	);
}
