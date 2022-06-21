# -*- coding: utf-8 -*-
#
# This file is part of Invenio.
# Copyright (C) 2015-2022 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""UI for Invenio-Search."""

from . import config

class OARepoGeneratedUI(object):
    """OARepo-Generated-UI extension."""

    def __init__(self, app=None):
        """Extension initialization.

        :param app: The Flask application.
        """
        if app:
            self.init_app(app)

    def init_app(self, app):
        """Flask application initialization.

        :param app: The Flask application.
        """
        self.init_config(app)
        app.extensions['oarepo-generated-ui'] = self

    def init_config(self, app):
        """Initialize configuration.

        :param app: The Flask application.
        """
        for k in dir(config):
            if k.startswith('OAREPO_GENERATED_UI_'):
                app.config.setdefault(k, getattr(config, k))
