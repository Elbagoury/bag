# -*- coding: utf-8 -*-
# Part of Bag. See LICENSE file for full copyright and licensing details.

{
    'name': 'BagBot',
    'version': '1.2',
    'category': 'Productivity/Discuss',
    'summary': 'Add BagBot in discussions',
    'website': 'https://www.bag.com/app/discuss',
    'depends': ['mail'],
    'auto_install': True,
    'installable': True,
    'data': [
        'views/res_users_views.xml',
        'data/mailbot_data.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'mail_bot/static/src/scss/bagbot_style.scss',
        ],
    },
    'license': 'LGPL-3',
}
