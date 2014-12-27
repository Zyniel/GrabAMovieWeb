/**
 * Example configuration file
 */
var config = {
	app: {
		'port': 3000,
		'posters': "images/posters"
	},
    // default clip configuration
    mongodb: {
		'hostname' : 'localhost',
		'port' : 27017,
		'auth' : null
    },
    remotedb: {
		'parser' : 'export_xbmc.json',
        url: {
			'protocol' : 'http',
			'hostname' : 'localhost',
			'port' : 9090,
			'pathname' : 'jsonrpc',
			'query' : { 'request' : null}
        },
		auth: {
			auth: {
				'user' : 'xbmc',
				'pass' : 'xbmc',
				'sendImmediately' : false
			}
		}
    }
}

module.exports = config;