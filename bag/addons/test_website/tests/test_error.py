import bag.tests
from bag.tools import mute_logger


@bag.tests.common.tagged('post_install', '-at_install')
class TestWebsiteError(bag.tests.HttpCase):

    @mute_logger('bag.addons.http_routing.models.ir_http', 'bag.http')
    def test_01_run_test(self):
        self.start_tour("/test_error_view", 'test_error_website')
