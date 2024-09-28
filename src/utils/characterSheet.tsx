import { ATTRIBUTES } from "./constants";
import { performItemCommands } from "./dataHelper";
import { FunctionToolkit, Popup, Widget, WidgetChild } from "./types";

export const DEFAULT_POPUPS: Popup[] = [
	{
		id: "roleplay_show_position",
		title: "Spieler Position",
		children: [
			{
				id: "name",
				type: "spezial_location",
				values(popupData, playerData, characterData, toolkit, constData) {},
			},
		],
	},
	{
		id: "basic_zustand_add",
		title: "Zustand hinzufügen",
		children: [
			{
				id: "name",
				type: "textfield",
				values: undefined,
				onChange: undefined,
				title: "Name",
				style: { width: "98%", marginLeft: "1%" },
			},
			{
				id: "description",
				type: "textfield",
				values: undefined,
				onChange: undefined,
				title: "Beschreibung",
				style: { width: "98%", marginLeft: "1%" },
			},
			{
				id: "color",
				type: "textfield",
				values: undefined,
				onChange: undefined,
				title: "Farbe",
				style: { width: "98%", marginLeft: "1%" },
			},
		],
		onSave(popupData, playerData, characterData, toolkit, constData) {
			playerData = toolkit.updateFieldArray(
				playerData,
				"zustand",
				[popupData],
				false,
				true
			);
			return playerData;
		},
	},
	{
		id: "basic_show_zustand",
		defaultData(playerData, characterData, openAttributes, toolkit, constData) {
			return openAttributes;
		},
		title: "",
		saveLabel: "Löschen",
		onSave(popupData, playerData, characterData, toolkit, constData) {
			let z = toolkit.getFieldData(playerData, "zustand");
			let z1 = [];
			for (let z2 of z) {
				if (z2.name != popupData.name) {
					z1.push(z2);
				}
			}
			playerData = toolkit.updateFieldArray(
				playerData,
				"zustand",
				z1,
				true,
				true
			);
			return playerData;
		},
		children: [
			{
				id: "text",
				type: "text",
				values(popupData, playerData, characterData, toolkit, constData) {
					return popupData.description;
				},
			},
		],
	},
	{
		id: "basic_edit_hp",
		title: "Trefferpunkte ändern",
		children: [
			{
				id: "change",
				type: "textfield",
				values: undefined,
				onChange: undefined,
				title: "Änderung",
				style: { width: "98%", marginLeft: "1%" },
			},
		],
		onSave: (
			popupData: any,
			playerData: any,
			characterData: any,
			toolkit: FunctionToolkit,
			constData: any
		) => {
			playerData.hp = parseInt(playerData.hp) + parseInt(popupData.change) + "";
			if (parseInt(playerData.hp) < 0) {
				playerData.hp = "0";
			}
			if (parseInt(playerData.hp) > parseInt(characterData.hp)) {
				playerData.hp = characterData.hp + "";
			}
			return playerData;
		},
	},
	{
		id: "basic_money_setter",
		title: "Geld ändern",
		defaultData: (
			playerData: any,
			characterData: any,
			openAttributes: any,
			toolkit: FunctionToolkit,
			constData: any
		) => {
			return playerData.money;
		},
		children: [
			{
				id: "pm",
				type: "textfield",
				values: undefined,
				onChange: undefined,
				title: "Platinmünzen",
				style: { width: "98%", marginLeft: "1%", marginTop: "1%" },
			},
			{
				id: "gm",
				type: "textfield",
				values: undefined,
				onChange: undefined,
				title: "Goldmünzen",
				style: { width: "98%", marginLeft: "1%", marginTop: "1%" },
			},
			{
				id: "sm",
				type: "textfield",
				values: undefined,
				onChange: undefined,
				title: "Silbermünzen",
				style: { width: "98%", marginLeft: "1%", marginTop: "1%" },
			},
			{
				id: "km",
				type: "textfield",
				values: undefined,
				onChange: undefined,
				title: "Kupfermünzen",
				style: { width: "98%", marginLeft: "1%", marginTop: "1%" },
			},
		],
		onSave: (
			popupData: any,
			playerData: any,
			characterData: any,
			toolkit: FunctionToolkit,
			constData: any
		) => {
			playerData.money = popupData;
			return playerData;
		},
	},
	{
		id: "basic_weapon_edit",
		title: "Waffe hinzufügen",
		defaultData: (
			playerData: any,
			characterData: any,
			openAttributes: any,
			toolkit: FunctionToolkit,
			constData: any
		) => {
			if (openAttributes.index == "-1") {
				return {
					name: "",
					description: "",
					damage: "",
					range: "",
					attribute: "",
					weaponType: "",
					index: "-1",
				};
			}
			return { ...openAttributes.weapon, index: openAttributes.index };
		},
		children: [
			{
				id: "name",
				type: "textfield",
				values(
					popupData,
					playerData,
					characterData,
					toolkit: FunctionToolkit,
					constData
				) {},
				style: { width: "98%", margin: "1%" },
				title: "Name",
			},
			{
				id: "description",
				type: "textarea",
				values(
					popupData,
					playerData,
					characterData,
					toolkit: FunctionToolkit,
					constData
				) {},
				style: { width: "98%", margin: "1%" },
				title: "Beschreibung",
			},
			{
				id: "damage",
				type: "textfield",
				values(
					popupData,
					playerData,
					characterData,
					toolkit: FunctionToolkit,
					constData
				) {},
				style: { width: "98%", margin: "1%" },
				title: "Schaden",
			},
			{
				id: "range",
				type: "textfield",
				values(
					popupData,
					playerData,
					characterData,
					toolkit: FunctionToolkit,
					constData
				) {},
				style: { width: "98%", margin: "1%" },
				title: "Reichweite",
			},
			{
				id: "attribute",
				type: "select",
				title: "Waffenattribut",
				values(popupData, playerData, characterData, getFieldData, constData) {
					let ret = [];
					for (let a of ATTRIBUTES) {
						ret.push({ value: a.shortName, label: a.name });
					}
					return ret;
				},
				style: { width: "98%", margin: "1%" },
			},
			{
				id: "weaponType",
				type: "select",
				title: "Waffentyp",
				values(popupData, playerData, characterData, getFieldData, constData) {
					return ["Nahkampfwaffe", "Fernkampfwaffe"];
				},
				style: { width: "98%", margin: "1%" },
			},
			{
				id: "ubung",
				type: "boolean",
				title: "Übung",
				style: { width: "98%", margin: "1%" },
				values(
					popupData,
					playerData,
					characterData,
					toolkit: FunctionToolkit,
					constData
				) {
					return [];
				},
			},
		],
		onSave: (
			popupData: any,
			playerData: any,
			characterData: any,
			toolkit: FunctionToolkit,
			constData: any
		) => {
			if (!playerData.weapons) {
				playerData.weapons = [];
			}
			if (popupData.index == "-1") {
				playerData.weapons.push({ ...popupData, index: undefined });
				return playerData;
			}
			if (!popupData.name) {
				playerData.weapons.splice(popupData.index, 1);
				return playerData;
			}
			playerData.weapons[popupData.index] = {
				...popupData,
				index: undefined,
			};
			return playerData;
		},
	},
	{
		id: "basic_item_edit",
		title: "Item bearbeiten",
		defaultData(
			playerData,
			characterData,
			openAttributes,
			toolkit: FunctionToolkit,
			constData
		) {
			if (!openAttributes) {
				return {
					id: "custom",
					index: openAttributes.index,
				};
			}
			if (openAttributes.parent) {
				return {
					amount: openAttributes.amount,
					name: openAttributes.parent.name,
					id: openAttributes.id,
					description: openAttributes.parent.description,
					it: openAttributes.items,
					index: openAttributes.index,
				};
			}
			return {
				amount: openAttributes.amount,
				name: openAttributes.name,
				id: openAttributes.id,
				description: openAttributes.description,
				it: openAttributes.items,
				index: openAttributes.index,
			};
		},
		children: [
			{
				id: "id",
				type: "select",
				style: { width: "98%", margin: "1%", height: "40px" },
				values(popupData, playerData, characterData, getFieldData, constData) {
					if (!popupData.it) {
						return [{ label: "custom", value: "custom" }];
					}
					let ret = [{ label: "custom", value: "custom" }];
					for (let i of popupData.it) {
						if (!i) {
							continue;
						}
						ret.push({ label: i.name, value: i.id });
					}
					return ret;
				},
				onChange(event, popupData) {
					if (event.target.value == "custom") {
						return { ...popupData, id: "custom", type: undefined };
					}
					for (let i of popupData.it) {
						if (!i) {
							continue;
						}
						if (i.type == "weapon" && i.id == event.target.value) {
							return {
								...popupData,
								name: i.name,
								id: i.id,
								description: i.description,
								equip: i.equip,
								data: i.data,
								type: "weapon",
							};
						}
						if (i.id == event.target.value) {
							return {
								...popupData,
								name: i.name,
								id: i.id,
								description: i.description,
								equip: i.equip,
								data: i.data,
								type: undefined,
							};
						}
					}
					return { ...popupData, id: "custom" };
				},
			},
			{
				id: "name",
				type: "textfield",
				style: { width: "98%", margin: "1%" },
				title: "Name",
				values(
					popupData,
					playerData,
					characterData,
					getFieldData,
					constData
				) {},
			},
			{
				id: "description",
				type: "textarea",
				style: { width: "98%", margin: "1%" },
				title: "Beschreibung",
				values(
					popupData,
					playerData,
					characterData,
					getFieldData,
					constData
				) {},
			},
			{
				id: "amount",
				type: "textfield",
				style: { width: "98%", margin: "1%" },
				title: "Anzahl",
				values(
					popupData,
					playerData,
					characterData,
					getFieldData,
					constData
				) {},
			},
		],
		onSave(
			popupData,
			playerData,
			characterData,
			toolkit: FunctionToolkit,
			constData
		) {
			if (popupData.index == undefined) {
				return;
			}
			if (!popupData.amount || parseInt(popupData.amount) <= 0) {
				if (
					playerData["items"][popupData.index] &&
					playerData["items"][popupData.index].type &&
					playerData["items"][popupData.index].type == "weapon"
				) {
					let newW = [];
					if (!playerData["weapons"]) {
						return playerData;
					}
					for (let w of playerData["weapons"]) {
						if (w.id != playerData["items"][popupData.index].id) {
							newW.push(w);
						}
					}
					playerData["weapons"] = newW;
				}
				playerData["items"][popupData.index] = undefined;

				return playerData;
			}
			if (popupData.type && popupData.type == "weapon") {
				if (!playerData["weapons"]) {
					playerData["weapons"] = [
						{
							...popupData.data.weapon,
							id: popupData.id,
							name: popupData.name,
							group: popupData.data.group,
						},
					];
				} else {
					playerData["weapons"].push({
						...popupData.data.weapon,
						id: popupData.id,
						name: popupData.name,
						group: popupData.data.group,
					});
				}
			}
			playerData["items"][popupData.index] = {
				name: popupData.name,
				id: popupData.id,
				amount: popupData.amount,
				description: popupData.description,
				equip: popupData.equip,
				data: popupData.data,
				type: popupData.type,
			};
			return playerData;
		},
	},
	{
		id: "basic_abilities_show",
		title: (popupData) => {
			return popupData.name;
		},
		defaultData(
			playerData,
			characterData,
			openAttributes,
			toolkit: FunctionToolkit,
			constData
		) {
			return openAttributes;
		},
		children: [
			{
				id: "text",
				type: "text",
				values(
					popupData,
					playerData,
					characterData,
					toolkit: FunctionToolkit,
					constData
				) {
					return toolkit.resolveToValue(characterData, popupData.description);
				},
			},
		],
	},
	{
		id: "spell_show_spell",
		title: "",
		defaultData(
			playerData,
			characterData,
			openAttributes,
			toolkit: FunctionToolkit,
			constData
		) {
			return openAttributes;
		},
		children: [
			{
				id: "text",
				type: "spell",
				values(
					popupData,
					playerData,
					characterData,
					toolkit: FunctionToolkit,
					constData
				) {},
			},
		],
	},
	{
		id: "spell_prepare",
		title: "Zaubervorbereiten",
		defaultData(
			playerData,
			characterData,
			openAttributes,
			toolkit: FunctionToolkit,
			constData
		) {
			return {
				spells: playerData.spells ?? [],
				spellsmax:
					toolkit.resolveToValue(
						characterData,
						toolkit.getFieldData(characterData, "data.magic.maxSpells")
					) ?? undefined,
			};
		},
		children: [
			{
				id: "spells",
				type: "multiselect",
				values(
					popupData,
					playerData,
					characterData,
					toolkit: FunctionToolkit,
					constData
				) {
					let a: any = [];
					if (!characterData.data.magic || !characterData.data.magic.spells) {
						return;
					}
					for (let s of constData.spells) {
						if (!characterData.data.magic.spells.includes(s.id)) {
							continue;
						}
						a.push({
							value: s.id,
							name: s.name,
						});
					}
					return a;
				},
			},
		],
		onSave(
			popupData,
			playerData,
			characterData,
			toolkit: FunctionToolkit,
			constData
		) {
			playerData["spells"] = popupData.spells;
			return playerData;
		},
	},
	{
		title: "Field-Kommando",
		id: "basic_field_command",
		onSave(
			popupData,
			playerData,
			characterData,
			toolkit: FunctionToolkit,
			constData
		) {
			playerData = performItemCommands(playerData, characterData, [
				{
					location: popupData.location,
					command: popupData.command,
					array: false,
				},
			]);
			return playerData;
		},
		children: [
			{
				id: "location",
				type: "textfield",
				values: undefined,
				title: "Location",
			},
			{
				id: "command",
				type: "textfield",
				values: undefined,
				title: "Kommando",
			},
		],
	},
	{
		title: "Ausrüstung anziehen",
		id: "basic_equip_item",
		defaultData(
			playerData,
			characterData,
			openAttributes,
			toolkit: FunctionToolkit,
			constData
		) {
			return openAttributes;
		},
		onSave(
			popupData,
			playerData,
			characterData,
			toolkit: FunctionToolkit,
			constData
		) {
			if (!popupData.it) {
				return playerData;
			}
			for (let i of popupData.it) {
				if (!i) {
					continue;
				}
				if (popupData.item == i.id) {
					if (i.data && i.data.onEquip) {
						playerData = performItemCommands(
							playerData,
							characterData,
							i.data.onEquip
						);
					}
					playerData = toolkit.updateField(
						playerData,
						"equipment." + (popupData.pos ?? popupData.slot),
						i,
						true
					);
					break;
				}
			}

			return playerData;
		},
		children: [
			{
				id: "item",
				type: "select",
				style: { width: "98%", margin: "1%" },
				values(
					popupData,
					playerData,
					characterData,
					toolkit: FunctionToolkit,
					constData
				) {
					let ret: any = [];
					if (!popupData.it) {
						return [];
					}
					for (let i of popupData.it) {
						if (!i) {
							continue;
						}
						if (!popupData.slot) {
							ret.push({ label: i.name, value: i.id });
							continue;
						}
						if (i.equip && i.equip == popupData.slot) {
							ret.push({ label: i.name, value: i.id });
						}
					}
					return ret;
				},
			},
		],
	},
];

