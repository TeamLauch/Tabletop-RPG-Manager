/* eslint-disable @next/next/no-img-element */
import { CSSProperties, HTMLAttributes, MouseEventHandler } from "react";
import DnDMoneyIcon from "../DnDMoneyIcon";
import { DnDBasicSheetWidgetContainer } from "../DnDCharacterSheetCP";
/**
 *
 * @param pm Amount of Platin Coins
 * @param gm Amount of Gold Coins
 * @param sm Amount of Silber Coins
 * @param km Amount of Copper Coins
 * @param onClick on Click Event
 * @returns
 */
export default function DnDMoneyBar({
	pm,
	gm,
	sm,
	km,
	onClick,
	style,
}: {
	pm: number;
	gm: number;
	sm: number;
	km: number;
	onClick?: MouseEventHandler<HTMLDivElement>;
	style: CSSProperties;
}) {
	return (
		<DnDBasicSheetWidgetContainer
			style={{
				...style,
				height: "130px",
				display: "flex",
				flexDirection: "column",
				alignContent: "center",
				justifyContent: "center",
				cursor: onClick ? "pointer" : "default",
			}}
		>
			<div
				style={{ textAlign: "center", fontSize: "25px", marginBottom: "4px" }}
			>
				Münzen
			</div>
			<div
				style={{
					height: "100px",
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
				}}
			>
				<DnDMoneyIcon
					amount={pm}
					label="PM"
					color="#E7FEFF"
					onClick={onClick}
				></DnDMoneyIcon>
				<DnDMoneyIcon
					amount={gm}
					label="GM"
					color="#FFE381"
					onClick={onClick}
				></DnDMoneyIcon>
				<DnDMoneyIcon
					amount={sm}
					label="SM"
					color="#F4F4F4"
					onClick={onClick}
				></DnDMoneyIcon>
				<DnDMoneyIcon
					amount={km}
					label="KM"
					color="#FFC887"
					onClick={onClick}
				></DnDMoneyIcon>
			</div>
		</DnDBasicSheetWidgetContainer>
	);
}
