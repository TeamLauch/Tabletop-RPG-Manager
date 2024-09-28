import { useCallback, useEffect, useMemo, useState } from "react";
import {
	getFieldData,
	updateField,
	updateFieldArray,
} from "@/utils/dataHelper";
import {
	useAllClasses,
	useBackground,
	useBackgrounds,
	useKlasse,
	useOpenConstants,
	useVolk,
	useVolker,
} from "@/utils/customHooks";
import DnDDialog from "../basic/DnDDialog";
import { DnDAttributeSlider } from "../basic/DnDAttributeSilder";
import { newlineChars } from "pdf-lib";
import { FunctionToolkit } from "@/utils/types";
import { DEFAULT_FUNCTION_TOOLKIT } from "@/utils/constants";

type QueueItem = {
	title: string;
	choices: string[];
	type: string;
	description: string;
	defaultValue?: string | string[];
	choiceDescription?: (
		choice: any,
		answers: Answer[],
		constData: any,
		toolkit: FunctionToolkit,
		character?: any
	) => string;
	id: string;
	choiceDescriptionType?: "none" | "tooltip" | "sidebar";
};

type Answer = {
	id: string;
	answers: string[] | string;
};

/**
 *
 * @param onSave Saves Data to Database
 * @returns A Character CreationDialog
 */
