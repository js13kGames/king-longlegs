import { addParticle, newParticle } from "./particles"
import { incrementCourage } from "./stats"
import { zzfx } from "./zzfx"

export const newWords = (text, x, y) => {
    return {
        type_: "words",
        text: text,
        x: x,
        y: y,
        t: 0, // unused, using, used
        lastParticleTime: 0
    }
}


export const updateWords = (obj, dt) => {
    if (IS_DEVELOPMENT_BUILD && obj.type_ != "words") {
        throw new Error("Invalid game object passed to updateWords " + JSON.stringify(obj))
    }
    if (obj.t === 0) {
        obj.lastParticleTime += dt
        if (Math.random() < 0.001*dt || obj.lastParticleTime > 500) {
            const particle = newParticle(
                0,
                undefined,
                obj.x + 60 * (Math.random() - 0.5), 
                obj.y - 180,
                5000 + 300 * Math.random(),
                -0.002 + 0.001 * Math.random(),
                0.99,
                0.1,
                0.001)
            addParticle(particle)
            obj.lastParticleTime = 0
        }

        if (Math.abs(G.player.x - obj.x) < 30 && Math.abs(G.player.y - obj.y) < 100) {
            obj.t = 0.001
            zzfx(...[1.2,,268,.02,.19,.32,,3.6,,,305,.07,.03,,,,.16,.79,.13,,-1388])
            incrementCourage(true, obj.x, obj.y - 170)
        }
    } else if (obj.t < 500) {
        obj.t += dt
    }
}
