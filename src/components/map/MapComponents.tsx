import {
	deleteTokenFromMap,
	setActiveMap,
	setVisibilityOfToken,
	updateMap,
} from "@/utils/game";
import {
	Delete,
	Grid3x3,
	Grid3x3TwoTone,
	Grid4x4,
	LocationOn,
	Save,
	Visibility,
	VisibilityOff,
} from "@mui/icons-material";
import { Button, IconButton, Slider, Tooltip } from "@mui/material";
import { eventNames } from "process";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";

/**
 *
 * @param style Style of the NameTag
 * @param children Data of the NameTag
 * @returns
 */
export function MapNameTag({
	position,
	children,
	scale,
}: Readonly<{
	position: { x: number; y: number };
	children?: any;
	scale: number;
}>) {
	return (
		<div
			style={{
				marginLeft: position.x + "px",
				marginTop: position.y + "px",
				backgroundColor: "#EEEEFE",
				border: "1px solid #ddd",
				borderRadius: "10px",
				boxShadow: "0 0 10px rgba(0,0,0,0.1)",
				display: "inline-flex",
				color: "black",
				maxHeight: scale * 3 + "px",
				justifyContent: "center",
				fontSize: scale + "px",
				width: scale * 7 + "px",
			}}
		>
			{children}
		</div>
	);
}

/**
 *
 * @param
 * @returns
 */
export function MapToken({
	style,
	children,
	position,
	color,
	selected,
	id,
	type,
	onClick = () => {},
	onMouseMove = () => {},
}: Readonly<{
	color: string;
	style: CSSProperties;
	children?: any;
	id: string;
	type: "npc" | "player";
	position: { x: number; y: number; width: number; height: number };
	selected: boolean;
	onClick?: (event: any) => void;
	onMouseMove?: (event: any) => void;
}>) {
	const [imageBrocken, setImgBrocken] = useState(false);

	return (
		<div
			style={{
				...style,
				position: "absolute",
				marginLeft: position.x + (selected ? -1 : 0) + "px",
				border: imageBrocken ? (selected ? "2px solid" : "none") : undefined,

				borderRadius: "50%",
				marginTop: position.y + (selected ? -1 : 0) + "px",
				backgroundColor: imageBrocken ? color : undefined,
				width: position.width + (selected ? 2 : 0),
				height: position.height + (selected ? 2 : 0),
			}}
			onClick={onClick}
			onMouseMove={onMouseMove}
		>
			{!imageBrocken ? (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					onError={() => {
						setImgBrocken(true);
					}}
					style={{
						borderStyle: "solid",
						marginLeft: "-1%",
						marginTop: "-1%",
						borderWidth: "1%",
						width: "98%",
						height: "98%",
						aspectRatio: "1",
						borderColor: selected ? "white" : "black",
						borderRadius: "50%",
					}}
					src={
						"/api/file/getImage?type=" +
						(type != "npc" ? "character" : "npc") +
						"&id=" +
						id
					}
				></img>
			) : (
				<></>
			)}
			{children}
		</div>
	);
}

