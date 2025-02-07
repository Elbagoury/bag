# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag.tests import tagged

from bag.addons.website_sale.tests.common import WebsiteSaleCommon


@tagged('post_install', '-at_install')
class TestWSaleCommon(WebsiteSaleCommon):

    def test_common(self):
        self.assertEqual(self.env.company, self.website.company_id)
        self.assertEqual(self.pricelist.currency_id, self.env.company.currency_id)
