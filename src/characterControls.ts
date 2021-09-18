import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


const w = 'w'
const a = 'a'
const s = 's'
const d = 'd'
const directions = [w,a,s,d]

export class CharacterControls {

    model: THREE.Group
    mixer: THREE.AnimationMixer
    animationsMap: Map<string, THREE.AnimationAction> = new Map() // Walk, Run, Idle
    toggleRun: boolean = true
    currentAction: string

    fadeDuration: number = 0.2
    walkDirection = new THREE.Vector3()
    rotateAngle = new THREE.Vector3(0,1,0)
    rotateQuarternion: THREE.Quaternion = new THREE.Quaternion()

    runVelocity = 5
    walkVelocity = 2

    constructor(model: THREE.Group, mixer: THREE.AnimationMixer, animationsMap: Map<string, THREE.AnimationAction>, currentAction: string) {
        this.model = model
        this.mixer = mixer
        this.animationsMap = animationsMap
        this.currentAction = currentAction
        this.animationsMap.forEach((value, key) => {
            if (key == currentAction) {
                value.play()
            }
        })
    }

    public switchRunToggle() {
        this.toggleRun = !this.toggleRun
    }

    public update(delta: number, keysPressed: any, camera: THREE.Camera, orbitControl: OrbitControls) {
        const directionPressed = directions.some(key => keysPressed[key] == true)

        var play = '';
        if (directionPressed && this.toggleRun) {
            play = 'Run'
        } else if (directionPressed) {
            play = 'Walk'
        } else {
            play = 'Idle'
        }

        if (this.currentAction != play) {
            const toPlay = this.animationsMap.get(play)
            const current = this.animationsMap.get(this.currentAction)

            current.fadeOut(this.fadeDuration)
            toPlay.reset().fadeIn(this.fadeDuration).play();

            this.currentAction = play
        }

        this.mixer.update(delta)

        if (this.currentAction == 'Run' || this.currentAction == 'Walk') {
            // calculate towards camera direction
            var angleYCameraDirection = Math.atan2( ( camera.position.x - this.model.position.x ), ( camera.position.z - this.model.position.z ) )
            // diagonal movement angle offset
            var directionOffset = this.directionOffset(keysPressed)

            // rotate model
            this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffset)
            this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.1)

            // calculate direction
            camera.getWorldDirection(this.walkDirection)
            this.walkDirection.y = 0
            this.walkDirection.normalize()
            this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset)

            // run/walk velocity
            const velocity = this.currentAction == 'Run' ? this.runVelocity : this.walkVelocity

            // move model & camera
            this.model.position.x += this.walkDirection.x * velocity * delta
            this.model.position.z += this.walkDirection.z * velocity * delta
            camera.position.x += this.walkDirection.x * velocity * delta
            camera.position.z += this.walkDirection.z * velocity * delta
            orbitControl.target = this.model.position
        }
    }

    private directionOffset(keysPressed: any) {
        var directionOffset = 0
        if (keysPressed[w]) {
            if (keysPressed[a]) {
                directionOffset = Math.PI / 4
            } else if (keysPressed[d]) {
                directionOffset = -Math.PI / 4
            }
        } else if (keysPressed[s]) {
            if (keysPressed[a]) {
                directionOffset = Math.PI / 4 + Math.PI / 2
            } else if (keysPressed[d]) {
                directionOffset = -Math.PI / 4 - Math.PI / 2
            } else {
                directionOffset = Math.PI
            }
        } else if (keysPressed[a]) {
            directionOffset = Math.PI / 2
        } else if (keysPressed[d]) {
            directionOffset = -Math.PI / 2
        }
        return directionOffset
    }
}