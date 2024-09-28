import {
	getFieldData,
	resolveToValue,
	resolveToValueWithOverride,
	updateField,
	updateFieldArray,
} from "./dataHelper";
import { WURFEL } from "./roleDice";
import { Field, FunctionToolkit } from "./types";

export const HOSTNAME = "https://dnd.lauch.eu";
export const VERSION = "1.3.3";

export const rowStyles = {
	display: "table-row",
	cursor: "pointer",
	transition: "background-color 0.3s",
};

export const DEFAULT_FUNCTION_TOOLKIT: FunctionToolkit = {
	getFieldData: getFieldData,
	updateField: updateField,
	updateFieldArray: updateFieldArray,
	resolveToValue: resolveToValue,
	resolveToValueWithOverride: resolveToValueWithOverride,
};

export const ATTRIBUTES = [
	{
		name: "Stärke",
		shortName: "Sta",
	},
	{
		name: "Geschicklichkeit",
		shortName: "Ges",
	},
	{
		name: "Konstitution",
		shortName: "Kon",
	},
	{
		name: "Intelligenz",
		shortName: "Int",
	},
	{
		name: "Weisheit",
		shortName: "Wei",
	},
	{
		name: "Charisma",
		shortName: "Cha",
	},
];

export const SPELLCASTER = [
	{
		name: "bard",
		title: "Barde",
	},
	{
		name: "cleric",
		title: "Kleriker",
	},
	{
		name: "druid",
		title: "Druide",
	},
	{
		name: "paladin",
		title: "Paladin",
	},
	{
		name: "ranger",
		title: "Waldläufer",
	},
	{
		name: "sorcerer",
		title: "Magier",
	},
	{
		name: "warlock",
		title: "Hexenmeister",
	},
	{
		name: "wizard",
		title: "Zauberer",
	},
];

export const FIELD_TYPES = [
	"string",
	"number",
	"spell",
	"language",
	"subattributes",
	"attributes",
	"damageType",
	"dice",
	"zaubertricks",
	"ability",
	"boolean",
	"spellcaster",
	"weapon",
];

export const SUBATTRIBUTES = [
	{
		attributeName: "Geschicklichkeit",
		name: "Akrobatik",
	},
	{
		attributeName: "Intelligenz",
		name: "Arkane Kunde",
	},
	{
		attributeName: "Stärke",
		name: "Athletik",
	},
	{
		attributeName: "Charisma",
		name: "Auftreten",
	},
	{
		attributeName: "Charisma",
		name: "Einschüchtern",
	},
	{
		attributeName: "Geschicklichkeit",
		name: "Fingerfertigkeit",
	},
	{
		attributeName: "Intelligenz",
		name: "Geschichte",
	},
	{
		attributeName: "Weisheit",
		name: "Heilkunst",
	},
	{
		attributeName: "Geschicklichkeit",
		name: "Heimlichkeit",
	},
	{
		attributeName: "Weisheit",
		name: "Mit Tieren umgehen",
	},
	{
		attributeName: "Weisheit",
		name: "Motiv erkennen",
	},
	{
		attributeName: "Intelligenz",
		name: "Nachforschungen",
	},
	{
		attributeName: "Intelligenz",
		name: "Naturkunde",
	},
	{
		attributeName: "Intelligenz",
		name: "Religion",
	},
	{
		attributeName: "Charisma",
		name: "Täuschen",
	},
	{
		attributeName: "Weisheit",
		name: "Überlebenskunst",
	},
	{
		attributeName: "Charisma",
		name: "Überzeugen",
	},
	{
		attributeName: "Weisheit",
		name: "Wahrnehmung",
	},
];

