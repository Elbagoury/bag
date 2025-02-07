# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag.addons.mail.controllers.attachment import AttachmentController


class PortalAttachmentController(AttachmentController):
    def _is_allowed_to_delete(self, message, **kwargs):
        if message._is_editable_in_portal(**kwargs):
            return True
        return super()._is_allowed_to_delete(message, **kwargs)
