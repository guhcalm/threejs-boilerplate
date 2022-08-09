import { PlaneBufferGeometry } from "three"

const getEdgesBuffer = (count: number, array: Float32Array) => {
  const edges = {}
  for (let i = 0; i < count; i++) {
    const vertex = [array[i]]
    if ((i + 1) % 3 === 0) vertex.push(array[i - 2])
    else vertex.push(array[i + 1])
    vertex.sort((a, b) => a - b)
    edges[`${vertex[0]}|${vertex[1]}`] = "edge"
  }
  const buffer = Object.keys(edges)
    .map(edge => edge.split("|").map(point => Number(point)))
    .flat()
  return { count: buffer.length, array: buffer, itemSize: 2 }
}
const geometry = new PlaneBufferGeometry(10, 10)
const { count, array } = geometry.index
const edgesBuffer = getEdgesBuffer(count, array)

export const Cloth = () => (
  <mesh geometry={geometry}>
    <meshBasicMaterial wireframe color="black" />
  </mesh>
)
