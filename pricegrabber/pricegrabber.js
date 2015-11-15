var sha1 = require('sha1'),
	crypto = require('crypto'),
	request = require('request');

var pricegrabber_handler = {
	cnfg : {
		ip: "204.145.74.4",
		private_key : "",
		pid : "",
		version : "2.55"
	},
	getCurrentKey : function (private_key, pid, version, ip) {
		var date = new Date();
		date = date.toISOString();
		var year = date.substring(0,4);
		var month = date.substring(5,7);
		var day = date.substring(8,10);
		var hour = date.substring(11,13);
		var currentKey = pricegrabber_handler.cnfg.private_key + "," + year + "," + month + "," + day + "," + hour + "," + pricegrabber_handler.cnfg.pid + "," + pricegrabber_handler.cnfg.version + "," + pricegrabber_handler.cnfg.ip;
		return currentKey;
	},
	fixProduct : function(product){
		var prefix = "montiera_";
		var prdct = product.substring(0,4);
		var num = product.substring(4);
		return prefix + prdct + "_" + num;
	},
	getURL : function(key,prms){
		var url = "http://sws.pricegrabber.com/search_xml.php?pid=" + pricegrabber_handler.cnfg.pid + "&key=" + key + "&version=2.55" + "&q=" + prms.st.replace(" ", "+") + "&limit=1&offers=1&offer_limit=1&mode=" + this.fixProduct(prms.prdct);
		if(typeof prms.type !== 'undefined' && prms.type == 'https'){
			url += "&secured_images=1";
		}
		return url;
	},
	setConfig : function (cntry) {
		switch (cntry) {
			case "uk":
				this.cnfg.private_key = "f87d0b06d42";
				this.cnfg.pid = "3385";
				break;
			case "ca":
				this.cnfg.private_key = "34d2e646282";
				this.cnfg.pid = "3386";
				break;
			default: // us
				this.cnfg.private_key = "87e713ad792";
				this.cnfg.pid = "3234";
				break;
		}

	},
	getPGrequest : function(req,res){
		var cntry = req.params.cntry;
		var st = req.params.st;
		var prdct = req.params.prdct;
		var type = req.params.type == "https" ? "https" : undefined;
		var prms = {
	        cntry : cntry,
	        st : st,
	        prdct : prdct,
	        type : type
	    };
		pricegrabber_handler.setConfig(prms.cntry);
		var currentKey = pricegrabber_handler.getCurrentKey();
		var keySHA1 = sha1(currentKey);
		var token = crypto.randomBytes(8).toString('hex');
		var finalKey = keySHA1.substring(0,18) + token + keySHA1.substring(18);
		var url = pricegrabber_handler.getURL(finalKey,prms);
		console.log(url);
	    request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.send(body);
            }
            else {
               res.send(error);
            }
        });
	}
}

module.exports = pricegrabber_handler;