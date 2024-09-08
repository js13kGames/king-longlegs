import { syncLevel } from "./level"

export const deleteTool = () => {
    if (E.objectData !== undefined) {
        if ((E.objectData.type === "wall" || E.objectData.type === "collider") && E.objectSubIndex >= 0) {
            E.objectData.points.splice(E.objectSubIndex, 2)
            if (E.objectData.points.length > 0) {
                if (E.objectSubIndex > 0) {
                    E.objectSubIndex -= 2
                }
            } else {
                if (E.objectData.type === "wall") {
                    E.wals.splice(E.objectIndex, 1)
                } else {
                    E.colliders.splice(E.objectIndex, 1)
                }
                E.objectData = undefined
                E.objectSubIndex = -1
                E.objectIndex = -1
            }
        }
    }

    syncLevel()
}