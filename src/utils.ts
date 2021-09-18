export class KeyDisplay {

    map: Map<string, HTMLDivElement> = new Map()

    constructor() {
        const w: HTMLDivElement = document.createElement("div")
        const a: HTMLDivElement = document.createElement("div")
        const s: HTMLDivElement = document.createElement("div")
        const d: HTMLDivElement = document.createElement("div")
        const shift: HTMLDivElement = document.createElement("div")

        this.map.set('w', w)
        this.map.set('a', a)
        this.map.set('s', s)
        this.map.set('d', d)
        this.map.set('shift', shift)

        this.map.forEach( (v, k) => {
            v.style.color = 'blue'
            v.style.fontSize = '50px'
            v.style.fontWeight = '800'
            v.style.position = 'absolute'
            v.textContent = k
        })

        this.updatePosition()

        this.map.forEach( (v, _) => {
            document.body.append(v)
        })
    }

    public updatePosition() {
        this.map.get('w').style.top = `${window.innerHeight - 150}px`
        this.map.get('a').style.top = `${window.innerHeight - 100}px`
        this.map.get('s').style.top = `${window.innerHeight - 100}px`
        this.map.get('d').style.top = `${window.innerHeight - 100}px`
        this.map.get('shift').style.top = `${window.innerHeight - 100}px`

        this.map.get('w').style.left = `${300}px`
        this.map.get('a').style.left = `${200}px`
        this.map.get('s').style.left = `${300}px`
        this.map.get('d').style.left = `${400}px`
        this.map.get('shift').style.left = `${50}px`
    }

    public down (key: string) {
        if (this.map.get(key.toLowerCase())) {
            this.map.get(key.toLowerCase()).style.color = 'red'
        }
    }

    public up (key: string) {
        if (this.map.get(key.toLowerCase())) {
            this.map.get(key.toLowerCase()).style.color = 'blue'
        }
    }

}