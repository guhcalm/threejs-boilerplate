import { MeshBasicMaterial, PlaneBufferGeometry } from "three"

const geometry = new PlaneBufferGeometry(300, 300, 50, 50)
geometry.rotateX(-Math.PI / 2)
const { position } = geometry.attributes
position.needsUpdate = true
geometry.computeVertexNormals()
new Array(position.count).fill("").forEach((value, index) => {
  const x = position.getX(index)
  const z = position.getZ(index)
  position.setY(index, 4 * (Math.sin(x / 20) + Math.sin(z / 15)))
})
position.needsUpdate = true
geometry.computeVertexNormals()

const GroundMaterial = new MeshBasicMaterial()
export const Environment = () => (
  <>
    <mesh
      receiveShadow
      position={[-2, 0, 0]}
      castShadow
      material={GroundMaterial}
    >
      <boxGeometry args={[1, 10, 5]} />
    </mesh>
    <mesh
      receiveShadow
      position={[2, 0, 0]}
      castShadow
      material={GroundMaterial}
    >
      <boxGeometry args={[1, 10, 5]} />
    </mesh>
    <mesh
      matrixAutoUpdate={false}
      geometry={geometry}
      receiveShadow
      castShadow
      material={GroundMaterial}
    />
  </>
)
