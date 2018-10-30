import {sha256} from "js-sha256"

export function generateRandomId(): string {
    return sha256(Math.random().toString(10))
}
