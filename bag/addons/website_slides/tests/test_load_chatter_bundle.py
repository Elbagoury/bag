# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag import tests
from bag.addons.website_slides.tests.test_ui_wslides import TestUiMemberInvited


@tests.tagged("-at_install", "post_install")
class TestPortalChatterLoadBundle(TestUiMemberInvited):
    def test_load_modules(self):
        self.start_tour(self.portal_invite_url, "portal_chatter_bundle", login="portal")
