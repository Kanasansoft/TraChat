from trac.core import *
from trac.web.chrome import INavigationContributor, ITemplateProvider, add_script, add_stylesheet
from trac.web.main import IRequestHandler
from trac.config import Configuration
from genshi.builder import tag

import re
import logging
from trac.util.concurrency import threading
import time
from os import path
from mod_pywebsocket import standalone

class TraChatPlugin(Component):
    implements(INavigationContributor, IRequestHandler, ITemplateProvider)

    def __init__(self):
        self.port = str(Configuration.get(self.config, "trachat", "port", "8081"))
        t = TraChatPlugin.thread()
        t.port(self.port)
        t.start()

    # INavigationContributor methods
    def get_active_navigation_item(self, req):
        return 'trachat'

    def get_navigation_items(self, req):
        yield ('mainnav', 'trachat', tag.a('TraChat', href=req.href.trachat()))

    # IRequestHandler methods
    def match_request(self, req):
        return re.match(r'/trachat(?:_trac)?(?:/.*)?$', req.path_info)

    def process_request(self, req):
        if re.match(r'/trachat(?:_trac)?\/port$', req.path_info):
            content = self.port
            req.send_response(200)
            req.send_header('Content-Type', 'text/plain')
            req.send_header('Content-Length', len(content))
            req.end_headers()
            req.write(content)
            return
        if re.match(r'/trachat(?:_trac)?$', req.path_info):
            data = {}
            add_script(req, 'trachat/js/trachat.js')
            add_stylesheet(req, 'trachat/css/trachat.css')
            return 'trachat.html', data, None
        req.send_response(404)
        req.send_header('Content-Type', 'text/plain')
        req.send_header('Content-Length', 0)
        req.end_headers()

    def get_templates_dirs(self):
        from pkg_resources import resource_filename
        return [resource_filename(__name__, 'templates')]

    def get_htdocs_dirs(self):
        from pkg_resources import resource_filename
        return [('trachat', resource_filename(__name__, 'htdocs'))]

    class thread(threading.Thread):

        def __init__(self):
            threading.Thread.__init__(self)
            self.setDaemon(True)

        def port(self, num):
            self.port = num

        def run(self):
            filepath = path.abspath(__file__)
            dirpath = path.dirname(filepath)
            standalone._main(["-p", self.port, "-w", dirpath, "--log-level", "debug"])
