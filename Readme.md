## Pages

```
https://guhcalm.github.io/minimal-boilerplate/dist
```

## Folder Structure

```
(~) root
├── public
|  └── # Static files
└── src
   └── # Main app files
```

## License

MIT License.

CONSTRAINED DYNAMICS

Motion of objects is restricted 
dof -> degree of freedom
Three main methods:
Spring
Solve for constraint force

Keep the distance between particles constant

Stiff Spring: {
   . strifness tuning needed
   . large stiffness causes numerical poblems
}
Constraint Forces : {
}
Generalized Coordinates:{}
Position Based Dynamics : {
   Move the particler to satisfy the constraint
   Dx1 = 1/2 (l - li) (x2 - x1) / |x2 - x1|
   Dx2 = - 1/2 (l - li) (x2 - x1) / |x2 - x1|

   if masses is different: {
      .Move proportional to the inverse mass w = 1/m  
      Dx1 = w1/(w1 + w2) (l    - li) (x2 - x1) / |x2 - x1|
      Dx2 = - w2/(w1 + 2) (l - li) (x2 - x1) / |x2 - x1|
   }
}


////
Position based dynamics
Approach:
   .  Create a tetrahedral mesh (Delaunay tetrahedralization, upcoming tutorial)
   .  One particle per vertex
   .  One distance contraint per edge
   .  One volume constraint per tetrahedron

   PBD (Position Based Dynamics) Algorithm
   n <- substeps
   Dt <- 1 / 60
   Dts <- Dt / n
   while simulating
      for n substeps
         for all particles i
            vi <- vi + Dts * g
            pi <- xi (pi -> old position)
            xi <- xi + Dts * vi
         for all contraints C
            solve(C, Dts)
         for all particles i
            vi <- (xi - pi) / Dts
   /////////////
   solve(C, Dt):
   for all particles i of C
      compute Axi
      xi <- xi + Dxi

Solving a General Constraint
   Compute the scalar value s (same for all particles participating in the constraint)
      s = -C / (w1|grad(C1)|² + w2|grad(C2)|² + ... + wn|grad(Cn)|² + alfa/(Dt²)) 
   Compute correction for point xi as: 
      Dxi = s * wi * grad(Ci) // (wi -> inverse mass of particle)
   C -> Constraint function, zero if the constraint is satisfied
   grad(Ci) -> Gradien to f C, how move xi for a maximal increase of C
   wi -> Inverse mass of particle i
   alfa -> Inverse of physical stiffness, stable for infinite stiffness (alfa = 0)!

Distance Constraint
   the constraint have a rest length li, and a current length l, for that ar computed correction vectors to move the particles to the distance constraint be satisfied
   in these case:
   C = l - li
   gradient(C1) = x2 - x1 / |x2 - x1|
   gradient(C2) = - x2 - x1 / |x2 - x1|

Volume Conservation Constraint
   C = 6 (V - Vrest)
   V = (1/6)*((x2 - x1) x (x3 - x1)).(x4 - x1)

   grad(C1) = (x4 - x2) x (x3 - x2)
   grad(C2) = (x3 - x1) x (x4 - x1)
   grad(C3) = (x4 - x1) x (x2 - x1)
   grad(C4) = (x2 - x1) x (x3 - x1)

