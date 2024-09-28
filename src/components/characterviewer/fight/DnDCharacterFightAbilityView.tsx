import { useCallback } from "react";
import DnDGameTextBox from "../DnDGameTextBox";

export default function DnDCharacterFightAbilityView({
	player,
	character,
	openPopup,
	abilities,
}: {
	player: any;
	character: any;
	openPopup: (id: string, openAttributes: any) => void;
	abilities: any[];
}) {
	/**
	 * Returns Ability by Name
	 */
	const getAbilitiesByName = useCallback(
		(name: string) => {
			if (!abilities) {
				return;
			}
			for (let a of abilities) {
				if (a.name == name) {
					return a;
				}
			}
			return undefined;
		},
		[abilities]
	);

	if (!abilities) {
		return;
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				textAlign: "center",
			}}
		>
			{character.data.abilities ? (
				character.data.abilities.map((item: any) => {
					if (!item) {
						return <></>;
					}
					let ab = getAbilitiesByName(item);
					if (!ab) {
						return (
							<div key={item + "show"}>
								<DnDGameTextBox
									backgroundColor="#DEDEDE"
									text={item}
									style={{ width: "100%" }}
								></DnDGameTextBox>
							</div>
						);
					}
					return (
						<div key={item + "show"}>
							<DnDGameTextBox
								backgroundColor="#DEDEDE"
								text={item}
								style={{ width: "100%" }}
								onClick={() => {
									openPopup("basic_abilities_show", ab);
								}}
							></DnDGameTextBox>
						</div>
					);
				})
			) : (
				<></>
			)}
			{player.transformData ? (
				player.transformData.abilities.map((item: any) => {
					if (!item) {
						return <></>;
					}

					let ab = getAbilitiesByName(item);
					if (!ab) {
						return (
							<div key={item + "show"}>
								<DnDGameTextBox
									backgroundColor="#DEDEDE"
									text={item}
									style={{ width: "100%" }}
								></DnDGameTextBox>
							</div>
						);
					}
					return (
						<div key={item + "show"}>
							<DnDGameTextBox
								backgroundColor="#DEDEDE"
								text={item}
								style={{ width: "100%" }}
								onClick={() => {
									openPopup("basic_abilities_show", ab);
								}}
							></DnDGameTextBox>
						</div>
					);
				})
			) : (
				<></>
			)}
			{character.data.traits ? (
				character.data.traits.map((item: any) => {
					if (!item) {
						return <></>;
					}

					return (
						<div key={item.name + "show"}>
							<DnDGameTextBox
								backgroundColor="#DEDEDE"
								text={item.name}
								style={{ width: "100%" }}
								onClick={() => {
									openPopup("basic_abilities_show", {
										name: item.name,
										description: item.value,
									});
								}}
							></DnDGameTextBox>
						</div>
					);
				})
			) : (
				<></>
			)}
			{character.legend ? (
				character.legend.map((item: any) => {
					if (!item) {
						return <></>;
					}

					return (
						<div key={item.name + "show"}>
							<DnDGameTextBox
								backgroundColor="#DEDEDE"
								text={item.name + " (Legendär)"}
								style={{ width: "100%" }}
								onClick={() => {
									openPopup("basic_abilities_show", {
										name: item.name,
										description: item.value,
									});
								}}
							></DnDGameTextBox>
						</div>
					);
				})
			) : (
				<></>
			)}
			{player.transformData && player.transformData.traits ? (
				player.transformData.traits.map((item: any) => {
					if (!item) {
						return <></>;
					}

					return (
						<div key={item.name + "show"}>
							<DnDGameTextBox
								backgroundColor="#DEDEDE"
								text={item.name}
								style={{ width: "100%" }}
								onClick={() => {
									openPopup("basic_abilities_show", {
										name: item.name,
										description: item.value,
									});
								}}
							></DnDGameTextBox>
						</div>
					);
				})
			) : (
				<></>
			)}
			{player.transformData && player.transformData.legend ? (
				player.transformData.legend.map((item: any) => {
					if (!item) {
						return <></>;
					}

					return (
						<div key={item.name + "show"}>
							<DnDGameTextBox
								backgroundColor="#DEDEDE"
								text={item.name + " (Legendär)"}
								style={{ width: "100%" }}
								onClick={() => {
									openPopup("basic_abilities_show", {
										name: item.name,
										description: item.value,
									});
								}}
							></DnDGameTextBox>
						</div>
					);
				})
			) : (
				<></>
			)}
			{player.transformData && player.transformData.damageResistance ? (
				player.transformData.damageResistance.map((item: any) => {
					if (!item) {
						return <></>;
					}

					return (
						<div key={item + "dg_show"}>
							<DnDGameTextBox
								backgroundColor="#DEDEDE"
								text={item + " resistenz"}
								style={{ width: "100%" }}
								onClick={() => {
									openPopup("basic_abilities_show", {
										name: item,
										description:
											"Du bist resistent(Halber Schaden) gegenüber Schaden durch " +
											item,
									});
								}}
							></DnDGameTextBox>
						</div>
					);
				})
			) : (
				<></>
			)}
			{!player.transformData && character.data.damageResistance ? (
				character.data.damageResistance.map((item: any) => {
					if (!item) {
						return <></>;
					}

					return (
						<div key={item + "dg_show"}>
							<DnDGameTextBox
								backgroundColor="#DEDEDE"
								text={item + " resistenz"}
								style={{ width: "100%" }}
								onClick={() => {
									openPopup("basic_abilities_show", {
										name: item,
										description:
											"Du bist resistent(Halber Schaden) gegenüber Schaden durch " +
											item,
									});
								}}
							></DnDGameTextBox>
						</div>
					);
				})
			) : (
				<></>
			)}

			{player.transformData && player.transformData.conditionImmunity ? (
				player.transformData.conditionImmunity.map((item: any) => {
					if (!item) {
						return <></>;
					}

					return (
						<div key={item + "dg_show"}>
							<DnDGameTextBox
								backgroundColor="#DEDEDE"
								text={item + " immunität"}
								style={{ width: "100%" }}
								onClick={() => {
									openPopup("basic_abilities_show", {
										name: item,
										description: "Du bist Immun gegenüber dem Zustand " + item,
									});
								}}
							></DnDGameTextBox>
						</div>
					);
				})
			) : (
				<></>
			)}
			{!player.transformData && character.data.conditionImmunity ? (
				character.data.conditionImmunity.map((item: any) => {
					if (!item) {
						return <></>;
					}

					return (
						<div key={item + "dg_show"}>
							<DnDGameTextBox
								backgroundColor="#DEDEDE"
								text={item + " immunität"}
								style={{ width: "100%" }}
								onClick={() => {
									openPopup("basic_abilities_show", {
										name: item,
										description: "Du bist Immun gegenüber dem Zustand " + item,
									});
								}}
							></DnDGameTextBox>
						</div>
					);
				})
			) : (
				<></>
			)}

			{player.transformData && player.transformData.damageEmpfind ? (
				player.transformData.damageEmpfind.map((item: any) => {
					if (!item) {
						return <></>;
					}

					return (
						<div key={item + "dg_show"}>
							<DnDGameTextBox
								backgroundColor="#DEDEDE"
								text={item + " empfindlichkeit"}
								style={{ width: "100%" }}
								onClick={() => {
									openPopup("basic_abilities_show", {
										name: item,
										description:
											"Du bist Empfindlich gegenüber " + item + " Schaden.",
									});
								}}
							></DnDGameTextBox>
						</div>
					);
				})
			) : (
				<></>
			)}
			{!player.transformData && character.data.damageEmpfind ? (
				character.data.damageEmpfind.map((item: any) => {
					if (!item) {
						return <></>;
					}

					return (
						<div key={item + "dg_show"}>
							<DnDGameTextBox
								backgroundColor="#DEDEDE"
								text={item + " empfindlichkeit"}
								style={{ width: "100%" }}
								onClick={() => {
									openPopup("basic_abilities_show", {
										name: item,
										description:
											"Du bist Empfindlich gegenüber " + item + " Schaden.",
									});
								}}
							></DnDGameTextBox>
						</div>
					);
				})
			) : (
				<></>
			)}

			{player.transformData && player.transformData.damageImmunity ? (
				player.transformData.damageImmunity.map((item: any) => {
					if (!item) {
						return <></>;
					}

					return (
						<div key={item + "dg_show"}>
							<DnDGameTextBox
								backgroundColor="#DEDEDE"
								text={item + " immunität"}
								style={{ width: "100%" }}
								onClick={() => {
									openPopup("basic_abilities_show", {
										name: item,
										description:
											"Du bist Immun gegenüber " + item + " Schaden.",
									});
								}}
							></DnDGameTextBox>
						</div>
					);
				})
			) : (
				<></>
			)}
			{!player.transformData && character.data.damageImmunity ? (
				character.data.damageImmunity.map((item: any) => {
					if (!item) {
						return <></>;
					}

					return (
						<div key={item + "dg_show"}>
							<DnDGameTextBox
								backgroundColor="#DEDEDE"
								text={item + " immunität"}
								style={{ width: "100%" }}
								onClick={() => {
									openPopup("basic_abilities_show", {
										name: item,
										description:
											"Du bist Immun gegenüber " + item + " Schaden.",
									});
								}}
							></DnDGameTextBox>
						</div>
					);
				})
			) : (
				<></>
			)}
		</div>
	);
}
