import { useItems, useTick } from "@/utils/customHooks";
import { Button, IconButton } from "@mui/material";
import { useMemo, useState } from "react";
import { saveItem } from "@/utils/items";
import { DnDSinglePageObjectEditor } from "../basic/DnDSinglePageObjectEditor";
import DnDListComponent from "../basic/DnDListComponent";
import DnDEditItemCP from "./DnDEditItemCP";
import { Add } from "@mui/icons-material";

export default function DnDItemCP({
	setError,
}: {
	setError: (string: any) => void;
}) {
	const { tick, updateTick } = useTick();
	const items = useItems(tick);
	const [editId, setEditId] = useState("-1");

	const currentItem = useMemo(() => {
		if (editId != "-1" && editId != "-2") {
			for (let item of items) {
				if (item.id == editId) {
					return item;
				}
			}
		}
		return undefined;
	}, [items, editId]);

	if (editId == "-2") {
		return (
			<DnDEditItemCP
				item={undefined}
				onExit={() => {
					setEditId("-1");
					updateTick();
				}}
				onSave={async (data) => {
					await saveItem(data);
					updateTick();
					setEditId("-1");
				}}
			/>
		);
	}

	if (editId != "-1" && currentItem) {
		return (
			<DnDEditItemCP
				item={currentItem}
				onExit={() => {
					setEditId("-1");
					updateTick();
				}}
				onSave={async (data) => {
					setEditId("-1");
					await saveItem(data);
					updateTick();
				}}
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
				nosort={false}
				filter
				list={items ?? []}
				additionalButtons={
					<IconButton
						onClick={() => {
							setEditId("-2");
						}}
					>
						<Add></Add>
					</IconButton>
				}
				bodys={[
					{
						name: "Typ",
						location: "type",
						filterable: true,
						formatLabel(value) {
							if (value == "item") {
								return "Item";
							}
							if (value == "weapon") {
								return "Waffe";
							}
							return "Sonstiges";
						},
					},
					{ name: "Waffentyp", location: "data.weapon.weaponType" },
					{ name: "Wert", location: "data.value" },
					{
						name: "Item Gruppe",
						location: "data.group",
						filterable: true,
					},
				]}
				onClick={(item) => {
					setEditId(item.id);
				}}
			></DnDListComponent>
		</div>
	);
}
