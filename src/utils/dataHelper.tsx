import { ATTRIBUTES } from "./constants";
import { decodeAndRunDiceString } from "./roleDice";

/**
 * @deprecated
 * @param character
 * @param level
 * @returns
 */
export default function onLevelUp(character: any, level: number) {
	if (
		!character ||
		!character["levelUp"] ||
		!character["levelUp"]["" + level]
	) {
		return character;
	}

	let data = character["data"];
	let levelUp = character["levelUp"]["" + level];
	if (!data) {
		data = { spells: [], abilities: [] };
	}
	for (let s of levelUp["spells"]) {
		data["spells"].push(s);
	}

	for (let a of levelUp["abilities"]) {
		data["abilities"].push(a);
	}

	let onLevelUp = levelUp["onLevelUp"];
	if (!onLevelUp) {
		character["data"] = data;
		return character;
	}

	for (let f of onLevelUp["fieldData"]) {
		const loc = f["location"];
		const val = f["value"];
		character = updateField(character, loc, val);
	}

	return character;
}

/**
 *
 * Location explained:
 *  data = {
 *        hello: {
 *              world: "hi"
 *          }
 * }
 *
 * value of location hello.world is "hi"
 *
 * @param data JSON Data
 * @param location Location to Search for in the Data
 * @returns Value of the Location or undefined
 */
export function getFieldData(
	data: any,
	location: string,
	resolveValue?: boolean,
	resolveData?: any
) {
	let s = location.split(".");
	if (!data) {
		return undefined;
	}
	let currentDataDepth = data;
	for (let d of s) {
		if (currentDataDepth[d] === undefined || currentDataDepth[d] === null) {
			return undefined;
		}
		currentDataDepth = currentDataDepth[d];
	}
	if (!currentDataDepth) {
		return undefined;
	}
	if (resolveValue) {
		currentDataDepth = resolveToValue(resolveData ?? data, currentDataDepth);
	}
	return currentDataDepth;
}

/**
 * @todo UPDATE FOR Multiply and Division
 * @param s string to perform Math
 * @returns The Computed Math
 */
export function evaluateMath(s: any) {
	s = s.replace("+-", "-").replace("-+", "-");
	var total = 0,
		s = s.match(/[+\-]*(\.\d+|\d+(\.\d+)?)/g) || [];

	while (s.length) {
		total += parseFloat(s.shift());
	}
	return total;
}

/**
 * @deprecated
 * @param s
 * @param data
 * @returns
 */
export function decodeCodeString(s: string, data: any) {
	if (s.toLocaleLowerCase().startsWith("field:")) {
		s = s.substring("field:".length);
		return getFieldData(data, s);
	} else if (s.toLocaleLowerCase().startsWith("database:")) {
		s = s.substring("database:".length);
		let split = s.split(".");
		s = s.substring(split[0].length + 1);
		data = {};
		switch (split[0].toLocaleLowerCase()) {
			case "abilities":
				data = {};
				break;
			case "spells":
				data = {};
				break;
			case "class":
				data = {};
				break;
			case "race":
				data = {};
				break;
			case "item":
				data = {};
				break;
			case "damagetype":
				data = {};
				break;
			default:
				return null;
		}
	}
}

export function performItemCommands(
	playerData: any,
	characterData: any,
	commands: { location: string; command: string; array?: boolean }[]
) {
	for (let command of commands) {
		if (!command) {
			continue;
		}
		if (command.array) {
			playerData = updateFieldArray(
				playerData,
				command.location,
				[command.command],
				false,
				false
			);
			continue;
		}

		const characterRegex = /cha:\[([^\[\]]*)\]/;
		const attRegex = /att:\[([^\[\]]*)\]/;
		while (
			characterRegex.test(command.command) ||
			attRegex.test(command.command)
		) {
			if (attRegex.test(command.command)) {
				command.command = command.command.replace(attRegex, (_, expr) => {
					for (let a of ATTRIBUTES) {
						if (
							expr.toLowerCase() == a.shortName.toLowerCase() ||
							expr.toLowerCase() == a.name.toLowerCase()
						) {
							return (
								Math.floor(
									(Number.parseInt(
										getFieldData(
											playerData,
											"override.attributes." + a.shortName.toLowerCase()
										) ??
											getFieldData(
												characterData,
												"attributes." + a.shortName.toLowerCase()
											) ??
											"0"
									) -
										10) /
										2
								) + ""
							);
						}
					}
					return "0";
				});
				continue;
			}
			command.command = command.command.replace(characterRegex, (_, expr) => {
				return (
					getFieldData(playerData, "override." + expr) ??
					getFieldData(characterData, expr)
				);
			});
		}
		playerData = updateField(
			playerData,
			command.location,
			command.command,
			false
		);
	}
	return playerData;
}

