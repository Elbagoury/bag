# -*- coding: utf-8 -*-
# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag.fields import Command
from bag.tests import tagged
from bag.tests.common import HttpCase


@tagged('post_install', '-at_install')
class TestWebsiteSaleStockMultilang(HttpCase):
    def test_website_sale_stock_multilang(self):
        # Install French
        website = self.env.ref('website.default_website')
        lang_fr = self.env['res.lang']._activate_lang('fr_FR')
        website.language_ids = [Command.link(lang_fr.id)]

        # Configure product: out-of-stock message in EN and FR
        unavailable_product = self.env['product.product'].create({
            'name': 'unavailable_product',
            'is_storable': True,
            'allow_out_of_stock_order': False,
            'sale_ok': True,
            'website_published': True,
            'list_price': 123.45,
            'out_of_stock_message': 'Out of stock',
        })
        unavailable_product.update_field_translations('out_of_stock_message', {
            'fr_FR': {'Out of stock': 'Hors-stock'},
        })
        self.start_tour("/fr/shop?search=unavailable", 'website_sale_stock_multilang')
