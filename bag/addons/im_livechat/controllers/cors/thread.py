# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag.http import route
from bag.addons.mail.controllers.thread import ThreadController
from bag.addons.im_livechat.tools.misc import force_guest_env


class LivechatThreadController(ThreadController):
    @route("/im_livechat/cors/message/post", methods=["POST"], type="json", auth="public", cors="*")
    def livechat_message_post(self, guest_token, thread_model, thread_id, post_data, context=None, **kwargs):
        force_guest_env(guest_token)
        return self.mail_message_post(thread_model, thread_id, post_data, context, **kwargs)

    @route("/im_livechat/cors/message/update_content", methods=["POST"], type="json", auth="public", cors="*")
    def livechat_message_update_content(
        self, guest_token, message_id, body, attachment_ids, attachment_tokens=None, partner_ids=None
    ):
        force_guest_env(guest_token)
        return self.mail_message_update_content(message_id, body, attachment_ids, attachment_tokens, partner_ids)
