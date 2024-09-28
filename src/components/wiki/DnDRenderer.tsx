import React, { useRef } from "react";
import { MdPreview, MdCatalog, config } from "md-editor-rt";
import "md-editor-rt/lib/preview.css";
import DE_DE from "@vavt/cm-extension/dist/locale/de-DE";

config({
	editorConfig: {
		languageUserDefined: {
			"de-DE": DE_DE,
		},
	},
});

export default function DnDRenderer({
	text,
	id,
}: {
	text: string;
	id: string;
}) {
	return (
		<>
			<MdPreview
				language="de-DE"
				editorId={id}
				modelValue={text}
				style={{
					backgroundColor: "rgba(200, 200, 255, 0.2)",
					borderRadius: "5px",
				}}
			/>
		</>
	);
}
