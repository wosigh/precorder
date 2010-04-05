VERSION=unknown

STAGING_DIR=/srv/preware/build/staging/i686
CC=/srv/preware/build/toolchain/i686-unknown-linux-gnu/build/i686-unknown-linux-gnu/bin/i686-unknown-linux-gnu-gcc

# STAGING_DIR=/srv/preware/build/staging/armv7
# CC=/opt/PalmPDK/arm-gcc/bin/arm-none-linux-gnueabi-gcc

CFLAGS := -g -DVERSION=\"${VERSION}\" -I${STAGING_DIR}/usr/include/glib-2.0 -I${STAGING_DIR}/usr/lib/glib-2.0/include -I${STAGING_DIR}/usr/include/gstreamer-0.10 -I${STAGING_DIR}/usr/include/libxml2 -I${STAGING_DIR}/usr/include
LDFLAGS  := -g -L${STAGING_DIR}/usr/lib -llunaservice -lmjson -lglib-2.0 -lgstreamer-0.10

precorder: gstreamer.o luna_service.o main.o misc.o

install: precorder
	- ssh root@webos killall org.webosinternals.saverestore
	scp saverestore root@webos:/var/usr/sbin/org.webosinternals.saverestore.new
	ssh root@webos mv /var/usr/sbin/org.webosinternals.saverestore.new /var/usr/sbin/org.webosinternals.saverestore

clobber:
	rm -rf *.o gstreamer

#SHORTNAME		=	precorder
#
#PROGRAM_BASE	=	org.webosinternals.$(SHORTNAME)
#
#PROGRAM			= 	$(PROGRAM_BASE)$(SUFFIX)
#
#CFLAGS			=	-Os -g $(MARCH_TUNE) -DVERSION=\"$(VERSION)\" -DGETTEXT_PACKAGE=\"$(PROGRAM_BASE)\"
#					
#LIBS			= 	-llunaservice -lglib-2.0 -lmjson -lgstreamer-0.10
#
#OBJECTS			= 	misc.o TPS6105X.o gstreamer.o lunaservice.o main.o
#
#DOXYGEN_FILE	=	$(SHORTNAME).doxyfile
#
#.PHONY			: 	clean-objects clean
#
#
#all: $(PROGRAM)
#
#fresh: clean docs all
#
#$(PROGRAM): $(OBJECTS)
#	$(CC) $(CFLAGS) $(OBJECTS) -o $(PROGRAM) $(INCLUDES) $(LIBS)
#
#$(OBJECTS): %.o: %.c
#	$(CC) $(CFLAGS) -c $<  -o $@ -I. $(INCLUDES) $(LIBS)
