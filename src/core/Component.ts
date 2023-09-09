
/**
 * A component must emit connected/disconnected events when connected and disconnected from a dom.
 */
export interface Component extends EventTarget {
    readonly isConnected: boolean;
}