/**
 *
 * @param data JSON data
 * @param valueString Text to Resolve the Codes
 * @returns Returns a Resolved Text with all Keys replaced with Content
 */
export function resolveToValue(data: any, valueString: string) {
	if (!valueString) {
		return valueString;
	}
	if (
		typeof valueString == "string" &&
		valueString.trim &&
		valueString.trim() == "undef:[]"
	) {
		return undefined;
	}
	const refRegex = /ref:\[([^\[\]]*)\]/;
	const mathRegex = /math:\[([^\[\]]*)\]/;
	const intRegex = /int:\[([^\[\]]*)\]/;
	const attribRegex = /attrib:\[([^\[\]]*)\]/;
	const wurfRegex = /wurf:\[([^\[\]]*)\]/;
	const floatRegex = /float:\[([^\[\]]*)\]/;
	const jsonRegex = /json:\[([^\[\]]*)\]/;
	const pointlistRegex = /pointlist:\[([^\[\]]*)\]/;
	const minRegex = /min:\[([^\[\]]*)\]/;
	const maxRegex = /max:\[([^\[\]]*)\]/;
	const attRegex = /att:\[([^\[\]]*)\]/;
	const divRegex = /div:\[([^\[\]]*)\]/;
	const multRegex = /mult:\[([^\[\]]*)\]/;
	const ifRegex = /if:\[([^\[\]]*)\]/;
	const floorRegex = /floor:\[([^\[\]]*)\]/;
	const ceilRegex = /ceil:\[([^\[\]]*)\]/;

	while (
		floorRegex.test(valueString) ||
		ceilRegex.test(valueString) ||
		divRegex.test(valueString) ||
		multRegex.test(valueString) ||
		ifRegex.test(valueString) ||
		refRegex.test(valueString) ||
		mathRegex.test(valueString) ||
		intRegex.test(valueString) ||
		attribRegex.test(valueString) ||
		wurfRegex.test(valueString) ||
		floatRegex.test(valueString) ||
		jsonRegex.test(valueString) ||
		pointlistRegex.test(valueString) ||
		minRegex.test(valueString) ||
		maxRegex.test(valueString) ||
		attRegex.test(valueString)
	) {
		if (refRegex.test(valueString)) {
			valueString = valueString.replace(refRegex, (_, expr) => {
				let val = getFieldData(data, expr);
				if (Array.isArray(val)) {
					return val.join(",");
				}
				return val;
			});
			continue;
		}
		if (divRegex.test(valueString)) {
			valueString = valueString.replace(divRegex, (_, expr) => {
				let s = expr.split(",");
				if (s.length != 2) {
					return "NaN";
				}
				return parseFloat(s[0]) / parseFloat(s[1]) + "";
			});
			continue;
		}
		if (floorRegex.test(valueString)) {
			valueString = valueString.replace(floorRegex, (_, expr) => {
				return Math.floor(parseFloat(expr)) + "";
			});
			continue;
		}
		if (ceilRegex.test(valueString)) {
			valueString = valueString.replace(ceilRegex, (_, expr) => {
				return Math.ceil(parseFloat(expr)) + "";
			});
			continue;
		}
		if (multRegex.test(valueString)) {
			valueString = valueString.replace(multRegex, (_, expr) => {
				let s = expr.split(",");
				let s1 = 1;
				for (let s2 of s) {
					s1 *= parseFloat(s2);
				}
				return s1 + "";
			});
			continue;
		}
		if (ifRegex.test(valueString)) {
			valueString = valueString.replace(ifRegex, (_, expr) => {
				let s = expr.split(",");
				if (s.length < 3) {
					return "";
				}
				let con = s[0];
				let then = s[1];
				let el = s[2];
				if (con.toLowerCase() == "true" || con == "1") {
					return then;
				}
				if (con.includes("==")) {
					let sides = con.split("==");
					if (sides[0].trim() == sides[1].trim()) {
						return then;
					}
				}

				if (con.includes("!=")) {
					let sides = con.split("!=");
					if (sides[0].trim() != sides[1].trim()) {
						return then;
					}
				}
				if (con.includes(">=")) {
					let sides = con.split(">=");
					if (parseInt(sides[0].trim()) >= parseInt(sides[1].trim())) {
						return then;
					}
				}
				if (con.includes("<=")) {
					let sides = con.split("<=");
					if (parseInt(sides[0].trim()) <= parseInt(sides[1].trim())) {
						return then;
					}
				}
				if (con.includes(">")) {
					let sides = con.split(">");
					if (parseInt(sides[0].trim()) > parseInt(sides[1].trim())) {
						return then;
					}
				}
				if (con.includes("<")) {
					let sides = con.split("<");
					if (parseInt(sides[0].trim()) < parseInt(sides[1].trim())) {
						return then;
					}
				}
				return el;
			});
			continue;
		}
		if (mathRegex.test(valueString)) {
			valueString = valueString.replace(mathRegex, (_, expr) =>
				evaluateMath(expr).toString()
			);
			continue;
		}
		if (attribRegex.test(valueString)) {
			valueString = valueString.replace(attribRegex, (_, expr) =>
				Math.floor((Number.parseInt(expr) - 10) / 2).toString()
			);
			continue;
		}
		if (intRegex.test(valueString)) {
			valueString = valueString.replace(intRegex, (_, expr) =>
				Number.parseInt(expr).toString()
			);
			continue;
		}
		if (wurfRegex.test(valueString)) {
			valueString = valueString.replace(wurfRegex, (_, expr) =>
				decodeAndRunDiceString(expr).toString()
			);
			continue;
		}
		if (floatRegex.test(valueString)) {
			valueString = valueString.replace(floatRegex, (_, expr) =>
				Number.parseFloat(expr).toString()
			);
			continue;
		}
		if (pointlistRegex.test(valueString)) {
			valueString = valueString.replace(pointlistRegex, (_, expr) => {
				if (!expr) {
					return "";
				}
				let s = expr.split(",");
				let ret = "";
				for (let s1 of s) {
					ret += "- " + s1 + "\n";
				}
				return ret;
			});
			continue;
		}
		if (minRegex.test(valueString)) {
			valueString = valueString.replace(minRegex, (_, expr) => {
				let s = expr.split(",");
				return (
					Math.min(
						...s.map((item) => {
							return Number.parseInt(item) ?? 100000000000;
						})
					) + ""
				);
			});
			continue;
		}
		if (maxRegex.test(valueString)) {
			valueString = valueString.replace(maxRegex, (_, expr) => {
				let s = expr.split(",");
				return (
					Math.max(
						...s.map((item) => {
							return Number.parseInt(item) ?? -100000000000;
						})
					) + ""
				);
			});
			continue;
		}
		if (attRegex.test(valueString)) {
			valueString = valueString.replace(attRegex, (_, expr) => {
				for (let a of ATTRIBUTES) {
					if (
						expr.toLowerCase() == a.shortName.toLowerCase() ||
						expr.toLowerCase() == a.name.toLowerCase()
					) {
						return (
							Math.floor(
								(Number.parseInt(
									getFieldData(
										data,
										"attributes." + a.shortName.toLowerCase()
									) ?? "0"
								) -
									10) /
									2
							) + ""
						);
					}
				}
				return "0";
			});
			continue;
		}
		if (jsonRegex.test(valueString)) {
			valueString = valueString.replace(jsonRegex, (_, expr) =>
				JSON.parse(expr)
			);
			continue;
		}
	}

	return valueString;
}

