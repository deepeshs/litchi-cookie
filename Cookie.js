/**
 * A simple cookie management utility
 */
'use strict';

var Cookie = function(objRequest, objResponse) {
	this.m_objRequest 	= objRequest;
	this.m_objResponse 	= objResponse;
	this.m_objList 		= {};
	this.m_reValidName 	= /^[\w!#\$%&\'\*\+\-\.\^\`|~]+$/;
	this.m_reValidValue = /^[\w!#\$%&\'\(\)\*\+\-\.\/:<=>\?@\[\]\^\`\{|\}~]+$/;
};

// parse cookies from request object
Cookie.prototype.parse = function() {
	if('object' !== typeof this.m_objRequest) {
		throw new TypeError('Request object is not set. Unable to parse cookie');
	}
	
	var strCookie = this.m_objRequest.headers.cookie;
	
	if(strCookie) {
		strCookie.split(';').forEach( function(strCookieChunk) {
			var arrParts = strCookieChunk.split('=');
			this.m_objList[arrParts.shift().trim()] = this.decodeStr(arrParts.join('='));
		}.bind(this));
	}
};

// set cookie value with key
Cookie.prototype.set = function(strName, strValue, objOpt) {
	// check if given name is valid as per RFC 
	if(false === this.m_reValidName.test(strName)) {
		throw new TypeError('Invalid cookie name');
	}
	
	// must encode cookie value
	strValue = this.encodeStr(strValue);
	
	// check if given value is valid as per RFC 
	if(false === this.m_reValidValue.test(strValue)) {
		throw new TypeError('Invalid cookie value');
	}
	
	var strCookie = strName + '=' + strValue;
	
	// check options and append option values accordingly
	var objOption = objOpt || {};
	
	// check and append max-age 
	if(null !== objOption.maxAge) {
		if(true === isNaN(objOption.maxAge)) {
			throw new TypeError('maxAge should be numeric for cookie: ' + strName);
		}
		strCookie += '; Max-Age=' + Math.floor(objOption.maxAge);
	}
	
	// check and append domain 
	if(null !== objOption.domain) {
		if(false === this.m_reValidName.test(objOption.domain)) {
			throw new TypeError('Invalid valid for option domain for cookie: ' + strName);
		}
		strCookie += '; Domain=' + objOption.domain;
	}
	
	// check and append path 
	if(null !== objOption.path) {
		if(false === this.m_reValidName.test(objOption.path)) {
			throw new TypeError('Invalid valid for option path for cookie: ' + strName);
		}
		strCookie += '; Path=' + objOption.path;
	}
	
	// check and append expires 
	if(null !== objOption.expires) {
		strCookie += '; Expires=' + objOption.expires.toUTCString();
	}
	
	// check and append httpOnly flag 
	if(null !== objOption.httpOnly) {
		strCookie += '; HttpOnly';
	}
	
	// check and append secure flag 
	if(null !== objOption.secure) {
		strCookie += '; Secure';
	}
	
	// check and append firstPartyOnly flag 
	if(null !== objOption.firstPartyOnly) {
		strCookie += '; First-Party-Only';
	}
	
	// Get any existing cookie value from response header	
	var strHeader = this.m_objResponse.getHeader('Set-Cookie');
	
	// Finally set the cookie in response header
	if('undefined' === (typeof strHeader)) {
		this.m_objResponse.setHeader('Set-Cookie', [strCookie]);
	} else {
		strHeader.push(strCookie)
		this.m_objResponse.setHeader('Set-Cookie', strHeader);
	}
};

// get specific cookie by key
Cookie.prototype.get = function(strName) {
	if(!this.m_objList) this.parse();
		
	if(!this.m_objList) return null;
		
	return this.m_objList[strName];
};

// get all cookies
Cookie.prototype.getAll = function() {
	return this.m_objList;
};

Cookie.prototype.encodeStr = function(str) {
	try {
		return encodeURIComponent(str);
	} catch(objException) {
		return false;
	}
}

Cookie.prototype.decodeStr = function(str) {
	try {
		return decodeURIComponent(str);
	} catch(objException) {
		return str;
	}
}

module.exports = Cookie;