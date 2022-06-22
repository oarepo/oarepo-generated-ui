# -*- coding: utf-8 -*-
#
# This file is part of Invenio.
# Copyright (C) 2015-2018 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""JS/CSS bundles for oarepo-generated-ui.

You include one of the bundles in a page like the example below (using
``base`` bundle as an example):

 .. code-block:: html

    {{ webpack['base.js']}}

"""

from invenio_assets.webpack import WebpackThemeBundle

generated_ui = WebpackThemeBundle(
    __name__,
    "assets",
    default="semantic-ui",
    themes={
        "semantic-ui": dict(
            entry={
                "oarepo_generated_layout": "./js/oarepo_generated_ui/layout.js",
            },
            dependencies={
                "i18next": "^20.3.0",
                "i18next-browser-languagedetector": "^6.1.0",
                "react-i18next": "^11.11.0",
                "@babel/runtime": "^7.9.0",
                "@semantic-ui-react/css-patch": "^1.0.0",
                "lodash": "^4.17.0",
                "react": "^16.13.0",
                "react-dom": "^16.13.0",
                "semantic-ui-css": "^2.4.1",
                "semantic-ui-react": "^2.1.2",
                "clsx": "^1.1.1",
            },
            aliases={
                '@js/oarepo_generated_ui': 'js/oarepo_generated_ui',
                # TODO: needed until resolution of https://github.com/inveniosoftware/invenio-search-ui/issues/130
                '@translations/invenio_app_rdm': 'translations/oarepo_generated_ui'
            }
        )
    },
)
