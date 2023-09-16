
export interface Factory<T extends object> {

    build(recycle?: T): T

}
