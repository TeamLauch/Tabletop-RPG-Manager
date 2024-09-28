import axios from "axios";
import prisma from "./prisma";
import { ATTRIBUTES, SUBATTRIBUTES } from "./constants";
import fs from "fs";
import * as ts from "typescript";

export async function loadSpellsFromAPI() {
	const spells = await axios.get("https://openrpg.de/srd/5e/de/api/spell");
	let toDatabase: any[] = [];

	let added: any[] = [];
	if (!spells.data.result) {
		return undefined;
	}
	for (let spell of spells.data.result.objects) {
		if (added.includes(spell)) {
			continue;
		}
		const s = await axios.get(spell + "/json").catch(() => {});
		if (!s || s.data.type == "error") {
			continue;
		}
		let sp = s.data;
		let spe = {
			name: sp.name,
			id: sp.id,
			description: sp.description.html,
			duration: sp.duration ?? "Sofort",
			level: parseInt(sp.level),
			material: sp["material-components"],
			school: sp.school,
			range: sp.range,
			components: sp.components,
			ritual: sp.ritual ? true : false,
			castingTime: sp.time,
		};
		toDatabase.push(spe);
		added.push(spell);
	}

	return toDatabase;
}

function addClassVolk(
	name: string,
	file: string,
	list: any[],
	licence: string,
	description?: string
) {
	let newList = [];
	let f = false;
	for (let a of list) {
		if (a.name == name) {
			newList.push({
				name: name,
				files: [...a.files, file],
				licence: [...a.licence, licence ?? "CC-BY-4.0"],
				description: description ?? a.description,
			});
			f = true;
			continue;
		}
		newList.push(a);
	}
	if (!f) {
		newList.push({
			name: name,
			files: [file],
			licence: [licence ?? "CC-BY-4.0"],
			description: description ?? "",
		});
	}
	return newList;
}