export const NPC_DEFAULT_FIELDS: Field[] = [
	{
		title: "NPC Name",
		description: "",
		location: "name",
		tab: "Basis",
		type: "string",
	},
	{
		title: "Volk",
		description: "",
		location: "volk",
		tab: "Basis",
		type: "string",
	},
	{
		title: "Trefferpunkte",
		description: "Trefferpunkte",
		location: "hp",
		tab: "Basis",
		type: "number",
	},
	{
		title: "Rüstungsklasse",
		description: "Rüstungsklasse",
		location: "rk",
		tab: "Basis",
		type: "number",
	},
	{
		title: "Bewegungsrate Land",
		description: "Land Bewegungsrate des Characters",
		tab: "Basis",
		type: "string",
		location: "data.bewegungsrate.land",
	},
	{
		title: "Bewegungsrate Wasser",
		description: "Wasser Bewegungsrate des Characters",
		tab: "Basis",
		type: "string",
		location: "data.bewegungsrate.wasser",
	},
	{
		title: "Bewegungsrate Luft",
		description: "Luft Bewegungsrate des Characters",
		tab: "Basis",
		type: "string",
		location: "data.bewegungsrate.luft",
	},
	{
		title: "Übungsbonus",
		description: "Übungsbonus welcher der Character besitzt",
		tab: "Basis",
		type: "string",
		location: "ubungsBonus",
	},
	{
		title: "Größe",
		description: "",
		location: "data.size",
		tab: "Basis",
		type: "string",
	},
	{
		title: "Weisheit",
		description: "Weisheit des Charakters",
		tab: "Attribute",
		type: "number",
		location: "attributes.wei",
	},
	{
		title: "Geschicklichkeit",
		description: "Geschicklichkeit des Charakters",
		tab: "Attribute",
		type: "number",
		location: "attributes.ges",
	},
	{
		title: "Inteligenz",
		description: "Inteligenz des Charakters",
		tab: "Attribute",
		type: "number",
		location: "attributes.int",
	},
	{
		title: "Stärke",
		description: "Stärke des Charakters",
		tab: "Attribute",
		type: "number",
		location: "attributes.sta",
	},
	{
		title: "Konstitution",
		description: "Konstitution des Charakters",
		tab: "Attribute",
		type: "number",
		location: "attributes.kon",
	},
	{
		title: "Charisma",
		description: "Charisma des Charakters",
		tab: "Attribute",
		type: "number",
		location: "attributes.cha",
	},
	{
		title: "Waffen",
		description: "Waffen des Characters",
		tab: "Waffen",
		type: "weapon[]",
		location: "data.weapons",
	},
	{
		title: "Sprachen",
		description: "Jene Sprachen die der Character spricht",
		tab: "Sprachen",
		type: "language[]",
		location: "languages",
	},

	{
		title: "Zauber",
		description: "Zauber des Spielers",
		tab: "Zauber",
		type: "spell[]",
		location: "data.magic.spells",
	},
	{
		title: "Zaubertricks",
		description: "Zaubertricks des Spielers",
		tab: "Zaubertricks",
		type: "spell[]",
		location: "data.magic.tricks",
	},
	{
		title: "Zauberwirk Attribute",
		description: "Attribute zum Zauberwirken",
		tab: "Zauber",
		type: "attributes",
		location: "data.magic.attribute",
	},
	{
		title: "Zauberbeschreibung",
		description: "Beschreibung",
		tab: "Zauber",
		type: "string",
		location: "data.magic.text",
		multiline: true,
	},
	{
		title: "Fähigkeiten",
		description: "Fähigkeiten welche der Charakter besitzt",
		tab: "Fähigkeiten",
		type: "ability[]",
		location: "data.abilities",
	},
	{
		title: "Zauberplätze Stufe 1",
		description: "Zauberplätze der Stufe 1",
		tab: "Zauber",
		type: "number",
		location: "data.magic.slot.1",
	},
	{
		title: "Zauberplätze Stufe 2",
		description: "Zauberplätze der Stufe 2",
		tab: "Zauber",
		type: "number",
		location: "data.magic.slot.2",
	},
	{
		title: "Zauberplätze Stufe 3",
		description: "Zauberplätze der Stufe 3",
		tab: "Zauber",
		type: "number",
		location: "data.magic.slot.3",
	},
	{
		title: "Zauberplätze Stufe 4",
		description: "Zauberplätze der Stufe 4",
		tab: "Zauber",
		type: "number",
		location: "data.magic.slot.4",
	},
	{
		title: "Zauberplätze Stufe 5",
		description: "Zauberplätze der Stufe 5",
		tab: "Zauber",
		type: "number",
		location: "data.magic.slot.5",
	},
	{
		title: "Zauberplätze Stufe 6",
		description: "Zauberplätze der Stufe 6",
		tab: "Zauber",
		type: "number",
		location: "data.magic.slot.6",
	},
	{
		title: "Zauberplätze Stufe 7",
		description: "Zauberplätze der Stufe 7",
		tab: "Zauber",
		type: "number",
		location: "data.magic.slot.7",
	},
	{
		title: "Zauberplätze Stufe 8",
		description: "Zauberplätze der Stufe 8",
		tab: "Zauber",
		type: "number",
		location: "data.magic.slot.8",
	},
	{
		title: "Zauberplätze Stufe 9",
		description: "Zauberplätze der Stufe 9",
		tab: "Zauber",
		type: "number",
		location: "data.magic.slot.9",
	},
	{
		title: "Herausforderungsgrad",
		description: "",
		tab: "Kampf",
		type: "string",
		location: "data.hg",
	},
	{
		title: "Erfahrungspunkte",
		description: "",
		tab: "Kampf",
		type: "string",
		location: "data.xp",
	},
	{
		title: "Gesinnung",
		description: "",
		tab: "Basis",
		type: "string",
		location: "data.gesinnung",
	},
	{
		title: "Zustandsimmunitäten",
		description: "",
		tab: "Kampf",
		type: "string[]",
		location: "data.conditionImmunity",
	},
	{
		title: "Schadensresistenzen",
		description: "",
		tab: "Kampf",
		type: "string[]",
		location: "data.damageResistance",
	},

	{
		title: "Vorbereitete Zauber",
		description: "Zauber welche stets vorbereitet sind",
		tab: "Vorbereitet Zauber",
		type: "spell[]",
		location: "data.magic.allwaysSpells",
	},
	{
		title: "Schadensempfindlichkeit",
		description: "",
		tab: "Kampf",
		type: "string[]",
		location: "data.damageEmpfind",
	},
	{
		title: "Schadensimmunitäten",
		description: "",
		tab: "Kampf",
		type: "string[]",
		location: "data.damageImmunity",
	},
	{
		title: "Trefferwürfel",
		description: "Trefferwürfel des Spielers",
		tab: "Basis",
		type: "dice",
		location: "data.dice.default",
	},
	{
		title: "Trefferwürfelanzahl",
		description: "Anzahl der Trefferwürfel des Spielers",
		tab: "Basis",
		type: "number",
		location: "data.dice.amount",
	},
	{
		title: "Übung Rettungswürfe",
		description: "Rettungswürfe in welchen der Charakter geübt ist",
		tab: "Basis",
		type: "attributes[]",
		location: "ubungRW",
	},
	{
		title: "Übung Fertigkeiten",
		description: "Fertigkeiten in denen  der Charakter geübt ist",
		tab: "Basis",
		type: "subattributes[]",
		location: "ubungAB",
	},
];

