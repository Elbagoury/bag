# -*- coding: utf-8 -*-
# Part of Bag. See LICENSE file for full copyright and licensing details.

import json

from bag import _
from bag.http import request
from bag.addons.website.controllers.form import WebsiteForm


class WebsiteNewsletterForm(WebsiteForm):

    def _handle_website_form(self, model_name, **kwargs):
        if model_name == 'mailing.contact':
            list_ids = kwargs.get('list_ids')
            if not list_ids:
                return json.dumps({'error': _('Mailing List(s) not found!')})
            list_ids = [int(x) for x in list_ids.split(',')]
            private_list_ids = request.env['mailing.list'].sudo().search([
                ('id', 'in', list_ids), ('is_public', '=', False)])
            if private_list_ids:
                return json.dumps({
                    'error': _('You cannot subscribe to the following list anymore : %s',
                               ', '.join(private_list_ids.mapped('name')))
                })
        return super()._handle_website_form(model_name, **kwargs)