export default function DnDCharacterCreator({
	onSave,
	character,
}: {
	onSave: (character: any) => void;
	character: any;
}) {
	const [queue, setQueue] = useState<QueueItem[]>();
	const classes = useAllClasses();
	const volker = useVolker();
	const backgrounds = useBackgrounds();
	const constData = useOpenConstants();
	const [currentPosition, setCurrentPosition] = useState(0);

	const [answers, setAnswers] = useState<Answer[]>([]);

	const [currentVolkName, setCurrentVolk] = useState<string>();
	const [currentClassName, setCurrentClass] = useState<string>();
	const [currentBackgroundName, setCurrentBackground] = useState<string>();
	/**
	 * Returns current Class
	 */
	const currentClass = useKlasse(currentClassName);

	/**
	 * Returns current Race
	 */
	const currentRace = useVolk(currentVolkName);

	const currentBackground = useBackground(currentBackgroundName);

	const [backFlag, setBackFlag] = useState(false);

	/**
	 * Generates Querry to Begin.
	 */
	useEffect(() => {
		updateQueue();
	}, [
		character,
		volker,
		classes,
		currentClass,
		currentRace,
		currentBackground,
	]);

	const getNextQuestion = (
		data: any[],
		level: number,
		answers: any[],
		character: any,
		create: boolean
	) => {
		for (let d of data) {
			if (
				d.getNextQuestion(
					level,
					answers,
					character,
					constData,
					getFieldData,
					create
				)
			) {
				return d.getNextQuestion(
					level,
					answers,
					character,
					constData,
					getFieldData,
					create
				);
			}
		}
		return undefined;
	};

	useEffect(() => {
		if (currentClass && currentRace) {
			if (
				!getNextQuestion(
					currentClass,
					parseInt(
						getFieldData(
							character ?? {},
							"data.class.level." + currentClassName
						) ?? "0"
					) + 1,
					[...answers],
					character,
					!character
				) &&
				!getNextQuestion(
					currentRace,
					parseInt(getFieldData(character ?? {}, "data.level") ?? "0") + 1,
					[...answers],
					character,
					!character
				) &&
				queue.length <= currentPosition
			) {
				performSave();
			} else {
				updateQueue();
			}
		}
	}, [currentClass, currentRace]);

	/**
	 * Function for getting the Names of the Races
	 */
	const raceNames = useMemo(() => {
		let li = [];
		for (let v of volker) {
			li.push(v.name);
		}
		return li;
	}, [volker]);

	/**
	 * Function for getting the Names of the Races
	 */
	const backgroundNames = useMemo(() => {
		let li = [];
		for (let v of backgrounds) {
			li.push(v.name);
		}
		return li;
	}, [backgrounds]);

	/**
	 * @returns The Names of the Classes
	 */
	const classNames = useMemo(() => {
		let li = [];
		for (let v of classes) {
			li.push(v.name);
		}
		return li;
	}, [classes]);

	/**
	 * Returns the Answer with the given ID
	 */
	const getAnswer = useCallback(
		(id: string) => {
			if (!answers) {
				return undefined;
			}
			for (let a of answers) {
				if (a.id == id) {
					return a;
				}
			}
			return undefined;
		},
		[answers]
	);

	/**
	 *
	 * @param newAnswer Adds a Answer to the Querry
	 */
	const addAnswer = (newAnswer: Answer) => {
		let newArray = [];
		let flag = false;
		for (let a of answers) {
			if (a.id == newAnswer.id) {
				newArray.push(newAnswer);
				flag = true;
				continue;
			}
			newArray.push(a);
		}
		if (!flag) {
			newArray.push(newAnswer);
		}
		setAnswers(newArray);
	};

	/**
	 *
	 * @param newestAnswer Neweste Answer
	 * @returns A New Queue
	 */
	const updateQueue = (newestAnswer?: Answer) => {
		let newQueue: QueueItem[] = queue;
		if (!newestAnswer && !character) {
			newQueue = [
				{
					id: "name",
					choices: [],
					defaultValue: undefined,
					description: "Name deines Charakters",
					title: "Charaktername",
					type: "input",
				},
				{
					id: "volk",
					choices: raceNames,
					defaultValue: undefined,
					description: "Das Volk dem dein Charakter angehört",
					title: "Volk",
					type: "single",
					choiceDescription(choice, answers, constData, toolkit, character) {
						for (let v of volker) {
							if (v.name == choice) {
								return v.description;
							}
						}
						return "";
					},
					choiceDescriptionType: "sidebar",
				},
				{
					id: "class",
					choices: classNames,
					defaultValue: undefined,
					description: "Die Hauptklasse deines Charakters",
					title: "Klasse",
					type: "single",
					choiceDescriptionType: "sidebar",
					choiceDescription(choice, answers, constData, toolkit, character) {
						for (let v of classes) {
							if (v.name == choice) {
								return v.description;
							}
						}
						return "";
					},
				},
				{
					id: "background",
					choices: backgroundNames,
					defaultValue: undefined,
					description: "Der Hintergrund deines Charakters",
					title: "Background",
					type: "single",
					choiceDescriptionType: "sidebar",
					choiceDescription(choice, answers, constData, toolkit, character) {
						for (let v of backgrounds) {
							if (v.name == choice) {
								return v.description;
							}
						}
						return "";
					},
				},
				{
					id: "attribute",
					choices: [],
					defaultValue: undefined,
					description: "",
					title: "",
					type: "attribute",
				},
			];
		}
		if (!newestAnswer && character) {
			newQueue = [
				{
					id: "class",
					choices: classNames,
					defaultValue:
						character && character.classes ? character.classes[0] : undefined,
					description: "Die Klasse welche aufsteigen soll",
					title: "Klasse",
					type: "single",
				},
			];
		}
		if (
			currentRace &&
			getNextQuestion(
				currentRace,
				(parseInt(getFieldData(character ?? {}, "data.level") ?? "0") ?? 0) + 1,
				newestAnswer ? [...answers, newestAnswer] : answers,
				character,
				!character
			)
		) {
			newQueue = [
				...newQueue,
				getNextQuestion(
					currentRace,
					(parseInt(getFieldData(character ?? {}, "data.level") ?? "0") ?? 0) +
						1,
					newestAnswer ? [...answers, newestAnswer] : answers,
					character,
					!character
				),
			];

			for (let v of currentRace) {
				if (v.modifiyQueue) {
					newQueue = v.modifiyQueue(newQueue) ?? newQueue;
				}
			}
			setQueue(newQueue);
			return [...newQueue].length;
		}
		if (
			currentClass &&
			getNextQuestion(
				currentClass,
				(parseInt(
					getFieldData(
						character ?? {},
						"data.class.level." + currentClassName
					) ?? "0"
				) ?? 0) + 1,
				newestAnswer ? [...answers, newestAnswer] : answers,
				character,
				!character
			)
		) {
			newQueue = [
				...newQueue,
				getNextQuestion(
					currentClass,
					(parseInt(
						getFieldData(
							character ?? {},
							"data.class.level." + currentClassName
						) ?? "0"
					) ?? 0) + 1,
					newestAnswer ? [...answers, newestAnswer] : answers,
					character,
					!character
				),
			];
			for (let v of currentClass) {
				if (v.modifiyQueue) {
					newQueue = v.modifiyQueue(newQueue) ?? newQueue;
				}
			}
			setQueue(newQueue);
			return [...newQueue].length;
		}

		if (
			currentBackground &&
			getNextQuestion(
				currentBackground,
				(parseInt(getFieldData(character ?? {}, "data.level") ?? "0") ?? 0) + 1,
				newestAnswer ? [...answers, newestAnswer] : answers,
				character,
				!character
			)
		) {
			newQueue = [
				...newQueue,
				getNextQuestion(
					currentBackground,
					(parseInt(getFieldData(character ?? {}, "data.level") ?? "0") ?? 0) +
						1,
					newestAnswer ? [...answers, newestAnswer] : answers,
					character,
					!character
				),
			];

			for (let v of currentBackground) {
				if (v.modifiyQueue) {
					newQueue = v.modifiyQueue(newQueue) ?? newQueue;
				}
			}
			setQueue(newQueue);
			return [...newQueue].length;
		}

		setQueue(newQueue);
		return [...newQueue].length;
	};

	/**
	 * Performs Save to Database
	 *
	 * @param newAnswer Newest Answer
	 * @returns
	 */
	const performSave = (newAnswer?: Answer) => {
		if (!currentClass || !currentRace || !currentBackground) {
			return;
		}
		let newCharacter: any = character ?? {
			characterName: getAnswer("name")?.answers,
			classes: [currentClassName],
			volk: currentVolkName,
			background: currentBackgroundName,
			attributes: {},
			ubungRW: [],
			ubungAB: [],
			ubungsBonus: "2",
			rk: "10",
			hp: 0,
			playerName: "",
			languages: [],
			data: {},
			fields: [],
		};
		if (character && !newCharacter.classes.includes(currentClassName)) {
			newCharacter = {
				...newCharacter,
				classes: [...newCharacter.classes, currentClassName],
			};
		}
		if (!character) {
			let attribs = getAnswer("attribute");
			if (!attribs || !Array.isArray(attribs.answers)) {
				if (!attribs && newAnswer && newAnswer.id == "attribute") {
					attribs = newAnswer;
				} else {
					return;
				}
			}
			for (const attrib of attribs.answers) {
				let name = attrib.split(":")[0];
				let value = attrib.split(":")[1];
				newCharacter.attributes[name] = value;
			}
		}
		newCharacter = updateField(
			newCharacter,
			"data.level",
			character ? "math:[oldValue+1]" : 1
		);
		newCharacter["ubungsBonus"] =
			2 +
			Math.floor(
				((parseInt(getFieldData(newCharacter, "data.level") ?? "1") ?? 1) - 1) /
					4
			) +
			"";
		newCharacter = updateField(
			newCharacter,
			"data.class.level." + currentClassName,
			getFieldData(newCharacter, "data.class.level." + currentClassName)
				? "math:[oldValue+1]"
				: 1
		);
		const volk = currentRace ?? (character ? character.volk : undefined);
		const clas = currentClass;
		if (volk) {
			for (let v of volk) {
				if (!v.performLevelUp) {
					continue;
				}
				newCharacter =
					v.performLevelUp(
						parseInt(getFieldData(newCharacter, "data.level") ?? "1") ?? 1,
						newAnswer ? [...answers, newAnswer] : answers,
						newCharacter,
						getFieldData,
						updateFieldArray,
						updateField,
						constData,
						!character
					) ?? newCharacter;
			}
		}

		if (clas) {
			for (let c of clas) {
				if (!c.performLevelUp) {
					continue;
				}
				newCharacter =
					c.performLevelUp(
						parseInt(
							getFieldData(
								newCharacter ?? {},
								"data.class.level." + currentClassName
							) ?? "1"
						) ?? 1,
						newAnswer ? [...answers, newAnswer] : answers,
						newCharacter,
						getFieldData,
						updateFieldArray,
						updateField,
						constData,
						!character
					) ?? newlineChars;
			}
		}

		if (currentBackground) {
			for (let v of currentBackground) {
				if (!v.performLevelUp) {
					continue;
				}
				newCharacter =
					v.performLevelUp(
						parseInt(getFieldData(newCharacter, "data.level") ?? "1") ?? 1,
						newAnswer ? [...answers, newAnswer] : answers,
						newCharacter,
						getFieldData,
						updateFieldArray,
						updateField,
						constData,
						!character
					) ?? newCharacter;
			}
		}

		onSave(newCharacter);
	};

	/**
	 *
	 * Handels onNext Button Click
	 *
	 * @param data Choices
	 * @param id Id of the Question
	 * @returns
	 */
	const onNext = (data: string[] | string, id: string) => {
		if (!queue) {
			return;
		}
		setCurrentPosition(currentPosition + 1);
		if (id == "volk") {
			if (Array.isArray(data)) {
				return;
			}
			setCurrentVolk(data);
		}
		if (character && !currentRace) {
			setCurrentVolk(character.volk);
		}
		if (character && !currentBackground) {
			setCurrentBackground(character.background);
		}
		if (id == "class") {
			if (Array.isArray(data)) {
				return;
			}
			setCurrentClass(data);
		}
		if (id == "background") {
			if (Array.isArray(data)) {
				return;
			}
			setCurrentBackground(data);
		}
		addAnswer({
			id: id,
			answers: data,
		});
		if (backFlag) {
			updateQueue({
				id: id,
				answers: data,
			});
			setBackFlag(false);
		}
		if (currentPosition + 1 >= queue.length) {
			if (
				currentPosition + 1 >=
				updateQueue({
					id: id,
					answers: data,
				})
			) {
				if (!currentClass || !currentRace || !currentBackground) {
					return;
				}
				setCurrentPosition(currentPosition);
				performSave({
					id: id,
					answers: data,
				});
				return;
			}
		}
	};

	if (!queue || !queue[currentPosition]) {
		return <></>;
	}

	if (queue[currentPosition].type == "attribute") {
		return (
			<DnDAttributeSlider
				onNext={(data) => {
					onNext(data, queue[currentPosition].id);
				}}
				onBack={
					currentPosition > 0
						? () => {
								setCurrentPosition(currentPosition - 1);
								setBackFlag(true);
							}
						: () => (window.location.href = "/ownCharacters")
				}
				def={
					getAnswer(queue[currentPosition].id) &&
					Array.isArray(getAnswer(queue[currentPosition].id)?.answers)
						? getAnswer(queue[currentPosition].id)?.answers
						: undefined
				}
			></DnDAttributeSlider>
		);
	}

	return (
		<DnDDialog
			key={queue[currentPosition].title + "dialog"}
			choices={queue[currentPosition].choices}
			defaultValue={
				getAnswer(queue[currentPosition].id)
					? getAnswer(queue[currentPosition].id)?.answers
					: queue[currentPosition].defaultValue
			}
			choiceDescription={(choice: any) => {
				if (queue[currentPosition].choiceDescription) {
					return queue[currentPosition].choiceDescription(
						choice,
						answers,
						constData,
						DEFAULT_FUNCTION_TOOLKIT,
						character
					);
				}
				return typeof choice == "string" ? undefined : choice.description;
			}}
			choiceDescriptionType={
				queue[currentPosition].choiceDescriptionType ?? "none"
			}
			description={queue[currentPosition].description}
			type={queue[currentPosition].type}
			onBack={
				currentPosition > 0
					? () => {
							setCurrentPosition(currentPosition - 1);
							setAnswers(answers.slice(0, answers.length - 1));
							setQueue(queue.slice(0, queue.length - 1));
							setBackFlag(true);
						}
					: () => (window.location.href = "/ownCharacters")
			}
			onNext={(data) => {
				onNext(data, queue[currentPosition].id);
			}}
			title={queue[currentPosition].title}
		></DnDDialog>
	);
}