export const MAGICTYPES = [
	"Illusionsmagie",
	"Beschwörung",
	"Bannmagie",
	"Verwandlung",
	"Nekromantie",
	"Erkenntnismagie",
	"Hervorrufung",
	"Verzauberung",
];

export const DEFAULT_FIELDS: Field[] = [
	{
		title: "Character Name",
		description: "Name des Charakters",
		tab: "Basis",
		type: "string",
		location: "characterName",
	},
	{
		title: "Trefferpunkte",
		description: "Trefferpunkte welche der Character besitzt",
		tab: "Basis",
		type: "string",
		location: "hp",
	},
	{
		title: "Rüstungsklasse",
		description: "Rüstungsklasse welche der Character besitzt",
		tab: "Basis",
		type: "string",
		location: "rk",
	},
	{
		title: "Standart Waffen",
		description: "Waffen des Characters",
		tab: "Waffen",
		type: "weapon[]",
		location: "data.weapons",
	},
	{
		title: "Trefferwürfel",
		description: "Trefferwürfel des Spielers",
		tab: "Basis",
		type: "dice",
		location: "data.dice.default",
	},
	{
		title: "Zustandsimmunitäten",
		description: "",
		tab: "Kampf",
		type: "string[]",
		location: "data.conditionImmunity",
	},
	{
		title: "Schadensresistenzen",
		description: "",
		tab: "Kampf",
		type: "damageType[]",
		location: "data.damageResistance",
	},
	{
		title: "Schadensempfindlichkeit",
		description: "",
		tab: "Kampf",
		type: "damageType[]",
		location: "data.damageEmpfind",
	},
	{
		title: "Schadensimmunitäten",
		description: "",
		tab: "Kampf",
		type: "damageType[]",
		location: "data.damageImmunity",
	},
	{
		title: "Trefferwürfelanzahl",
		description: "Anzahl der Trefferwürfel des Spielers",
		tab: "Basis",
		type: "number",
		location: "data.dice.amount",
	},
	{
		title: "Item Übung",
		description: "Welche Klassen von Items ist man geübt",
		tab: "Items",
		type: "string[]",
		location: "data.items.ub",
	},
	{
		title: "Bewegungsrate Land",
		description: "Land Bewegungsrate des Characters",
		tab: "Basis",
		type: "string",
		location: "data.bewegungsrate.land",
	},
	{
		title: "Bewegungsrate Wasser",
		description: "Wasser Bewegungsrate des Characters",
		tab: "Basis",
		type: "string",
		location: "data.bewegungsrate.wasser",
	},
	{
		title: "Bewegungsrate Luft",
		description: "Luft Bewegungsrate des Characters",
		tab: "Basis",
		type: "string",
		location: "data.bewegungsrate.luft",
	},
	{
		title: "Übungsbonus",
		description: "Übungsbonus welcher der Character besitzt",
		tab: "Basis",
		type: "string",
		location: "ubungsBonus",
	},
	{
		title: "Player Name",
		description: "Name des Spielers",
		tab: "Basis",
		type: "string",
		location: "playerName",
	},

	{
		title: "Weisheit",
		description: "Weisheit des Charakters",
		tab: "Attribute",
		type: "number",
		location: "attributes.wei",
	},
	{
		title: "Geschicklichkeit",
		description: "Geschicklichkeit des Charakters",
		tab: "Attribute",
		type: "number",
		location: "attributes.ges",
	},
	{
		title: "Inteligenz",
		description: "Inteligenz des Charakters",
		tab: "Attribute",
		type: "number",
		location: "attributes.int",
	},
	{
		title: "Stärke",
		description: "Stärke des Charakters",
		tab: "Attribute",
		type: "number",
		location: "attributes.sta",
	},
	{
		title: "Konstitution",
		description: "Konstitution des Charakters",
		tab: "Attribute",
		type: "number",
		location: "attributes.kon",
	},
	{
		title: "Charisma",
		description: "Charisma des Charakters",
		tab: "Attribute",
		type: "number",
		location: "attributes.cha",
	},
	{
		title: "Level",
		description: "Level des Characters",
		tab: "Basis",
		type: "string",
		location: "data.level",
		disabled: true,
	},
	{
		title: "Übung Rettungswürfe",
		description: "Rettungswürfe in welchen der Charakter geübt ist",
		tab: "Basis",
		type: "attributes[]",
		location: "ubungRW",
	},
	{
		title: "Übung Fertigkeiten",
		description: "Fertigkeiten in denen  der Charakter geübt ist",
		tab: "Basis",
		type: "subattributes[]",
		location: "ubungAB",
	},
	{
		title: "Makel",
		description: "Makel des Charakters",
		tab: "Roleplay",
		type: "string",
		location: "makel",
		multiline: true,
	},

	{
		title: "Sprachen",
		description: "Jene Sprachen die der Character spricht",
		tab: "Sprachen",
		type: "language[]",
		location: "languages",
	},
	{
		title: "Ideeale",
		description: "Ideale des Charakters",
		tab: "Roleplay",
		type: "string",
		location: "ideale",
		multiline: true,
	},
	{
		title: "Bindungen",
		description: "Bindungen des Charakters",
		tab: "Roleplay",
		type: "string",
		location: "bindungen",
		multiline: true,
	},
	{
		title: "Hintergrund",
		description: "Hintergrund des Charakters",
		tab: "Roleplay",
		type: "string",
		location: "hintergrund",
		multiline: true,
	},
	{
		title: "Alter",
		description: "Alter des Charakters",
		tab: "Roleplay",
		type: "string",
		location: "alter",
	},
	{
		title: "Religion",
		description: "Religion des Charakters",
		tab: "Roleplay",
		type: "string",
		location: "religion",
	},
	{
		title: "Körpergröße",
		description: "Körpergröße des Charakters",
		tab: "Roleplay",
		type: "string",
		location: "korperGrose",
	},
	{
		title: "Geschlecht",
		description: "Geschlecht des Charakters",
		tab: "Roleplay",
		type: "string",
		location: "geschlecht",
	},
	{
		title: "Gesinnung",
		description: "Gesinnung des Charakters",
		tab: "Roleplay",
		type: "string",
		location: "gesinnung",
	},
	{
		title: "Augenfarbe",
		description: "Augenfarbe des Charakters",
		tab: "Roleplay",
		type: "string",
		location: "augenfarbe",
	},
	{
		title: "Haarfarbe",
		description: "Haarfarbe des Charakters",
		tab: "Roleplay",
		type: "string",
		location: "haarfarbe",
	},
	{
		title: "Hautfarbe",
		description: "Hautfarbe des Charakters",
		tab: "Roleplay",
		type: "string",
		location: "hautfarbe",
	},
	{
		title: "Aussehen",
		description: "Aussehen des Charakters",
		tab: "Roleplay",
		type: "string",
		location: "aussehen",
		multiline: true,
	},
	{
		title: "Werdegang",
		description: "Werdegang des Charakters",
		tab: "Roleplay",
		type: "string",
		location: "werdegang",
		multiline: true,
	},
	{
		title: "Hintergrundgeschichte",
		description: "Hintergrundgeschichte des Charakters",
		tab: "Roleplay",
		type: "string",
		location: "hintergrundGeschichte",
		multiline: true,
	},
	{
		title: "Vorbereitete Zauber",
		description: "Zauber welche stets vorbereitet sind",
		tab: "Vorbereitet Zauber",
		type: "spell[]",
		location: "data.magic.allwaysSpells",
	},
	{
		title: "Zauber",
		description: "Zauber des Spielers",
		tab: "Zauber",
		type: "spell[]",
		location: "data.magic.spells",
	},
	{
		title: "Zaubertricks",
		description: "Zaubertricks des Spielers",
		tab: "Zaubertricks",
		type: "spell[]",
		location: "data.magic.tricks",
	},
	{
		title: "Zauberwirk Attribute",
		description: "Attribute zum Zauberwirken",
		tab: "Zauber",
		type: "attributes",
		location: "data.magic.attribute",
	},
	{
		title: "Fähigkeiten",
		description: "Fähigkeiten welche der Charakter besitzt",
		tab: "Fähigkeiten",
		type: "ability[]",
		location: "data.abilities",
	},
	{
		title: "Maximale Zauber",
		description: "Maximale Anzahl an Zaubern",
		tab: "Zauber",
		type: "string",
		location: "data.magic.maxSpells",
	},
	{
		title: "Zauber-SG",
		description: "Maximale Anzahl an Zaubern",
		tab: "Zauber",
		type: "string",
		location: "data.magic.spellSG",
	},
	{
		title: "Zauberwirkerstufe (x2)",
		description: "Stufe zur Bestimmung der Zauberplätze",
		tab: "Zauber",
		type: "string",
		location: "data.class.level.spellCaster",
	},
	{
		title: "Zauberplätze Stufe 1",
		description: "Zauberplätze der Stufe 1",
		tab: "Zauber",
		type: "number",
		location: "data.magic.slot.1",
	},
	{
		title: "Zauberplätze Stufe 2",
		description: "Zauberplätze der Stufe 2",
		tab: "Zauber",
		type: "number",
		location: "data.magic.slot.2",
	},
	{
		title: "Zauberplätze Stufe 3",
		description: "Zauberplätze der Stufe 3",
		tab: "Zauber",
		type: "number",
		location: "data.magic.slot.3",
	},
	{
		title: "Zauberplätze Stufe 4",
		description: "Zauberplätze der Stufe 4",
		tab: "Zauber",
		type: "number",
		location: "data.magic.slot.4",
	},
	{
		title: "Zauberplätze Stufe 5",
		description: "Zauberplätze der Stufe 5",
		tab: "Zauber",
		type: "number",
		location: "data.magic.slot.5",
	},
	{
		title: "Zauberplätze Stufe 6",
		description: "Zauberplätze der Stufe 6",
		tab: "Zauber",
		type: "number",
		location: "data.magic.slot.6",
	},
	{
		title: "Zauberplätze Stufe 7",
		description: "Zauberplätze der Stufe 7",
		tab: "Zauber",
		type: "number",
		location: "data.magic.slot.7",
	},
	{
		title: "Zauberplätze Stufe 8",
		description: "Zauberplätze der Stufe 8",
		tab: "Zauber",
		type: "number",
		location: "data.magic.slot.8",
	},
	{
		title: "Zauberplätze Stufe 9",
		description: "Zauberplätze der Stufe 9",
		tab: "Zauber",
		type: "number",
		location: "data.magic.slot.9",
	},
];

