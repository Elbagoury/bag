# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag import fields, models


class AccountAnalyticApplicability(models.Model):
    _inherit = 'account.analytic.applicability'
    _description = "Analytic Plan's Applicabilities"

    business_domain = fields.Selection(
        selection_add=[
            ('timesheet', 'Timesheet'),
        ],
        ondelete={'timesheet': 'cascade'},
    )
