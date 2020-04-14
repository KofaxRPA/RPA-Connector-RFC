const fs = require('fs-extra');
const util = require('util');
const zipper = require('zip-local');

const node_rfc_build = require('./node-rfc/windows/build.js');

const NODE_RFC_BUILD = 'build/node-rfc';
const KRPA_RFC_BUILD = 'build/krpa-rfc';
const KRPA_RFC_BUILD_WINDOWS = KRPA_RFC_BUILD + '/windows';
const KRPA_RFC_BUILD_LINUX = KRPA_RFC_BUILD + '/linux';
const KRPA_RFC_BUILD_ALL = KRPA_RFC_BUILD + '/all';
const KRPA_RFC_DIST = 'dist';
const WINDOWS_BUILD = true;
const LINUX_BUILD = true;

// Uncomment this line if you want to use another version of node-rfc
//const NODE_RFC_VERSION = "1.0.6";

// Uncomment this line if you want to build the master branch of node-rfc
//const NODE_RFC_BRANCH = "master";

(async function(){
var krpaRfcVersion = require('./package.json').version;
var nodeRfcVersion = (typeof NODE_RFC_VERSION === 'undefined' || NODE_RFC_VERSION === null) ? krpaRfcVersion : NODE_RFC_VERSION;
var nodeRfcBranch = (typeof NODE_RFC_BRANCH === 'undefined' || NODE_RFC_BRANCH === null) ? "v" + nodeRfcVersion : NODE_RFC_BRANCH;

console.log("Building connector version " + krpaRfcVersion + " using node-rfc version " + nodeRfcVersion + " (branch " + nodeRfcBranch +")\n");

// Clean the build directory
await fs.remove('build');

if (WINDOWS_BUILD) {
	console.log("Building Windows release\n");
	
	// Build the win32 ia32 node-rfc module from source using Docker Windows
	console.log("Build the node-rfc module from source");
	fs.mkdirSync(NODE_RFC_BUILD, {recursive : true});
	await node_rfc_build.run(nodeRfcBranch, NODE_RFC_BUILD);

	// Install node-rfc package dependencies + deasync module
	console.log("Install node-rfc package dependencies + deasync module");
	fs.mkdirSync(KRPA_RFC_BUILD_WINDOWS, {recursive : true});
	await util.promisify(function(cb) {
		var npm = require('npm');
		npm.load({'package-lock': false, 'ignore-scripts': true, 'production': true, 'platform': 'win32', 'arch': 'ia32'}, function (er, data) {
			if (er) cb(er, data);
			else npm.commands.install(KRPA_RFC_BUILD_WINDOWS, ['deasync', NODE_RFC_BUILD + '/node-rfc-'+ nodeRfcBranch +'.tgz'], function (er, data) {
				cb(er, data);
			  });
		  })
		})();

	console.log("Copy connector manifest and source file"); 
	fs.copyFileSync('src/manifest.json', KRPA_RFC_BUILD_WINDOWS + '/manifest.json');
	fs.copyFileSync('src/krpa-rfc.js', KRPA_RFC_BUILD_WINDOWS + '/node_modules/krpa-rfc.js');

	console.log("Create connector archive");
	fs.mkdirSync(KRPA_RFC_DIST, {recursive : true});
	var connectorArchive = KRPA_RFC_DIST + '/krpa-rfc-windows-' + krpaRfcVersion.replace(/\./g, "_") + '.connector';
	await fs.remove(connectorArchive);
	zipper.sync.zip(KRPA_RFC_BUILD_WINDOWS).compress().save(connectorArchive);
}

if (LINUX_BUILD) {
	console.log("Building Linux release\n");
	
	// Install node-rfc + deasync module
	console.log("Install node-rfc package dependencies + deasync module");
	fs.mkdirSync(KRPA_RFC_BUILD_LINUX, {recursive : true});
	await util.promisify(function(cb) {
	var npm = require('npm');
	npm.load({'package-lock': false, 'ignore-scripts': true, 'production': true, 'platform': 'linux', 'arch': 'x64'}, function (er, data) {
		if (er) cb(er, data);
		else npm.commands.install(KRPA_RFC_BUILD_LINUX, ['deasync', 'node-rfc@' + nodeRfcVersion], function (er, data) {
			cb(er, data);
		  });
	  })
	})();
	
	console.log("Copy connector manifest and source file"); 
	fs.copyFileSync('src/manifest.json', KRPA_RFC_BUILD_LINUX + '/manifest.json');
	fs.copyFileSync('src/krpa-rfc.js', KRPA_RFC_BUILD_LINUX + '/node_modules/krpa-rfc.js');
	
	console.log("Create connector archive");
	fs.mkdirSync(KRPA_RFC_DIST, {recursive : true});	
	var connectorArchive = KRPA_RFC_DIST + '/krpa-rfc-linux-' + krpaRfcVersion.replace(/\./g, "_") + '.connector';
	await fs.remove(connectorArchive);
	zipper.sync.zip(KRPA_RFC_BUILD_LINUX).compress().save(connectorArchive);
}

if ((WINDOWS_BUILD) && (LINUX_BUILD)) {
	console.log("Building All release\n");
	
	fs.mkdirSync(KRPA_RFC_BUILD_ALL, {recursive : true});
	
	await util.promisify(function(cb) {
	var npm = require('npm');
	npm.load({'package-lock': false, 'ignore-scripts': true, 'production': true, 'platform': 'linux', 'arch': 'x64'}, function (er, data) {
		if (er) cb(er, data);
		else npm.commands.install(KRPA_RFC_BUILD_ALL, ['deasync', 'node-rfc-win32@' + NODE_RFC_BUILD + '/node-rfc-'+ nodeRfcBranch +'.tgz', 'node-rfc-linux@npm:node-rfc@' + nodeRfcVersion], function (er, data) {
			cb(er, data);
		  });
	  })
	})();
			
	console.log("Copy connector manifest and source file"); 
	fs.copyFileSync('src/manifest.json', KRPA_RFC_BUILD_ALL + '/manifest.json');
	fs.copyFileSync('src/krpa-rfc.js', KRPA_RFC_BUILD_ALL + '/node_modules/krpa-rfc.js');
	fs.copyFileSync('src/node-rfc.js', KRPA_RFC_BUILD_ALL + '/node_modules/node-rfc.js');
	
	console.log("Create connector archive");
	fs.mkdirSync(KRPA_RFC_DIST, {recursive : true});	
	var connectorArchive = KRPA_RFC_DIST + '/krpa-rfc-all-' + krpaRfcVersion.replace(/\./g, "_") + '.connector';
	await fs.remove(connectorArchive);
	zipper.sync.zip(KRPA_RFC_BUILD_ALL).compress().save(connectorArchive);
}
	
console.log("Build completed");  
  
})();