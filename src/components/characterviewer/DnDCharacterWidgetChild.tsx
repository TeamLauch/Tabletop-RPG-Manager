import {
	getFieldData,
	resolveToValue,
	resolveToValueWithOverride,
	updateField,
	updateFieldArray,
} from "@/utils/dataHelper";
import { Button, Typography } from "@mui/material";
import DnDVerticalBar from "./DnDVerticalBar";
import DnDHorizontalBar from "./DnDHorizontalBar";
import DnDPointArray from "./DnDPointArray";
import DnDGameTextBox from "./DnDGameTextBox";
import { FunctionToolkit } from "@/utils/types";
import { DEFAULT_FUNCTION_TOOLKIT } from "@/utils/constants";

export default function DnDCharacterWidgetChild({
	type,
	id,
	style,
	onClick,
	title,
	values,
	playerData,
	openPopup,
	constData,
	characterData,
	savePlayer,
}: {
	id: string;
	type: string;
	values?: any;
	title?: string;
	onClick?: (
		playerData: any,
		characterData: any,
		toolkit: FunctionToolkit,
		openPopup: (id: string, openAttributes: any) => void,
		event?: any
	) => any;
	style?: any;
	openPopup: (id: string, openAttributes: any) => void;
	playerData: any;
	constData: any;
	characterData: any;
	savePlayer: any;
}) {
	switch (type.toLowerCase()) {
		case "array":
			return (
				<div style={style}>
					{Array.isArray(values) ? (
						values.map((item) => {
							if (!item) {
								return;
							}
							return (
								<DnDCharacterWidgetChild
									characterData={characterData}
									savePlayer={savePlayer}
									constData={constData}
									id={item.id}
									openPopup={openPopup}
									playerData={playerData}
									type={item.type}
									key={id + "_" + item.id}
									onClick={item.onClick}
									style={item.style}
									title={item.title}
									values={
										item.values
											? item.values(
													playerData,
													characterData,
													getFieldData,
													resolveToValue,
													constData
												)
											: undefined
									}
								></DnDCharacterWidgetChild>
							);
						})
					) : (
						<></>
					)}
				</div>
			);
		case "button":
			return (
				<Button
					sx={style}
					variant={values[0] ?? undefined}
					color={values[1] ?? undefined}
					size={values[2] ?? undefined}
					disabled={!onClick}
					onClick={
						onClick
							? (e) => {
									if (onClick) {
										let ret = onClick(
											playerData,
											characterData,
											DEFAULT_FUNCTION_TOOLKIT,
											openPopup,
											e
										);
										if (ret) {
											savePlayer(ret);
										}
									}
								}
							: undefined
					}
				>
					{title}
				</Button>
			);
		case "text":
			return (
				<div
					style={{ ...style }}
					onClick={
						onClick
							? (e) => {
									if (onClick) {
										let ret = onClick(
											playerData,
											characterData,
											DEFAULT_FUNCTION_TOOLKIT,
											openPopup,
											e
										);
										if (ret) {
											savePlayer(ret);
										}
									}
								}
							: undefined
					}
				>
					{title ? (
						<>
							<b>{title}</b>
							<br />{" "}
						</>
					) : (
						<></>
					)}
					<Typography variant="body1">{values}</Typography>
				</div>
			);
		case "hbar":
			return (
				<DnDHorizontalBar
					colorOne={values[0]}
					style={style}
					colorTwo={values[1]}
					currentValue={parseInt(values[2])}
					maxValue={parseInt(values[3])}
					onClick={
						onClick
							? (e) => {
									if (onClick) {
										let ret = onClick(
											playerData,
											characterData,
											DEFAULT_FUNCTION_TOOLKIT,
											openPopup,
											e
										);
										if (ret) {
											savePlayer(ret);
										}
									}
								}
							: undefined
					}
				></DnDHorizontalBar>
			);
		case "vbar":
			return (
				<DnDVerticalBar
					colorOne={values[0]}
					colorTwo={values[1]}
					style={style}
					currentValue={parseInt(values[2])}
					maxValue={parseInt(values[3])}
					onClick={
						onClick
							? (e) => {
									if (onClick) {
										let ret = onClick(
											playerData,
											characterData,
											DEFAULT_FUNCTION_TOOLKIT,
											openPopup,
											e
										);
										if (ret) {
											savePlayer(ret);
										}
									}
								}
							: undefined
					}
				></DnDVerticalBar>
			);
		case "gtext":
			return (
				<DnDGameTextBox
					backgroundColor={values[0]}
					text={title}
					style={style}
					onClick={
						onClick
							? (e) => {
									if (onClick) {
										let ret = onClick(
											playerData,
											characterData,
											DEFAULT_FUNCTION_TOOLKIT,
											openPopup,
											e
										);
										if (ret) {
											savePlayer(ret);
										}
									}
								}
							: undefined
					}
				></DnDGameTextBox>
			);
		case "widget":
			if (!values) {
				return <></>;
			}
			return (
				<DnDCharacterWidgetChild
					characterData={characterData}
					constData={constData}
					id={values.id}
					openPopup={openPopup}
					playerData={playerData}
					savePlayer={savePlayer}
					type={values.type}
					onClick={values.onClick}
					style={values.style}
					title={values.title}
					values={
						values.values
							? values.values(
									playerData,
									characterData,
									getFieldData,
									resolveToValue,
									constData
								)
							: undefined
					}
				></DnDCharacterWidgetChild>
			);
		case "pointarray":
			return (
				<DnDPointArray
					colorOne={values[0]}
					colorTwo={values[1]}
					pointAmount={values[2]}
					pointsPerRow={values[3]}
					width={values[4]}
					label={title}
					style={style}
					onClick={
						onClick
							? (e) => {
									if (onClick) {
										let ret = onClick(
											playerData,
											characterData,
											DEFAULT_FUNCTION_TOOLKIT,
											openPopup,
											e
										);
										if (ret) {
											savePlayer(ret);
										}
									}
								}
							: undefined
					}
					pointAmountSelected={values[5]}
					pointRoundness={values[6]}
				></DnDPointArray>
			);
		default:
			return <></>;
	}
}