/**
 *
 * @param type Type of the Question
 * @param constData Data from the Database like Languages, Abilities, Classes and Races
 * @param filter A Filter for Spells
 * @returns A Array of Possible Answers to a Question
 */
export function getPossibilities(type: string, constData: any, filter?: any) {
	switch (type) {
		case "language":
			return constData.languages;

		case "subattributes":
			return SUBATTRIBUTES;

		case "attributes":
			return ATTRIBUTES;

		case "spellcaster":
			return SPELLCASTER;

		case "magictypes":
			return MAGICTYPES;

		case "ability":
			return constData.abilities;

		case "damageType":
			return constData.damageTypes;
		case "spell":
			if (filter) {
				let level = filter.level ?? "all";
				let spellcaster = filter.spellcaster ?? "all";
				if (level == "all" && spellcaster == "all") {
					return constData.spells;
				}
				let ret = [];
				for (let spell of constData.spells) {
					if (Array.isArray(level)) {
						if (level.includes(spell.level)) {
							if (Array.isArray(spellcaster)) {
								for (let caster of spellcaster) {
									if (spell.classes.includes(caster)) {
										ret.push(spell);
										continue;
									}
								}
							}
							if (spell.classes.includes(spellcaster) || spellcaster == "all") {
								ret.push(spell);
								continue;
							}
						}
						continue;
					}
					if (spell.level == Number.parseInt(level) || level == "all") {
						if (Array.isArray(spellcaster)) {
							for (let caster of spellcaster) {
								if (spell.classes.includes(caster)) {
									ret.push(spell);
									continue;
								}
							}
						}
						if (spell.classes.includes(spellcaster) || spellcaster == "all") {
							ret.push(spell);
						}
					}
				}
				return ret;
			}
			return constData.spells;
		case "dice":
			return WURFEL;
		case "zaubertricks":
			return constData.spells.filter((item: any) => {
				item.level == 0;
			});
		default:
			return [];
	}
}