/**
 *
 * @param data JSON data
 * @param valueString Text to Resolve the Codes
 * @returns Returns a Resolved Text with all Keys replaced with Content
 */
export function resolveToValueWithOverride(
	player: any,
	character: any,
	valueString: string
) {
	if (!valueString) {
		return valueString;
	}
	if (
		typeof valueString == "string" &&
		valueString.trim &&
		valueString.trim() == "undef:[]"
	) {
		return undefined;
	}
	const refRegex = /ref:\[([^\[\]]*)\]/;
	const mathRegex = /math:\[([^\[\]]*)\]/;
	const intRegex = /int:\[([^\[\]]*)\]/;
	const attribRegex = /attrib:\[([^\[\]]*)\]/;
	const wurfRegex = /wurf:\[([^\[\]]*)\]/;
	const floatRegex = /float:\[([^\[\]]*)\]/;
	const jsonRegex = /json:\[([^\[\]]*)\]/;
	const pointlistRegex = /pointlist:\[([^\[\]]*)\]/;
	const minRegex = /min:\[([^\[\]]*)\]/;
	const maxRegex = /max:\[([^\[\]]*)\]/;
	const attRegex = /att:\[([^\[\]]*)\]/;
	const divRegex = /div:\[([^\[\]]*)\]/;
	const multRegex = /mult:\[([^\[\]]*)\]/;
	const ifRegex = /if:\[([^\[\]]*)\]/;
	const floorRegex = /floor:\[([^\[\]]*)\]/;
	const ceilRegex = /ceil:\[([^\[\]]*)\]/;

	while (
		floorRegex.test(valueString) ||
		ceilRegex.test(valueString) ||
		divRegex.test(valueString) ||
		multRegex.test(valueString) ||
		ifRegex.test(valueString) ||
		refRegex.test(valueString) ||
		mathRegex.test(valueString) ||
		intRegex.test(valueString) ||
		attribRegex.test(valueString) ||
		wurfRegex.test(valueString) ||
		floatRegex.test(valueString) ||
		jsonRegex.test(valueString) ||
		pointlistRegex.test(valueString) ||
		minRegex.test(valueString) ||
		maxRegex.test(valueString) ||
		attRegex.test(valueString)
	) {
		if (refRegex.test(valueString)) {
			valueString = valueString.replace(refRegex, (_, expr) => {
				let val = getFieldData(player, "override." + expr);
				if (!val) {
					val = getFieldData(character, expr);
				}
				if (Array.isArray(val)) {
					return val.join(",");
				}
				return val;
			});
			continue;
		}
		if (divRegex.test(valueString)) {
			valueString = valueString.replace(divRegex, (_, expr) => {
				let s = expr.split(",");
				if (s.length != 2) {
					return "NaN";
				}
				return parseFloat(s[0]) / parseFloat(s[1]) + "";
			});
			continue;
		}
		if (floorRegex.test(valueString)) {
			valueString = valueString.replace(floorRegex, (_, expr) => {
				return Math.floor(parseFloat(expr)) + "";
			});
			continue;
		}
		if (ceilRegex.test(valueString)) {
			valueString = valueString.replace(ceilRegex, (_, expr) => {
				return Math.ceil(parseFloat(expr)) + "";
			});
			continue;
		}
		if (multRegex.test(valueString)) {
			valueString = valueString.replace(multRegex, (_, expr) => {
				let s = expr.split(",");
				let s1 = 1;
				for (let s2 of s) {
					s1 *= parseFloat(s2);
				}
				return s1 + "";
			});
			continue;
		}
		if (ifRegex.test(valueString)) {
			valueString = valueString.replace(ifRegex, (_, expr) => {
				let s = expr.split(",");
				if (s.length < 3) {
					return "";
				}
				let con = s[0];
				let then = s[1];
				let el = s[2];
				if (con.toLowerCase() == "true" || con == "1") {
					return then;
				}
				if (con.includes("==")) {
					let sides = con.split("==");
					if (sides[0].trim() == sides[1].trim()) {
						return then;
					}
				}

				if (con.includes("!=")) {
					let sides = con.split("!=");
					if (sides[0].trim() != sides[1].trim()) {
						return then;
					}
				}
				if (con.includes(">=")) {
					let sides = con.split(">=");
					if (parseInt(sides[0].trim()) >= parseInt(sides[1].trim())) {
						return then;
					}
				}
				if (con.includes("<=")) {
					let sides = con.split("<=");
					if (parseInt(sides[0].trim()) <= parseInt(sides[1].trim())) {
						return then;
					}
				}
				if (con.includes(">")) {
					let sides = con.split(">");
					if (parseInt(sides[0].trim()) > parseInt(sides[1].trim())) {
						return then;
					}
				}
				if (con.includes("<")) {
					let sides = con.split("<");
					if (parseInt(sides[0].trim()) < parseInt(sides[1].trim())) {
						return then;
					}
				}
				return el;
			});
			continue;
		}
		if (mathRegex.test(valueString)) {
			valueString = valueString.replace(mathRegex, (_, expr) =>
				evaluateMath(expr).toString()
			);
			continue;
		}
		if (attribRegex.test(valueString)) {
			valueString = valueString.replace(attribRegex, (_, expr) =>
				Math.floor((Number.parseInt(expr) - 10) / 2).toString()
			);
			continue;
		}
		if (intRegex.test(valueString)) {
			valueString = valueString.replace(intRegex, (_, expr) =>
				Number.parseInt(expr).toString()
			);
			continue;
		}
		if (wurfRegex.test(valueString)) {
			valueString = valueString.replace(wurfRegex, (_, expr) =>
				decodeAndRunDiceString(expr).toString()
			);
			continue;
		}
		if (floatRegex.test(valueString)) {
			valueString = valueString.replace(floatRegex, (_, expr) =>
				Number.parseFloat(expr).toString()
			);
			continue;
		}
		if (pointlistRegex.test(valueString)) {
			valueString = valueString.replace(pointlistRegex, (_, expr) => {
				if (!expr) {
					return "";
				}
				let s = expr.split(",");
				let ret = "";
				for (let s1 of s) {
					ret += "- " + s1 + "\n";
				}
				return ret;
			});
			continue;
		}
		if (minRegex.test(valueString)) {
			valueString = valueString.replace(minRegex, (_, expr) => {
				let s = expr.split(",");
				return (
					Math.min(
						...s.map((item) => {
							return Number.parseInt(item) ?? 100000000000;
						})
					) + ""
				);
			});
			continue;
		}
		if (maxRegex.test(valueString)) {
			valueString = valueString.replace(maxRegex, (_, expr) => {
				let s = expr.split(",");
				return (
					Math.max(
						...s.map((item) => {
							return Number.parseInt(item) ?? -100000000000;
						})
					) + ""
				);
			});
			continue;
		}
		if (attRegex.test(valueString)) {
			valueString = valueString.replace(attRegex, (_, expr) => {
				for (let a of ATTRIBUTES) {
					if (
						expr.toLowerCase() == a.shortName.toLowerCase() ||
						expr.toLowerCase() == a.name.toLowerCase()
					) {
						return (
							Math.floor(
								(Number.parseInt(
									getFieldData(
										player,
										"transformData.attributes." + a.shortName.toLowerCase()
									) ??
										getFieldData(
											player,
											"override.attributes." + a.shortName.toLowerCase()
										) ??
										getFieldData(
											character,
											"attributes." + a.shortName.toLowerCase()
										) ??
										"0"
								) -
									10) /
									2
							) + ""
						);
					}
				}
				return "0";
			});
			continue;
		}
		if (jsonRegex.test(valueString)) {
			valueString = valueString.replace(jsonRegex, (_, expr) =>
				JSON.parse(expr)
			);
			continue;
		}
	}

	return valueString;
}

