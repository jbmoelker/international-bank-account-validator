
(function(root){

	var countryInput 	= document.getElementById('input-country'),
		ibanInput 		= document.getElementById('input-iban'),
		ibanHelp 		= document.getElementById('input-iban-help'),
		bicInput 		= document.getElementById('input-bic'),
		bicHelp 		= document.getElementById('input-bic-help');

	var HELPS			= {
			IBAN_PREFIX		: 'The International Bank Account Number (IBAN) ',
			IBAN_DEFAULT	: 'should start with 2 letters (a-z or A-Z), followed by 2 digits (0-9), 4 letters or digits (a-z, A-Z or 0-9), 7 digits (0-9) and 0 to 16 letters or digits (a-z, A-Z or 0-9), ',
			BIC_PREFIX		: 'The Business Identifier Code (BIC) ',
			BIC_INFIX		: 'should start with institution code or bank code of 4 letters (A-Z), followed by country code ',
			BIC_POSTFIX		: 'the location code of 2 letters (A-Z) or digits (0-9), an optional branch code of 3 letters (A-Z), ',
			BIC_DEFAULT		: 'should start with institution code or bank code of 4 letters (A-Z), followed by the country code of 2 letters (A-Z), the location code of 2 letters (A-Z) or digits (0-9), an optional branch code of 3 letters (A-Z), ',
			FOR 			: 'for ',
			START_WITH 		: 'should start with ',
			FOLLOWED_BY		: 'followed by ',
			DIGITS 			: ' digits (0-9)',
			UPERCASE 		: ' uppercase letters (A-Z)',
			ALPHANUMERIC 	: ' letters or digits (a-z, A-Z or 0-9)',
			POSTFIX			: 'and should have no spaces or special characters.'
		},
		IBAN_PATTERN 		= '[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}', // generic pattern http://snipplr.com/view/15322/
		BIC_PATTERN 		= '[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?',
		COUNTRY_NAME_INDEX 	= 0,
		IBAN_PATTERN_INDEX 	= 1,
	 	REGISTRY 			= { // based on http://code.google.com/p/php-iban/source/browse/trunk/registry.txt
		// "AA" : [ "IIBAN (Internet)", "AA(\\d{2})([A-Z0-9]{12})" ],
		"AL" : [ "Albania", "AL(\\d{2})(\\d{8})([A-Za-z0-9]{16})" ],
		"AD" : [ "Andorra", "AD(\\d{2})(\\d{4})(\\d{4})([A-Za-z0-9]{12})" ],
		"AT" : [ "Austria", "AT(\\d{2})(\\d{5})(\\d{11})" ],
		"AZ" : [ "Azerbaijan", "AZ(\\d{2})([A-Z]{4})([A-Za-z0-9]{20})" ],
		"BH" : [ "Bahrain", "BH(\\d{2})([A-Z]{4})([A-Za-z0-9]{14})" ],
		"BE" : [ "Belgium", "BE(\\d{2})(\\d{3})(\\d{7})(\\d{2})" ],
		"BA" : [ "Bosnia and Herzegovina", "BA(\\d{2})(\\d{3})(\\d{3})(\\d{8})(\\d{2})" ],
		"BR" : [ "Brazil", "BR(\\d{2})(\\d{8})(\\d{5})(\\d{10})([A-Z]{1})([A-Za-z0-9]{1})" ],
		"BG" : [ "Bulgaria", "BG(\\d{2})([A-Z]{4})(\\d{4})(\\d{2})([A-Za-z0-9]{8})" ],
		"CR" : [ "Costa Rica", "CR(\\d{2})(\\d{3})(\\d{14})" ],
		"HR" : [ "Croatia", "HR(\\d{2})(\\d{7})(\\d{10})" ],
		"CY" : [ "Cyprus", "CY(\\d{2})(\\d{3})(\\d{5})([A-Za-z0-9]{16})" ],
		"CZ" : [ "Czech Republic", "CZ(\\d{2})(\\d{4})(\\d{6})(\\d{10})" ],
		"DK" : [ "Denmark", "DK(\\d{2})(\\d{4})(\\d{9})(\\d{1})" ],
		"FO" : [ "Faroe Islands", "FO(\\d{2})(\\d{4})(\\d{9})(\\d{1})" ],
		"GL" : [ "Greenland", "GL(\\d{2})(\\d{4})(\\d{9})(\\d{1})" ],
		"DO" : [ "Dominican Republic", "DO(\\d{2})([A-Za-z0-9]{4})(\\d{20})" ],
		"EE" : [ "Estonia", "EE(\\d{2})(\\d{2})(\\d{2})(\\d{11})(\\d{1})" ],
		"FI" : [ "Finland", "FI(\\d{2})(\\d{6})(\\d{7})(\\d{1})" ],
		"FR" : [ "France", "FR(\\d{2})(\\d{5})(\\d{5})([A-Za-z0-9]{11})(\\d{2})" ],
		"BL" : [ "Saint Barthelemy", "BL(\\d{2})(\\d{5})(\\d{5})([A-Za-z0-9]{11})(\\d{2})" ],
		"GF" : [ "French Guyana", "GF(\\d{2})(\\d{5})(\\d{5})([A-Za-z0-9]{11})(\\d{2})" ],
		"GP" : [ "Guadelope", "GP(\\d{2})(\\d{5})(\\d{5})([A-Za-z0-9]{11})(\\d{2})" ],
		"MF" : [ "Saint Martin (French Part)", "MF(\\d{2})(\\d{5})(\\d{5})([A-Za-z0-9]{11})(\\d{2})" ],
		"MQ" : [ "Martinique", "MQ(\\d{2})(\\d{5})(\\d{5})([A-Za-z0-9]{11})(\\d{2})" ],
		"RE" : [ "Reunion", "RE(\\d{2})(\\d{5})(\\d{5})([A-Za-z0-9]{11})(\\d{2})" ],
		"PF" : [ "French Polynesia", "PF(\\d{2})(\\d{5})(\\d{5})([A-Za-z0-9]{11})(\\d{2})" ],
		"TF" : [ "French Southern Territories", "TF(\\d{2})(\\d{5})(\\d{5})([A-Za-z0-9]{11})(\\d{2})" ],
		"YT" : [ "Mayotte", "YT(\\d{2})(\\d{5})(\\d{5})([A-Za-z0-9]{11})(\\d{2})" ],
		"NC" : [ "New Caledonia", "NC(\\d{2})(\\d{5})(\\d{5})([A-Za-z0-9]{11})(\\d{2})" ],
		"PM" : [ "Saint Pierre et Miquelon", "PM(\\d{2})(\\d{5})(\\d{5})([A-Za-z0-9]{11})(\\d{2})" ],
		"WF" : [ "Wallis and Futuna Islands", "WF(\\d{2})(\\d{5})(\\d{5})([A-Za-z0-9]{11})(\\d{2})" ],
		"GE" : [ "Georgia", "GE(\\d{2})([A-Z]{2})(\\d{16})" ],
		"DE" : [ "Germany", "DE(\\d{2})(\\d{8})(\\d{10})" ],
		"GI" : [ "Gibraltar", "GI(\\d{2})([A-Z]{4})([A-Za-z0-9]{15})" ],
		"GR" : [ "Greece", "GR(\\d{2})(\\d{3})(\\d{4})([A-Za-z0-9]{16})" ],
		"GT" : [ "Guatemala", "GT(\\d{2})([A-Za-z0-9]{4})([A-Za-z0-9]{20})" ],
		"HU" : [ "Hungary", "HU(\\d{2})(\\d{3})(\\d{4})(\\d{1})(\\d{15})(\\d{1})" ],
		"IS" : [ "Iceland", "IS(\\d{2})(\\d{4})(\\d{2})(\\d{6})(\\d{10})" ],
		"IE" : [ "Ireland", "IE(\\d{2})([A-Z]{4})(\\d{6})(\\d{8})" ],
		"IL" : [ "Israel", "IL(\\d{2})(\\d{3})(\\d{3})(\\d{13})" ],
		"IT" : [ "Italy", "IT(\\d{2})([A-Z]{1})(\\d{5})(\\d{5})([A-Za-z0-9]{12})" ],
		"KZ" : [ "Kazakhstan", "KZ(\\d{2})(\\d{3})([A-Za-z0-9]{13})" ],
		"KW" : [ "Kuwait", "KW(\\d{2})([A-Z]{4})(\\d{22})" ],
		"LV" : [ "Latvia", "LV(\\d{2})([A-Z]{4})([A-Za-z0-9]{13})" ],
		"LB" : [ "Lebanon", "LB(\\d{2})(\\d{4})([A-Za-z0-9]{20})" ],
		"LI" : [ "Liechtenstein", "LI(\\d{2})(\\d{5})([A-Za-z0-9]{12})" ],
		"LT" : [ "Lithuania", "LT(\\d{2})(\\d{5})(\\d{11})" ],
		"LU" : [ "Luxembourg", "LU(\\d{2})(\\d{3})([A-Za-z0-9]{13})" ],
		"MK" : [ "Macedonia", "MK(\\d{2})(\\d{3})([A-Za-z0-9]{10})(\\d{2})" ],
		"MT" : [ "Malta", "MT(\\d{2})([A-Z]{4})(\\d{5})([A-Za-z0-9]{18})" ],
		"MR" : [ "Mauritania", "MR13(\\d{5})(\\d{5})(\\d{11})(\\d{2})" ],
		"MU" : [ "Mauritius", "MU(\\d{2})([A-Z]{4})(\\d{2})(\\d{2})(\\d{12})(\\d{3})([A-Z]{3})" ],
		"MD" : [ "Moldova", "MD(\\d{2})([A-Za-z0-9]{20})" ],
		"MC" : [ "Monaco", "MC(\\d{2})(\\d{5})(\\d{5})([A-Za-z0-9]{11})(\\d{2})" ],
		"ME" : [ "Montenegro", "ME(\\d{2})(\\d{3})(\\d{13})(\\d{2})" ],
		"NL" : [ "The Netherlands", "NL(\\d{2})([A-Z]{4})(\\d{10})" ],
		"NO" : [ "Norway", "NO(\\d{2})(\\d{4})(\\d{6})(\\d{1})" ],
		"PK" : [ "Pakistan", "PK(\\d{2})([A-Z]{4})([A-Za-z0-9]{16})" ],
		"PL" : [ "Poland", "PL(\\d{2})(\\d{8})(\\d{1,16})" ],
		"PS" : [ "Palestinian Territory", "PS(\\d{2})([A-Z]{4})([A-Za-z0-9]{21})" ],
		"PT" : [ "Portugal", "PT(\\d{2})(\\d{4})(\\d{4})(\\d{11})(\\d{2})" ],
		"RO" : [ "Romania", "RO(\\d{2})([A-Z]{4})([A-Za-z0-9]{16})" ],
		"SM" : [ "San Marino", "SM(\\d{2})([A-Z]{1})(\\d{5})(\\d{5})([A-Za-z0-9]{12})" ],
		"SA" : [ "Saudi Arabia", "SA(\\d{2})(\\d{2})([A-Za-z0-9]{18})" ],
		"RS" : [ "Serbia", "RS(\\d{2})(\\d{3})(\\d{13})(\\d{2})" ],
		"SK" : [ "Slovak Republic", "SK(\\d{2})(\\d{4})(\\d{6})(\\d{10})" ],
		"SI" : [ "Slovenia", "SI(\\d{2})(\\d{5})(\\d{8})(\\d{2})" ],
		"ES" : [ "Spain", "ES(\\d{2})(\\d{4})(\\d{4})(\\d{1})(\\d{1})(\\d{10})" ],
		"SE" : [ "Sweden", "SE(\\d{2})(\\d{3})(\\d{16})(\\d{1})" ],
		"CH" : [ "Switzerland", "CH(\\d{2})(\\d{5})([A-Za-z0-9]{12})" ],
		"TN" : [ "Tunisia", "TN59(\\d{2})(\\d{3})(\\d{13})(\\d{2})" ],
		"TR" : [ "Turkey", "TR(\\d{2})(\\d{5})([A-Za-z0-9]{1})([A-Za-z0-9]{16})" ],
		"AE" : [ "United Arab Emirates", "AE(\\d{2})(\\d{3})(\\d{16})" ],
		"GB" : [ "United Kingdom", "GB(\\d{2})([A-Z]{4})(\\d{6})(\\d{8})" ],
		"VG" : [ "British Virgin Islands", "VG(\\d{2})([A-Z]{4})(\\d{16})" ],
	};

	/**
	 * [populateSelect description]
	 * @return {[type]} [description]
	 */
	var populateSelect = function(){
		var options = document.createDocumentFragment();
		for(countryCode in REGISTRY){
			if( REGISTRY.hasOwnProperty(countryCode) ){
				var countryName = REGISTRY[countryCode][COUNTRY_NAME_INDEX],
					option = document.createElement("option");
					option.textContent = countryName;
					option.setAttribute('value',countryCode);
					options.appendChild(option);
			}
		}
		countryInput.appendChild(options);
		return options;
	}

	//populateSelect();

	/**
	 * Explain pattern similar to http://rick.measham.id.au/paste/explain.pl
	 * @param  {String} pattern Regex pattern to be explained
	 * @return {String}         Human readable description of the pattern
	 */
	var explainPattern = function(pattern){
		//console.log('explain pattern:',pattern);
		var explanation = '',
			parts = pattern.split('('),
			start = parts.shift(),
			rules = [];

		while(parts.length > 0){
			var part = parts.shift().slice(0,-2);
			if(part.substr(0,2) === '\\d'){
				//console.log('digits',part.slice(3));
				rules.push(part.slice(3) + HELPS.DIGITS);
			}
			else if(part.substr(0,5) === '[A-Z]'){
				//console.log('upercase',part.slice(6));
				rules.push(part.slice(6) + HELPS.UPPERCASE);
			}
			else if(part.substr(0,11) === '[A-Za-z0-9]'){
				//console.log('alphanumeric',part.slice(12));
				rules.push(part.slice(12) + HELPS.ALPHANUMERIC);
			}
			//else {
			//	console.log('unkown part',part);
			//}
		}

		explanation = HELPS.START_WITH +'\''+ start +'\' '+ HELPS.FOLLOWED_BY +rules.join(', ') +' ';
		//console.log('explanation:',explanation);

		return explanation;
	};

	/**
	 * [updatePattern description]
	 * @param  {Event} event [description]
	 * @return {Object}       [description]
	 */
	var updatePattern = function(event){
		var countryCode = event.target.value,
			countryName = '',
			iban 		= { pattern: undefined, help: undefined },
			bic 		= { pattern: undefined, help: undefined };

		if(!countryCode){
			// remove validation attributes & disable inputs
			ibanInput.removeAttribute('pattern');
			ibanInput.removeAttribute('title');
			ibanInput.disabled = 'disabled';
			ibanHelp.textContent = '';
			bicInput.removeAttribute('pattern');
			bicInput.removeAttribute('title');
			bicInput.disabled = 'disabled';
			bicHelp.textContent = '';
		} else {
			// define new patterns & titles
			iban.help 	= HELPS.IBAN_PREFIX;
			bic.help 	= HELPS.BIC_PREFIX;
			if( Object.keys(REGISTRY).indexOf(countryCode) >= 0){
				// use name & pattern based on given country code
				countryName  = REGISTRY[countryCode][COUNTRY_NAME_INDEX];
				iban.pattern = REGISTRY[countryCode][IBAN_PATTERN_INDEX];
				iban.help 	+= HELPS.FOR + countryName +' '+ explainPattern(iban.pattern);
				bic.pattern  = BIC_PATTERN.substring(0,8)+countryCode+BIC_PATTERN.substring(16);
				bic.help 	+= HELPS.FOR + countryName +' '+ HELPS.BIC_INFIX +'\''+ countryCode +'\', '+ HELPS.BIC_POSTFIX;
			} else {
				// unknown country, so use generic patterns
				iban.pattern = IBAN_PATTERN;
				iban.help 	+= HELPS.IBAN_DEFAULT;
				bic.pattern  = BIC_PATTERN;
				bic.help 	+= HELPS.BIC_PREFIX + HELPS.BIC_DEFAULT;
			}
			iban.help 	+= HELPS.POSTFIX;
			bic.help 	+= HELPS.POSTFIX;
			// update pattern & title attributes
			ibanInput.removeAttribute('disabled');
			ibanInput.pattern 	= iban.pattern;
			ibanInput.title 	= iban.help;
			ibanHelp.textContent= iban.help;
			bicInput.removeAttribute('disabled');
			bicInput.pattern 	= bic.pattern;
			bicInput.title 		= bic.help;
			bicHelp.textContent = bic.help;
		}

		return {
			iban : iban,
			bic  : bic
		};
	};

	countryInput.addEventListener("change", updatePattern, false);
	updatePattern({ target: countryInput });

}(this));