export function EffectsCanvas({
	width,
	height,
	images,
}: {
	width: number;
	height: number;
	images: {
		path: string;
		maxStates: number;
		stillTime: number;
		mask: HTMLImageElement | string;
	}[];
}) {
	const canvasRef = useRef(null);
	const [glContex, setGl] = useState<WebGLRenderingContext | null>(null);

	const [textureLocation, setTextureLocation] =
		useState<WebGLUniformLocation | null>(null);
	const [maskLocation, setMaskLocation] = useState<WebGLUniformLocation | null>(
		null
	);
	const [stateLocation, setStateLocation] =
		useState<WebGLUniformLocation | null>(null);
	const [maxStatesLocation, setMaxStatesLocation] =
		useState<WebGLUniformLocation | null>(null);

	useEffect(() => {
		const canvas: any = canvasRef.current;
		const gl: WebGLRenderingContext = canvas.getContext("webgl");

		if (!gl) {
			console.error(
				"Unable to initialize WebGL. Your browser may not support it."
			);
			return;
		}
		// Vertex shader source code
		const vsSource = `
    attribute vec2 position;
    varying vec2 texCoord; // Pass texture coordinates to the fragment shader
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
      texCoord = (position + 1.0) / 2.0;
    }
  `;

		// Fragment shader source code
		const fsSource = `
    precision mediump float;
    varying vec2 texCoord; // Receive texture coordinates from the vertex shader
    uniform sampler2D uTexture;
    uniform int state;
    uniform int maxStates;
    uniform sampler2D mask;
  
    void main() {
      vec2 texCoordModified = vec2(texCoord.x, 1.0 - texCoord.y); // Flip the y-coordinate
      vec4 texColor = texture2D(uTexture, texCoordModified);
      vec4 maskColor = texture2D(mask, texCoordModified);

      gl_FragColor = vec4(texColor.rgb, length(maskColor));
    }
  `;

		// Compile shader
		const compileShader = (gl: any, source: any, type: any) => {
			const shader = gl.createShader(type);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				console.error(
					"An error occurred compiling the shaders:",
					gl.getShaderInfoLog(shader)
				);
				gl.deleteShader(shader);
				return null;
			}
			return shader;
		};

		const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
		const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);

		// Create shader program
		const shaderProgram: any = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			console.error(
				"Unable to initialize the shader program:",
				gl.getProgramInfoLog(shaderProgram)
			);
			return () => {};
		}
		gl.useProgram(shaderProgram);

		// Set time uniform
		setTextureLocation(gl.getUniformLocation(shaderProgram, "uTexture"));
		setStateLocation(gl.getUniformLocation(shaderProgram, "state"));
		setMaxStatesLocation(gl.getUniformLocation(shaderProgram, "maxStates"));
		setMaskLocation(gl.getUniformLocation(shaderProgram, "mask"));
		// Create buffer for square
		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		const positionAttributeLocation = gl.getAttribLocation(
			shaderProgram,
			"position"
		);
		gl.enableVertexAttribArray(positionAttributeLocation);
		gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

		setGl(gl);
		let then = 0;

		const texture = gl.createTexture();
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);

		// Set the texture parameters
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

		const maskTexture = gl.createTexture();
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, maskTexture);

		const bindTexture = (path: string, mask: HTMLImageElement | string) => {
			// Upload image data to the texture
			const image = new Image();
			image.onload = () => {
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, texture);
				gl.texImage2D(
					gl.TEXTURE_2D,
					0,
					gl.RGBA,
					gl.RGBA,
					gl.UNSIGNED_BYTE,
					image
				);
			};

			image.src = path; // Replace 'path_to_your_image.jpg' with the path to your image

			if (typeof mask == "string") {
				const img = new Image();
				img.onload = () => {
					gl.activeTexture(gl.TEXTURE1);
					gl.bindTexture(gl.TEXTURE_2D, maskTexture);
					gl.texImage2D(
						gl.TEXTURE_2D,
						0,
						gl.RGBA,
						gl.RGBA,
						gl.UNSIGNED_BYTE,
						img
					);
				};
				img.src = mask;
			} else {
				gl.activeTexture(gl.TEXTURE1);
				gl.bindTexture(gl.TEXTURE_2D, maskTexture);
				gl.texImage2D(
					gl.TEXTURE_2D,
					0,
					gl.RGBA,
					gl.RGBA,
					gl.UNSIGNED_BYTE,
					mask
				);
			}

			// Set the uniform variable for the texture
			gl.uniform1i(textureLocation, 0);
			gl.uniform1i(maskLocation, 1);
			return texture;
		};

		const render = (now: any) => {
			now *= 0.001; // convert to seconds
			const deltaTime = now - then;
			then = now;

			gl.clearColor(0, 0, 0, 1);
			gl.clear(gl.COLOR_BUFFER_BIT);
			for (const i of images) {
				bindTexture(i.path, i.mask);
				gl.uniform1i(
					stateLocation,
					Math.floor((now * 1000) / i.stillTime) % i.maxStates
				);
				gl.uniform1i(maxStatesLocation, i.maxStates);
				gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
			}
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);

		return () => {
			gl.deleteProgram(shaderProgram);
			gl.deleteShader(vertexShader);
			gl.deleteShader(fragmentShader);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			width={width + 2 + "px"}
			height={height + 2 + "px"}
			style={{ pointerEvents: "none", zIndex: 10, position: "absolute" }}
		/>
	);
}