/**
 *
 * @param data JSON Data
 * @param location Location
 * @param values Values to Save into Location
 * @param override Override Location => true = yes | false = append
 * @param noresolve if true dont Resolve Values to Text
 * @returns Updated JSON Data
 */
export function updateFieldArray(
	data: any,
	location: string,
	values: any[],
	override: boolean,
	noresolve = false
) {
	let newValues = [];
	if (!noresolve && values) {
		for (let value of values) {
			newValues.push(resolveToValue(data, value));
		}
	} else {
		newValues = values;
	}
	let s = location.split(".");
	let currentDataDepth = data;
	let i = 1;
	for (let d of s) {
		if (currentDataDepth[d] === undefined || currentDataDepth[d] === null) {
			currentDataDepth[d] = s.length == i ? newValues : {};
			if (s.length == i) {
				break;
			}
		}

		if (s.length == i) {
			if (!Array.isArray(currentDataDepth[d])) {
				currentDataDepth[d] = newValues;
				currentDataDepth[d] = currentDataDepth[d].filter(
					(value, index) => currentDataDepth[d].indexOf(value) == index
				);
				break;
			}
			if (!override) {
				for (let val of newValues) {
					currentDataDepth[d].push(val);
					currentDataDepth[d] = currentDataDepth[d].filter(
						(value, index) => currentDataDepth[d].indexOf(value) == index
					);
				}
				break;
			}
			currentDataDepth[d] = newValues;
			currentDataDepth[d] = currentDataDepth[d].filter(
				(value, index) => currentDataDepth[d].indexOf(value) == index
			);
			break;
		}
		currentDataDepth = currentDataDepth[d];
		i++;
	}
	return data;
}

