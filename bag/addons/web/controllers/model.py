# Part of Bag. See LICENSE file for full copyright and licensing details.

from json import loads, dumps
from bag.http import Controller, request, route


class Model(Controller):
    @route("/web/model/get_definitions", methods=["POST"], type="http", auth="user")
    def get_model_definitions(self, model_names, **kwargs):
        return request.make_response(
            dumps(
                request.env["ir.model"]._get_definitions(loads(model_names)),
            )
        )