///////////////////////////////////////////////////
// math on vector arrays
const Vector = {
   setZero: (array: Float32Array, index: number) => {
      array[index * 3 + 0] = 0.
      array[index * 3 + 1] = 0.
      array[index * 3 + 2] = 0.
   },
   scale: (array: Float32Array, index: number, scale: number) => {
      array[index * 3 + 0] *= scale
      array[index * 3 + 1] *= scale
      array[index * 3 + 2] *= scale
   },
   copy: (array: Float32Array, index: number, targetArray: Float32Array, targetIndex: number) => {
      array[index * 3 + 0] = targetArray[targetIndex * 3 + 0]
      array[index * 3 + 1] = targetArray[targetIndex * 3 + 1]
      array[index * 3 + 2] = targetArray[targetIndex * 3 + 2]
   },
   add: (array: Float32Array, index: number, targetArray: Float32Array, targetIndex: number, scale = 1.: number) => {
      array[index * 3 + 0] += targetArray[targetIndex * 3 + 0] * scale
      array[index * 3 + 1] += targetArray[targetIndex * 3 + 1] * scale
      array[index * 3 + 2] += targetArray[targetIndex * 3 + 2] * scale
   },
   length: (array: Float32Array, index: number) => 
      array[index * 3 + 0]**2 +  array[index * 3 + 1]**2+  array[index * 3 + 2]**2,
   dot: (array: Float32Array, index: number, targetArray: Float32Array, targetIndex: number) => 
      array[index * 3 + 0] * targetArray[targetIndex * 3 + 0] +
      array[index * 3 + 1] * targetArray[targetIndex * 3 + 1] +
      array[index * 3 + 2] * targetArray[targetIndex * 3 + 2] 
   ,
   cross: (array: Float32Array, index: number, targetArray: Float32Array, targetIndex: number) => [
      array[index * 3 + 1] * targetArray[targetIndex * 3 + 2] - array[index * 3 + 2] * targetArray[targetIndex * 3 + 1],
      array[index * 3 + 2] * targetArray[targetIndex * 3 + 0] - array[index * 3 + 0] * targetArray[targetIndex * 3 + 2],
      array[index * 3 + 0] * targetArray[targetIndex * 3 + 1] - array[index * 3 + 1] * targetArray[targetIndex * 3 + 0]
   ]
}
//////// Mesh

const bunnyMesh = {
   name: "bunny",
   verts: [] as number[],
   tetIds: [] as number[],
   tetEdgeIds: [] as number[],
   tetSurfaceTrianglesIds: [] as number[]
}

