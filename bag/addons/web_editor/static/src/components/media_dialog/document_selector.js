/** @bag-module **/

import { _t } from "@web/core/l10n/translation";
import { Attachment, FileSelector, IMAGE_MIMETYPES } from './file_selector';

export class DocumentAttachment extends Attachment {
    static template = "web_editor.DocumentAttachment";
}

export class DocumentSelector extends FileSelector {
    static mediaSpecificClasses = ["o_image"];
    static mediaSpecificStyles = [];
    static mediaExtraClasses = [];
    static tagNames = ["A"];
    static attachmentsListTemplate = "web_editor.DocumentsListTemplate";
    static components = {
        ...FileSelector.components,
        DocumentAttachment,
    };

    setup() {
        super.setup();

        this.uploadText = _t("Upload a document");
        this.urlPlaceholder = "https://www.bag.com/mydocument";
        this.addText = _t("Add URL");
        this.searchPlaceholder = _t("Search a document");
        this.allLoadedText = _t("All documents have been loaded");
    }

    get attachmentsDomain() {
        const domain = super.attachmentsDomain;
        domain.push(['mimetype', 'not in', IMAGE_MIMETYPES]);
        // The assets should not be part of the documents.
        // All assets begin with '/web/assets/', see _get_asset_template_url().
        domain.unshift('&', '|', ['url', '=', null], '!', ['url', '=like', '/web/assets/%']);
        return domain;
    }

    async onClickDocument(document) {
        this.selectAttachment(document);
        await this.props.save();
    }

    async fetchAttachments(...args) {
        const attachments = await super.fetchAttachments(...args);

        if (this.selectInitialMedia()) {
            for (const attachment of attachments) {
                if (`/web/content/${attachment.id}` === this.props.media.getAttribute('href').replace(/[?].*/, '')) {
                    this.selectAttachment(attachment);
                }
            }
        }
        return attachments;
    }

    /**
     * Utility method used by the MediaDialog component.
     */
    static async createElements(selectedMedia, { orm }) {
        return Promise.all(selectedMedia.map(async attachment => {
            const linkEl = document.createElement('a');
            let href = `/web/content/${encodeURIComponent(attachment.id)}?unique=${encodeURIComponent(attachment.checksum)}&download=true`;
            if (!attachment.public) {
                let accessToken = attachment.access_token;
                if (!accessToken) {
                    [accessToken] = await orm.call(
                        'ir.attachment',
                        'generate_access_token',
                        [attachment.id],
                    );
                }
                href += `&access_token=${encodeURIComponent(accessToken)}`;
            }
            linkEl.href = href;
            linkEl.title = attachment.name;
            linkEl.dataset.mimetype = attachment.mimetype;
            return linkEl;
        }));
    }
}