/**
 *
 * @param data JSON Data
 * @param location Location
 * @param values Values to Save into Location
 * @param override Override Location => true = yes | false = append
 * @param noresolve if true dont Resolve Values to Text
 * @param setData Function to Save data to
 */
export function updateFieldArrayFunction(
	data: any,
	location: string,
	values: any[],
	override: boolean,
	setData: any,
	noresolve = false
) {
	if (!data) {
		data = {};
	}
	let newValues = [];
	if (!noresolve && values) {
		for (let value of values) {
			newValues.push(resolveToValue(data, value));
		}
	} else {
		newValues = values;
	}

	let s = location.split(".");
	let currentDataDepth = data;
	let i = 1;
	for (let d of s) {
		if (!currentDataDepth[d]) {
			currentDataDepth[d] = s.length == i ? newValues : {};
			if (s.length == i) {
				break;
			}
		}
		if (s.length == i) {
			if (!Array.isArray(currentDataDepth[d])) {
				currentDataDepth[d] = newValues;
				break;
			}
			if (!override) {
				for (let val of newValues) {
					currentDataDepth[d].push(val);
				}
				break;
			}
			currentDataDepth[d] = newValues;
			break;
		}
		currentDataDepth = currentDataDepth[d];
		i++;
	}
	setData((prev: any) => ({ ...prev, [s[0]]: data[s[0]] }));
}