//////// Softbody
const SoftBody = (
   mesh: Mesh, 
   scene: Object3d, 
   edgeComplience = 100.: number, 
   volumeCompliance = 0. : number
) => {
   const { verts, tetIds, tetEdgeIds, tetSurfaceTriIds } = mesh
   const numberParticles: number = verts.length / 3
   const numberTetrahedrals: number = tetIds.length / 4 
   const positions: Float32Array = new Float32Array(verts)
   const oldPositions = [...verts]
   const velocities: Float32Array = new Float32Array(verts.length)
   const restVolume: Float32Array = new Float32Array(numberTetahedrals)
   const edgeLengths: Float32Array = new Float32Array(tetEdgeIds.length / 2)
   const inverseMass: Float32Array = new Float32Array(numberParticles)
   const temp: Float32Array = new Float32Array(4 * 3)
   const grad: Float32Array = new Float32Array(4 * 3)
   const grabId = -1
   const gravInverseMass = 0.

   this.initPhysics()

   // surface tri mesh
   const geometry = new BufferGeometry()
   geometry.setAttribute("position", new BufferAttribute(positions, 3))
   geometry.setIndex(tetSurfaceTriIds)
   const material = new MeshPhongMaterial({ color: "red" })
   material.flatShading = true
   const surfaceMesh = new Mesh(geometry, material)
   surfaceMesh.geometry.computeVertexNormals()
   surfaceMesh.userData = this |||||||||||||\\\\
   surfaceMesh.layers.enable(1)
   scene.add(surfaceMesh)

   const volumeIdOrder = [[1, 3, 2], [0, 2, 3], [0, 3, 1], [0, 1, 2]]

   const translate = (x: number, y: number, z: number) => {
      for (let index = 0; index < numberParticles; index++) {
         Vector.add(positions, index, [x, y, z], 0)
         Vector.add(oltPosition, index, [x, y, z], 0)
      }
   }
   const updateMeshes = () => {
      surfaceMesh.geometry.computeVertexNormals()
      surfaceMesh.geometry.attributes.position.needsUpdate = true
      surfaceMesh.geometry.computeBoundingSphere()
   }
   const getTetrahedralVolume = (index: number) => {
      const vertex  = [
         tetIds[4 * index + 0],
         tetIds[4 * index + 1],
         tetIds[4 * index + 2],
         tetIds[4 * index + 3]
      ]
      Vector.setDiff(temp, 0, positions, vertex[1], positions, vertex[0])
      Vector.setDiff(temp, 1, positions, vertex[2], positions, vertex[0])
      Vector.setDiff(temp, 2, positions, vertex[3], positions, vertex[0])
      Vector.setCross(temp, 3, temp, 0, temp, 1)
      return vecDot(temp, 3, temp, 2) / 6
   }
   const initPhysics = () => {
      inverseMass.fill(0)
      restVolume.fill(0)
      for (let index = 0; index < numberTetrahedrals; index++) {
         const vertex  = [
            tetIds[4 * index + 0],
            tetIds[4 * index + 1],
            tetIds[4 * index + 2],
            tetIds[4 * index + 3]
         ]
         const volume = getTetrahedralVolume(index)
         restVolume[index] = volume
         const pInverseMass = volume > 0 ? 1 / (volume / 4) : 0
         inverseMass[vertex[0]] += pInverseMass
         inverseMass[vertex[1]] += pInverseMass
         inverseMass[vertex[2]] += pInverseMass
         inverseMass[vertex[3]] += pInverseMass
      }
      for (const index = 0; index < edgeLengths.length; index++) {
         const vertex  = [
            edgeIds[2 * index + 0],
            edgeIds[2 * index + 1]
         ]
         edgeLengths[index] = Math.sqrt(Vector.distance(positions, vertex[0], positions, vertex[1]))
      }
   }
   const preSolve = (dt: number, gravity: [x: number, y: number, z: number]) => {
      for (let i = 0; i < numberParticles; i++) {
         if (inverseMass[i] === 0) continue
         Vector.add(velocities, i, gravity, 0, dt)
         Vector.copy(oldPositions, i, positions, i)
         Vector.add(positions, i, velocities, i, dt)
         const y = positions[3 * i + 1]
         if (y >= 0.0) return
         Vector.copy(positions, i, oldPositions, i)
         positions[3 * i + 1] = 0
      }
   }

   const solve = (dt: number) => {
      solveEdges(edgeCompliance, dt)
      solveVolumes(volumeCompliance, dt)
   }

   const postSolve = (dt: number) => {
      for (const i = 0; i < numberParticles; i++) {
         if (inverseMass[i] === 0) continue
         Vector.setDiff(velocities, i, positions, i, oltPositions, i, 1 / dt)
      }
      updateMeshes()
   }

   const solveEdges = (compliance: number, dt: number) => {
      const alpha = compliance / dt / dt
      for (const i = 0; i < edgeLengths.length; i++) {
         const vertex  = [
           edgeIds[2 * i + 0],
           edgeIds[2 * i + 1]
         ]
         const w0 = inverseMass[vertex[0]]
         const w1 = inverseMass[vertex[1]]
         const w = w0 + w1
         if (w === 0) continue
         Vector.setDiff(grads, 0, positions, vertex[0], positions, vertex[1])
         const len = Math.sqrt(Vector.length(grads, 0))
         if (len === 0) continue
         Vector.scale(grads, 0, 1 / len)
         const restLen = edgeLengths[i]
         const C = len - restLen
         const s = - C / (w + alpha)
         Vector.add(positions, vertex[0], grads, 0, s * w0)
         Vector.add(positions, vertex[1], grads, 0, -s * w1)
      }
   }

   const solveVolumes = (compliance: number, dt: number) => {
      const alpha = compliance / dt / dt
      for (const i = 0; i < numberTetrahedrals; i++) {
         const w = 0
         for (const vertex = 0; vertex < 4, vertex ++) {
            const id0 = tetIds[4 * i + volumeIdOrder[vertex][0]]
            const id1 = tetIds[4 * i + volumeIdOrder[vertex][1]]
            const id2 = tetIds[4 * i + volumeIdOrder[vertex][2]]
            Vector.setDiff(temp, 0, positions, id1, positions, id0)
            Vector.setDiff(temp, 1, positions, id2, positions, id0)
            Vector.cross(grads, vertex, temp, 0, temp, 1)
            vector.scale(grads, vertex, 1 / 6)
            w += inverseMass[tetIds[4 * i + vertex]] * Vector.lengthSquared(grads, j)
         }
         if (w === 0.0) continue
         const volume = getTetrahedralVolume(i)
         const restVolume = restVolume[i]
         const C = volume - restVolume
         const s = - C / (w - alpha)
         for (const vertex = 0; vertex < 4, vertex ++) {
            const id = tetIds[4 * i + j]
            Vector.add(positions, id, grads, vertex, s * inverseMass[id])
         }
      }
   }

   const squash = () => {
      for (const i = 0; i < numberParticles; i++) {
         positions[3 * i + 1] = .5
      }
      updateMeshes()
   }

   const startGrab = (pos) => {
      const p = [pos.x, pos.y, pos.z]
      const minD2 = Number.MAX_VALUE;
      grabId = -1
      for (let i = 0; i< numberParticles; i++) {
         const d2 = vecDistSquared(p, 0, positions, i)
         if (d2 < minD2) {
            minD2 = d2
            grabId = i
         }
      }
      if (grabId >= 0) {
         gravInvMass = inverseMass[grabId]
         inverseMass[grabId] = 0
         Vector.copy(positions, grabId, p, 0)
      }
   }

   const moveGrabbed = (pos, vel) => {
      if (this.grabId >= 0) {
         const p = [pos.x, pos.y, pos.z]
         Vector.copy(positions, grabId, p, 0)
      }
   }
 
   const endGrab = (pos, vel) => {}
}

