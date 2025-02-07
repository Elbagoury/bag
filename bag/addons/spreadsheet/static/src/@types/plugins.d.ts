declare module "@spreadsheet" {
    import { CommandResult, CorePlugin, UIPlugin } from "@bag/o-spreadsheet";
    import { CommandResult as CR } from "@spreadsheet/o_spreadsheet/cancelled_reason";
    type BagCommandResult = CommandResult | typeof CR;

    export interface BagCorePlugin extends CorePlugin {
        getters: BagCoreGetters;
        dispatch: BagCoreDispatch;
        allowDispatch(command: AllCoreCommand): string | string[];
        beforeHandle(command: AllCoreCommand): void;
        handle(command: AllCoreCommand): void;
    }

    export interface BagCorePluginConstructor {
        new (config: unknown): BagCorePlugin;
    }

    export interface BagUIPlugin extends UIPlugin {
        getters: BagGetters;
        dispatch: BagDispatch;
        allowDispatch(command: AllCommand): string | string[];
        beforeHandle(command: AllCommand): void;
        handle(command: AllCommand): void;
    }

    export interface BagUIPluginConstructor {
        new (config: unknown): BagUIPlugin;
    }
}
