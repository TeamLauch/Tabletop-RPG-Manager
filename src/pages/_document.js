// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="de">
			{" "}
			{/* Optionally set the language */}
			<Head>
				<meta charSet="UTF-8" />
				{/* Other head tags */}
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
