import { useFrame } from "@react-three/fiber"
import { Dispatch, SetStateAction, useState } from "react"
import { Mesh, Object3D, Quaternion, Raycaster, Vector2, Vector3 } from "three"

const NAME: string = "PLAYER"
const RADIUS: number = 1
const GRAVITY: Vector3 = new Vector3(0, -9.8, 0)
const FRICTION: number = 0.1
const ACCELERATION: number = 60
const JUMP: number = 5
const SPEED: number = 20
const dt: number = 0.017
const directions = {
  front: new Vector3(0, 0, 1),
  back: new Vector3(0, 0, -1),
  left: new Vector3(1, 0, 0),
  rigt: new Vector3(-1, 0, 0),
  up: new Vector3(0, 1, 0),
  down: new Vector3(0, -1, 0)
}
const inputs = {
  KeyW: 0,
  KeyS: 0,
  KeyA: 0,
  KeyD: 0,
  Space: 0,
  ShiftLeft: 0,
  ShiftRight: 0
}
addEventListener("keydown", ({ code }) => (inputs[code] = 1))
addEventListener("keyup", ({ code }) => (inputs[code] = 0))

const getDirectionInput = (setDirection: Dispatch<SetStateAction<Vector3>>) => {
  const { KeyW, KeyS, KeyA, KeyD, ShiftLeft, ShiftRight } = inputs
  const factor = ShiftLeft === 1 || ShiftRight === 1 ? 3 : 1
  const acc = ACCELERATION * factor
  setDirection(direction =>
    direction.copy(
      new Vector3(KeyA - KeyD, 0, KeyW - KeyS).normalize().multiplyScalar(acc)
    )
  )
}

const getIntersection = (raycaster: Raycaster, scene: Object3D) =>
  raycaster
    .intersectObject(scene)
    .filter(({ object }) => object instanceof Mesh && object.name !== NAME)[0]

const seekCollisions = (
  position: Vector3,
  rotation: Quaternion,
  raycaster: Raycaster,
  scene: Object3D
) =>
  Object.entries(directions).map(([name, direction]) => {
    raycaster.near = 0
    raycaster.far = RADIUS
    raycaster.set(
      new Vector3(0, RADIUS, 0).clone().add(position),
      direction.clone().applyQuaternion(rotation)
    )
    const intersection = getIntersection(raycaster, scene)
    if (!intersection) return { collided: false, name }
    return {
      collided: true,
      normal: intersection.face?.normal,
      point: intersection.point,
      name
    }
  })

const mouse = new Vector2()
const firstPersonCamera = (
  { x, y }: Vector2,
  position: Vector3,
  setRotation: Dispatch<SetStateAction<Quaternion>>,
  camera: Object3D,
  scene: Object3D,
  raycaster: Raycaster
) =>
  setRotation(rotation => {
    const getRotation = (direction: Vector3, angle: number) =>
      new Quaternion().setFromAxisAngle(
        direction.clone().applyQuaternion(rotation),
        angle
      )
    const rotateY = getRotation(directions.up, (mouse.x - x - x / 90) * Math.PI)
    const rotateX = getRotation(directions.left, (-y * Math.PI) / 2)
    mouse.set(x, y)
    const basisPosition = new Vector3(-3, 5, -5).applyQuaternion(rotation)
    camera.position.lerp(basisPosition.add(position), 0.1)
    camera.lookAt(
      directions.front
        .clone()
        .applyQuaternion(rotation)
        .applyQuaternion(rotateX)
        .add(camera.position)
    )
    raycaster.near = 0
    raycaster.far = 20
    const origin = position.clone().add(new Vector3(0, RADIUS, 0))
    const target = camera.position.clone().sub(origin).normalize()
    raycaster.set(origin, target)
    const intersection = getIntersection(raycaster, scene)
    if (intersection) camera.position.lerp(intersection.point, 0.1)

    return rotation.multiply(rotateY)
  })

const useEntityBehaviors = (setEntity: Dispatch<SetStateAction<Object3D>>) => {
  const [position, setPosition] = useState(new Vector3(0, 5, 0))
  const [rotation, setRotation] = useState(new Quaternion())
  const [direction, setDirection] = useState(new Vector3())
  const [velocity, setVelocity] = useState(new Vector3())
  useFrame(({ mouse, scene, camera, raycaster }) => {
    getDirectionInput(setDirection)
    const collisions = seekCollisions(position, rotation, raycaster, scene)
    setVelocity(current => {
      current.add(GRAVITY.clone().multiplyScalar(dt))
      const dV = direction.clone().applyQuaternion(rotation)
      collisions.forEach(({ collided, normal, name, point }) => {
        if (!collided) return
        current.add(normal.clone().multiplyScalar(-velocity.dot(normal)))
        if (name !== "down") return
        setPosition(current => current.lerp(point, 0.1))
        dV.applyQuaternion(
          new Quaternion().setFromUnitVectors(directions.up, normal)
        )
        if (inputs.Space)
          current.add(directions.up.clone().multiplyScalar(JUMP))
        if (direction.length() === 0) current.multiplyScalar(1 - FRICTION)
      })
      current.add(dV.multiplyScalar(dt))
      const horizontal = current.clone().setY(0)
      return horizontal.length() > SPEED
        ? horizontal.normalize().multiplyScalar(SPEED).setY(current.y)
        : current
    })
    setPosition(current => current.add(velocity.clone().multiplyScalar(dt)))
    firstPersonCamera(mouse, position, setRotation, camera, scene, raycaster)
    setEntity(entity => {
      entity.position.copy(position)
      entity.quaternion.copy(rotation)
      return entity
    })
  })
}

export const Player = () => {
  const [, setEntity] = useState<Object3D>(null!)
  useEntityBehaviors(setEntity)
  return (
    <group ref={setEntity}>
      <mesh castShadow name={NAME} position-y={RADIUS} receiveShadow>
        <sphereBufferGeometry args={[1]} />
        <meshPhysicalMaterial roughness={0} metalness={0} color="white" />
      </mesh>
      <directionalLight position={[0, 35, -5]} castShadow />
      <axesHelper args={[3]} position-y={RADIUS} />
    </group>
  )
}
