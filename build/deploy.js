
"use strict";

const path = require("path");
const fs = require("fs");
const s3 = require("s3");
//const CloudFront = require("aws-sdk").CloudFront;


const LAST_VERSION_PATH = path.join(__dirname, "LAST_VERSION");
const LAST_VERSION = fs.existsSync(LAST_VERSION_PATH) ? fs.readFileSync(LAST_VERSION_PATH, "utf8") : "0.0.0";

if(VERSION === LAST_VERSION) {
	throw `Failed to deploy: VERSION ${VERSION} matches LAST_VERSION ${LAST_VERSION}`;
}

// write new version file
fs.writeFile(LAST_VERSION_PATH, VERSION, "utf8", err => {
	if(err) {
		throw err;
	}
});


//let invalidationPaths = [];

const LOCALPATH = path.join(__dirname, "../staging");
const CONFIG = require("./aws.json");
const PARAMS = {
	localDir: LOCALPATH,
	deleteRemoved: true,
	s3Params: {
		Bucket: CONFIG.bucket,
		Prefix: "",
		ACL: "public-read"
	},
	getS3Params: (localFile, stat, callback) => {
		console.log("UPLOADING: " + localFile);

		let params = {};

		if(localFile.endsWith(".xml")) {
			params["ContentType"] = "application/xml; charset=UTF-8";
		}

		//invalidationPaths.push(localFile.replace(LOCALPATH, ""));

		callback(null, params);
	}
};

let client = s3.createClient({
	s3Options: CONFIG
});

let sync = client.uploadDir(PARAMS);

sync.on("error", err => console.error("Sync error:", err.stack));
sync.on("progress", () => console.log("Sync progress:", sync.progressAmount, sync.progressTotal));
sync.on("end", () => {
	console.log("Completed");
	/*invalidationPaths = invalidationPaths.map(m => m.substring(1).split("/")).map(m => {
		let path = "";

		if(m.length == 1) {
			path = m[0];
		}
		else if(m[m.length - 1] == "index.html") {
			path = m[0] + "/*";
		}
		else {
			path = m.join("/");
		}

		return "/" + path;

	}).filter((v, i, a) => a.indexOf(v) == i);

	if(invalidationPaths.length > 0) {
		const cloudFront = new CloudFront();

		console.log("CREATING INVALIDATION: " + invalidationPaths.length + " items", invalidationPaths);

		cloudFront.createInvalidation({
			DistributionId: CONFIG.distributionId,
			InvalidationBatch: {
				CallerReference: Date.now().toString(),
				Paths: {
					Quantity: invalidationPaths.length,
					Items: invalidationPaths
				}
			}
		}, (err, data) => {
			if(err) {
				console.error("Create invalidation failed:", err, err.stack);
			}
			else {
				console.log("Completed without errors");
			}
		});
	}
	else {
		console.log("Completed with nothing to upload");
	}*/
});
