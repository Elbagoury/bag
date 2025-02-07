# -*- coding: utf-8 -*-
# Part of Bag. See LICENSE file for full copyright and licensing details.

import bag.tests
from bag.tools import mute_logger


@bag.tests.common.tagged('post_install', '-at_install')
class TestCustomSnippet(bag.tests.HttpCase):

    @mute_logger('bag.addons.http_routing.models.ir_http', 'bag.http')
    def test_01_run_tour(self):
        self.start_tour(self.env['website'].get_client_action_url('/'), 'test_custom_snippet', login="admin")
