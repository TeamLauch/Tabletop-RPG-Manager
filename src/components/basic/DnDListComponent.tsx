import Typography from "@mui/material/Typography";
import {
	Autocomplete,
	IconButton,
	Paper,
	Popover,
	TextField,
} from "@mui/material";
import { useState, useMemo } from "react";
import { getFieldData } from "@/utils/dataHelper";
import { Filter, FilterAlt, Search } from "@mui/icons-material";
import { DnDBasicPaper } from "./DnDStyledComponents";

/**
 *
 * @param list Array of Items
 * @param bodys Values of the DnDListComponent
 */
export default function DnDListComponent({
	list,
	onClick,
	bodys,
	searchfield = false,
	nosort = false,
	filter = false,
	additionalButtons,
}: {
	nosort: boolean;
	searchfield: boolean;
	list: any[];
	onClick: (item: any) => void;
	filter?: boolean;
	additionalButtons?: any;
	bodys: {
		name: string;
		location: string;
		filterable?: boolean;
		formatLabel?: (value: any) => string;
	}[];
}) {
	const [anchorElFilter, setAnchorElFilter] =
		useState<HTMLButtonElement | null>(null);

	const [searchQuery, setSearch] = useState<string>("");

	const [currentFiler, setCurrentFilter] = useState<
		{
			value: string[];
			location: string;
		}[]
	>([]);

	const filters: {
		name: string;
		location: string;
		values: string[];
		formatLabel?: (value: any) => string;
	}[] = useMemo(() => {
		let li = [];
		for (let b of bodys) {
			if (!b.filterable) {
				continue;
			}
			let val = [];
			for (let l of list) {
				let f = getFieldData(l, b.location);
				if (Array.isArray(f)) {
					for (let a of f) {
						if (!val.includes(a)) {
							val.push(a);
						}
					}
					continue;
				}
				if (!val.includes(f)) {
					val.push(f);
				}
			}
			val.sort((a, b) => {
				if (a < b) {
					return -1;
				}
				if (b < a) {
					return 1;
				}
				return 0;
			});
			li.push({
				values: val,
				location: b.location,
				name: b.name,
				formatLabel: b.formatLabel,
			});
		}
		if (li.length == 0) {
			return undefined;
		}

		return li;
	}, [bodys, list]);

	const getValuesOfCurrentFilterLocation = (location: string) => {
		for (let f of currentFiler) {
			if (f.location == location) {
				return f.value;
			}
		}
		return [];
	};

	const preparedList = useMemo(() => {
		if (!list) {
			return [];
		}
		if (!searchfield || !searchQuery) {
			if (!nosort) {
				return list
					.filter((item) => {
						if (filter && currentFiler.length > 0) {
							for (let fil of currentFiler) {
								if (fil.value.length == 0) {
									continue;
								}
								let f = getFieldData(item, fil.location);
								if (Array.isArray(f)) {
									for (let a of fil.value) {
										if (!f.includes(a)) {
											return false;
										}
									}
									continue;
								}
								if (f == undefined || !fil.value.includes(f)) {
									return false;
								}
							}
						}
						return true;
					})
					.sort((a, b) => {
						if (a.name.toLowerCase() < b.name.toLowerCase()) {
							return -1;
						}
						if (a.name.toLowerCase() > b.name.toLowerCase()) {
							return 1;
						}
						return 0;
					});
			}
			return list.filter((item) => {
				if (filter && currentFiler.length > 0) {
					for (let fil of currentFiler) {
						if (fil.value.length == 0) {
							continue;
						}
						let f = getFieldData(item, fil.location);
						if (Array.isArray(f)) {
							for (let a of fil.value) {
								if (!f.includes(a)) {
									return false;
								}
							}
							continue;
						}
						if (f == undefined || !fil.value.includes(f)) {
							return false;
						}
					}
				}
				return true;
			});
		}
		if (nosort) {
			return list.filter((item) => {
				if (!item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
					return false;
				}
				if (filter && currentFiler.length > 0) {
					for (let fil of currentFiler) {
						if (fil.value.length == 0) {
							continue;
						}
						let f = getFieldData(item, fil.location);
						if (Array.isArray(f)) {
							for (let a of fil.value) {
								if (!f.includes(a)) {
									return false;
								}
							}
							continue;
						}
						if (f == undefined || !fil.value.includes(f)) {
							return false;
						}
					}
				}
				return true;
			});
		}
		return list
			.filter((item) => {
				if (!item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
					return false;
				}
				if (filter && currentFiler.length > 0) {
					for (let fil of currentFiler) {
						if (fil.value.length == 0) {
							continue;
						}
						let f = getFieldData(item, fil.location);
						if (Array.isArray(f)) {
							for (let a of fil.value) {
								if (!f.includes(a)) {
									return false;
								}
							}
							continue;
						}
						if (f == undefined || !fil.value.includes(f)) {
							return false;
						}
					}
				}
				return true;
			})
			.sort((a, b) => {
				if (a.name.toLowerCase() < b.name.toLowerCase()) {
					return -1;
				}
				if (a.name.toLowerCase() > b.name.toLowerCase()) {
					return 1;
				}
				return 0;
			});
	}, [list, searchfield, nosort, searchQuery, currentFiler, filter]);

	return (
		<>
			{searchfield ? (
				<div
					style={{
						width: "100%",
						display: "flex",
						justifyContent: "center",
						marginTop: "10px",
					}}
				>
					<TextField
						value={searchQuery}
						size="small"
						sx={{ width: "30%", marginRight: "5px" }}
						label={
							<>
								<Search></Search>
							</>
						}
						onChange={(e) => {
							e.preventDefault();

							setSearch(e.target.value);
						}}
					></TextField>
					{filter ? (
						<IconButton
							sx={{
								marginRight: "5px",
							}}
							onClick={(e) => {
								setAnchorElFilter(e.currentTarget);
							}}
							disabled={filters == undefined}
						>
							<FilterAlt></FilterAlt>
						</IconButton>
					) : (
						<></>
					)}
					{filter ? (
						<Popover
							id={"Filter"}
							open={anchorElFilter != null}
							anchorEl={anchorElFilter}
							onClose={() => {
								setAnchorElFilter(null);
							}}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}
						>
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									flexWrap: "wrap",
									width: "20%",
									minWidth: "450px",
								}}
							>
								{filters.map((item) => {
									return (
										<Autocomplete
											multiple
											sx={{
												width: "200px",
												margin: "10px",
											}}
											key={item.name + "_filter"}
											options={item.values}
											value={getValuesOfCurrentFilterLocation(item.location)}
											getOptionLabel={(option) =>
												item.formatLabel
													? item.formatLabel(option) + ""
													: option + ""
											}
											onChange={(event, value: string[]) => {
												let newFilter = [];
												let flag = false;
												for (let f of currentFiler) {
													if (f.location == item.location) {
														flag = true;
														if (value.length == 0) {
															continue;
														}
														newFilter.push({
															value: value,
															location: item.location,
														});
														continue;
													}
													newFilter.push(f);
												}
												if (!flag && value.length != 0) {
													newFilter.push({
														value: value,
														location: item.location,
													});
												}
												setCurrentFilter(newFilter);
											}}
											renderInput={(params) => (
												<TextField
													{...params}
													variant="standard"
													label={item.name}
												/>
											)}
										/>
									);
								})}
							</div>
						</Popover>
					) : (
						<></>
					)}
					{additionalButtons ?? <></>}
				</div>
			) : (
				<></>
			)}
			<div
				style={{
					width: "100%",
					display: "grid",
					gridTemplateColumns: "1fr 1fr 1fr 1fr",
					gridGap: "5px",
					gridAutoRows: "1fr",
				}}
			>
				{preparedList.map((item, index) => {
					let b: any[] = [];
					for (let bo of bodys) {
						if (getFieldData(item, bo.location) === undefined) {
							continue;
						}
						b.push({
							name: bo.name,
							value: bo.formatLabel
								? bo.formatLabel(getFieldData(item, bo.location))
								: getFieldData(item, bo.location),
						});
					}
					return (
						<DnDListItemComponent
							onClick={() => {
								onClick(item);
							}}
							title={item.name}
							bodys={b}
							key={item.name + "card" + index}
						></DnDListItemComponent>
					);
				})}
			</div>
		</>
	);
}

