import { useEffect, useState } from "react";
import DnDModal from "../basic/DnDModal";
import DnDCharacterSheetPopupField from "./DnDCharacterSheetPopupField";
import {
	getFieldData,
	resolveToValue,
	updateField,
	updateFieldArray,
} from "@/utils/dataHelper";
import { Button } from "@mui/material";
import DnDPopUpMenu from "../basic/DnDPopupMenu";
import { values } from "pdf-lib";
import { FunctionToolkit } from "@/utils/types";
import { DEFAULT_FUNCTION_TOOLKIT } from "@/utils/constants";

export default function DnDCharacterSheetPopup({
	id,
	title,
	style,
	openAttributes,
	children,
	playerData,
	openPopup,
	constData,
	characterData,
	worldData,
	onClose,
	onSave,
	defaultData,
	savePlayer,
	saveLabel,
}: {
	id: string;
	title: string | ((popupData: any) => string);
	saveLabel?: string;
	style?: any;
	openAttributes: any;
	worldData: any;
	openPopup: (id: string, openAttributes: any) => void;
	playerData: any;
	constData: any;
	defaultData?: (
		playerData: any,
		characterData: any,
		openAttributes: any,
		toolkit: FunctionToolkit,
		constData: any
	) => any;
	characterData: any;
	children: {
		id: string;
		type: string;
		values: (
			popupData: any,
			playerData: any,
			characterData: any,
			toolkit: FunctionToolkit,
			constData: any
		) => any;
		onClick?: (
			popupData: any,
			openPopup: (id: string, openAttributes: any) => void,
			index?: number
		) => any;
		onChange?: (event: any, popupData: any, index?: number) => any;
		title?: string;
		style?: any;
	}[];
	onClose: () => void;

	onSave?: (
		popupData: any,
		playerData: any,
		characterData: any,
		toolkit: FunctionToolkit,
		constData: any
	) => any;
	savePlayer: (playerData: any) => void;
}) {
	const [popupData, setPopupData] = useState<any>({});
	useEffect(() => {
		if (id) {
			setPopupData(
				defaultData
					? defaultData(
							playerData,
							characterData,
							openAttributes,
							DEFAULT_FUNCTION_TOOLKIT,
							constData
						) ?? {}
					: {}
			);
		} else {
			setPopupData({});
		}
	}, [id, openAttributes]);
	if (!id) {
		return <></>;
	}
	return (
		<DnDPopUpMenu
			onClose={onClose}
			title={typeof title == "string" ? title : title(popupData)}
			sx={{}}
		>
			{children.map((item) => {
				return (
					<DnDCharacterSheetPopupField
						characterData={characterData}
						constData={constData}
						worldData={worldData}
						id={item.id}
						openPopup={openPopup}
						playerData={playerData}
						popupData={popupData}
						setPopupData={(data: any) => {
							setPopupData(data);
						}}
						type={item.type}
						values={
							item.values
								? item.values(
										popupData,
										playerData,
										characterData,
										DEFAULT_FUNCTION_TOOLKIT,
										constData
									)
								: undefined
						}
						key={item.id}
						onChange={item.onChange}
						onClick={item.onClick}
						style={item.style}
						title={item.title}
					></DnDCharacterSheetPopupField>
				);
			})}
			<br />
			{onSave ? (
				<Button
					sx={{
						margin: "1%",
						width: "98%",
						marginTop: "20px",
						marginBottom: "10px",
					}}
					onClick={() => {
						savePlayer(
							onSave(
								popupData,
								playerData,
								characterData,
								DEFAULT_FUNCTION_TOOLKIT,
								constData
							) ?? playerData
						);
						onClose();
					}}
					variant="outlined"
				>
					{saveLabel ?? "Speichern"}
				</Button>
			) : (
				<></>
			)}
		</DnDPopUpMenu>
	);
}
