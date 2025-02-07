import { Plugin } from "@html_editor/plugin";
import { isBlock } from "@html_editor/utils/blocks";

export class BagLinkSelectionPlugin extends Plugin {
    static id = "bagLinkSelection";
    resources = {
        ineligible_link_for_zwnbsp_predicates: [
            (link) =>
                [link, ...link.querySelectorAll("*")].some(
                    (el) => el.nodeName === "IMG" || isBlock(el)
                ),
            (link) => link.matches("nav a, a.nav-link"),
        ],
        ineligible_link_for_selection_indication_predicates: (link) => link.matches(".btn"),
    };
}
