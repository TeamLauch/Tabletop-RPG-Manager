import { ATTRIBUTES } from "@/utils/constants";
import roleDice from "@/utils/roleDice";
import { Casino } from "@mui/icons-material";
import {
	Button,
	Grid,
	IconButton,
	Input,
	Paper,
	Slider,
	Tooltip,
	Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

/**
 *
 * @param onNext Handels Next Action
 * @param onBack Handels Back Action
 * @param def Default Value
 * @returns Attribute Sliders for all Attributes
 */
export function DnDAttributeSlider({
	onNext,
	onBack,
	def,
}: {
	def?: any;
	onNext: (selection: string[] | string) => void;
	onBack?: () => void;
}) {
	const minValue = 0;
	const maxValue = 20;

	const [data, setData] = useState<string[]>(def ?? []);

	/**
	 * Sets data to be the Default Value provided or if not provided all Values are 10.
	 */
	useEffect(() => {
		if (!def) {
			let list = [];
			for (const at of ATTRIBUTES) {
				list.push(at.shortName.toLowerCase() + ":" + 10);
			}
			setData(list);
			return;
		}
		setData(def);
	}, [def]);

	/**
	 * If Value is out of Bounds(minValue, maxValue) is set to min or max
	 *
	 * @param attribute Updated Attribute
	 */
	const handleBlur = (attribute: string) => {
		let value = getValueOfAttribute(attribute.toLowerCase());
		if (value < minValue) {
			setValueOfAttribute(minValue + "", attribute.toLowerCase());
		} else if (value > maxValue) {
			setValueOfAttribute(maxValue + "", attribute.toLowerCase());
		}
	};

	/**
	 * @returns Value of the given Attribute
	 */
	const getValueOfAttribute = useCallback(
		(attribue: string) => {
			for (let item of data) {
				if (item.startsWith(attribue.toLowerCase())) {
					return Number.parseInt(item.split(":")[1]);
				}
			}
			return 0;
		},
		[data]
	);

	/**
	 *
	 * @param newValue new Value
	 * @param attribue Name of the Attribute
	 */
	const setValueOfAttribute = (newValue: string, attribue: string) => {
		let newArray = [];
		for (let item of data) {
			if (item.startsWith(attribue.toLowerCase())) {
				newArray.push(attribue.toLowerCase() + ":" + newValue);
				continue;
			}
			newArray.push(item);
		}
		setData(newArray);
	};

	/**
	 * Returns the Sum of all Attribut Values
	 */
	const sum = useMemo(() => {
		let sum = 0;
		for (let item of data) {
			sum += Number.parseInt(item.split(":")[1]);
		}
		return sum;
	}, [data]);

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
			}}
		>
			<Paper
				elevation={3}
				sx={{
					padding: 4,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					width: "100%",
					maxWidth: 400,
				}}
			>
				<Typography component="h1" variant="h5">
					Attribute
					<Tooltip title="Zufällige Werte">
						<IconButton
							onClick={() => {
								let rolls = ATTRIBUTES.map((item) => {
									let sum = 0;
									let min = 6;
									for (let i = 0; i < 4; i++) {
										let roll = roleDice(1, 6, 1);
										min = Math.min(roll, min);
										sum += roll;
									}
									sum -= min;
									return item.shortName.toLowerCase() + ":" + sum;
								});

								setData(rolls);
							}}
						>
							<Casino></Casino>
						</IconButton>
					</Tooltip>
				</Typography>
				{/* TODO Fix <Typography component="h1" variant="h6">
					{sum < 30
						? "Willst du etwa Sterben?"
						: sum < 50
							? "Sehr schwach"
							: sum < 64
								? "Schwach"
								: sum < 75
									? "Normal"
									: sum < 95
										? "Stark"
										: sum < 105
											? "Sehr Stark"
											: "OP"}
				</Typography> */}
				{ATTRIBUTES.map((item) => {
					return (
						<div key={item.name + "slider"} style={{ width: "100%" }}>
							<Typography gutterBottom>{item.name}</Typography>
							<Grid container spacing={2} alignItems="center">
								<Grid item xs>
									<Slider
										value={
											typeof getValueOfAttribute(item.shortName) === "number"
												? getValueOfAttribute(item.shortName)
												: 0
										}
										onChange={(event: Event, newValue: any) => {
											setValueOfAttribute(newValue + "", item.shortName);
										}}
										aria-labelledby="input-slider"
										max={maxValue}
										min={minValue}
									/>
								</Grid>
								<Grid item>
									<Input
										value={getValueOfAttribute(item.shortName)}
										size="small"
										onChange={(e) => {
											setValueOfAttribute(e.target.value, item.shortName);
										}}
										onBlur={() => {
											handleBlur(item.shortName);
										}}
										inputProps={{
											step: 1,
											min: minValue,
											max: maxValue,
											type: "number",
											"aria-labelledby": "input-slider",
										}}
									/>
								</Grid>
								<Grid item>
									<Typography>
										{Math.floor((getValueOfAttribute(item.shortName) - 10) / 2)}
									</Typography>
								</Grid>
							</Grid>
						</div>
					);
				})}

				<div
					style={{
						display: "flex",
						justifyContent: "space-around",
						width: "80%",
						margin: 5,
					}}
				>
					<Button
						variant="contained"
						onClick={() => {
							onBack ? onBack() : () => {};
						}}
						disabled={onBack == null}
					>
						Back
					</Button>
					<Button
						variant="contained"
						onClick={() => {
							onNext(data);
						}}
					>
						Next
					</Button>
				</div>
			</Paper>
		</div>
	);
}
