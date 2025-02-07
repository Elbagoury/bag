# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag.http import request
from bag.osv import expression
from bag.addons.mail.controllers import thread


class ThreadController(thread.ThreadController):
    def _filter_message_post_partners(self, thread, partners):
        if thread._name == "project.task":
            domain = [
                ("res_model", "=", "project.task"),
                ("res_id", "=", thread.id),
                ("partner_id", "in", partners.ids),
            ]
            if thread.project_id:
                project_domain = [
                    ("res_model", "=", "project.project"),
                    ("res_id", "=", thread.project_id.id),
                    ("partner_id", "in", partners.ids),
                ]
                domain = expression.OR([domain, project_domain])
            # sudo: mail.followers - filtering partners that are followers is acceptable
            return request.env["mail.followers"].sudo().search(domain).partner_id
        return super()._filter_message_post_partners(thread, partners)
