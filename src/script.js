import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */

const gui = new dat.GUI({
    width: 300,
    title: 'Nice debug UI',
    closeFolders: true
})
const debugObject = {}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
     sizes.width = window.innerWidth
     sizes.height = window.innerHeight

     // Update camera
     camera.aspect = sizes.width / sizes.height
     camera.updateProjectionMatrix()

     // Update renderer
     renderer.setSize(sizes.width, sizes.height)
     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen)
        {
            canvas.webkitRequestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        }
    }
})

// Scene
const scene = new THREE.Scene()



// Object
debugObject.color = '#01fe62'
const material = new THREE.MeshBasicMaterial({ color: debugObject.color })
const geometry =  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5)
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const cubeTweaks = gui.addFolder('Awesome cube')

cubeTweaks
    .add(mesh.position, 'y')
    // ...

cubeTweaks
    .add(mesh, 'visible')


gui
    .add(mesh.position, 'y')
    .min(- 3)
    .max(3)
    .step(0.01)
    .name('elevation')

gui
   .add(mesh, 'visible')
   
gui
   .add(material, 'wireframe')
gui
   .addColor(debugObject, 'color')
   .onChange(()=>{
     material.color.set(debugObject.color)
   })
   
debugObject.spin = () =>{
    gsap.to(mesh.rotation, {y: mesh.rotation.y + Math.PI * 2})
}
gui.add(debugObject, 'spin')

debugObject.subdivision = 2
gui
    .add(debugObject, 'subdivision')
    .min(1)
    .max(20)
    .step(1)
    .onFinishChange(() =>
    {
        mesh.geometry.dispose()
        mesh.geometry = new THREE.BoxGeometry(
            1, 1, 1,
            debugObject.subdivision, debugObject.subdivision, debugObject.subdivision
        )
    })

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.x = 2
camera.position.y = 2
camera.position.z = 2
camera.lookAt(mesh.position)
scene.add(camera)

//Controls 

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    
    
    // Update controls
    controls.update()
      

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()