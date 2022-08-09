import { Canvas } from "@react-three/fiber"
import {
  sRGBEncoding,
  ACESFilmicToneMapping,
  EquirectangularReflectionMapping,
  PCFShadowMap
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
import { DepthOfField, EffectComposer, SSAO } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import { useMyContext, BridgeContextProvider } from "./context"
import { Player } from "./Player"
import { Bunny } from "./Bunny"
import { Environment } from "./Environment"
import { Cloth } from "./Cloth"

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
      gl.shadowMap.enabled = true
      gl.shadowMap.type = PCFShadowMap
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
        <DepthOfField
          focusDistance={0.0035}
          focalLength={0.01}
          bokehScale={3}
          height={480}
        />
        <SSAO
          blendFunction={BlendFunction.MULTIPLY}
          bias={0.01}
          radius={0.1}
          intensity={20}
          luminanceInfluence={1}
          color="black"
        />
        <SSAO
          blendFunction={BlendFunction.MULTIPLY}
          bias={0.01}
          radius={0.01}
          intensity={10}
          luminanceInfluence={1}
          color="black"
        />
      </EffectComposer>
      {/* <Environment />
      <Player />
      <Bunny /> */}
      <Cloth />
      <pointLight intensity={30} position={[0, 35, -5]} castShadow />
    </BridgeContextProvider>
  </Canvas>
)
