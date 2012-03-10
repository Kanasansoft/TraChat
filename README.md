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
% cd pywebsocket-read-only/src
% python setup.py build
% sudo python setup.py install
```

#### install

```
% git clone https://github.com/Kanasansoft/TraChat.git
% cd TraChat
% python setup.py bdist_egg
% cp dist/TraChat*.egg [plugins directory of your Trac project]
```

#### setup

After installing plugin add [components] section in `trac.ini` configuration file.

```
[components]
trachat.* = enabled
```

You need to restart Trac.

If you want specify port number of WebSocket, add [trachat] section. (default => 8081)

```
[trachat]
port = 8000
```
*do not specify same port number as Trac.*

#### thanks

Translation support by [ujihisa](https://github.com/ujihisa)
