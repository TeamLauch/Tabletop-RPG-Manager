export default function DnDCharacterImage({ src }: { src: string }) {
	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			alt=""
			loading="lazy"
			src={src}
			style={{
				width: "100%",
				aspectRatio: "1",
				borderRadius: "50%",
				borderStyle: "solid",
			}}
		></img>
	);
}