/**
 *
 * @param title Title of the Item
 * @param onClick Handles Click
 * @param bodys Sub Texts
 * @returns DnDListitem
 */
function DnDListItemComponent({
	title,
	onClick,
	bodys,
}: {
	bodys: {
		name: string;
		value: string;
	}[];
	title: any;
	onClick: React.MouseEventHandler<HTMLDivElement>;
}) {
	return (
		<div
			onClick={onClick}
			style={{
				flexGrow: "1",
			}}
		>
			<DnDBasicPaper
				sx={{
					minWidth: "330px",
					maxWidth: "500px",
					height: "98%",
					margin: "5px",
					cursor: "pointer",
				}}
				elevation={3}
			>
				<div style={{ textAlign: "center" }}>
					<Typography variant="h4">{title}</Typography>
				</div>
				{bodys.map((item) => {
					if (Array.isArray(item.value)) {
						return (
							<Typography key={title + "_" + item.name} variant="body1">
								<b>{item.name}</b>{" "}
								{item.value.map((item, index) => {
									return (index != 0 ? ", " : "") + item;
								})}
							</Typography>
						);
					}
					return (
						<Typography key={title + "_" + item.name} variant="body1">
							<b>{item.name}</b> {item.value}
						</Typography>
					);
				})}
			</DnDBasicPaper>
		</div>
	);
}
