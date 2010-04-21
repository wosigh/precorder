VERSION=unknown
STAGING_DIR=/usr/local

CC=gcc

CFLAGS := -g -DVERSION=\"${VERSION}\" -I${STAGING_DIR}/include/glib-2.0 -I${STAGING_DIR}/lib/glib-2.0/include -I${STAGING_DIR}/include/gstreamer-0.10 -I${STAGING_DIR}/include/libxml2 -I${STAGING_DIR}/include -I/usr/include
LDFLAGS  := -g -L${STAGING_DIR}/lib -llunaservice -lmjson -lglib-2.0 -lgmodule-2.0 -lgthread-2.0 -lgobject-2.0 -lgstreamer-0.10 -lz -lxml2 -lcjson -ldbus-1 -lgdbus

precorder: precorder.o lunaservice.o main.o misc.o

install: precorder
		- ssh root@webos killall org.webosinternals.saverestore
		scp saverestore root@webos:/var/usr/sbin/org.webosinternals.saverestore.new
		ssh root@webos mv /var/usr/sbin/org.webosinternals.saverestore.new /var/usr/sbin/org.webosinternals.saverestore

clobber:
		rm -rf *.o gstreamer