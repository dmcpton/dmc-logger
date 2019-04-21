function Logger() {
	
	// writestreams default to null
	this.out = null;
	this.debugOut = null;
	this.errorOut = null;

	// defaults
	this.threshhold = Logger.DEBUG;
	this.timestamps = true;
	this.console = false;

}

// constants
Logger.CRITICAL = 0;
Logger.FAILURE = 1;
Logger.ERROR = 2;
Logger.WARN = 3;
Logger.INFO = 4;
Logger.DEBUG = 5;
// should be kept in sync with the above
Logger.threshholdNames = [
	'CRITICAL',
	'FAILURE',
	'ERROR',
	'WARN',
	'INFO',
	'DEBUG'
];

// static functions

Logger.prependDate = function (messageStr) {
	var nowDate = new Date();
	return nowDate.toISOString().substring(0, 10) + ' ' + nowDate.toISOString().substring(11, 19) + ' ' + messageString;
}

// setters

Logger.prototype.setStream = function (writeStream) {
	this.out = writeStream;
}

Logger.prototype.setDebugStream = function (writeStream) {
	this.debugOut = writeStream;
}

Logger.prototype.setErrorStream = function (writeStream) {
	this.errorOut = writeStream;
}

Logger.prototype.setLevel = function(th) {
	if (th < Logger.CRITICAL) {
		th = Logger.CRITICAL;
	} else if (th > Logger.DEBUG) {
		th = Logger.DEBUG;
	}
	this.threshhold = th;
	this.debug('threshhold set: ', Logger.threshholdNames[th]);
}

Logger.prototype.setTimestamps = function (bool) {
	this.timestamps = bool;
}

Logger.prototype.setConsole = function (bool) {
	this.console = bool;
}

// actual log functions

Logger.prototype.log = function(message) {
	let out = null;
	
	if (this.out && this.threshhold >= Logger.INFO) {
		out = this.out;
	} else {
		return false;
	}
	
	let messageString = "INFO: " + message + "\n";
	if(this.timestamps) {
		messageString = Logger.prependDate(messageString);
	}
	out.write(messageString);
	if (this.console) {
		console.log('\x1b[32m%s\x1b[0m%s', 'INFO: ', message);
	}
	return true;
}

// alias
Logger.prototype.info = Logger.prototype.log;

Logger.prototype.critical = function (message) {
	let out = null;

	if (this.errorOut) {
		out = this.errorOut;
	} else if (this.out) {
		out = this.out;
	} else {
		return false;
	}

	let messageString = "CRITICAL_FAILURE: " + message + "\n";
	if(this.timestamps) {
		messageString = Logger.prependDate(messageString);
	}
	out.write(messageString);
	if (this.console) {
		console.log('\x1b[31m%s\x1b[0m%s', 'CRITICAL_FAILURE: ', message);
	}
	return true;
}

Logger.prototype.failure = function (message) {
	let out = null;

	if (this.errorOut) {
		out = this.errorOut;
	} else if (this.out) {
		out = this.out;
	} else {
		return false;
	}

	let messageString = "FAILURE: " + message + "\n";
	if(this.timestamps) {
		messageString = Logger.prependDate(messageString);
	}
	out.write(messageString);
	if (this.console) {
		console.log('\x1b[31m%s\x1b[0m%s', 'FAILURE: ', message);
	}
	return true;
}

Logger.prototype.error = function (message) {
	let out = null;	

	if (this.errorOut && this.threshhold >= Logger.ERROR) {
		out = this.errorOut;
	} else if (this.out && this.threshhold >= Logger.ERROR) {
		out = this.out;
	} else {
		return false;
	}

	let messageString = "ERROR: " + message + "\n";
	if(this.timestamps) {
		messageString = Logger.prependDate(messageString);
	}
	out.write(messageString);
	if (this.console) {
		console.log('\x1b[35m%s\x1b[0m%s', 'ERROR: ', message);
	}
	return true;
}

Logger.prototype.warn = function (message) {
	let out = null;

	if (this.errorOut && this.threshhold >= Logger.WARN) {
		out = this.errorOut;
	} else if (this.out && this.threshhold >= Logger.WARN) {
		out = this.out;
	} else {
		return false;
	}

	let messageString = "WARN: " + message + "\n";
	if(this.timestamps) {
		messageString = Logger.prependDate(messageString);
	}
	out.write(messageString);
	if (this.console) {
		console.log('\x1b[33m%s\x1b[0m%s', 'WARN: ', message);
	}
	return true;
}

Logger.prototype.debug = function (message) {
	let out = null;

	if (this.debugOut && this.threshhold >= Logger.DEBUG) {
		out = this.debugOut;
	} else if (this.out && this.threshhold >= Logger.DEBUG) {
		out = this.out;
	} else {
		return false;
	}

	let messageString = "DEBUG: " + message + "\n";
	if(this.timestamps) {
		messageString = Logger.prependDate(messageString);
	}
	out.write(messageString);
	if (this.console) {
		console.log('\x1b[34m%s\x1b[0m%s', 'DEBUG: ', message);
	}
	return true;
}


module.exports = Logger;