////////////////////////////////////////////////

XPBD -> Extended Position Based Dynamics
Accurate?
   . PBD is very closely related to implicit Euler integration
   . Original PBD is unphysical only in thre way it handles softness
   Integration: explicity euler integration:
      x <- x + v * Dt
   Solve Contraint: Move the object to closest contraint point
   Update valocity: 
      v = (x - oldD) / Dt

PBD Algorithm = integrator and solver
while simulation
   for all particles i
      vi <- vi + Dt * g
      pi <- xi
      xi <- xi + Dt * vi
   for all constraints C
      solve(C, Dt)
   for all particles i
      vi <- (xi - pi) / Dt

solve(C, Dt)
for all particles i of C
   compute Dxi
   xi <- xi + Dxi


Iterations vs Sub-steps
Dts = Dt / n
while simulation
   for n substeps
      for all particles i
         vi <- vi + Dts * g
         pi <- xi
         xi <- xi + Dts * vi
      for all constraints C
         solve(C, Dts)
      for all particles i
         vi <- (xi - pi) / Dts

solve(C, Dts)
for all particles i of C
   compute Dxi
   xi <- xi + Dxi

. XPBD much simpler (no S tracking)

Distance Constraint
   . Rest distance li
   . Current distance l
   . Masses mi
   . inverse masses wi = 1 / mi

   Dx1 = w1 / (w1 + w2) (l - li) (x2 - x1) / |x2 - x1|
   Dx2 = - w2 / (w1 + w2) (l - li) (x2 - x1) / |x2 - x1|

General Constraint
x1, x2, ..., xn (particles participating in constraint)
constraint function -> C(x1, x2, ..., xn  ) -> C (constraint error - number)

For distance constraint:
Cdist(x1, x2) = |x2 - x1| - li

Constraint Gradient grad(C)
Cdist = |x| - li
. direction i  which X increases the most
grad(C) = x / |x|

Solving a General Constraint (PBD)
compute the scalar value s (same for all participating particles):
s = -C / w1|grad(C1)|²+w2|grad(C2)|²+...+wn|grad(Cn)|²
grad(Ci) : How move xi for a maximal increase of C
|grad(Ci)|² : the squared length of grad(Ci)
Compute correction for point xi as : 
   Dxi = s * wi * grad(Ci) // correction vector poinst in the direction of the gradient.

PBD: 
   . Scale the correction as Dxi = k * s * wi * grad(Ci)
   . Stiffness k E [0, 1]

XPBD: 
   s = -C / w1|grad(C1)|²+w2|grad(C2)|²+...+wn|grad(Cn)|² + alfa/dt²
   . Compliance alfa is the inverse of physical stiffness

Example: Distance Constraint
   grad(C1) = x2 - x1 / |x2 - x1|
   grad(C2) = - (x2 - x1) / |x2 - x1|
   C = l - li

   s = -C / w1|grad(C1)|²+w2|grad(C2)|²+...+wn|grad(Cn)|² 
   s = -(l - li) / w1 * |x2 - x1 / |x2 - x1||² + w2 * |- (x2 - x1) / |x2 - x1||²
   s = (li - l) / w1 * 1 + w2 * 1
   Dx1 = w1 * s * grad(C1) 
   Dx1 = w1 * [(li - l) / (w1 + w2)] * [(x2 - x1) / |x2 - x1|]
   Dx1 = -[w1 / (w1 + w2)] * (l - li) * [(x2 - x1) / |x2 - x1|]