/**
 *
 * @param data JSON Data
 * @param location Location
 * @param newValue New Value for Location
 * @param noresovle if true dont Resolve to Text
 * @returns New Data
 */
export function updateField(
	data: any,
	location: string,
	newValue: any,
	noresovle = false
) {
	if (!data) {
		data = {};
	}
	if ((newValue + "").includes("oldValue")) {
		let oldValue = getFieldData(data, location);
		if (!oldValue) {
			oldValue = "";
		}
		newValue = (newValue + "").replace("oldValue", oldValue);
	}
	if (!noresovle && newValue) {
		newValue = resolveToValue(data, newValue);
	}
	let s = location.split(".");
	let currentDataDepth = data;
	let i = 1;
	for (let d of s) {
		if (!currentDataDepth[d]) {
			currentDataDepth[d] = {};
		}
		if (s.length == i) {
			currentDataDepth[d] = newValue;
			break;
		}
		currentDataDepth = currentDataDepth[d];

		i++;
	}
	return data;
}

/**
 *
 * @param data JSON Data
 * @param location Location
 * @param newValue New Value for Location
 * @param noresovle if true dont Resolve to Text
 * @param setData Saves new Data to
 */
export function updateFieldFunction(
	data: any,
	location: string,
	newValue: any,
	setData: any,
	noresolve = false
) {
	if ((newValue + "").includes("oldValue")) {
		let oldValue = getFieldData(data, location);
		if (!oldValue) {
			oldValue = "";
		}
		newValue = (newValue + "").replace("oldValue", oldValue);
	}
	if (!noresolve && newValue) {
		newValue = resolveToValue(data, newValue);
	}
	let s = location.split(".");
	let currentDataDepth = data;
	let i = 1;
	for (let d of s) {
		if (!currentDataDepth[d]) {
			currentDataDepth[d] = {};
		}
		if (s.length == i) {
			currentDataDepth[d] = newValue;
			break;
		}
		if (typeof currentDataDepth[d] != "object") {
			currentDataDepth[d] = {};
		}
		currentDataDepth = currentDataDepth[d];

		i++;
	}
	setData((prev: any) => ({ ...prev, [s[0]]: data[s[0]] }));
}
