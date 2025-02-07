# Part of Bag. See LICENSE file for full copyright and licensing details.

{
    'name': 'account_qr_code_emv',
    'category': 'Accounting/Payment',
    'version': '1.0',
    'description': """
Bridge module addings support for EMV Merchant-Presented QR-code generation for Payment System.
    """,
    'author': 'Bag SA',
    'depends': ['account'],
    'data': [
        'views/res_bank_views.xml',
    ],
    'license': 'LGPL-3',
}
