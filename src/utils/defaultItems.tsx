export const ITEMS = [
	{
		secret: "",
		custom: true,
		data: {
			group: "Schwere Rüstung",
			value: "200 GM",
			onEquip: [
				{
					command: "17",
					location: "rk",
				},
			],
			onUnequip: [
				{
					command: "cha:[rk]",
					location: "rk",
				},
			],
		},
		equip: "armor",
		description:
			"Diese Rüstung besteht aus schmalen, länglichen Metallstreifen, die auf eine Lederschicht genietet sind und über einer wattierten Kleidungsschicht getragen werden. Ein flexibler Kettenpanzer schützt die Gelenke.",
		id: "armor-schienenpanzer",
		name: "Schienenpanzer",
		type: "item",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Leichte Rüstung",
			value: "10 GM",
			onEquip: [
				{
					command: "math:[11+att:[ges]]",
					location: "rk",
				},
			],
			onUnequip: [
				{
					command: "cha:[rk]",
					location: "rk",
				},
			],
		},
		equip: "armor",
		description:
			"Die Brustplatte und Schulterstücke dieser Rüstung sind aus Leder gefertigt, das in Öl gekocht wurde, um es zu härten. Der Rest der Rüstung besteht aus weicheren und flexibleren Materialien.",
		id: "armor-leder",
		name: "Leder Rüstung",
		type: "item",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Leichte Rüstung",
			value: "5 GM",
			onEquip: [
				{
					command: "math:[rk+att:[ges]]",
					location: "rk",
				},
			],
			onUnequip: [
				{
					command: "cha:[rk]",
					location: "rk",
				},
			],
		},
		equip: "armor",
		description:
			"Gepolsterte Rüstungen bestehen aus gesteppten Stoff- und Wattelagen.",
		id: "armor-gepolstert",
		name: "Gepolsterte Rüstung",
		type: "item",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Leichte Rüstung",
			value: "45 GM",
			onEquip: [
				{
					command: "math:[12+att:[ges]]",
					location: "rk",
				},
			],
			onUnequip: [
				{
					command: "cha:[rk]",
					location: "rk",
				},
			],
		},
		equip: "armor",
		description:
			"Beschlagenes Leder besteht aus widerstandsfähigem, aber flexiblem Leder, das mit dicht gesetzten Nieten oder Stiften verstärkt wurde.",
		id: "armor-beschlagenes-leder",
		name: "Beschlagene Leder Rüstung",
		type: "item",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Mittelschwere Rüstung",
			value: "10 GM",
			onEquip: [
				{
					command: "math:[12+min:[att:[ges],2]]",
					location: "rk",
				},
			],
			onUnequip: [
				{
					command: "cha:[rk]",
					location: "rk",
				},
			],
		},
		equip: "armor",
		description:
			"Diese grobe Rüstung besteht aus dicken Fellen und Pelzen. Sie wird häufig von Barbarenstämmen, bösen Humanoiden und anderen Individuen getragen, denen die Werkzeuge und Materialien zur Herstellung besserer Rüstungen fehlen.",
		id: "armor-fell",
		name: "Fell Rüstung",
		type: "item",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Mittelschwere Rüstung",
			value: "50 GM",
			onEquip: [
				{
					command: "math:[13+min:[att:[ges],2]]",
					location: "rk",
				},
			],
			onUnequip: [
				{
					command: "cha:[rk]",
					location: "rk",
				},
			],
		},
		equip: "armor",
		description:
			"Ein Kettenhemd besteht aus ineinandergreifenden Metallringen und wird zwischen Kleidungs- oder Lederschichten getragen. Diese Rüstung bietet dem Träger einen gewissen Schutz für den Oberkörper, während die äußeren Kleidungsschichten den Klang der aneinanderreibenden Ringe dämpfen.",
		id: "armor-kettenhemd",
		name: "Kettenhemd",
		type: "item",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Mittelschwere Rüstung",
			value: "50 GM",
			onEquip: [
				{
					command: "math:[14+min:[att:[ges],2]]",
					location: "rk",
				},
			],
			onUnequip: [
				{
					command: "cha:[rk]",
					location: "rk",
				},
			],
		},
		equip: "armor",
		description:
			"Diese Rüstung besteht aus einem Mantel und Beinlingen (sowie eventuell aus einem zusätzlichen Rock) aus Leder, die mit überlappenden Metallplatten im Schuppenmuster bedeckt sind. Zum Panzer gehören auch Handschuhe.",
		id: "armor-schuppenpanzer",
		name: "Schuppenpanzer",
		type: "item",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Mittelschwere Rüstung",
			value: "400 GM",
			onEquip: [
				{
					command: "math:[14+min:[att:[ges],2]]",
					location: "rk",
				},
			],
			onUnequip: [
				{
					command: "cha:[rk]",
					location: "rk",
				},
			],
		},
		equip: "armor",
		description:
			"Diese Rüstung besteht aus einem maßgefertigten Brustpanzer aus Metall, der mit weichem Leder getragen wird. Arme und Beine des Trägers bleiben zwar relativ ungeschützt, doch diese Rüstung schützt die lebenswichtigen Organe des Trägers, ohne dessen Bewegungsfreiheit allzu sehr einzuschränken.",
		id: "armor-brustplatte",
		name: "Brustplatte",
		type: "item",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Mittelschwere Rüstung",
			value: "750 GM",
			onEquip: [
				{
					command: "math:[15+min:[att:[ges],2]]",
					location: "rk",
				},
			],
			onUnequip: [
				{
					command: "cha:[rk]",
					location: "rk",
				},
			],
		},
		equip: "armor",
		description:
			"Ein Plattenpanzer besteht aus geformten Metallplatten, die den Großteil des Körpers bedecken. Die Beine werden allerdings nur durch einfache Beinschienen geschützt, die mit Lederriemen befestigt sind.",
		id: "armor-plattenpanzer",
		name: "Plattenpanzer\t",
		type: "item",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Schwere Rüstung",
			value: "30 GM",
			onEquip: [
				{
					command: "14",
					location: "rk",
				},
			],
			onUnequip: [
				{
					command: "cha:[rk]",
					location: "rk",
				},
			],
		},
		equip: "armor",
		description:
			"Diese Rüstung ist eine Lederrüstung, in die schwere Ringe eingenäht wurden. Die Ringe helfen, die Rüstung gegen Schwert- und Axthiebe zu verstärken. Ringpanzer sind weniger effektiv als Kettenpanzer und werden üblicherweise von jenen getragen, die sich keine bessere Rüstung leisten können.",
		id: "armor-ringpanzer",
		name: "Ringpanzer",
		type: "item",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Schwere Rüstung",
			value: "75 GM",
			onEquip: [
				{
					command: "16",
					location: "rk",
				},
			],
			onUnequip: [
				{
					command: "cha:[rk]",
					location: "rk",
				},
			],
		},
		equip: "armor",
		description:
			"Ein Kettenpanzer besteht aus ineinandergreifenden Metallringen und einer Schicht gesteppten Stoffes, die unter der Kettenschicht getragen wird, um Scheuerstellen zu verhindern und Schläge und Hiebe abzufedern. Zum Panzer gehören auch Handschuhe.",
		id: "armor-kettenpanzer",
		name: "Kettenpanzer",
		type: "item",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Schwere Rüstung",
			value: "1500 GM",
			onEquip: [
				{
					command: "18",
					location: "rk",
				},
			],
			onUnequip: [
				{
					command: "cha:[rk]",
					location: "rk",
				},
			],
		},
		equip: "armor",
		description:
			"Eine Ritterrüstung besteht aus geformten, ineinandergreifenden Metallplatten, die den ganzen Körper bedecken. Zur Ritterrüstung gehören Handschuhe, schwere Lederstiefel, ein Helm mit Visier und eine dicke Wattierung unter der Rüstung. Schnallen und Riemen verteilen das Gewicht über den Körper.",
		id: "armor-ritterrüstung",
		name: "Ritterrüstung",
		type: "item",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Schild",
			value: "10 GM",
			onEquip: [
				{
					command: "math:[oldValue+2]",
					location: "rk",
				},
			],
			onUnequip: [
				{
					command: "math:[oldValue-2]",
					location: "rk",
				},
			],
		},
		equip: "hand",
		description: "Ein Schild dient der Verteidigung und erhöht die RK um 2",
		id: "equip-schild",
		name: "Schild",
		type: "item",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Einfache Nahkampfwaffen",
			value: "5 GM",
			weapon: {
				range: "1,5 m oder Wurfwaffe (Reichweite 6/18)",
				damage: "1W6+att:[sta] Hiebschaden",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-beil",
		name: "Beil",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Einfache Nahkampfwaffen",
			value: "2 SM",
			weapon: {
				range: "1,5 m",
				damage: "1W6(1W8 wenn zweihändig) + att:[sta] Wuchtschaden",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-kampfstab",
		name: "Kampfstab",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Einfache Nahkampfwaffen",
			value: "2 GM",
			weapon: {
				range: "1,5 m oder Wurfwaffe (Reichweite 6/18)",
				damage: "1W4+max:[att:[ges],att:[sta]] Stichschaden",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
				description:
					"Alternativ kannst du Anstelle deines Stärkemodifikators  +att:[sta] deinen Geschicklichkeitsmodifikator +att:[ges] für den Angriffswurf nutzen. (Bist du geübt in der Waffe so addiere noch deinen Übungsbonus)",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-dolch",
		name: "Dolch",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Einfache Nahkampfwaffen",
			value: "1 SM",
			weapon: {
				range: "1,5m",
				damage: "1W4+att:[sta] Wuchtschaden",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-knueppel",
		name: "Knüppel",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Einfache Nahkampfwaffen",
			value: "2 GM",
			weapon: {
				range: "1,5 oder Wurfwaffe(Reichweite 6/18)",
				damage: "1W4+att:[sta] Wuchtschaden",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-leichter-hammer",
		name: "Leichter Hammer",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Einfache Nahkampfwaffen",
			value: "1 Gm",
			weapon: {
				range: "1,5m",
				damage: "1W4+att:[sta] Heibschaden",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-sichel",
		name: "Sichel",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Einfache Nahkampfwaffen",
			value: "1 GM",
			weapon: {
				range: "1,5m oder Wurfwaffe(Reichweite 6/18)",
				damage: "1W6(Zweihändig 1W8)+att:[sta]",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-speer",
		name: "Speer",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Einfache Nahkampfwaffen",
			value: "5 SM",
			weapon: {
				range: "1,5m oder Wurfwaffe(Reichweite 9/36)",
				damage: "1W6+att:[sta] Stichschaden",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-wurfspeer",
		name: "Wurfspeer",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Einfache Nahkampfwaffen",
			value: "5 GM",
			weapon: {
				range: "1,5",
				damage: "1W6+att:[sta] Wuchtschaden",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-streitkolben",
		name: "Streitkolben",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Einfache Nahkampfwaffen",
			value: "2 SM",
			weapon: {
				range: "1,5m",
				damage: "1W8+att:[sta]",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
				description: "Diese Waffen müssen mit zwei Händen geführt werden.",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-zweihandknueppel",
		name: "Zweihandknüppel",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Einfache Fernkampfwaffen",
			value: "25 GM",
			weapon: {
				range: "25m/96m",
				damage: "1W8+att:[ges] Stichschaden",
				weaponType: "Fernkampfwaffe",
				attribute: "Geschicklichkeit",
				description:
					"Da das Laden einer solchen Waffe lange dauert, kannst du mit einer Aktion, Bonusaktion oder Reaktion immer nur ein Geschoss abfeuern, unabhängig davon, wie viele Angriffe dir zur Verfügung stehen.\n\nDiese Waffen müssen mit zwei Händen geführt werden.",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-leichte-armbrust",
		name: "Leichte Armbrust",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Einfache Fernkampfwaffen",
			value: "25 GM",
			weapon: {
				range: "24m/96m",
				damage: "1W6+att:[ges] Stichschaden",
				weaponType: "Fernkampfwaffe",
				attribute: "Geschicklichkeit",
				description: "Diese Waffen müssen mit zwei Händen geführt werden.",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-kurzbogen",
		name: "Kurzbogen",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Einfache Fernkampfwaffen",
			value: "1SM",
			weapon: {
				range: "9m/36m",
				damage: "1W4+att:[ges] Wucht",
				weaponType: "Fernkampfwaffe",
				attribute: "Geschicklichkeit",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-schleuder",
		name: "Schleuder",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			value: "5 KM",
			weapon: {
				range: "6/18m",
				damage: "1W4+max:[att:[ges],att:[sta]] Stichschaden",
				attribute: "Geschicklichkeit",
				weaponType: "Fernkampfwaffe",
				description:
					"Du kannst alternativ deinen Stärkewert (+att:[sta]) für den Angriffswurf nutzen. (Bist du in der Waffe geübt so addiere dazu noch den Übungsbonus)",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-wurfpfeil",
		name: "Wurfpfeil",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Nahkampf-Kriegswaffen",
			value: "5 GM",
			weapon: {
				range: "1,5m oder Wurfwaffe (Reichweite 6/18)",
				damage: "1W6(Zweihändig 1W8)+att:[sta] Stichschaden",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-dreizack",
		name: "Dreizack",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Nahkampf-Kriegswaffen",
			value: "10 GM",
			weapon: {
				range: "1,5m",
				attribute: "Stärke",
				damage: "1W8+att:[sta] Wuchtschaden",
				weaponType: "Nahkampfwaffe",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-flegel",
		name: "Flegel",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Nahkampf-Kriegswaffen",
			value: "20 GM",
			weapon: {
				range: "3m",
				damage: "1W10+att:[sta] Hiebschaden",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
				description: "Diese Waffen müssen mit zwei Händen geführt werden.",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-glefe",
		name: "Glefe",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Nahkampf-Kriegswaffen",
			value: "20 GM",
			weapon: {
				range: "3m",
				damage: "1W10+att:[sta]",
				attribute: "Stärke",
				weaponType: "Nahkampfwaffe",
				description: "Diese Waffen müssen mit zwei Händen geführt werden.\n\n",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-hellebarde",
		name: "Hellebarde",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Nahkampf-Kriegswaffen",
			value: "15 GM",
			weapon: {
				range: "1,5m",
				attribute: "Stärke",
				damage: "1W8(Zweihändig 1W10)+att:[sta]",
				weaponType: "Nahkampfwaffe",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-kriegshammer",
		name: "Kriegshammer",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Nahkampf-Kriegswaffen",
			value: "5 GM",
			weapon: {
				range: "1,5m",
				attribute: "Stärke",
				damage: "1W8+att:[sta] Stichschaden",
				weaponType: "Nahkampfwaffe",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-kriegspicke",
		name: "Kriegspicke",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Nahkampf-Kriegswaffen",
			value: "25 GM",
			weapon: {
				range: "1,5m",
				damage: "1W6+max:[att:[ges],att:[sta]] Heibschaden",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
				description:
					"Alternativ kannst du Anstelle deines Stärkemodifikators  +att:[sta] deinen Geschicklichkeitsmodifikator +att:[ges] für den Angriffswurf nutzen. (Bist du geübt in der Waffe so addiere noch deinen Übungsbonus)",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-krummsaebel",
		name: "Krummsäbel",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Nahkampf-Kriegswaffen",
			value: "10 GM",
			weapon: {
				range: "1,5m",
				damage: "1W6+max:[att:[ges],att:[sta]]",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
				description:
					"Alternativ kannst du Anstelle deines Stärkemodifikators  +att:[sta] deinen Geschicklichkeitsmodifikator +att:[ges] für den Angriffswurf nutzen. (Bist du geübt in der Waffe so addiere noch deinen Übungsbonus)",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-kurzschwert",
		name: "Kurzschwert",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Nahkampf-Kriegswaffen",
			value: "15GM",
			weapon: {
				range: "1,5m",
				damage: "1W8(Zweihändig 1W10)+att:[sta]",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-langschwert",
		name: "Langschwert",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Nahkampf-Kriegswaffen",
			value: "10 GM",
			weapon: {
				range: "3m",
				damage: "1W12+att:[sta] Stichschaden",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
				description:
					"Wenn du ein Ziel im Abstand von bis zu 1,5 Metern von dir mit einer Lanze angreifst, bist du im Nachteil. Außerdem muss eine Lanze mit zwei Händen geführt werden, wenn du nicht reitest.",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-lanze",
		name: "Lanze",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Nahkampf-Kriegswaffen",
			value: "15 GM",
			weapon: {
				range: "1,5m",
				damage: "1W8+att:[sta] Stichschaden",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-morgenstern",
		name: "Morgenstern",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Nahkampf-Kriegswaffen",
			value: "5 GM",
			weapon: {
				range: "3m",
				damage: "1W10+att:[sta] Stichschaden",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
				description: "Diese Waffen müssen mit zwei Händen geführt werden.",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-pike",
		name: "Pike",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Nahkampf-Kriegswaffen",
			value: "25 GM",
			weapon: {
				range: "1,5m",
				damage: "1W8+max:[att:[sta],att:[ges]] Stichschaden",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
				description:
					"Alternativ kannst du Anstelle deines Stärkemodifikators  +att:[sta] deinen Geschicklichkeitsmodifikator +att:[ges] für den Angriffswurf nutzen. (Bist du geübt in der Waffe so addiere noch deinen Übungsbonus)",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-rapier",
		name: "Rapier",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Nahkampf-Kriegswaffen",
			value: "2 GM",
			weapon: {
				range: "3m",
				damage: "1W4+max:[att:[sta],att:[ges]] Hiebschaden",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
				description:
					"Alternativ kannst du Anstelle deines Stärkemodifikators  +att:[sta] deinen Geschicklichkeitsmodifikator +att:[ges] für den Angriffswurf nutzen. (Bist du geübt in der Waffe so addiere noch deinen Übungsbonus)",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-peitsche",
		name: "Peitsche",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Nahkampf-Kriegswaffen",
			value: "10 GM",
			weapon: {
				range: "1,5m",
				damage: "1W8(Zweihändig 1W10)+att:[sta]",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-streitaxt",
		name: "Streitaxt",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Nahkampf-Kriegswaffen",
			value: "30 GM",
			weapon: {
				range: "1,5m",
				damage: "1W12+att:[sta] Hiebschaden",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
				description: "Diese Waffen müssen mit zwei Händen geführt werden.",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-zweihandaxt",
		name: "Zweihandaxt",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Nahkampf-Kriegswaffen",
			value: "10 GM",
			weapon: {
				range: "1,5m",
				damage: "2W6+att:[sta] Wuchtschaden",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
				description: "Diese Waffen müssen mit zwei Händen geführt werden.",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-zweihandhammer",
		name: "Zweihandhammer",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Nahkampf-Kriegswaffen",
			value: "50 GM",
			weapon: {
				range: "1,5 m",
				damage: "2W6+att:[sta] Heibschaden",
				weaponType: "Nahkampfwaffe",
				attribute: "Stärke",
				description: "Diese Waffen müssen mit zwei Händen geführt werden.",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-zweihandschwert",
		name: "Zweihandschwert",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Fernkampf-Kriegswaffen",
			value: "75 GM",
			weapon: {
				range: "9m/36m",
				damage: "1W6+att:[ges] Stichschaden",
				weaponType: "Fernkampfwaffe",
				attribute: "Geschicklichkeit",
				description:
					"Da das Laden einer solchen Waffe lange dauert, kannst du mit einer Aktion, Bonusaktion oder Reaktion immer nur ein Geschoss abfeuern, unabhängig davon, wie viele Angriffe dir zur Verfügung stehen.",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-handarmbrust",
		name: "Handarmbrust",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Fernkampf-Kriegswaffen",
			value: "50 GM",
			weapon: {
				range: "30m/120m",
				damage: "1W10+att:[ges] Stichschaden",
				weaponType: "Fernkampfwaffe",
				attribute: "Geschicklichkeit",
				description:
					"Da das Laden einer solchen Waffe lange dauert, kannst du mit einer Aktion, Bonusaktion oder Reaktion immer nur ein Geschoss abfeuern, unabhängig davon, wie viele Angriffe dir zur Verfügung stehen.\n\nDiese Waffen müssen mit zwei Händen geführt werden.",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-schwere-armbrust",
		name: "Schwere Armbrust",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Fernkampf-Kriegswaffen",
			value: "10 GM",
			weapon: {
				range: "7,5m/30m",
				damage: "1+att:[ges] Stichschaden",
				weaponType: "Fernkampfwaffe",
				attribute: "Geschicklichkeit",
				description:
					"Da das Laden einer solchen Waffe lange dauert, kannst du mit einer Aktion, Bonusaktion oder Reaktion immer nur ein Geschoss abfeuern, unabhängig davon, wie viele Angriffe dir zur Verfügung stehen.",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-blasrohr",
		name: "Blasrohr",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Fernkampf-Kriegswaffen",
			value: "50 GM",
			weapon: {
				range: "45m/180m",
				damage: "1W8+att:[ges] Stichschaden",
				weaponType: "Fernkampfwaffe",
				description: "Diese Waffen müssen mit zwei Händen geführt werden.",
				attribute: "Geschicklichkeit",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-langbogen",
		name: "Langbogen",
		type: "weapon",
	},
	{
		secret: "",
		custom: true,
		data: {
			group: "Fernkampf-Kriegswaffen",
			value: "1 GM",
			weapon: {
				range: "1,5m/4,5m",
				damage: "0",
				weaponType: "Fernkampfwaffe",
				attribute: "Geschicklichkeit",
				description:
					"Eine höchstens große Kreatur, die mit einem Netz getroffen wird, ist festgesetzt, bis sie sich befreien kann oder befreit wird. Ein Netz hat keinen Einfluss auf formlose Kreaturen oder riesige beziehungsweise größere Kreaturen. Kreaturen können ihre Aktion verwenden, um einen SG-10-Stärkewurf auszuführen und sich oder eine andere Kreatur in Reichweite bei einem Erfolg zu befreien. Werden dem Netz 5 Punkte Hiebschaden (RK10) zugefügt, wird die Kreatur ebenfalls befreit, ohne sie zu verletzen. Der Effekt endet und das Netz wird zerstört.\n\nWenn du eine Aktion, Bonusaktion oder Reaktion verwendest, um mit einem Netz anzugreifen, kannst du nur einen Angriff ausführen, egal, wie viele Angriffe du normalerweise ausführen könntest.",
			},
		},
		equip: "hand",
		description: "",
		id: "weapon-netz",
		name: "Netz",
		type: "weapon",
	},
];
