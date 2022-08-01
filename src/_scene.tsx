import { Canvas } from "@react-three/fiber"
import {
  Color,
  sRGBEncoding,
  ACESFilmicToneMapping,
  EquirectangularReflectionMapping,
  MeshStandardMaterial
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
import { useMyContext, BridgeContextProvider } from "./context"

const ClayMaterial = new MeshStandardMaterial({
  color: "white",
  metalness: 0,
  roughness: 0.9
})
const GroundMaterial = new MeshStandardMaterial({
  color: "rgb(252, 190, 180)",
  metalness: 0.5
})

const Envirionment = () => (
  <>
    <mesh castShadow position-y={1} material={ClayMaterial}>
      <sphereBufferGeometry args={[1]} />
    </mesh>
    <mesh receiveShadow rotation-x={-Math.PI / 2} material={GroundMaterial}>
      <planeBufferGeometry args={[300, 300]} />
    </mesh>
  </>
)

export const MyScene = () => (
  <Canvas
    shadows
    gl={{
      powerPreference: "high-performance",
      toneMapping: ACESFilmicToneMapping,
      outputEncoding: sRGBEncoding,
      pixelRatio: Math.min(devicePixelRatio, 2),
      physicallyCorrectLights: true,
      stencil: false,
      antialias: true,
      alpha: false,
      logarithmicDepthBuffer: true
    }}
    camera={{ near: 0.1, far: 100, position: [0, 2, 5] }}
    onCreated={({ scene, camera, gl }) => {
      scene.background = new Color("black")
      new OrbitControls(camera, gl.domElement).update()
      new RGBELoader().load("assets/blurry.hdr", texture => {
        texture.mapping = EquirectangularReflectionMapping
        scene.environment = texture
      })
    }}
  >
    <BridgeContextProvider value={useMyContext()}>
      <axesHelper args={[10]} />
      <ambientLight color="rgb(167,140,129)" intensity={0.2} />
      <ambientLight color="rgb(255,211,153)" intensity={0.1} />
      <directionalLight color="white" position={[5, 10, -5]} castShadow />
      <Envirionment />
    </BridgeContextProvider>
  </Canvas>
)

/*

      <ambientLight color="rgb(167,140,129)" />
      <ambientLight color="rgb(255,211,153)" intensity={0.5} />
      <directionalLight color="rgb(252,190,180)" position={[0, 5, -5]} />
*/
