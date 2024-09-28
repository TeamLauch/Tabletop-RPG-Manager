import { useAbilites, useTick } from "@/utils/customHooks";
import axios from "axios";
import { useMemo, useState } from "react";
import { DnDSinglePageObjectEditor } from "../basic/DnDSinglePageObjectEditor";
import { Button, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import DnDListComponent from "../basic/DnDListComponent";

/**
 *
 * @param w margin for nav-Bar
 * @returns A List of All Abilities Sorted Alphabethycaly
 */
export default function DnDAbilitiesList({ setError }: { setError: any }) {
	const [createAbility, setCreateAbility] = useState(false);
	const [editAbility, setEditAbility] = useState(false);
	const [currentAbility, setCurrentAbility] = useState<any>({});
	const { tick, updateTick } = useTick();
	const abilities = useAbilites(tick);

	/**
	 * Sorts Abilities By Names
	 */
	const sortedAbilities = useMemo(() => {
		return abilities.sort((a: any, b: any) => {
			if (a.name.toLowerCase() < b.name.toLowerCase()) {
				return -1;
			}
			if (a.name.toLowerCase() > b.name.toLowerCase()) {
				return 1;
			}
			return 0;
		});
	}, [abilities]);

	/**
	 * Closes the Dialog
	 */
	const close = () => {
		setCreateAbility(false);
		setEditAbility(false);
	};

	/**
	 *
	 * Saves Data via API route to Database
	 * @param data Data from Edit data Form
	 */
	const createAbilityF = async (data: any) => {
		const res = await axios.post("/api/abilities/createAbility", {
			ability: data,
		});
		if (res.status != 200) {
			setError("Internal Server Error");
			return;
		}
		if (res.data.error) {
			setError(res.data.message);
			return;
		}
		close();
		updateTick();
	};

	/**
	 * Sends updatet Data to API route to save Abilites Changes
	 * @param data Data given by Form
	 */
	const saveAbilityF = async (data: any, oldName?: any) => {
		if (!data) {
			updateTick();
			close();
			return;
		}
		const res = await axios.post("/api/abilities/editAbility", {
			ability: data,
			oldName: oldName,
		});
		if (res.status != 200) {
			setError("Internal Server Error");
			return;
		}
		if (res.data.error) {
			setError(res.data.message);
			return;
		}
		close();
		updateTick();
	};

	if (createAbility) {
		return (
			<DnDSinglePageObjectEditor
				bodys={[
					{ key: "name", label: "Name", type: "string" },
					{
						key: "description",
						label: "Beschreibung",
						type: "string",
						multiline: true,
					},
				]}
				onCancel={close}
				onSave={(data) => {
					createAbilityF(data);
				}}
				title={"Erstelle Fähigkeit"}
			/>
		);
	}

	if (editAbility) {
		return (
			<DnDSinglePageObjectEditor
				oldData={currentAbility}
				bodys={[
					{ key: "name", label: "Name", type: "string" },
					{
						key: "description",
						label: "Beschreibung",
						type: "string",
						multiline: true,
					},
				]}
				onCancel={close}
				onSave={(data) => {
					saveAbilityF(data, currentAbility.name);
				}}
				title={
					<>
						{"Bearbeite Fähigkeit"}{" "}
						<IconButton
							onClick={async () => {
								await axios.post("/api/abilities/deleteAbility", {
									ability: currentAbility,
								});
								close();
								updateTick();
							}}
						>
							{" "}
							<Delete></Delete>
						</IconButton>
					</>
				}
			/>
		);
	}

	return (
		<div
			style={{
				width: "100%",
				display: "flex",
				overflowWrap: "break-word",
				justifyContent: "flex-start",
				flexWrap: "wrap",
			}}
		>
			<DnDListComponent
				searchfield
				additionalButtons={
					<IconButton
						onClick={() => {
							setCreateAbility(true);
						}}
					>
						<Add></Add>
					</IconButton>
				}
				nosort={false}
				bodys={[]}
				list={abilities}
				onClick={(item) => {
					setEditAbility(true);
					setCurrentAbility(item);
				}}
			/>
		</div>
	);
}