export function FogOfWarCanvas({
	alpha = 1,
	width,
	height,
	walls,
	viewer,
	fogColor,
	grid,
}: {
	alpha: number;
	width: number;
	height: number;
	walls: { x: number; y: number }[];
	fogColor: number[];
	grid: any;
	viewer: {
		posX: number;
		posY: number;
		width: number;
		coneAngle?: number;
		coneView?: { x: number; y: number };
		height: number;
		type: "circle" | "square" | "cone" | "none";
	}[];
}) {
	const canvasRef = useRef(null);
	const [glContex, setGl] = useState<WebGLRenderingContext | null>(null);

	const [uniformFogColorLocation, setUniformFogColorLocation] =
		useState<WebGLUniformLocation | null>(null);
	const [uniformViewPointsLocation, setUniformViewPointsLocation] =
		useState<WebGLUniformLocation | null>(null);
	const [uniformWallsLocation, setUniformWallsLocation] =
		useState<WebGLUniformLocation | null>(null);
	const [uniformStartAlphaLocation, setUniformStartAlphaLocation] =
		useState<WebGLUniformLocation | null>(null);

	const render = () => {
		if (!glContex) return;
		glContex.clearColor(0, 0, 0, 1);
		glContex.clear(glContex.COLOR_BUFFER_BIT);
		glContex.uniform3fv(uniformFogColorLocation, fogColor);
		glContex.uniform1f(uniformStartAlphaLocation, alpha);
		let viewersArray: any[] = [];
		for (let i = 0; i < 50; i++) {
			if (i < viewer.length) {
				const v = viewer[i];
				viewersArray.push([
					v.posX,
					v.posY + 2,
					v.coneView ? v.coneView?.x : 0,
					v.coneView ? v.coneView?.y : 0,
					v.type == "circle"
						? 2
						: v.type == "square"
							? 1
							: v.type == "cone"
								? 3
								: -1,
					v.width,
					v.type == "cone" ? v.coneAngle : v.height,
					grid.scale,
				]);
				continue;
			}
			viewersArray.push([0, 0, 0, 0, 0, 0, 0, 0]);
		}
		let flatViewerArray = viewersArray.flat();
		glContex.uniform4fv(uniformViewPointsLocation, flatViewerArray);
		glContex.drawArrays(glContex.TRIANGLE_STRIP, 0, 4);
	};

	useEffect(() => {
		const canvas: any = canvasRef.current;
		const gl: WebGLRenderingContext = canvas.getContext("webgl");

		if (!gl) {
			console.error(
				"Unable to initialize WebGL. Your browser may not support it."
			);
			return;
		}
		// Vertex shader source code
		const vsSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

		// Fragment shader source code
		const fsSource = `
      precision mediump float;
      uniform vec3 fogColor;
      uniform vec4 viewPoints[100];
      uniform vec4 walls[50];
      uniform float startAlpha;
      void main() {
        vec4 st = gl_FragCoord;
        float alpha = startAlpha;
        for(int i = 0; i < 50; i++){
          vec4 pos = viewPoints[2*i];
          vec4 attr = viewPoints[2*i+1];
          if(attr.x == 1.0){
            vec2 minPx = pos.xy - attr.yz/2.;
            vec2 maxPx = pos.xy + attr.yz/2.;
            if(minPx.x <= st.x && maxPx.x >= st.x && minPx.y <= st.y && maxPx.y >= st.y){
              alpha = 0.0;
            }
          }else if(attr.x == 2.0){
            if(length(st.xy-pos.xy) <= attr.y/2.){
              alpha = 0.0;
            }
          }else if(attr.x == 3.0){
            if(length(st.xy-pos.xy) <= attr.y/2.){
              if(acos(dot(st.xy-pos.xy,pos.zw) / (length(st.xy-pos.xy)*length(pos.zw))) < attr.z/2.){
                alpha = 0.0;
              }
            }
          }
          if(alpha == 0){
            for(int i = 0; i < 50; i++){
              if(walls[i]){
                if()
              }
            }
          }
          vec2 minPxC = pos.xy - vec2(attr.w/2., attr.w/2.);
          vec2 maxPxC = pos.xy + vec2(attr.w/2., attr.w/2.);
          if(minPxC.x <= st.x && maxPxC.x >= st.x && minPxC.y <= st.y && maxPxC.y >= st.y){
            alpha = 0.0;
          }
        }

        gl_FragColor = vec4(fogColor, alpha);
      }
    `;

		// Compile shader
		const compileShader = (gl: any, source: any, type: any) => {
			const shader = gl.createShader(type);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				console.error(
					"An error occurred compiling the shaders:",
					gl.getShaderInfoLog(shader)
				);
				gl.deleteShader(shader);
				return null;
			}
			return shader;
		};

		const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
		const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);

		// Create shader program
		const shaderProgram: any = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			console.error(
				"Unable to initialize the shader program:",
				gl.getProgramInfoLog(shaderProgram)
			);
			return () => {};
		}
		gl.useProgram(shaderProgram);

		// Set time uniform
		setUniformViewPointsLocation(
			gl.getUniformLocation(shaderProgram, "viewPoints")
		);
		setUniformFogColorLocation(
			gl.getUniformLocation(shaderProgram, "fogColor")
		);
		setUniformWallsLocation(gl.getUniformLocation(shaderProgram, "walls"));
		setUniformStartAlphaLocation(
			gl.getUniformLocation(shaderProgram, "startAlpha")
		);

		// Create buffer for square
		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		const positionAttributeLocation = gl.getAttribLocation(
			shaderProgram,
			"aPosition"
		);
		gl.enableVertexAttribArray(positionAttributeLocation);
		gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

		setGl(gl);
		render();

		return () => {
			gl.deleteProgram(shaderProgram);
			gl.deleteShader(vertexShader);
			gl.deleteShader(fragmentShader);
		};
	}, []);

	useEffect(() => {
		render();
	}, [walls, viewer, fogColor]);

	return (
		<canvas
			ref={canvasRef}
			width={width + 2 + "px"}
			height={height + 2 + "px"}
			style={{ pointerEvents: "none", zIndex: 10, position: "absolute" }}
		/>
	);
}

