# -*- coding: utf-8 -*-
# Part of Bag. See LICENSE file for full copyright and licensing details.

import bag.tests

@bag.tests.tagged("post_install", "-at_install")
class TestBagEditor(bag.tests.HttpCase):

    def test_bag_editor_suite(self):
        self.browser_js('/web_editor/tests', "", "", login='admin', timeout=1800)
