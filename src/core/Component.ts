
/**
 * A component must emit connected/disconnected events when connected and disconnected from a dom.
 */
export interface Component<Properties = unknown> extends EventTarget {
    /**
     * Is this component active and connected to the containing dom?
     */
    readonly isConnected: boolean;
    /**
     * The only property we set to (re)configure a component. 
     */
    properties: Properties;
}
