// Quantimodo.com API. Requires JQuery.
Quantimodo = function() {
	var GET = function (baseURL, allowedParams, params, successHandler) {
		var urlParams = [];
		for (var key in params) {
			if (jQuery.inArray(key, allowedParams) == -1) { throw 'invalid parameter; allowed parameters: ' + allowedParams.toString(); }
			urlParams.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
		}
		jQuery.ajax({type: 'GET', url: ('https://quantimodo.com/api/' + ((urlParams.length == 0) ? baseURL : baseURL + '?' + urlParams.join('&'))), contentType: 'application/json', success: successHandler});
	};

	var POST = function (baseURL, requiredFields, items, successHandler) {
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			for (var j = 0; j < requiredFields.length; j++) { if (!(requiredFields[j] in item)) { throw 'missing required field in POST data; required fields: ' + requiredFields.toString(); } }
		}
		jQuery.ajax({type: 'POST', url: 'https://quantimodo.com/api/' + baseURL, contentType: 'application/json', data: JSON.stringify(items), dataType: 'json', success: successHandler});
	};

	return {
		getMeasurements: function(params, f) { GET('measurements', ['variableName', 'startTime', 'endTime', 'groupingWidth', 'groupingTimezone'], params, f); },
		postMeasurements: function(measurements, f) { POST('measurements', ['source', 'variable', 'combinationOperation', 'timestamp', 'value', 'unit'], measurements, f); },
		
		getMeasurementsRange: function(params, f) { GET('measurementsRange', [], params, f); },
		
		getMeasurementSources: function(params, f) { GET('measurementSources', [], params, f); },
		postMeasurementSources: function(measurements, f) { POST('measurementSources', ['name'], measurements, f); },
		
		getUnits: function(params, f) { GET('units', ['unitName', 'abbreviatedUnitName', 'categoryName'], params, f); },
		postUnits: function(measurements, f) { POST('units', ['name', 'abbreviatedName', 'category', 'conversionSteps'], measurements, f); },
		
		getUnitCategories: function(params, f) { GET('unitCategories', [], params, f); },
		postUnitCategories: function(measurements, f) { POST('unitCategories', ['name'], measurements, f); },
		
		getVariables: function(params, f) { GET('variables', ['categoryName'], params, f); },
		postVariables: function(measurements, f) { POST('variables', ['name', 'category', 'unit', 'combinationOperation'], measurements, f); },
		
		getVariableCategories: function(params, f) { GET('variableCategories', [], params, f); },
		postVariableCategories: function(measurements, f) { POST('variableCategories', ['name'], measurements, f); },
		
		getVariableUserSettings: function(params, f) { GET('variableUserSettings', ['variableName'], params, f); },
		postVariableUserSettings: function(measurements, f) { POST('variableUserSettings', ['variable', 'unit'], measurements, f); }
	};
}();