export const DEFAULT_WIDGET: Widget[] = [
	{
		id: "abilities",
		title: "Fähigkeiten",
		type: "all",
		children: [
			{
				type: "array",
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
					gridAutoRows: "min-content",
					gridGap: "4px 10px",
					overflow: "auto",
				},
				id: "list",
				values(playerData, characterData, toolkit, constData) {
					let r: WidgetChild[] = [];
					const getAbilitiesByName = (name: string) => {
						if (!constData || !constData.abilities) {
							return undefined;
						}
						for (let a of constData.abilities) {
							if (a.name == name) {
								return a;
							}
						}
						return undefined;
					};
					if (characterData.data.abilities) {
						for (let ab of characterData.data.abilities) {
							if (!ab) {
								continue;
							}
							let a = getAbilitiesByName(ab);
							if (!a) {
								continue;
							}
							r.push({
								id: "ab_" + ab,
								type: "gtext",
								values(playerData, characterData, toolkit, constData) {
									return ["#DEDEDE"];
								},
								onClick(playerData, characterData, toolkit, openPopup, event) {
									openPopup("basic_abilities_show", a);
								},
								title: ab,
							});
						}
					}
					if (playerData.transformData && playerData.transformData.abilities) {
						for (let ab of playerData.transformData.abilities) {
							if (!ab) {
								continue;
							}
							let a = getAbilitiesByName(ab);
							if (!a) {
								continue;
							}
							r.push({
								id: "abt_" + ab,
								type: "gtext",
								values(playerData, characterData, toolkit, constData) {
									return ["#DEDEDE"];
								},
								onClick(playerData, characterData, toolkit, openPopup, event) {
									openPopup("basic_abilities_show", a);
								},
								title: ab,
							});
						}
					}
					if (characterData.data.traits) {
						for (let ab of characterData.data.traits) {
							if (!ab) {
								continue;
							}
							r.push({
								id: "trait_" + ab.name,
								type: "gtext",
								values(playerData, characterData, toolkit, constData) {
									return ["#DEDEDE"];
								},
								onClick(playerData, characterData, toolkit, openPopup, event) {
									openPopup("basic_abilities_show", {
										name: ab.name,
										description: ab.value,
									});
								},
								title: ab.name,
							});
						}
					}
					if (characterData.data.legend) {
						for (let ab of characterData.data.legend) {
							if (!ab) {
								continue;
							}
							r.push({
								id: "legend_" + ab.name,
								type: "gtext",
								values(playerData, characterData, toolkit, constData) {
									return ["#DEDEDE"];
								},
								onClick(playerData, characterData, toolkit, openPopup, event) {
									openPopup("basic_abilities_show", {
										name: ab.name,
										description: ab.value,
									});
								},
								title: ab.name + " (Legendär)",
							});
						}
					}
					if (playerData.transformData && playerData.transformData.traits) {
						for (let ab of playerData.transformData.traits) {
							if (!ab) {
								continue;
							}
							r.push({
								id: "traitt_" + ab.name,
								type: "gtext",
								values(playerData, characterData, toolkit, constData) {
									return ["#DEDEDE"];
								},
								onClick(playerData, characterData, toolkit, openPopup, event) {
									openPopup("basic_abilities_show", {
										name: ab.name,
										description: ab.value,
									});
								},
								title: ab,
							});
						}
					}
					if (playerData.transformData && playerData.transformData.legend) {
						for (let ab of playerData.transformData.legend) {
							if (!ab) {
								continue;
							}
							r.push({
								id: "legendt_" + ab.name,
								type: "gtext",
								values(playerData, characterData, toolkit, constData) {
									return ["#DEDEDE"];
								},
								onClick(playerData, characterData, toolkit, openPopup, event) {
									openPopup("basic_abilities_show", {
										name: ab.name,
										description: ab.value,
									});
								},
								title: ab.name + " (Legendär)",
							});
						}
					}
					if (
						playerData.transformData &&
						playerData.transformData.damageResistance
					) {
						for (let ab of playerData.transformData.damageResistance) {
							if (!ab) {
								continue;
							}
							r.push({
								id: "rest_" + ab,
								type: "gtext",
								values(playerData, characterData, toolkit, constData) {
									return ["#DEDEDE"];
								},
								onClick(playerData, characterData, toolkit, openPopup, event) {
									openPopup("basic_abilities_show", {
										name: ab,
										description:
											"Du bist resistent(Halber Schaden) gegenüber Schaden durch " +
											ab,
									});
								},
								title: ab + " resistenz",
							});
						}
					}
					if (
						!playerData.transformData &&
						characterData.data.damageResistance
					) {
						for (let ab of characterData.data.damageResistance) {
							if (!ab) {
								continue;
							}
							r.push({
								id: "rest_" + ab,
								type: "gtext",
								values(playerData, characterData, toolkit, constData) {
									return ["#DEDEDE"];
								},
								onClick(playerData, characterData, toolkit, openPopup, event) {
									openPopup("basic_abilities_show", {
										name: ab,
										description:
											"Du bist resistent(Halber Schaden) gegenüber Schaden durch " +
											ab,
									});
								},
								title: ab + " resistenz",
							});
						}
					}

					if (
						playerData.transformData &&
						playerData.transformData.conditionImmunity
					) {
						for (let ab of playerData.transformData.conditionImmunity) {
							if (!ab) {
								continue;
							}
							r.push({
								id: "rest_" + ab,
								type: "gtext",
								values(playerData, characterData, toolkit, constData) {
									return ["#DEDEDE"];
								},
								onClick(playerData, characterData, toolkit, openPopup, event) {
									openPopup("basic_abilities_show", {
										name: ab,
										description:
											"Du bist resistent(Halber Schaden) gegenüber Schaden durch " +
											ab,
									});
								},
								title: ab + " resistenz",
							});
						}
					}
					if (
						!playerData.transformData &&
						characterData.data.conditionImmunity
					) {
						for (let ab of characterData.data.conditionImmunity) {
							if (!ab) {
								continue;
							}
							r.push({
								id: "rest_" + ab,
								type: "gtext",
								values(playerData, characterData, toolkit, constData) {
									return ["#DEDEDE"];
								},
								onClick(playerData, characterData, toolkit, openPopup, event) {
									openPopup("basic_abilities_show", {
										name: ab,
										description:
											"Du bist resistent(Halber Schaden) gegenüber Schaden durch " +
											ab,
									});
								},
								title: ab + " resistenz",
							});
						}
					}

					if (
						playerData.transformData &&
						playerData.transformData.damageEmpfind
					) {
						for (let ab of playerData.transformData.damageEmpfind) {
							if (!ab) {
								continue;
							}
							r.push({
								id: "rest_" + ab,
								type: "gtext",
								values(playerData, characterData, toolkit, constData) {
									return ["#DEDEDE"];
								},
								onClick(playerData, characterData, toolkit, openPopup, event) {
									openPopup("basic_abilities_show", {
										name: ab,
										description:
											"Du bist resistent(Halber Schaden) gegenüber Schaden durch " +
											ab,
									});
								},
								title: ab + " resistenz",
							});
						}
					}
					if (!playerData.transformData && characterData.data.damageEmpfind) {
						for (let ab of characterData.data.damageEmpfind) {
							if (!ab) {
								continue;
							}
							r.push({
								id: "rest_" + ab,
								type: "gtext",
								values(playerData, characterData, toolkit, constData) {
									return ["#DEDEDE"];
								},
								onClick(playerData, characterData, toolkit, openPopup, event) {
									openPopup("basic_abilities_show", {
										name: ab,
										description:
											"Du bist resistent(Halber Schaden) gegenüber Schaden durch " +
											ab,
									});
								},
								title: ab + " resistenz",
							});
						}
					}

					if (
						playerData.transformData &&
						playerData.transformData.damageImmunity
					) {
						for (let ab of playerData.transformData.damageImmunity) {
							if (!ab) {
								continue;
							}
							r.push({
								id: "rest_" + ab,
								type: "gtext",
								values(playerData, characterData, toolkit, constData) {
									return ["#DEDEDE"];
								},
								onClick(playerData, characterData, toolkit, openPopup, event) {
									openPopup("basic_abilities_show", {
										name: ab,
										description:
											"Du bist resistent(Halber Schaden) gegenüber Schaden durch " +
											ab,
									});
								},
								title: ab + " resistenz",
							});
						}
					}
					if (!playerData.transformData && characterData.data.damageImmunity) {
						for (let ab of characterData.data.damageImmunity) {
							if (!ab) {
								continue;
							}
							r.push({
								id: "rest_" + ab,
								type: "gtext",
								values(playerData, characterData, toolkit, constData) {
									return ["#DEDEDE"];
								},
								onClick(playerData, characterData, toolkit, openPopup, event) {
									openPopup("basic_abilities_show", {
										name: ab,
										description:
											"Du bist resistent(Halber Schaden) gegenüber Schaden durch " +
											ab,
									});
								},
								title: ab + " resistenz",
							});
						}
					}
					return r;
				},
			},
		],
	},
	{
		id: "magic",
		title: "Magie",
		type: "all",
		style: {
			display: "grid",
			fontSize: "15pt",
			minHeight: "50vh",
			gridTemplateColumns: "1fr 1fr 1fr",
			gridTemplateRows: "1fr min-content",
		},
		children: [
			{
				id: "tricks",
				type: "array",
				style: {
					display: "flex",
					flexDirection: "column",
					marginLeft: "2%",
					height: "100%",
					alignSelf: "center",
					alignItems: "center",
					alignContent: "center",
				},

				values(playerData, characterData, toolkit: FunctionToolkit, constData) {
					let a: WidgetChild[] = [];
					if (!characterData.data.magic || !characterData.data.magic.tricks) {
						return a;
					}
					a.push({
						id: "text_spells",
						type: "text",
						style: { fontSize: "15pt" },
						values() {
							return "Zaubertricks";
						},
					});
					for (let s of constData.spells) {
						if (
							!playerData.transformData &&
							!characterData.data.magic.tricks.includes(s.id)
						) {
							continue;
						}
						if (
							playerData.transformData &&
							!playerData.transformData.tricks.includes(s.id)
						) {
							continue;
						}
						a.push({
							id: "s_" + s.id,
							type: "gtext",
							style: { width: "100%", textAlign: "center" },
							title: s.name,
							onClick: (
								playerData,
								characterData,
								toolkit: FunctionToolkit,
								openPopup
							) => {
								openPopup("spell_show_spell", s);
							},
							values(playerData, characterData, toolkit, constData) {
								return ["#FEF6FF"];
							},
						});
					}
					return a;
				},
			},
			{
				id: "spell",
				type: "array",
				style: {
					display: "flex",
					flexDirection: "column",
					marginLeft: "2%",
					height: "100%",
					alignSelf: "center",
					alignItems: "center",
					alignContent: "center",
				},

				values(playerData, characterData, toolkit: FunctionToolkit, constData) {
					let a: WidgetChild[] = [];

					a.push({
						id: "text_spell_name",
						type: "text",
						style: { fontSize: "15pt" },
						values() {
							return "Zauber";
						},
					});
					for (let s of constData.spells) {
						if (
							!playerData.transformData &&
							characterData.data.magic &&
							characterData.data.magic.allwaysSpells
						) {
							if (characterData.data.magic.allwaysSpells.includes(s.id)) {
								a.push({
									id: "s_" + s.id,
									type: "gtext",
									style: { width: "100%", textAlign: "center" },
									title: s.name,
									onClick: (
										playerData,
										characterData,
										toolkit: FunctionToolkit,
										openPopup
									) => {
										openPopup("spell_show_spell", s);
									},
									values(playerData, characterData, toolkit, constData) {
										return ["#FEF6FF"];
									},
								});
								continue;
							}
						}
						if (
							playerData.transformData &&
							playerData.transformData.allwaysSpells
						) {
							if (playerData.transformData.allwaysSpells.includes(s.id)) {
								a.push({
									id: "s_" + s.id,
									type: "gtext",
									style: { width: "100%", textAlign: "center" },
									title: s.name,
									onClick: (
										playerData,
										characterData,
										toolkit: FunctionToolkit,
										openPopup
									) => {
										openPopup("spell_show_spell", s);
									},
									values(playerData, characterData, toolkit, constData) {
										return ["#FEF6FF"];
									},
								});
								continue;
							}
						}
						if (playerData.transformData || !playerData.spells) {
							continue;
						}
						if (!playerData.spells.includes(s.id)) {
							continue;
						}
						a.push({
							id: "s_" + s.id,
							type: "gtext",
							style: { width: "100%", textAlign: "center" },
							title: s.name,
							onClick: (
								playerData,
								characterData,
								toolkit: FunctionToolkit,
								openPopup
							) => {
								openPopup("spell_show_spell", s);
							},
							values(playerData, characterData, toolkit, constData) {
								return ["#FEF6FF"];
							},
						});
					}
					return a;
				},
			},
			{
				id: "slots",
				type: "array",
				values(playerData, characterData, toolkit: FunctionToolkit, constData) {
					if (
						!playerData.transformData &&
						(!characterData.data.magic || !characterData.data.magic.slot)
					) {
						return;
					}
					let r: WidgetChild[] = [
						{
							id: "text_slots",
							type: "text",
							style: {
								fontSize: "15pt",
								width: "100%",
								gridColumn: "1 / span 2",
								gridRow: "1 / span 1",
							},
							values() {
								return "Zauberplätze";
							},
						},
					];
					if (playerData.transformData) {
						if (!playerData.transformData.spellSlots) {
							return [];
						}
						for (let i = 1; i <= 9; i++) {
							if (!playerData.transformData.spellSlots[i + ""]) {
								continue;
							}
							r.push({
								id: "slot_" + i,
								type: "pointarray",
								title: "" + i,
								style: { margin: "1%" },
								values() {
									return [
										"#F5B8FF",
										"#FEF6FF",
										playerData.transformData.spellSlots[i + ""],
										3,
										"98%",
										playerData.spellSlots
											? playerData.spellSlots[i + ""] ?? 0
											: 0,
										"45%",
									];
								},
								onClick(
									playerData,
									characterData,
									toolkit: FunctionToolkit,
									openPopup,
									event
								) {
									if (event.ctrlKey) {
										if (!playerData.spellSlots) {
											playerData.spellSlots = {};
										}
										playerData.spellSlots[i + ""] =
											parseInt(playerData.spellSlots[i + ""]) + 1;
										if (
											parseInt(playerData.spellSlots[i + ""] + "") >
											parseInt(playerData.transformData.spellSlots[i + ""] + "")
										) {
											playerData.spellSlots[i + ""] =
												playerData.transformData.spellSlots[i + ""];
										}
										return playerData;
									}
									if (!playerData.spellSlots) {
										playerData.spellSlots = {};
									}
									playerData.spellSlots[i + ""] =
										parseInt(playerData.spellSlots[i + ""]) - 1;
									if (playerData.spellSlots[i + ""] < 0) {
										playerData.spellSlots[i + ""] = 0;
									}
									return playerData;
								},
							});
						}
						return r;
					}
					for (let i = 1; i <= 9; i++) {
						if (!characterData.data.magic.slot[i + ""]) {
							continue;
						}
						r.push({
							id: "slot_" + i,
							type: "pointarray",
							title: "" + i,
							style: { margin: "1%" },
							values() {
								return [
									"#F5B8FF",
									"#FEF6FF",
									characterData.data.magic.slot[i + ""],
									3,
									"98%",
									playerData.spellSlots
										? playerData.spellSlots[i + ""] ?? 0
										: 0,
									"45%",
								];
							},
							onClick(
								playerData,
								characterData,
								toolkit: FunctionToolkit,
								openPopup,
								event
							) {
								if (event.ctrlKey) {
									if (!playerData.spellSlots) {
										playerData.spellSlots = {};
									}
									playerData.spellSlots[i + ""] =
										parseInt(playerData.spellSlots[i + ""]) + 1;
									if (
										parseInt(playerData.spellSlots[i + ""] + "") >
										parseInt(characterData.data.magic.slot[i + ""] + "")
									) {
										playerData.spellSlots[i + ""] =
											characterData.data.magic.slot[i + ""];
									}
									return playerData;
								}
								if (!playerData.spellSlots) {
									playerData.spellSlots = {};
								}
								playerData.spellSlots[i + ""] =
									parseInt(playerData.spellSlots[i + ""]) - 1;
								if (playerData.spellSlots[i + ""] < 0) {
									playerData.spellSlots[i + ""] = 0;
								}
								return playerData;
							},
						});
					}
					return r;
				},
				style: {
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gridTemplateRows:
						"min-content min-content min-content min-content min-content min-content 1fr",
					margin: "5px",
				},
			},
			{
				id: "data",
				type: "text",
				title: "",
				style: {
					gridColumn: "1 / span 2",
					alignItems: "center",
					display: "flex",
					height: "100%",
					justifyContent: "center",
				},
				values(playerData, characterData, toolkit: FunctionToolkit, constData) {
					if (toolkit.getFieldData(characterData, "data.magic.text")) {
						return toolkit.getFieldData(characterData, "data.magic.text");
					}
					let a = toolkit.getFieldData(characterData, "data.magic.attribute");
					let valu = parseInt(
						toolkit.resolveToValue(
							characterData,
							a
								? "math:[ref:[ubungsBonus]+att:[" + a + "]]"
								: "ref:[ubungsBonus]"
						)
					);
					return (
						"SG: " +
						(toolkit.resolveToValue(
							characterData,
							toolkit.getFieldData(characterData, "data.magic.spellSG")
						) ?? "8") +
						" | Angriff: " +
						(valu >= 0 ? "+" : "-") +
						valu
					);
				},
			},
			{
				id: "prepareSpells",
				type: "button",
				style: {
					fontSize: "13pt",
					border: undefined,
					backgroundColor: "#A7F3AA",
					color: "black",
				},
				values: () => {
					return ["contained", undefined, "small"];
				},
				title: "Zauber vorbereiten",
				onClick(
					playerData: any,
					characterData,
					toolkit: FunctionToolkit,
					openPopup
				) {
					openPopup("spell_prepare", {});
					return playerData;
				},
			},
		],
	},
	{
		title: "Zustände",
		type: "all",
		children: [
			{
				id: "zustande",
				type: "array",
				style: {
					display: "grid",
					fontSize: "15pt",
					gridTemplateColumns: "1fr 1fr 1fr",
					gridTemplateRows: "auto",
				},
				values(playerData, characterData, toolkit: FunctionToolkit, constData) {
					let a: WidgetChild[] = [];
					if (
						!toolkit.getFieldData(playerData, "zustand") ||
						!Array.isArray(toolkit.getFieldData(playerData, "zustand"))
					) {
						return [];
					}
					for (let z of toolkit.getFieldData(playerData, "zustand")) {
						a.push({
							id: "zu_" + z.name,
							type: "gtext",
							style: {
								textAlign: "center",
								margin: "5px",
							},
							title: z.name,
							onClick: (playerData, characterData, toolkit, openPopup) => {
								openPopup("basic_show_zustand", z);
							},
							values(playerData, characterData, toolkit, constData) {
								return [z.color];
							},
						});
					}
					return a;
				},
			},
			{
				id: "add-zustand",
				type: "button",
				title: "Zustand hinzufügen",
				style: { justifySelf: "center" },
				values(playerData, characterData, toolkit: FunctionToolkit, constData) {
					return ["outlined", "error"];
				},
				onClick(
					playerData,
					characterData,
					toolkit: FunctionToolkit,
					openPopup
				) {
					openPopup("basic_zustand_add", {});
				},
			},
		],
		id: "statuses",
	},
	{
		id: "spezial_traits",
		children: [],
		type: "fight",
		title: "Spezialfähigkeiten",
		style: {
			display: "grid",
			fontSize: "15pt",
			gridTemplateColumns: "1fr 1fr 1fr",
			gridTemplateRows: "auto",
		},
		disabled: true,
	},
];
