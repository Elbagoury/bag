/** @bag-module **/
import { App, whenReady } from "@bag/owl";
import { PublicReadonlySpreadsheet } from "./public_readonly";
import { getTemplate } from "@web/core/templates";
import { makeEnv, startServices } from "@web/env";
import { session } from "@web/session";
import { _t } from "@web/core/l10n/translation";

(async function boot() {
    bag.info = {
        db: session.db,
        server_version: session.server_version,
        server_version_info: session.server_version_info,
        isOY: session.server_version_info.slice(-1)[0] === "e",
    };
    bag.isReady = false;
    const env = makeEnv();
    await startServices(env);
    await whenReady();
    const app = new App(PublicReadonlySpreadsheet, {
        env,
        props: session.spreadsheet_public_props,
        getTemplate,
        translateFn: _t,
        dev: env.debug,
        warnIfNoStaticProps: env.debug,
        translatableAttributes: ["data-tooltip"],
    });
    const root = await app.mount(document.getElementById("spreadsheet-mount-anchor"));
    bag.__WOWL_DEBUG__ = { root };
    bag.isReady = true;
})();
