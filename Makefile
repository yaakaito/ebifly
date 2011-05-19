SRC_DIR = src
BUILD_DIR = build
COMPILER = compiler/compiler.jar

CLIENT_DIR = ${SRC_DIR}/client
CLIENT_FILES = ${CLIENT_DIR}/ebifly.js\
							 ${CLIENT_DIR}/html.js\
							 ${CLIENT_DIR}/logger.js\
							 ${CLIENT_DIR}/css.js\
							 ${CLIENT_DIR}/dom.js

CLIENT_MODULES = ${CLIENT_DIR}/intro.js\
								${CLIENT_FILES}\
								${CLIENT_DIR}/outro.js

EBIFLY_CLIENT = ${BUILD_DIR}/client/ebifly.js
EBIFLY_CLIENT_MIN = ${BUILD_DIR}/client/ebifly.min.js

CONSOLE_DIR = ${SRC_DIR}/console
CONSOLE_FILES = ${CONSOLE_DIR}/console.js\
								${CONSOLE_DIR}/html.js\
								${CONSOLE_DIR}/logger.js\
								${CONSOLE_DIR}/css.js\
								${CONSOLE_DIR}/dom.js

CONSOLE_MODULES = ${CONSOLE_DIR}/intro.js\
									${CONSOLE_FILES}\
									${CONSOLE_DIR}/outro.js

EBIFLY_CONSOLE = ${BUILD_DIR}/console/ebiconsole.js
EBIFLY_CONSOLE_MIN = ${BUILD_DIR}/console/ebiconsole.min.js

all:	client console

client: 
				@@echo "Building" ${EBIFLY_CLIENT}
				@@cat ${CLIENT_MODULES} > ${EBIFLY_CLIENT}
				@@java -jar ${COMPILER} --js ${EBIFLY_CLIENT} --js_output_file ${EBIFLY_CLIENT_MIN};

console: 
				@@echo "Building" ${EBIFLY_CONSOLE}
				@@cat ${CONSOLE_MODULES} > ${EBIFLY_CONSOLE}
				@@java -jar ${COMPILER} --js ${EBIFLY_CONSOLE} --js_output_file ${EBIFLY_CONSOLE_MIN};
