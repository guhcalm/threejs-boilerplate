import { BufferAttribute, BufferGeometry } from "three"
import { BunnyBuffers } from "./BunnyBuffers"

const { vertices, faces } = BunnyBuffers
const positions: Float32Array = new Float32Array(vertices.array)
const geometry = new BufferGeometry()
geometry.setAttribute("position", new BufferAttribute(positions, 3))
geometry.setIndex(faces.array)
geometry.computeVertexNormals()

export const Bunny = () => (
  <mesh geometry={geometry} position={[-5, 2, 0]} castShadow receiveShadow>
    <meshPhysicalMaterial roughness={0} metalness={0} color="white" />
  </mesh>
)
