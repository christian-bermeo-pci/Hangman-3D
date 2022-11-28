import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import './HangmanDrawing3D.css';

type HangmanDrawing3DProps = {
  numberOfGuesses: number;
};

/**
 * React three fiber Canvas for three.js
 */
export const HangmanDrawing3D = ({
  numberOfGuesses,
}: HangmanDrawing3DProps) => {
  return (
    <>
      <Canvas>
        <ambientLight intensity={1.5} />
        {/* Lego Character */}
        <Character numberOfGuesses={numberOfGuesses} />
        <OrbitControls autoRotate={true} autoRotateSpeed={1} />
      </Canvas>
    </>
  );
};

/**
 * Lego Character
 */
const Character = ({ numberOfGuesses }: HangmanDrawing3DProps) => {
  const BODY_PARTS: any = [];

  const gltf = useGLTF('../lego-deadpool.glb');
  gltf.scene.scale.set(0.01, 0.01, 0.01);
  gltf.scene.position.y = -2;

  /**
   * Capture 3D lego parts by their name in BLENDER and store them in order
   */
  gltf.scene.traverse((child: any) => {
    switch (child.name) {
      case 'Cabeza_4':
        const HEAD = child;
        BODY_PARTS.push(HEAD);
        break;
      case 'Exportaciones_18':
        const SWORD1 = child;
        BODY_PARTS.push(SWORD1);
        break;
      case 'Espada_16':
        const SWORD2 = child;
        BODY_PARTS.push(SWORD2);
        break;
      case 'Torso_6':
        const BODY = child;
        BODY_PARTS.push(BODY);
        break;
      case 'Manos_14':
        const ARMS = child;
        BODY_PARTS.push(ARMS);
        break;
      case 'Cadera_8':
        const HIP1 = child;
        BODY_PARTS.push(HIP1);
        break;
      case 'Caedra_bajo_10':
        const HIP2 = child;
        BODY_PARTS.push(HIP2);
        break;
      case 'Piernas_12':
        const LEGS = child;
        BODY_PARTS.push(LEGS);
        break;
    }
  });

  // Make lego invisible on start and refresh
  useEffect(() => {
    BODY_PARTS.map((part: any) => (part.visible = false));

    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (key !== 'Enter') return;

      e.preventDefault();
      BODY_PARTS.map((part: any) => (part.visible = false));
    };
    document.addEventListener('keypress', handler);

    return () => {
      document.removeEventListener('keypress', handler);
    };
  }, [numberOfGuesses]);

  // Make lego appear part by part
  useEffect(() => {
    for (let i = 0; i < numberOfGuesses; i++) {
      BODY_PARTS[i].visible = true;
    }
  }, [numberOfGuesses]); // appear as more guesses are wrong

  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  );
};