/**
 *
 * @param fields Additional Fields from the Character
 * @returns All Fields a Character has
 */
export const getCombinedFields = (fields: any[]) => {
	return [...DEFAULT_FIELDS, ...fields];
};

/**
 *
 * @param fields Additional Fields from a NPC
 * @returns All Fields a NPC has
 */
export const getCombinedFieldsNPC = (fields: any[]) => {
	return [...NPC_DEFAULT_FIELDS, ...fields];
};

/**
 * @deprecated
 * @param screenWidth Width of the Screen
 * @returns Calculates the Nav Bar width
 */
export const getSideBarWidth = (screenWidth: number) => {
	if (screenWidth > 800) {
		return 240;
	} else if (screenWidth <= 800 && screenWidth > 200) {
		return 40;
	} else {
		return 40;
	}
};

/**
 *
 * @returns Child Roles for given Parent Role
 */
export function getRoles(role: string | undefined): string[] {
	if (!role) {
		return [];
	}
	switch (role.toLowerCase()) {
		case "admin":
			return ["editor", "gamemaster", "admin", "user"];
		case "user":
			return ["user"];
		case "gamemaster":
			return ["gamemaster", "editor", "user"];
		case "editor":
			return ["editor", "user"];
		default:
			return [];
	}
}

/**
 *
 * @param type Type of the Question
 * @param constData Constant Data
 * @param filter Filter to Applay
 * @returns Name of the Choices
 */
export const getChoices = (type: string, constData: any, filter?: any) => {
	const pos = getPossibilities(type, constData, filter);
	let answers = [];
	for (const p of pos) {
		answers.push(p.name);
	}
	return answers;
};
