import { Button, IconButton } from "@mui/material";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useSpells, useTick } from "@/utils/customHooks";
import DnDEditSpellComponent from "./DnDEditSpellComponent";
import DnDSpellPanel from "./DnDSpellPanel";
import DnDListComponent from "../basic/DnDListComponent";
import { useRouter } from "next/router";
import { Add } from "@mui/icons-material";

/**
 *
 * @param w Margin for NavBar
 * @param setError Creating a Error Message
 * @returns Site for Editing and Viewing Spells
 */
export default function DnDSpellPageComponent({ setError }: { setError: any }) {
	const { tick, updateTick } = useTick();
	const spells = useSpells(tick);
	const [spellId, setSpellId] = useState<string>(null);
	const [showEdit, setShowEdit] = useState(false);
	const [showCreate, setShowCreate] = useState(false);

	const currentSpell = useMemo(() => {
		if (!spellId) {
			return undefined;
		}
		for (let s of spells) {
			if (s.id == spellId) {
				return s;
			}
		}
	}, [spellId, spells]);

	const onDelete = async (spell: any) => {
		if (spell.custom) {
			try {
				await axios.post("/api/spells/removeSpell", { id: spell.id });
				updateTick();
			} catch {
				console.log("error while delete");
			}
		}
	};

	/**
	 * Shows Details of Spell
	 * @param spell Spell to show
	 */
	const showZauber = (spell: any) => {
		setShowCreate(false);
		setShowEdit(false);
		setSpellId(spell.id);
	};

	/**
	 *
	 * @param spell Data of Spell to Create
	 * Creates a new Spell using the API
	 */
	const createSpell = async (spell: any) => {
		try {
			spell.custom = true;
			const res = await axios.post("/api/spells/addSpell", { spell: spell });
			if (res.status != 200) {
				setError("Internal Server Error");
				return;
			}
			if (res.data.error) {
				setError(res.data.message);
				return;
			}
			setShowCreate(false);
			setShowEdit(false);
			setSpellId(undefined);
			updateTick();
		} catch (err: any) {}
	};

	/**
	 *
	 * @param spell New Spell Data
	 * Edits a Spell using the API
	 */
	const editSpell = async (spell: any) => {
		try {
			const res = await axios.post("/api/spells/editSpell", { spell: spell });
			if (res.status != 200) {
				setError("Internal Server Error");
				return;
			}
			if (res.data.error) {
				setError(res.data.message);
				return;
			}
			setShowCreate(false);
			setShowEdit(false);
			updateTick();
		} catch (err: any) {}
	};

	if (showCreate) {
		return (
			<DnDEditSpellComponent
				s={null}
				save={createSpell}
				close={() => {
					setShowCreate(false);
				}}
			></DnDEditSpellComponent>
		);
	}

	if (showEdit && currentSpell) {
		return (
			<DnDEditSpellComponent
				s={currentSpell}
				save={editSpell}
				close={() => {
					setShowEdit(false);
				}}
			></DnDEditSpellComponent>
		);
	}

	if (currentSpell) {
		return (
			<DnDSpellPanel
				spell={currentSpell}
				close={() => {
					setSpellId(undefined);
				}}
				edit={() => {
					setShowEdit(true);
				}}
				onDelete={() => onDelete(currentSpell)}
			/>
		);
	}

	return (
		<div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
			<DnDListComponent
				additionalButtons={
					<IconButton
						color="primary"
						onClick={() => {
							setSpellId(undefined);
							setShowCreate(true);
							setShowEdit(false);
						}}
					>
						<Add></Add>
					</IconButton>
				}
				list={spells ?? []}
				bodys={[
					{
						name: "Level",
						location: "level",
						filterable: true,
						formatLabel: (value) => {
							if (value == 0) {
								return "Zaubertrick";
							}
							return value;
						},
					},
					{ name: "Schule", location: "school", filterable: true },
					{ name: "Lizenz", location: "licence", filterable: true },
					{ name: "Klassen", location: "classes", filterable: true },
				]}
				nosort={false}
				filter
				searchfield
				onClick={(item: any) => {
					showZauber(item);
				}}
			></DnDListComponent>
		</div>
	);
}