export async function loadClassesAndRacesFromFolder() {
	const races = fs.readdirSync("./ruleset/races");
	const classes = fs.readdirSync("./ruleset/classes");
	const backgrounds = fs.readdirSync("./ruleset/backgrounds");
	await prisma.spell.updateMany({
		data: {
			classes: [],
		},
	});
	let b = [];
	for (let f of backgrounds) {
		const data = fs.readFileSync("./ruleset/backgrounds/" + f, "utf-8");
		const compiled = ts.transpile(data);
		let runnalbe: any = eval(compiled);
		if (runnalbe.name) {
			b = addClassVolk(
				runnalbe.name,
				f,
				b,
				runnalbe.licence,
				runnalbe.description
			);
			let init = runnalbe.onInit();
			if (init && init.create && init.create.abilities) {
				await prisma.ability.createMany({
					data: init.create.abilities,
					skipDuplicates: true,
				});
			}
			if (init && init.create && init.create.spells) {
				await prisma.ability.createMany({
					data: init.spell.spells,
					skipDuplicates: true,
				});
			}
			if (init && init.create && init.create.additionalData) {
				await prisma.additionalDataTypes.createMany({
					data: init.create.additionalData,
					skipDuplicates: true,
				});
			}
			if (init && init.update && init.update.additionalData) {
				for (let a of init.update.additionalData) {
					await prisma.additionalDataTypes
						.update({
							where: {
								id: a.id,
							},
							data: a,
						})
						.catch((e) => {
							console.error(
								"Error updating additional Data " + a.id + " in race file " + f
							);
						});
				}
			}
			if (init && init.update && init.update.abilities) {
				for (let a of init.update.abilities) {
					await prisma.ability
						.update({
							where: {
								name: a.name,
							},
							data: a,
						})
						.catch((e) => {
							console.error(
								"Error updating ability " + a.name + " in race file " + f
							);
						});
				}
			}
			if (init && init.update && init.update.spells) {
				for (let a of init.update.spells) {
					await prisma.spell
						.update({
							where: {
								id: a.id,
							},
							data: a,
						})
						.catch((e) => {
							console.error(
								"Error updating Spell " + a.id + " in race file " + f
							);
						});
				}
			}
		}
	}
	let r = [];
	for (let f of races) {
		const data = fs.readFileSync("./ruleset/races/" + f, "utf-8");
		const compiled = ts.transpile(data);
		let runnalbe: any = eval(compiled);
		if (runnalbe.name) {
			r = addClassVolk(
				runnalbe.name,
				f,
				r,
				runnalbe.licence,
				runnalbe.description
			);
			let init = runnalbe.onInit();
			if (init && init.create && init.create.abilities) {
				await prisma.ability.createMany({
					data: init.create.abilities,
					skipDuplicates: true,
				});
			}
			if (init && init.create && init.create.spells) {
				await prisma.ability.createMany({
					data: init.spell.spells,
					skipDuplicates: true,
				});
			}
			if (init && init.create && init.create.additionalData) {
				await prisma.additionalDataTypes.createMany({
					data: init.create.additionalData,
					skipDuplicates: true,
				});
			}
			if (init && init.update && init.update.additionalData) {
				for (let a of init.update.additionalData) {
					await prisma.additionalDataTypes
						.update({
							where: {
								id: a.id,
							},
							data: a,
						})
						.catch((e) => {
							console.error(
								"Error updating additional Data " + a.id + " in race file " + f
							);
						});
				}
			}
			if (init && init.update && init.update.abilities) {
				for (let a of init.update.abilities) {
					await prisma.ability
						.update({
							where: {
								name: a.name,
							},
							data: a,
						})
						.catch((e) => {
							console.error(
								"Error updating ability " + a.name + " in race file " + f
							);
						});
				}
			}
			if (init && init.update && init.update.spells) {
				for (let a of init.update.spells) {
					await prisma.spell
						.update({
							where: {
								id: a.id,
							},
							data: a,
						})
						.catch((e) => {
							console.error(
								"Error updating Spell " + a.id + " in race file " + f
							);
						});
				}
			}
		}
	}
	let c = [];
	for (let f of classes) {
		const data = fs.readFileSync("./ruleset/classes/" + f, "utf-8");
		const compiled = ts.transpile(data);
		let runnalbe: any = eval(compiled);
		if (runnalbe.name) {
			c = addClassVolk(
				runnalbe.name,
				f,
				c,
				runnalbe.licence,
				runnalbe.description
			);
			let init = runnalbe.onInit();
			if (init && init.create && init.create.abilities) {
				await prisma.ability.createMany({
					data: init.create.abilities,
					skipDuplicates: true,
				});
			}
			if (init && init.create && init.create.spells) {
				await prisma.ability.createMany({
					data: init.spell.spells,
					skipDuplicates: true,
				});
			}
			if (init && init.create && init.create.additionalData) {
				await prisma.additionalDataTypes.createMany({
					data: init.create.additionalData,
					skipDuplicates: true,
				});
			}
			if (init && init.update && init.update.additionalData) {
				for (let a of init.update.additionalData) {
					await prisma.additionalDataTypes
						.update({
							where: {
								id: a.id,
							},
							data: a,
						})
						.catch((e) => {
							console.error(
								"Error updating additional Data " + a.id + " in race file " + f
							);
						});
				}
			}
			if (init && init.update && init.update.abilities) {
				for (let a of init.update.abilities) {
					await prisma.ability
						.update({
							where: {
								name: a.name,
							},
							data: a,
						})
						.catch((e) => {
							console.error(
								"Error updating ability " + a.name + " in class file " + f
							);
						});
				}
			}
			if (init && init.update && init.update.spells) {
				for (let a of init.update.spells) {
					await prisma.spell
						.update({
							where: {
								id: a.id,
							},
							data: a,
						})
						.catch((e) => {
							console.error(
								"Error updating Spell " + a.id + " in class file " + f
							);
						});
				}
			}
		}
	}
	await prisma.volk.deleteMany();
	await prisma.class.deleteMany();
	await prisma.background.deleteMany();
	await prisma.volk.createMany({ data: r });
	await prisma.class.createMany({ data: c });
	await prisma.background.createMany({ data: b });
}

/**
 *
 * @returns A list of NPCs to add to the Database
 */
