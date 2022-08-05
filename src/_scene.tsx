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
import { EffectComposer, SSAO, SSR } from "@react-three/postprocessing"
import { useMyContext, BridgeContextProvider } from "./context"
import { Player } from "./Player"
import { Bunny } from "./Bunny"
import { Environment } from "./Environment"

export const MyScene = () => (
  <Canvas
    shadows
    gl={{
      pixelRatio: Math.min(devicePixelRatio, 2),
      powerPreference: "high-performance",
      toneMapping: ACESFilmicToneMapping,
      physicallyCorrectLights: true,
      logarithmicDepthBuffer: true,
      outputEncoding: sRGBEncoding,
      toneMappingExposure: 1.5,
      antialias: false,
      stencil: false,
      alpha: false,
      depth: false
    }}
    camera={{ near: 0.1, far: 100, position: [-8, 3, -3] }}
    onCreated={({ scene, camera, gl }) => {
      new OrbitControls(camera, gl.domElement).update()
      new RGBELoader().load("assets/blurry.hdr", texture => {
        texture.mapping = EquirectangularReflectionMapping
        texture.matrixAutoUpdate = false
        scene.environment = texture
        scene.background = texture
      })
    }}
  >
    <BridgeContextProvider value={useMyContext()}>
      <EffectComposer multisampling={0}>
        <SSAO
          luminanceInfluence={0}
          radius={0.01}
          bias={0}
          color="rgb(167,140,129)"
        />
        <SSAO
          luminanceInfluence={0}
          radius={0.001}
          bias={0}
          color="rgb(167,140,129)"
        />
      </EffectComposer>
      <Environment />
      <Player />
      <Bunny />
    </BridgeContextProvider>
  </Canvas>
)
