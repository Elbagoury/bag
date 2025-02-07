interface BagModuleErrors {
    cycle?: string | null;
    failed?: Set<string>;
    missing?: Set<string>;
    unloaded?: Set<string>;
}

interface BagModuleFactory {
    deps: string[];
    fn: BagModuleFactoryFn;
    ignoreMissingDeps: boolean;
}

class BagModuleLoader {
    bus: EventTarget;
    checkErrorProm: Promise<void> | null;
    /**
     * Mapping [name => factory]
     */
    factories: Map<string, BagModuleFactory>;
    /**
     * Names of failed modules
     */
    failed: Set<string>;
    /**
     * Names of modules waiting to be started
     */
    jobs: Set<string>;
    /**
     * Mapping [name => module]
     */
    modules: Map<string, BagModule>;

    constructor(root?: HTMLElement);

    addJob: (name: string) => void;

    define: (
        name: string,
        deps: string[],
        factory: BagModuleFactoryFn,
        lazy?: boolean
    ) => BagModule;

    findErrors: (jobs?: Iterable<string>) => BagModuleErrors;

    findJob: () => string | null;

    reportErrors: (errors: BagModuleErrors) => Promise<void>;

    sortFactories: () => void;

    startModule: (name: string) => BagModule;

    startModules: () => void;
}

type BagModule = Record<string, any>;

type BagModuleFactoryFn = (require: (dependency: string) => BagModule) => BagModule;

declare const bag: {
    csrf_token: string;
    debug: string;
    define: BagModuleLoader["define"];
    loader: BagModuleLoader;
};