Volume Conservation Constraint (Tetrahedron)
C = 6(V - Vi)
V = (1 / 6)[(x2 - x1) x (x3 - x1)] . (x4 - x1)
C = 6(V - Vi)

grad(C1) = (x4 - x2) x (x3 - x2)
grad(C2) = (x3 - x1) x (x4 - x1)
grad(C3) = (x4 - x1) x (x2 - x1)
grad(C4) = (x2 - x1) x (x3 - x1)

s = -C / w1|grad(C1)|²+w2|grad(C2)|²+...+wn|grad(Cn)|² 
s = - (6(V - Vi)) / w1|grad(C1)|²+w2|grad(C2)|²+w3|grad(C3)|²+w4|grad(C4)|²
s = - (6(V - Vi)) / w1 * 1 + w2 * 1 + w3 * 1 + w4 * 1

Dxi = wi * s * grad(Ci)
Dx1 = - [w1 / (w1 + w2 + w3 + w4)] * 6(V - Vi) * [(x4 - x2) x (x3 - x2)] 
Dx2 = - [w2 / (w1 + w2 + w3 + w4)] * 6(V - Vi) * [(x3 - x1) x (x4 - x1)] 
Dx3 = - [w3 / (w1 + w2 + w3 + w4)] * 6(V - Vi) * [(x4 - x1) x (x2 - x1)] 
Dx4 = - [w4 / (w1 + w2 + w3 + w4)] * 6(V - Vi) * [(x2 - x1) x (x3 - x1)]

/////////////////////////////////////////////////////////
11 - Finding Overlaps among thousands of objects blazing fast
(using spacial hashing)

Blazing Fast Neighbor Search with Spatial Hashing

Problem
   . Given: n points
   . For all points pi: Find neighbors pj such that |pj - pi| <= d
   . Spacial case d = 2r: Fing overlaps of particles with radius r

Naive Solution
   for all points pi
      for all points pj
         if |pj - pi| <= d
            handleOverlap(i, j)

. Problem: the complexity of the algorithm if O(n²)
. For 100.000 points we perform 10.000.000.000 tests
. In general for the complexity of a simulation algorithm:
   . O(n) is good
   . O(nlogn) is OK (i.e. sorting, log 1000, 1000 ~ 17; O(n * 17))
   . O(n²) in not a option

Acceleration Idea (Regular Grids)
   . Store particles in a regular grid
   . Only chech close cells

Grid Layout
   . Store particles once where theis center is located.
   . If we choose h = 2r we only need to check the conteining and the surrounding cells
   . 9 in 2 dimension, 27 in 3 dimensions

Storing the Grid
   cell data : {
      height = width = spacing
      position = (xi, yi)
   }
   xi = Math.floor(px / spacing)
   yi = Math.floor(py / spacing)
   i = xi * numY + yi


////////////////////////
Delaunay
Incre,emtaç Tetraheralization Algorithm
. Input: vertices of the surface mesh
. Start with 4 temporary points forming a big tetrahedron containing all points
. Add the new point
. Remove all tetrahedra whose circumsphere contains the new point
. fill the void with a tetrahedral fan centered at the new point










//////////////////////////////
14 - The secret of cloth simulation
Observation
   . As rigid bodies are not rigid, cloth is strechable
   . Typically only between 0 - 5% with a very strong stretch limit
   . Gravity is rarely strong enought to cause noticeabçe stretching
   . Too much stretching is a bed vsual artifact
   . Latex? No dynamics, quasistatic motion, use skeletal skinning
   . We want to simulate an infinitely stiff material! How?
   . Force based methods explode
   . Use zero compliance distance constraints on cloth mesh edges with XPBD
   . No parameter to tune!

Bending Resistance
   . The only remaining effect is bending resistance (one parameter)
   . Handle as constraint between two neighboring triangles
   . Two popular approaches

Finding Triangle Neighbors
   . Define globalEdgeNr = 3 * triNr + localEdgeNr
   . Create aedge list {min(id0, id1), max(id0, id1), globalEdgeNr}


99% of complecity os rigid body formulations comer from using a global solvers!,
XPBD use a local Solver
. Fix slow convergence with sub-stepping