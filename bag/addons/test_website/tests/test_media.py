# -*- coding: utf-8 -*-
# Part of Bag. See LICENSE file for full copyright and licensing details.

import base64

import bag.tests
from bag.tools import mute_logger


@bag.tests.common.tagged('post_install', '-at_install')
class TestMedia(bag.tests.HttpCase):

    @mute_logger('bag.addons.http_routing.models.ir_http', 'bag.http')
    def test_01_replace_media(self):
        SVG = base64.b64encode(b'<svg xmlns="http://www.w3.org/2000/svg"></svg>')
        self.env['ir.attachment'].create({
            'name': 'sample.svg',
            'public': True,
            'mimetype': 'image/svg+xml',
            'datas': SVG,
        })
        self.start_tour("/", 'test_replace_media', login="admin")

    def test_02_image_link(self):
        self.start_tour("/", 'test_image_link', login="admin")
