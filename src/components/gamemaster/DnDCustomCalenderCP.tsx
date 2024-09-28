import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { Grid, IconButton, Typography } from "@mui/material";
import { CSSProperties, useMemo } from "react";

export default function DnDCustomCalenderCP({
	selectedDate,
	currentDate,
	world,
	title,
	onMoveLeft,
	onMoveRight,
	setCustomContext,
	onClick,
	onStyle = () => ({}),
}: {
	selectedDate: { day: number; month: number; year: number };
	currentDate: { day: number; month: number; year: number };
	world: any;
	title: any;
	onMoveLeft?: () => void;
	onMoveRight?: () => void;
	setCustomContext: any;
	onClick?: (date: number) => void;
	onStyle?: (day: number) => CSSProperties;
}) {
	const offset = useMemo(() => {
		if (!world) {
			return 0;
		}
		let daysPerYear = 0;
		for (let m of world.month) {
			daysPerYear += parseInt(m.days);
		}
		let d = (selectedDate.year ?? 0) * daysPerYear;
		for (let i = 1; i < (selectedDate.month ?? 1); i++) {
			d += parseInt(world.month[i - 1].days);
		}

		return d % world.days.length;
	}, [world, selectedDate]);
	if (
		Math.ceil(
			(world.month[selectedDate.month - 1].days + offset) / world.days.length
		) == Infinity ||
		Math.ceil(
			(world.month[selectedDate.month - 1].days + offset) / world.days.length
		) <= 0
			? 1
			: Math.ceil(
					(world.month[selectedDate.month - 1].days + offset) /
						world.days.length
				) < 0
	) {
		return <></>;
	}

	return (
		<div
			style={{
				display: "grid",
				gridAutoColumns: "1fr",
				gridAutoRows: "min-content",
				border: "1px solid black",
				gridGap: "5px",
				borderRadius: "5px",
				backgroundColor: "#F5F5F5",
				padding: "5px",
			}}
		>
			<div
				style={{
					gridColumn: "1 / span " + world.days.length,
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-around",
				}}
			>
				<IconButton onClick={onMoveLeft}>
					<ArrowLeft></ArrowLeft>
				</IconButton>
				<Typography variant="h4">{title}</Typography>
				<IconButton onClick={onMoveRight}>
					<ArrowRight></ArrowRight>
				</IconButton>
			</div>
			{world.days.map((item) => {
				return (
					<div
						key={item}
						style={{
							border: "1px solid black",
							borderRadius: "5px",
							textAlign: "center",
						}}
					>
						<Typography variant="h5" sx={{ textAlign: "center" }}>
							<b>{item}</b>
						</Typography>
					</div>
				);
			})}
			{[
				...Array(
					Math.ceil(
						(world.month[selectedDate.month - 1].days + offset) /
							world.days.length
					) == Infinity ||
						Math.ceil(
							(world.month[selectedDate.month - 1].days + offset) /
								world.days.length
						) <= 0
						? 1
						: Math.ceil(
								(world.month[selectedDate.month - 1].days + offset) /
									world.days.length
							)
				),
			].map((item, index) => {
				return (
					<>
						{world.days.map((item, i) => {
							if (
								offset >= world.days.length * index + (i + 1) ||
								world.month[selectedDate.month - 1].days <
									world.days.length * index + (i + 1) - offset
							) {
								return (
									<div
										key={
											item + "" + (world.days.length * index + (i + 1) - offset)
										}
									></div>
								);
							}
							return (
								<div
									key={
										item + "" + (world.days.length * index + (i + 1) - offset)
									}
									onClick={() => {
										onClick(world.days.length * index + (i + 1) - offset);
									}}
									onContextMenu={
										setCustomContext
											? (e) => {
													e.preventDefault();
													setCustomContext({
														posX: e.pageX,
														posY: e.pageY,
														target:
															world.days.length * index + (i + 1) - offset,
													});
													e.stopPropagation();
												}
											: undefined
									}
									style={{
										border: "1px solid black",
										borderRadius: "5px",
										aspectRatio: "4/2",
										backgroundColor:
											selectedDate.month == currentDate.month &&
											selectedDate.year == currentDate.year &&
											world.days.length * index + (i + 1) - offset ==
												currentDate.day
												? "#FADADA"
												: "#F5F5F5",
										...onStyle(world.days.length * index + (i + 1) - offset),
									}}
								>
									<Typography variant="h5" sx={{ textAlign: "center" }}>
										{world.days.length * index + (i + 1) - offset}.
										{selectedDate.month}.{selectedDate.year}
									</Typography>
								</div>
							);
						})}
					</>
				);
			})}
		</div>
	);
}
