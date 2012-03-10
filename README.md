# TraChat

## Overview

**TraChat** is a chat plugin for Trac.

### note

TraChat uses WebSocket API.

Chat rooms are separated by project on Trac.

#### required

Of course, you need Trac.
And you need mod_pywebsocket too.

```
% svn checkout http://pywebsocket.googlecode.com/svn/trunk/ pywebsocket-read-only


% cd TraChat
% python setup.py bdist_egg
% cp dist/TraChat*.egg [plugins directory of your Trac project]
```



```
[components]



[trachat]