export function ViewOnlyMapCP({
	images,
	fogOfWar = { color: [0, 0, 0], visible: false },
	ts,
	grid = { color: "black", scale: 20, type: "none" },
	dimensions,
	map,
}: {
	images: string[];
	fogOfWar: {
		color: any[];
		visible: boolean;
	};
	ts: {
		type: "npc" | "player";
		id: string;
		position: { x: number; y: number };
		size: number;
		visible: boolean;
		viewType: "cone" | "square" | "circle";
		viewDistance: any;
		color: string;
		coneAngle: number;
		coneView: number;
	}[];
	grid: { color: string; scale: number; type: "square" | "none" };
	dimensions: { x: number; y: number };
	map: any;
}) {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [scale, setScale] = useState(1);
	const [width, setDisplayHeight] = useState(1);
	const [height, setDisplayWidth] = useState(1);

	useEffect(() => {
		if (!map || !map.camera) {
			return;
		}
		setScale(map.camera.scale);
		setPosition(map.camera.position);
	}, [map]);

	useEffect(() => {
		console.log(dimensions);
		setDisplayHeight(dimensions.x);
		setDisplayWidth(dimensions.y);
	}, [dimensions]);

	const getGridHeightArray = () => {
		let a: number[] = [];
		for (let i = position.y % grid.scale; i <= height; i += grid.scale) {
			a.push(i);
		}
		return a;
	};

	const tokensToViewers = () => {
		let ar: any[] = [];
		if (!ts) {
			return [];
		}
		for (const t of ts) {
			if (t.type != "player") continue;
			ar.push({
				posX: t.position.x * grid.scale + position.x + grid.scale / 2,
				posY:
					height - (t.position.y * grid.scale + position.y + grid.scale / 2),
				width: ((t.viewDistance * 2) / 1.5) * grid.scale,
				height: ((t.viewDistance * 2) / 1.5) * grid.scale,
				type: t.viewType,
				coneAngle: t.coneAngle,
				coneView: t.coneView,
			});
		}
		return ar;
	};

	const getGridWidthArray = () => {
		let a: number[] = [];
		for (let i = position.x % grid.scale; i <= width; i += grid.scale) {
			a.push(i);
		}
		return a;
	};

	if (!map || !images || !images[0]) {
		return (
			<div
				style={{
					width: width + "px",
					height: height + "px",
					position: "relative",
					overflow: "hidden",
					backgroundColor: "black",
				}}
			></div>
		);
	}

	return (
		<div
			style={{
				width: width + "px",
				height: height + "px",
				position: "relative",
				overflow: "hidden",
			}}
		>
			<div
				className="container-map"
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					backgroundImage: `url(${images[0]})`,
					backgroundPosition: `${position.x}px ${position.y}px`,
					backgroundSize: `${scale * 100 * Math.max(1920 / dimensions.x, 1080 / dimensions.y)}%`,
					backgroundColor: "black",
					backgroundRepeat: "no-repeat",
					height: height,
					width: width,
					zIndex: 1,
				}}
			></div>
			{images.map((item, index) => {
				if (index == 0) {
					return;
				}
				return (
					<div
						key={"image-" + index}
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							backgroundImage: `url(${item})`,
							backgroundPosition: `${position.x}px ${position.y}px`,
							backgroundSize: `${scale * 100 * Math.max(1920 / dimensions.x, 1080 / dimensions.y)}%`,
							backgroundRepeat: "no-repeat",
							height: height,
							width: width,
							zIndex: index + 1,
						}}
					></div>
				);
			})}
			{grid.type == "square" ? (
				<>
					<div
						style={{
							width: width + "px",
							height: height + "px",
							position: "absolute",
							backgroundColor: "rgba(0,0,0,0)",
							top: 0,
							left: 0,
							zIndex: images.length + 1,
						}}
					>
						{getGridWidthArray().map((item) => {
							return (
								<hr
									key={"vLine" + item}
									style={{
										cursor: "grab",
										position: "absolute",
										marginLeft: item + "px",
										marginTop: 0,
										width: "1px",
										height: height,
										backgroundColor: grid.color,
										border: "none",
									}}
								></hr>
							);
						})}
					</div>
					<div
						style={{
							width: width + "px",
							height: height + "px",
							position: "absolute",
							backgroundColor: "rgba(0,0,0,0)",
							top: 0,
							left: 0,
							zIndex: images.length + 1,
						}}
					>
						{getGridHeightArray().map((item) => {
							return (
								<hr
									key={"hLine" + item}
									style={{
										cursor: "grab",
										position: "absolute",
										marginTop: item + "px",
										marginLeft: 0,
										width: width,
										height: "1px",
										backgroundColor: grid.color,
										border: "none",
									}}
								></hr>
							);
						})}
					</div>
				</>
			) : (
				<></>
			)}

			<div
				key="tokens_CP"
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					zIndex: images.length + 2,
					width: width + "px",
					height: height + "px",
				}}
			>
				{ts ? (
					ts.map((item: any, index: number) => {
						if (item.type != "player" && !item.visible) return <></>;
						if (
							item.position.x * grid.scale + position.x > width ||
							item.position.y * grid.scale + position.y > height
						) {
							return <></>;
						}
						return (
							<MapToken
								key={"token_map_" + item.id}
								style={{}}
								id={item.id}
								type={item.type}
								color={item.color}
								position={{
									x: item.position.x * grid.scale + position.x,
									y: item.position.y * grid.scale + position.y,
									width: grid.scale - 1,
									height: grid.scale - 1,
								}}
								selected={false}
							></MapToken>
						);
					})
				) : (
					<></>
				)}
			</div>
			{fogOfWar.visible ? (
				<FogOfWarCanvas
					grid={grid}
					alpha={1}
					fogColor={fogOfWar.color}
					height={dimensions.y}
					width={dimensions.x}
					viewer={tokensToViewers()}
					walls={[]}
				></FogOfWarCanvas>
			) : (
				<></>
			)}
		</div>
	);
}

