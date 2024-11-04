import Particles from "@tsparticles/react";
import { loadStarsPreset } from "@tsparticles/preset-stars";
import { useEffect, useRef, useState, memo } from "react";

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);
  const engineInitialized = useRef(false);

  useEffect(() => {
    if (!engineInitialized.current) {
      const initParticlesEngine = async (engine: any) => {
        await loadStarsPreset(engine);
        setInit(true);
        engineInitialized.current = true;
      };

      import("@tsparticles/engine").then(({ tsParticles }) => {
        initParticlesEngine(tsParticles);
      });
    }
  }, []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={{
        preset: "stars",
        background: {
          color: { value: "transparent" },
        },
        particles: {
          color: { value: "#818cf8" },
          number: { value: 100, density: { enable: true } },
          move: { enable: true, speed: 1 },
          size: { value: { min: 1, max: 3 } },
        },
      }}
      className="absolute inset-0"
    />
  );
};

export default memo(ParticlesBackground);
