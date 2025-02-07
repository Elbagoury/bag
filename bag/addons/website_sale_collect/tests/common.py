# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag.fields import Command

from bag.addons.payment_custom.tests.common import PaymentCustomCommon
from bag.addons.website_sale.tests.common import WebsiteSaleCommon


class OnSiteCommon(PaymentCustomCommon, WebsiteSaleCommon):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        # Create the in-store delivery method.
        product = cls._prepare_carrier_product(list_price=0.0)
        cls.store_1 = cls.env['stock.warehouse'].create({
            'name': 'Store 1',
            'code': 'ST1',
        })
        cls.carrier = cls._prepare_carrier(
            product,
            fixed_price=0.0,
            delivery_type='in_store',
            warehouse_ids=[Command.set([cls.store_1.id])],
            name="Example in-store delivery",
        )
        cls.provider = cls._prepare_provider('on_site')