export default function MapCP({
	images,
	game,
	map,
	ts,
	gridData = { color: "black", scale: 20, type: "none" },
	dimensions,
	updateTick,
}: {
	images: string[];
	game: any;
	map: any;
	updateTick: any;
	ts: {
		type: "npc" | "player";
		id: string;
		position: { x: number; y: number };
		size: number;
		visible: boolean;
		viewType: "cone" | "square" | "circle";
		viewDistance: any;
		color: string;
		coneAngle: number;
		coneView: number;
		name: string;
	}[];
	gridData: { color: string; scale: number; type: "square" | "none" };
	dimensions: { x: number; y: number };
}) {
	const [position, setPosition] = useState<any>(undefined);
	const [scale, setScale] = useState<any>(undefined);
	const [grid, setGrid] = useState<any>(undefined);
	const [width, setDisplayHeight] = useState(1);
	const [height, setDisplayWidth] = useState(1);

	const [selectedToken, setSelectedToken] = useState(-1);

	const [allowScroll, setScroll] = useState(true);
	const preventDefault = (e: any) => {
		if (allowScroll) {
			return;
		}
		console.log(e);
		e = e || window.event;
		if (e.preventDefault) {
			e.preventDefault();
		}
		e.returnValue = false;
	};

	useEffect(() => {
		if (!map || !map.camera || (scale && position)) {
			return;
		}
		setScale(map.camera.scale);
		document.addEventListener("wheel", preventDefault, {
			passive: false,
		});
		setPosition(map.camera.position);
	}, [map, position, scale]);

	useEffect(() => {
		if (!gridData || grid) {
			return;
		}
		setGrid(gridData);
	}, [gridData]);

	const [preViewFogOfWar, setPreViewFogOfWar] = useState(false);

	const tokensToViewers = () => {
		let ar: any[] = [];
		for (const t of tokens) {
			if (t.type != "player") continue;
			ar.push({
				posX: t.position.x * grid.scale + position.x + grid.scale / 2,
				posY:
					height - (t.position.y * grid.scale + position.y + grid.scale / 2),
				width: ((t.viewDistance * 2) / 1.5) * grid.scale,
				height: ((t.viewDistance * 2) / 1.5) * grid.scale,
				type: t.viewType,
				coneAngle: t.coneAngle,
				coneView: t.coneView,
			});
		}
		return ar;
	};

	const [tokens, setTokens] = useState(ts);

	useEffect(() => {
		setTokens(ts);
	}, [ts]);

	useEffect(() => {
		setDisplayHeight(dimensions.x);
		setDisplayWidth(dimensions.y);
	}, [dimensions]);

	const [editGrid, setEditGrid] = useState(false);

	const enableScroll = () => {
		setScroll(true);
	};
	const disableScroll = () => {
		setScroll(false);
	};

	const handleWheel = async (event: any) => {
		const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1; // Adjust the scale factor as needed
		event.preventDefault();
		if (editGrid) {
			setGrid({ ...grid, scale: grid.scale * scaleFactor });
			await updateMap(
				map.id,
				game,
				grid,
				{
					position: position,
					scale: scale,
				},
				tokens
			);
			return;
		}
		setScale(scale * scaleFactor);
		setGrid({ ...grid, scale: grid.scale * scaleFactor });
		setPosition({ x: position.x, y: position.y });
	};
	const handleMouseMove = async (event: any) => {
		// Check if mouse is pressed
		event.stopPropagation();
		if (event.buttons == 1) {
			if (selectedToken >= 0) {
				const newTokens = [...tokens];
				let t = newTokens[selectedToken];
				let currentTargetRect = event.currentTarget.getBoundingClientRect();
				const event_offsetX = event.clientX - currentTargetRect.left,
					event_offsetY = event.clientY - currentTargetRect.top;
				t.position.x = Math.floor((event_offsetX - position.x) / grid.scale);
				t.position.y = Math.floor((event_offsetY - position.y) / grid.scale);
				setTokens(newTokens);
				await updateMap(
					map.id,
					game,
					grid,
					{
						position: position,
						scale: scale,
					},
					tokens
				);
				return;
			}
			const newX = position.x + event.movementX;
			const newY = position.y + event.movementY;
			setPosition({ x: newX, y: newY });
		}
	};

	const handleTokenClick = async (event: any) => {
		if (selectedToken >= 0) {
			const newTokens = [...tokens];
			let t = newTokens[selectedToken];
			let currentTargetRect = event.currentTarget.getBoundingClientRect();
			const event_offsetX = event.clientX - currentTargetRect.left,
				event_offsetY = event.clientY - currentTargetRect.top;
			t.position.x = Math.floor((event_offsetX - position.x) / grid.scale);
			t.position.y = Math.floor((event_offsetY - position.y) / grid.scale);
			setTokens(newTokens);
			await updateMap(
				map.id,
				game,
				grid,
				{
					position: position,
					scale: scale,
				},
				tokens
			);
		}
		setSelectedToken(-1);
	};

	const getGridHeightArray = () => {
		let a: number[] = [];
		for (let i = position.y % grid.scale; i < height; i += grid.scale) {
			if (i <= 0) {
				continue;
			}
			a.push(i);
		}
		return a;
	};

	const getGridWidthArray = () => {
		let a: number[] = [];
		for (let i = position.x % grid.scale; i < width; i += grid.scale) {
			if (i <= 0) {
				continue;
			}
			a.push(i);
		}
		return a;
	};

	if (!scale || !position || !width || !height) {
		return;
	}

	return (
		<>
			<div
				style={{
					width: "100%",
					height: "100%",
					overflow: "hidden",
					position: "relative",
				}}
				onMouseMove={handleMouseMove}
				onWheel={handleWheel}
				onClick={handleTokenClick}
				onScroll={(e) => {
					e.preventDefault();
				}}
				onScrollCapture={(e) => {
					e.preventDefault();
				}}
			>
				<div
					className="container-map"
					onClick={async (event) => {}}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						backgroundImage: `url(${images[0]})`,
						backgroundPosition: `${position.x}px ${position.y}px`,
						backgroundSize: `${scale * 100 * Math.max(1920 / dimensions.x, 1080 / dimensions.y)}%`,
						backgroundColor: "black",
						backgroundRepeat: "no-repeat",
						width: "100%",
						height: "100%",
						zIndex: 1,
					}}
				></div>
				{images.map((item, index) => {
					if (index == 0) {
						return;
					}
					return (
						<div
							key={"image-" + index}
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								backgroundImage: `url(${item})`,
								backgroundPosition: `${position.x}px ${position.y}px`,
								backgroundSize: `${scale * 100 * Math.max(1920 / dimensions.x, 1080 / dimensions.y)}%`,
								backgroundRepeat: "no-repeat",
								width: "100%",
								height: "100%",
								zIndex: index + 1,
							}}
						></div>
					);
				})}
				{grid.type == "square" ? (
					<>
						<div
							style={{
								width: "100%",
								height: "100%",
								position: "absolute",
								top: 0,
								left: 0,
								zIndex: images.length + 1,
							}}
							onClick={handleTokenClick}
						>
							{getGridWidthArray().map((item) => {
								return (
									<hr
										key={"vLine" + item}
										style={{
											cursor: "grab",
											position: "absolute",
											marginLeft: item + "px",
											marginTop: 0,
											width: "1px",
											height: "100%",
											backgroundColor: grid.color,
											border: "none",
										}}
									></hr>
								);
							})}
						</div>
						<div
							style={{
								width: "100%",
								height: "100%",
								position: "absolute",
								top: 0,
								left: 0,
								zIndex: images.length + 1,
							}}
							onClick={handleTokenClick}
						>
							{getGridHeightArray().map((item) => {
								return (
									<hr
										key={"hLine" + item}
										style={{
											cursor: "grab",
											position: "absolute",
											marginTop: item + "px",
											marginLeft: 0,
											width: "100%",
											height: "1px",
											backgroundColor: grid.color,
											border: "none",
										}}
									></hr>
								);
							})}
						</div>
					</>
				) : (
					<></>
				)}

				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						zIndex: images.length + 3,
						width: "100%",
						height: "100%",
					}}
				>
					{tokens.map((item, index) => {
						if (
							item.position.x * grid.scale + position.x > width ||
							item.position.y * grid.scale + position.y > height ||
							item.position.x * grid.scale + position.x < 0 ||
							item.position.y * grid.scale + position.y < 0
						) {
							return <></>;
						}
						return (
							<MapToken
								key={"token_" + item.id}
								style={{}}
								id={item.id}
								type={item.type}
								selected={selectedToken == index}
								color={item.color}
								position={{
									x: item.position.x * grid.scale + position.x,
									y: item.position.y * grid.scale + position.y,
									width: grid.scale - 1,
									height: grid.scale - 1,
								}}
								onClick={(e) => {
									selectedToken != index
										? setSelectedToken(index)
										: setSelectedToken(-1);
									e.stopPropagation();
								}}
								onMouseMove={(e) => {
									if (e.buttons == 1) {
										setSelectedToken(index);
										handleMouseMove(e);
									}
								}}
							></MapToken>
						);
					})}
				</div>
				{preViewFogOfWar ? (
					<FogOfWarCanvas
						grid={grid}
						alpha={0.6}
						fogColor={[0, 0, 0]}
						height={dimensions.y}
						width={dimensions.x}
						viewer={tokensToViewers()}
						walls={[]}
					></FogOfWarCanvas>
				) : (
					<></>
				)}
				<div
					style={{
						position: "absolute",
						top: 0,
						left: width - 30,
						alignItems: "center",
						justifyContent: "right",
						justifyItems: "right",
						zIndex: images.length + 20,
						width: 30 + "px",
						height: height - 1,
						justifySelf: "right",
						marginTop: "1px",
						display: "flex",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							alignSelf: "center",
							alignContent: "center",
							width: "30px",
							height: "100%",
							zIndex: images.length + 20,
							backgroundColor: "rgba(0,0,0,0.2)",
						}}
					>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
							}}
						>
							<Tooltip title="Änderungen Speichern">
								<IconButton
									sx={{
										backgroundColor: "rgba(255,255,255,1)",
										width: "30px",
										aspectRatio: "1",
										height: "30px",
									}}
									onClick={async (e) => {
										e.stopPropagation();
										await updateMap(
											map.id,
											game,
											grid,
											{
												position: position,
												scale: scale,
											},
											tokens
										);
									}}
								>
									<Save></Save>
								</IconButton>
							</Tooltip>

							{selectedToken != -1 && tokens[selectedToken].type == "npc" ? (
								<Tooltip title="Toggle Visibility">
									<IconButton
										sx={{
											backgroundColor: "rgba(255,255,255,1)",
											width: "30px",
											aspectRatio: "1",
											height: "30px",
										}}
										onClick={async (e) => {
											e.stopPropagation();
											await setVisibilityOfToken(
												map.id,
												game,
												tokens[selectedToken].id,
												!tokens[selectedToken].visible
											);
											updateTick();
										}}
									>
										{tokens[selectedToken].visible ? (
											<VisibilityOff></VisibilityOff>
										) : (
											<Visibility></Visibility>
										)}
									</IconButton>
								</Tooltip>
							) : (
								<></>
							)}

							{selectedToken != -1 ? (
								<Tooltip title="Token Löschen">
									<IconButton
										sx={{
											backgroundColor: "rgba(255,255,255,1)",
											width: "30px",
											aspectRatio: "1",
											height: "30px",
										}}
										onClick={async (e) => {
											e.stopPropagation();
											await deleteTokenFromMap(
												map.id,
												game,
												tokens[selectedToken].id
											);
											setSelectedToken(-1);
										}}
									>
										<Delete></Delete>
									</IconButton>
								</Tooltip>
							) : (
								<></>
							)}
							<Tooltip title="Bearbeite Grid">
								<IconButton
									sx={{
										backgroundColor: "rgba(255,255,255,1)",
										width: "30px",
										aspectRatio: "1",
										height: "30px",
									}}
									onClick={async (e) => {
										e.stopPropagation();
										setEditGrid(!editGrid);
									}}
								>
									<Grid3x3></Grid3x3>
								</IconButton>
							</Tooltip>
							<Tooltip
								title={
									"Grid " + (grid.type != "square" ? "anzeigen" : "ausblenden")
								}
							>
								<IconButton
									sx={{
										backgroundColor: "rgba(255,255,255,1)",
										width: "30px",
										aspectRatio: "1",
										height: "30px",
									}}
									onClick={async (e) => {
										e.stopPropagation();
										if (grid.type == "square") {
											setGrid({ ...grid, type: "none" });
											await updateMap(
												map.id,
												game,
												{ ...grid, type: "none" },
												{
													position: position,
													scale: scale,
												},
												tokens
											);
										} else {
											setGrid({ ...grid, type: "square" });
											await updateMap(
												map.id,
												game,
												{ ...grid, type: "square" },
												{
													position: position,
													scale: scale,
												},
												tokens
											);
										}
									}}
								>
									<Grid4x4></Grid4x4>
								</IconButton>
							</Tooltip>
						</div>
					</div>
				</div>
				<div
					style={{
						position: "absolute",
						pointerEvents: "none",
						top: 0,
						left: 0,
						zIndex: images.length + 3,
						width: "100%",
						height: "100%",
						display: "flex",
					}}
				>
					{selectedToken >= 0 ? (
						<MapNameTag
							scale={grid.scale / 2}
							position={{
								x:
									tokens[selectedToken].position.x * grid.scale +
									position.x -
									grid.scale * 1.25,
								y:
									(tokens[selectedToken].position.y + 1) * grid.scale +
									position.y,
							}}
						>
							{tokens[selectedToken].name}
							<br />
							{tokens[selectedToken].type}
						</MapNameTag>
					) : (
						<></>
					)}
				</div>
			</div>
		</>
	);
}
