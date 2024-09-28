import { HTMLAttributes, MouseEventHandler, useMemo } from "react";

export default function DnDPointArray({
	colorOne,
	colorTwo,
	pointAmount,
	pointAmountSelected,
	onClick,
	style,
	width,
	pointsPerRow,
	label,
	pointRoundness,
}: {
	colorOne: string;
	colorTwo: string;
	pointAmount: number | string;
	pointAmountSelected?: number | string;
	onClick?: MouseEventHandler<HTMLDivElement>;
	style?: HTMLAttributes<HTMLDivElement>;
	width: string;
	pointsPerRow: number | string;
	label?: string;
	pointRoundness?: string;
}) {
	const convertToInt = (inp: string | number) => {
		if (typeof inp == "string") {
			return parseInt(inp);
		}
		return inp;
	};

	return (
		<div
			style={{
				display: "grid",
				width: width,
				borderRadius: "15px",
				borderStyle: "solid",
				borderColor: "black",
				borderWidth: "1px",
				gridTemplateColumns: "repeat(" + pointsPerRow + ", 1fr)",
				gridTemplateRows: "repeat(" + pointsPerRow + 1 + ", min-content)",
				...style,
				cursor: onClick ? "pointer" : "default",
			}}
			onClick={onClick}
		>
			{label ? (
				<div
					style={{
						gridColumn: "1 / -1",
						display: "flex",
						justifyContent: "center",
						marginBottom: "0px",
					}}
				>
					{label}
				</div>
			) : (
				<></>
			)}
			{[...Array(convertToInt(pointAmount))].map((item, index) => {
				return (
					<div
						key={"ball" + index}
						style={{ alignSelf: "start", alignContent: "start" }}
					>
						<div
							style={{
								width: "calc(100%-max(2%,5px)px)",
								height: "calc(100%-max(2%,5px)px)",
								aspectRatio: 1,
								margin: "max(1%,2.5px)",
								backgroundColor:
									convertToInt(pointAmountSelected) > index
										? colorOne
										: colorTwo,
								borderRadius: pointRoundness,
								borderStyle: "solid",
								borderColor: "black",
								borderWidth: "1px",
							}}
						></div>
					</div>
				);
			})}
		</div>
	);
}
