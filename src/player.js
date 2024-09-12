import { decrementCourage } from "./stats"
import { updateWalker } from "./walker"
import { loadLevel } from "./level"
import { zzfx } from "./zzfx"


export const updatePlayer = (dt) => {
    if (IS_DEVELOPMENT_BUILD && G.isEditPaused) {
        if (G.keys["ArrowLeft"]) {
            G.player.x -= 12
        }
        if (G.keys["ArrowRight"]) {
            G.player.x += 12
        }
        if (G.keys["ArrowUp"]) {
            G.player.y -= 12
        }
        if (G.keys["ArrowDown"]) {
            G.player.y += 12
        }
    } else {
        handleControls(dt)
        handleDamage(dt)
        handleRespawn(dt)
        handleJumping(dt)
        updateWalker(G.player, dt)
    }
}


const handleDamage = (dt) => {
    if (G.damage.invincibility > 0)
        G.damage.invincibility -= dt
    if (G.damage.pending !== undefined) {
        if (G.damage.invincibility <= 0) {
            decrementCourage()
            G.damage.invincibility = 500
            G.player.vx += 2 * G.damage.pending.push_x
            G.player.vy += 2 * G.damage.pending.push_y
            // Give the player a change to escape.
            G.jump.coyoteTime = 200
            G.jump.doubleJumpReady = G.jump.hasDoubleJump
            if (G.player_courage <= 0) {
                G.player.isDead = true
                G.damage.deathTimer = 3000
            }
        }
        G.damage.pending = undefined
    }
}


const handleRespawn = (dt) => {
    if (G.damage.deathTimer > 0) {
        G.damage.deathTimer -= dt

        if (G.damage.deathTimer <= 0) {
            G.player.isDead = false
            G.player.x = G.damage.lastSavepoint.x - G.damage.lastSavepoint.s * 100
            G.player.y = G.damage.lastSavepoint.y - 200
            loadLevel(G.damage.lastSavepointLevel)
            G.player_courage = G.player_maxCourage
        }
    }
}


const handleJumping = (dt) => {
    if (G.player.isGrounded) {
        G.jump.coyoteTime = 100
        G.jump.doubleJumpReady = G.jump.hasDoubleJump
    } else if (G.jump.coyoteTime >= 0) {
        G.jump.coyoteTime -= dt
    }

    if (!G.player.isDead && G.jump.buffer > 0) {
        G.jump.buffer -= dt
        if ((G.jump.coyoteTime >= 0 || G.jump.doubleJumpReady) && G.jump.buffer >= 0) {
            G.jump.lastTime = G.t
            G.jump.buffer = 0
            if (G.jump.coyoteTime < 0)
                G.jump.doubleJumpReady = false
            zzfx(...[,,173,.03,.06,.05,1,.6,,91,,,,,,,,.6,.05])
        }
    }

    if ((G.t - G.jump.lastTime) < 35) {
        G.player.vy = -2
    } else if (G.keys["z"] && (G.t - G.jump.lastTime) < 85) {
        G.player.vy = Math.min(G.player.vy, -2)
    }
}


const handleControls = (dt) => {
    if (!G.player.isDead) {
        if (!G.jump.zPressed && G.keys["z"]) {
            G.jump.buffer = 50
        }
        if (G.keys["ArrowLeft"]) {
            G.player.facing_ = -1
            G.player.vx -= 0.15
        }
        if (G.keys["ArrowRight"]) {
            G.player.facing_ = 1
            G.player.vx += 0.15
        }
    }

    G.jump.zPressed = G.keys["z"]
}
