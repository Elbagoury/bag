# Part of Bag. See LICENSE file for full copyright and licensing details.

import bag.tests


@bag.tests.common.tagged('post_install', '-at_install')
class TestSnippetBackgroundVideo(bag.tests.HttpCase):

    def test_snippet_background_video(self):
        self.start_tour("/", "snippet_background_video", login="admin")
