# -*- coding:utf-8 -*-
from mod_pywebsocket import msgutil

#requests = []
rooms = {}

def web_socket_do_extra_handshake(request):
    pass 

def web_socket_transfer_data(request):
    from urlparse import urlparse
    from urlparse import parse_qs
    #requests.append(request)
    url = urlparse(request.get_uri())
    query = parse_qs(url.query)
    if query.has_key('projectName'):
        projectNames = query["projectName"]
        if len(projectNames) == 1:
            projectName = projectNames[0]
            if not rooms.has_key(projectName):
                rooms[projectName] = []
            rooms[projectName].append(request)
    while True:
        try:
            message = msgutil.receive_message(request)
        except Exception:
            return
        #for req in requests:
        #    try:
        #        msgutil.send_message(req, message)
        #    except Exception:
        #        requests.remove(req)
        for req in rooms[projectName]:
            try:
                msgutil.send_message(req, message)
            except Exception:
                rooms[projectName].remove(req)
                if len(rooms[projectName]) == 0:
                    del rooms[projectName]
