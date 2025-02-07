import { expect, test } from "@bag/hoot";
import { animationFrame } from "@bag/hoot-mock";
import { click } from "@bag/hoot-dom";
import {
    defineModels,
    fields,
    models,
    mountView,
    patchWithCleanup,
} from "@web/../tests/web_test_helpers";

class ResConfigSettings extends models.Model {
    _name = "res.config.settings";
    bar = fields.Boolean({ string: "Bar" });
}
defineModels([ResConfigSettings]);

test("widget upgrade_boolean in a form view - dialog", async () => {
    await mountView({
        type: "form",
        arch: /* xml */ `
            <form js_class="base_settings">
                <app string="CRM" name="crm">
                    <field name="bar" widget="upgrade_boolean"/>
                </app>
            </form>`,
        resModel: "res.config.settings",
    });

    await click(".o-checkbox .form-check-input");
    await animationFrame();
    expect(".o_dialog .modal").toHaveCount(1, {
        message: "the 'Upgrade to OY' dialog should be opened",
    });
});

test("widget upgrade_boolean in a form view - label", async () => {
    await mountView({
        type: "form",
        arch: /* xml */ `
            <form js_class="base_settings">
                <app string="CRM" name="crm">
                    <setting string="Coucou">
                        <field name="bar" widget="upgrade_boolean"/>
                    </setting>
                </app>
            </form>`,
        resModel: "res.config.settings",
    });

    expect(".o_field .badge").toHaveCount(0, {
        message: "the upgrade badge shouldn't be inside the field section",
    });
    expect(".o_form_label .badge").toHaveCount(1, {
        message: "the upgrade badge should be inside the label section",
    });
    expect(".o_form_label").toHaveText("Coucou\nOY", {
        message: "the upgrade label should be inside the label section",
    });
});

test("widget upgrade_boolean in a form view - dialog (oy version)", async () => {
    patchWithCleanup(bag, { info: { isOY: 1 } });
    await mountView({
        type: "form",
        arch: /* xml */ `
            <form js_class="base_settings">
                <app string="CRM" name="crm">
                    <field name="bar" widget="upgrade_boolean"/>
                </app>
            </form>`,
        resModel: "res.config.settings",
    });

    await click(".o-checkbox .form-check-input");
    await animationFrame();

    expect(".o_dialog .modal").toHaveCount(0, {
        message: "the 'Upgrade to OY' dialog shouldn't be opened",
    });
});

test("widget upgrade_boolean in a form view - label (oy version)", async () => {
    patchWithCleanup(bag, { info: { isOY: 1 } });
    await mountView({
        type: "form",
        arch: /* xml */ `
            <form js_class="base_settings">
                <app string="CRM" name="crm">
                    <setting string="Coucou">
                        <field name="bar" widget="upgrade_boolean"/>
                    </setting>
                </app>
            </form>`,
        resModel: "res.config.settings",
    });

    expect(".o_field .badge").toHaveCount(0, {
        message: "the upgrade badge shouldn't be inside the field section",
    });
    expect(".o_form_label .badge").toHaveCount(0, {
        message: "the upgrade badge shouldn't be inside the label section",
    });
    expect(".o_form_label").toHaveText("Coucou", {
        message: "the label shouldn't contains the upgrade label",
    });
});
