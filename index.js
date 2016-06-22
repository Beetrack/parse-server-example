var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  appId: process.env.APP_ID || 'beetrack',
  masterKey: process.env.MASTER_KEY || 'beetrack',
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
	push: {
		android: {
			senderId: process.env.GCM_SENDER_ID,
			apiKey: process.env.GCM_API_KEY
		},
		ios: [
      {
        pfx: 'Beetrack_Push_Notification_Dev.p12',
        bundleId: 'com.Beetrack.Beetrack',
        production: false
      },
      {
        pfx: 'Beetrack_Push_Notification_Prod.p12',
        bundleId: 'com.Beetrack.Beetrack',
        production: true
      }
    ]
	}
});
var app = express();

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});
