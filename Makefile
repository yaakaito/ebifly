SRC_DIR = src
BUILD_DIR = build
COMPILER = vendor/compiler/compiler.jar
SOCKET_IO = vendor/socket.io-client
MD5 = vendor/md5

COMMON_DIR = ${SRC_DIR}/common
TEMPLATE_DIR = ${SRC_DIR}/html
RESOURCE_DIR = resource
CLIENT_DIR = ${SRC_DIR}/client

CLIENT_FILES = ${COMMON_DIR}/global.js\
							 ${CLIENT_DIR}/ebifly.js\
							 ${CLIENT_DIR}/html.js\
							 ${CLIENT_DIR}/logger.js\
							 ${CLIENT_DIR}/script.js\
							 ${CLIENT_DIR}/css.js\
							 ${CLIENT_DIR}/dom.js\
							 ${MD5}/md5.js

CLIENT_MODULES = ${CLIENT_DIR}/intro.js\
								${CLIENT_FILES}\
								${CLIENT_DIR}/outro.js

EBIFLY_CLIENT = ${BUILD_DIR}/client/ebifly.js
EBIFLY_CLIENT_MIN = ${BUILD_DIR}/client/ebifly.min.js

CONSOLE_DIR = ${SRC_DIR}/console
CONSOLE_FILES = ${COMMON_DIR}/global.js\
								${CONSOLE_DIR}/console.js\
								${CONSOLE_DIR}/html.js\
								${CONSOLE_DIR}/logger.js\
								${CONSOLE_DIR}/script.js\
								${CONSOLE_DIR}/css.js\
								${CONSOLE_DIR}/dom.js

CONSOLE_MODULES = ${CONSOLE_DIR}/intro.js\
									${CONSOLE_FILES}\
									${CONSOLE_DIR}/outro.js

EBIFLY_CONSOLE = ${BUILD_DIR}/server/console/console.js
EBIFLY_CONSOLE_MIN = ${BUILD_DIR}/server/console/console.min.js

EBIFLY_SERVER = ${SRC_DIR}/server/ebiserver.js

all:	client web

client: 
				@@echo "Building" ${EBIFLY_CLIENT}
				@@cat ${CLIENT_MODULES} > ${EBIFLY_CLIENT}
				@@java -jar ${COMPILER} --js ${EBIFLY_CLIENT} --js_output_file ${EBIFLY_CLIENT_MIN};


web:	server console

server:
				@@echo "Building Server Apps"
				@@ cp -r ${SOCKET_IO} ${BUILD_DIR}/server/
				@@ cp ${EBIFLY_SERVER} ${BUILD_DIR}/server/

console: uptpl
				@@echo "Building" ${EBIFLY_CONSOLE}
				@@cat ${CONSOLE_MODULES} > ${EBIFLY_CONSOLE}
				@@java -jar ${COMPILER} --js ${EBIFLY_CONSOLE} --js_output_file ${EBIFLY_CONSOLE_MIN};

uptpl:	upimage
				@@cp ${TEMPLATE_DIR}/console/console.html  ${BUILD_DIR}/server/console/
				@@cp ${TEMPLATE_DIR}/console//console.css  ${BUILD_DIR}/server/console/

upimage:
				@@cp ${RESOURCE_DIR}/arrow_right.png ${BUILD_DIR}/server/console/
				@@cp ${RESOURCE_DIR}/arrow_bottom.png ${BUILD_DIR}/server/console/