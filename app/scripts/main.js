var watch
var log
var out = document.getElementById('out')
var dump = document.getElementById('dump')
var mapOptions = {
	zoom: 16,
	mapTypeId: google.maps.MapTypeId.ROADMAP
}

var map = new google.maps.Map(document.getElementById('map'), mapOptions)
var marker = new google.maps.Marker({
	map: map
})

;[].concat.apply([], document.querySelectorAll('button'))
	.forEach(function(btn) {
		btn.addEventListener('click', action, false)
	})

function action(e) {
	window[e.target.name]()
}

function getCurrentPosition() {
	startLog('getCurrentPosition', options())
	navigator.geolocation.getCurrentPosition(function(position) {
		success(position)
		endLog()
	}, error, options())
}

function watchPosition() {
	startLog('watchPosition', options())
	watch = navigator.geolocation.watchPosition(success, error, options())
}

function clearWatch() {
	navigator.geolocation.clearWatch(watch)
	endLog()
}

function startLog(method, options) {
	log = {
		method: method,
		options: options,
		userAgent: navigator.userAgent,
		timestamp: new Date().toString(),
		positions: []
	}
}

function endLog() {
	localStorage['log-' + log.timestamp] = JSON.stringify(log)
}

function showDump() {
	dump.innerHTML = JSON.stringify(log, null, ' ')
}

function options() {
	var form = document.forms.options;
	var options = {
		enableHighAccuracy: form.enableHighAccuracy.checked,
	}
	;['timeout', 'maximumAge'].forEach(function(name) {
		if (form[name].value !== '') {
			options[name] = parseInt(form[name].value, 10)
		}
	})
	return options;
}

function success(position) {
	console.log('success', position)
	out.innerHTML = JSON.stringify(position, null, ' ')
	log.positions.push(position)
	centerMap(position)
}

function error(positionError) {
	console.log('error', positionError)
	log.positions.push(positionError)
	out.innerHTML = JSON.stringify(positionError, null, ' ')
}

function centerMap(position) {
	var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
	map.setCenter(pos)
	marker.setPosition(pos)
}

function getStorage() {
	var logs = {}
	for (var k in localStorage) {
		if (k.indexOf('log-') != -1) {
			logs[k] = JSON.parse(localStorage[k])
		}
	}
	return logs
}
