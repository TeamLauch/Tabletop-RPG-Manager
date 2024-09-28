import { CSSProperties } from "react";

interface WikiTreeNode {
	id: string;
	label: string;
	content: string;
	children: WikiTreeNode[];
}

type Field = {
	location: string;
	title: string;
	description: string;
	tab: string;
	type: string;
	disabled?: boolean;
	multiline?: boolean;
	choices?: string[] | { value: string; name: string }[];
};

type WidgetChild = {
	id: string;
	type: string;
	values: (
		playerData: any,
		characterData: any,
		toolkit: FunctionToolkit,
		constData: any
	) => any;
	title?: string;
	onClick?: (
		playerData: any,
		characterData: any,
		toolkit: FunctionToolkit,
		openPopup: (id: string, openAttributes: any) => void,
		event?: any
	) => any;
	style?: CSSProperties;
};

type Widget = {
	id: string;
	title?: string;
	type: "basic" | "fight" | "all";
	style?: CSSProperties;
	disabled?: boolean;
	children: WidgetChild[];
};

type FunctionToolkit = {
	getFieldData: (data: any, location: string) => any;
	resolveToValue: (data: any, valueString: string) => any;
	updateFieldArray: (
		data: any,
		location: string,
		values: any[],
		override: boolean,
		noresolve: boolean
	) => any;
	updateField: (
		data: any,
		location: string,
		newValue: any,
		noresovle: boolean
	) => any;
	resolveToValueWithOverride: (
		player: any,
		character: any,
		valueString: string
	) => any;
};

export type Popup = {
	id: string;
	title: string | ((popupData: any) => string);
	style?: CSSProperties;

	defaultData?: (
		playerData: any,
		characterData: any,
		openAttributes: any,
		toolkit: FunctionToolkit,
		constData: any
	) => any;
	children: {
		id: string;
		type: string;
		values: (
			popupData: any,
			playerData: any,
			characterData: any,
			toolkit: FunctionToolkit,
			constData: any
		) => any;
		onClick?: (
			popupData: any,
			openPopup: (id: string, openAttributes: any) => void,
			index?: number
		) => any;
		onChange?: (event: any, popupData: any, index?: number) => any;
		title?: string;
		style?: CSSProperties;
	}[];
	saveLabel?: string;
	onSave?: (
		popupData: any,
		playerData: any,
		characterData: any,
		toolkit: FunctionToolkit,
		constData: any
	) => any;
};
