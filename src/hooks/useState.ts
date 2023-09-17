import { getActiveFunctionalComponent } from "../components/private/FunctionalComponent.js";

export function useState<T>(initializer: () => T): [T, (value: T) => void]
export function useState<T>(initialValue: T): [T, (value: T) => void]
export function useState<T>(initial: () => T) {
    return useStateWithInitializer(typeof initial === "function" ? initial : () => initial);
}

/**
 * Like `useState`, but initialized with a function to avoid reconstructing `initialValue`.
 * @param initializer 
 * @returns 
 */
function useStateWithInitializer<T>(initializer: () => T): [T, (value: T) => void] {
    const component = getActiveFunctionalComponent();
    const hookIndex = component.hookIndex++;
    const value = component.hooks[hookIndex] ??= initializer();
    return [
        value,
        (newValue: T) => {
            component.hooks[hookIndex] = newValue;
            component.requestUpdate();
        }
    ];
}
