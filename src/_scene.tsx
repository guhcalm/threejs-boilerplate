import { Canvas } from "@react-three/fiber"
import {
  sRGBEncoding,
  ACESFilmicToneMapping,
  EquirectangularReflectionMapping,
  Color,
  Fog
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
import { EffectComposer, SSAO } from "@react-three/postprocessing"
import { useMyContext, BridgeContextProvider } from "./context"
import { Player } from "./Player"
import { Environment } from "./Environment"

export const MyScene = () => (
  <Canvas
    shadows
    gl={{
      powerPreference: "high-performance",
      toneMapping: ACESFilmicToneMapping,
      toneMappingExposure: 1.5,
      outputEncoding: sRGBEncoding,
      pixelRatio: Math.min(devicePixelRatio, 2),
      physicallyCorrectLights: true,
      stencil: false,
      alpha: false,
      depth: false,
      antialias: true,
      logarithmicDepthBuffer: true
    }}
    camera={{ near: 0.1, far: 100, position: [2, 2, -5] }}
    onCreated={({ scene, camera, gl }) => {
      scene.background = new Color("black")
      scene.fog = new Fog("black", 0, 100)
      new OrbitControls(camera, gl.domElement).update()
      new RGBELoader().load("assets/blurry.hdr", texture => {
        texture.matrixAutoUpdate = false
        texture.mapping = EquirectangularReflectionMapping
        scene.environment = texture
      })
    }}
  >
    <BridgeContextProvider value={useMyContext()}>
      <directionalLight
        color="rgb(252,190,180)"
        position={[0, 35, -5]}
        castShadow
      />
      <ambientLight color="rgb(167,140,129)" intensity={0.2} />
      <ambientLight color="rgb(255,211,153)" intensity={0.1} />
      <EffectComposer multisampling={0}>
        <SSAO
          luminanceInfluence={1}
          intensity={30}
          radius={0.05}
          bias={0}
          color="rgb(167,140,129)"
        />
        <SSAO
          luminanceInfluence={1}
          intensity={60}
          radius={0.005}
          bias={0}
          color="rgb(167,140,129)"
        />
      </EffectComposer>
      <Environment />
      <Player />
    </BridgeContextProvider>
  </Canvas>
)
