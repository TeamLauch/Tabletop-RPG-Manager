import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshStandardMaterial } from "three";
import { useSpring, animated } from "@react-spring/three";
import { Box } from "@react-three/drei";

interface DiceProps {
  position: [number, number, number];
  value: number;
}

const Dice: React.FC<DiceProps> = ({ position, value }) => {
  const mesh = useRef<any>(null);

  // Animation mit react-spring
  const { rotation } = useSpring({
    from: { rotation: [0, 0, 0] },
    to: async (next: any) => {
      while (true) {
        await next({
          rotation: [
            Math.random() * 2 * Math.PI,
            Math.random() * 2 * Math.PI,
            Math.random() * 2 * Math.PI,
          ],
        });
      }
    },
    reset: true,
  });

  // Kollisionserkennung (hier einfaches Kugelkollisionsmodell)
  const collisionRadius = 2;

  // Aktualisierung der Animation
  useFrame(() => {
    if (mesh.current) {
      const distance = Math.sqrt(
        position[0] ** 2 + position[1] ** 2 + position[2] ** 2
      );

      if (distance < collisionRadius) {
        // Kollision erkannt, hier können Sie Ihre Logik für die Kollision implementieren
        console.log("Collision detected!");
      }
    }
  });

  return (
    <animated.group
      ref={mesh}
      position={position}
      rotation-x={rotation.to((x: any) => x[0])}
      rotation-y={rotation.to((x: any) => x[1])}
      rotation-z={rotation.to((x: any) => x[2])}
    >
      <Box args={[1, 1, 1]}>
        <animated.meshStandardMaterial
          attach="material"
          color={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
        />
      </Box>
    </animated.group>
  );
};

export default Dice;
