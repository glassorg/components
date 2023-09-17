import { useState } from "./useState.js";

export function useRef<T>(value: T): { value: T } {
    const [state, setState] = useState({ value });
    return state;
}
