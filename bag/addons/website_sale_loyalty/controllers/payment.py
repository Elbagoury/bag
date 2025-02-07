# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag import _
from bag.exceptions import ValidationError

from bag.addons.website_sale.controllers import payment


class PaymentPortal(payment.PaymentPortal):

    def _validate_transaction_for_order(self, transaction, sale_order):
        """Update programs & rewards before finalizing transaction.

        :param payment.transaction transaction: The payment transaction
        :param int order_id: The id of the sale order to pay
        :raise: ValidationError if the order amount changed after updating rewards
        """
        super()._validate_transaction_for_order(transaction, sale_order)
        if sale_order.exists():
            initial_amount = sale_order.amount_total
            sale_order._update_programs_and_rewards()
            if initial_amount != sale_order.amount_total:
                raise ValidationError(
                    _("Cannot process payment: applied reward was changed or has expired.")
                )