export async function loadMonsterFromAPI() {
	const monsters = await axios.get("https://openrpg.de/srd/5e/de/api/monster");
	let toDatabase: any[] = [];
	let added: any[] = [];
	for (let monster of monsters.data.result.objects) {
		if (added.includes(monster)) {
			continue;
		}
		const m = await axios.get(monster + "/json").catch(() => {});
		if (!m || m.data.type == "error") {
			continue;
		}
		let mo = m.data;

		let mon: any = {
			name: mo.name,
			volk: mo.type,
			id: mo.id,
			hp: mo["hit-points"].value,
			rk: mo["armor-class"].value,
			ubungsBonus: "0",
			fields: [],
			ubungRW: [],
			ubungAB: [],
			languages: mo.languages,
			data: {
				size: mo.size,
				gesinnung: mo.alignment,
				magic: {
					slot: {},
				},
			},
			attributes: {},
		};
		for (let at of mo.attributes) {
			mon.attributes[
				at.class
					.replace("str", "sta")
					.replace("dex", "ges")
					.replace("con", "kon")
					.replace("wis", "wei")
			] = at.value;
		}
		if (mo["saving-throws"]) {
			for (let save of mo["saving-throws"]) {
				let sp = save.split(" ");
				for (let at of ATTRIBUTES) {
					if (
						sp[0].toLowerCase().replace("ä", "a") == at.shortName.toLowerCase()
					) {
						mon["ubungRW"] = [...mon["ubungRW"], at.name];
						mon["ubungsBonus"] =
							"" +
							(Number.parseInt(sp[1].replace("+", "")) -
								Math.floor(
									(Number.parseInt(mon.attributes[at.shortName.toLowerCase()]) -
										10) /
										2
								));
						break;
					}
				}
			}
		}
		if (mo["spellcasting-trait"]) {
			let trait = mo["spellcasting-trait"];
			mon.data.magic["text"] = trait["spellcasting-text"] ?? "";

			mon.data.magic["allwaysSpells"] = [];
			for (const spell of trait["spells"]) {
				if (!spell) {
					continue;
				}
				if (spell.level == "Zaubertricks") {
					mon.data.magic["tricks"] = [];
					for (const sp of spell.list) {
						mon.data.magic["tricks"] = [...mon.data.magic["tricks"], sp.id];
					}
				} else {
					mon.data.magic.slot[spell.level] = spell.slots;
					for (const sp of spell.list) {
						mon.data.magic["allwaysSpells"] = [
							...mon.data.magic["allwaysSpells"],
							sp.id,
						];
					}
				}
			}
		}
		if (mo.skills) {
			for (let skill of mo.skills) {
				let s = skill.split(" ");
				mon["ubungAB"] = [...mon["ubungAB"], s[0]];
				for (let at of SUBATTRIBUTES) {
					if (at.name == s[0]) {
						for (let a of ATTRIBUTES) {
							if (a.name == at.attributeName) {
								mon["ubungsBonus"] =
									"" +
									(Number.parseInt(s[1].replace("+", "")) -
										Math.floor(
											(Number.parseInt(
												mon.attributes[a.shortName.toLowerCase()]
											) -
												10) /
												2
										));
							}
						}
						break;
					}
				}
			}
		}
		mon.data["bewegungsrate"] = {
			land: mo.speeds.walk ? mo.speeds.walk.split("m")[0].trim() : "0",
			wasser: mo.speeds.swim ? mo.speeds.swim.split("m")[0].trim() : "0",
			luft: mo.speeds.fly ? mo.speeds.fly.split("m")[0].trim() : "0",
		};
		mon.data["xp"] = mo.xp;
		mon.data["hg"] = mo.challenge;
		mon.data["traits"] = mo.traits ?? [];
		mon.data["actions"] = mo.actions ?? [];
		mon.data["senses"] = mo.senses ?? [];
		mon.data["legend"] = mo["legendary-actions"] ?? [];
		(mon.data["conditionImmunity"] = mo["condition-immunitys"] ?? []),
			(mon.data["damageResistance"] = mo["damage-resistances"] ?? []),
			(mon.data["damageEmpfind"] = mo["damage-vulnerability"] ?? []),
			(mon.data["damageImmunity"] = mo["damage-immunitys"] ?? []),
			toDatabase.push(mon);
		added.push(monster);
	}
	return toDatabase;
}

/**
 * @todo ADD NPCS and mayby delete this all
 * Setup Database
 *
 */
export default async function setupDefaultDnD() {
	await prisma.language.createMany({
		data: [
			{
				name: "Gemeinsprache",
				writeAble: true,
			},
			{
				name: "Elfisch",
				writeAble: true,
			},
			{
				name: "Druidisch",
				writeAble: true,
			},
			{
				name: "Diebisch",
			},
			{
				name: "Orkisch",
			},
			{
				name: "Zwergisch",
			},
			{
				name: "Elementar",
				writeAble: false,
			},
			{
				name: "Drakonisch",
			},
			{
				name: "Infernalisch",
			},
			{
				name: "Halblingisch",
			},
			{
				name: "Gnomisch",
			},
		],
	});

	await prisma.damageType.createMany({
		data: [
			{
				name: "Stich",
			},
			{
				name: "Hieb",
			},
			{
				name: "Wucht",
			},
			{
				name: "Feuer",
			},
			{
				name: "Blitz",
			},
			{
				name: "Energie",
			},
			{
				name: "Gift",
			},
			{
				name: "Gleißend",
			},
			{
				name: "Kälte",
			},
			{
				name: "Nekrotisch",
			},
			{
				name: "Psychisch",
			},
			{
				name: "Säure",
			},
			{
				name: "Schall",
			},
		],
	});
}
