/** @bag-module **/

import { BagEditor } from "@web_editor/js/editor/bag-editor/src/BagEditor";
import { patch } from "@web/core/utils/patch";
import { removeTextHighlight } from "@website/js/text_processing";

/**
 * The goal of this patch is to correctly handle BagEditor's behaviour for text
 * highlight elements.
 */
patch(BagEditor.prototype, {
    /**
     * @override
     */
    _onClipboardCopy(e) {
        super._onClipboardCopy(e);

        const selection = this.document.getSelection();
        const range = selection.getRangeAt(0);
        let rangeContent = range.cloneContents();
        const firstChild = rangeContent.firstChild;

        // Fix the copied range and remove the highlight units when the content
        // is partially selected.
        if (firstChild && firstChild.className && firstChild.className.includes("o_text_highlight_item")) {
            const textHighlightEl = range.commonAncestorContainer.cloneNode();
            textHighlightEl.replaceChildren(...rangeContent.childNodes);
            removeTextHighlight(textHighlightEl);
            rangeContent = textHighlightEl;
            const data = document.createElement("data");
            data.append(rangeContent);
            const html = data.innerHTML;
            e.clipboardData.setData("text/plain", selection.toString());
            e.clipboardData.setData("text/html", html);
            e.clipboardData.setData("text/bag-editor", html);
        }
    },
});
