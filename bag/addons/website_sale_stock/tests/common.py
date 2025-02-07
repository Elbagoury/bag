# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag.addons.website_sale.tests.common import WebsiteSaleCommon


class WebsiteSaleStockCommon(WebsiteSaleCommon):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        cls.warehouse = cls.env['stock.warehouse'].search([('company_id', '=', cls.company.id)])
