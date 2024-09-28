/* eslint-disable @next/next/no-img-element */
import { MouseEventHandler } from "react";
/**
 *
 * @param width Width of the GameBox
 * @param onClick Handles on Click
 * @param text Text of the TextBox
 * @param backgroundColor BackgroundColor of the Click
 * @returns
 */
export default function DnDGameTextBox({
	onClick,
	text,
	backgroundColor,
	style,
	children,
}: {
	text: string;
	backgroundColor: any;
	onClick?: MouseEventHandler<HTMLDivElement>;
	style?: any;
	children?: any;
}) {
	return (
		<div
			onClick={onClick}
			style={{
				marginBottom: "5px",
				border: "1px solid black",
				borderRadius: "4px",
				minHeight: "25px",
				textAlign: "justify",
				backgroundColor: backgroundColor,
				fontSize: "15pt",
				cursor: onClick ? "pointer" : "default",
				...style,
			}}
		>
			{typeof text != "string" ? "" + JSON.stringify(text) : text}
			{children ?? <></>}
		</div>
	);
}
