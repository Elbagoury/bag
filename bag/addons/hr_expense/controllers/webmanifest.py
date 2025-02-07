# Part of Bag. See LICENSE file for full copyright and licensing details.

from bag.addons.web.controllers import webmanifest


class WebManifest(webmanifest.WebManifest):

    def _get_webmanifest(self):
        manifest = super()._get_webmanifest()
        if not manifest.get('share_target'):
            manifest['share_target'] = {
                'action': '/bag?share_target=trigger',
                'method': 'POST',
                'enctype': 'multipart/form-data',
                'params': {
                    'files': [{
                        'name': 'externalMedia',
                        'accept': ['image/*', 'application/pdf'],
                    }]
                }
            }
        return manifest
