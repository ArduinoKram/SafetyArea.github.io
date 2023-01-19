var setRequestHeader = function(xhr) {
  xhr.setRequestHeader("distance-token", "0C7aw48QlR#6!N#2GnEB8kSJAa2!3br2");
};

Directions = function(params){};

Directions.prototype.getOSRM5 = function (params, cb) {
  var url = 'https://api.distance.to/api/v2/directions/get/route/v1/driving/' + params.waypoints + '?apiKey=MbdqfjdNhMPkDS57Q&midpoint=true';
  var jqxhr = $.ajax({ 
      type: 'post',
      url: url, 
      data: { 
        route: params.waypoints.split(';')
      }, 
      dataType: 'json', 
      beforeSend: setRequestHeader
    })
    .done(function(data) {
      if(data.code === "Ok" && typeof cb === 'function') {
        cb(data);
      } else {
        cb(null);
      }
    })
    .fail(function() {
      cb(null)
    });
};

Directions.prototype.draw = function (routeData, options) {
  var waypoints = [];
  options = options || {};
  var unit = options.unit || 'km';
  routeData.forEach(function (step) { waypoints.push(step.coordinates.join()) });
  this.getOSRM5({
    waypoints: waypoints.join(';')
  }, function (data) {
    if (data && data.routes && data.routes.length) {
      var routeOptions = {
        weight: 4,
        opacity: 0.7,
      }
      var route = new L.Polyline(L.PolylineUtil.decode(data.routes[0].geometry, 5), routeOptions);
      map.addLayer(route);

      // Write steps
      for (var i = 0; i < data.routes[0].legs.length; i++) {
        var leg = data.routes[0].legs[i];
        // direction distance
        var distanceKm = '<span class="value">' + formatMoney(leg.distance/1000, 2, sep, decp) + '</span> <span class="unit">km</span>';
        var distanceMi = '<span class="value">' + formatMoney(leg.distance/1000*0.621371, 2, sep, decp) + '</span> <span class="unit">mi</span>';
        var distanceFormatted = (unit === 'mi') ? distanceMi + ' <span class="e2nd">(' + distanceKm + ')</span>' : distanceKm;
        for (var h = 0; h < document.querySelectorAll(".directionsResult" + i).length; h++) {
          var direction = document.querySelectorAll(".directionsResult" + i)[h];
          direction.innerHTML = distanceFormatted;
        }
        // direction duration
        var duration = moment.duration((leg.duration), 'seconds');
        var durationFormatted = (moment.duration(duration, 'seconds').get('days') * 24 + moment.duration(duration, 'seconds').get('hours')  ) + "h " + moment.duration(duration, 'seconds').get('minutes') + "min";
        for (var j = 0; j < document.querySelectorAll(".directionsResultTime" + i).length; j++) {
          var duration = document.querySelectorAll(".directionsResultTime" + i)[j];
          duration.innerHTML = durationFormatted;
        }

        // direction midpoint
        if (leg.midpoint) {
          var midpoint = leg.midpoint.coordinates;
          var midpointFormatted = "<a href='/" + midpoint[1] + ',' + midpoint[0] + "'>" + midpoint[1] + ',' + midpoint[0] + "</a>"
  
          for (var l = 0; l < document.querySelectorAll(".directionsResultMidpoint" + i).length; l++) {
            var mid = document.querySelectorAll(".directionsResultMidpoint" + i)[l];
            mid.innerHTML = midpointFormatted;
          }
  
          var midpointMarker = L.circleMarker(L.latLng(midpoint[1],midpoint[0]), {radius: 3, stroke: true, color: "#ff0000", weight: 2,opacity: 1, fillColor: "#fff", fillOpacity: 1 });
          map.addLayer(midpointMarker);
        }
      }

      // Write directions total
      var distanceTotal = (data.routes[0].distance / 1000).toFixed(2);
      var durationTotal = moment.duration((data.routes[0].duration), 'seconds');
      var midpointTotal = [];
      if (data.routes[0].midpoint) {
        if (data.routes[0].midpoint.coordinates) {
          var midpointCoordinates = data.routes[0].midpoint.coordinates || [];
          for (var x = 0; x < midpointCoordinates.length; x++) {
            var coord = midpointCoordinates[x];
            midpointTotal.push(coord.toFixed(5));
          }
          var midpointMarker = L.circleMarker(L.latLng(midpointTotal[1],midpointTotal[0]), {radius: 3, stroke: true, color: "#1105fa", weight: 2,opacity: 1, fillColor: "#fff", fillOpacity: 1 });
          map.addLayer(midpointMarker);
        }
      }

      var distanceTotalKm = '<span class="value">' + formatMoney(distanceTotal, 2, sep, decp) + '</span> <span class="unit">km</span>';
      var distanceTotalMi = '<span class="value">' + formatMoney(distanceTotal*0.621371, 2, sep, decp) + '</span> <span class="unit">mi</span>';
      var distanceTotalFormatted = (unit === 'mi') ? distanceTotalMi + ' <span class="e2nd">(' + distanceTotalKm + ')</span>' : distanceTotalKm;

      for (var m = 0; m < document.querySelectorAll('.directionsResultTotal').length; m++) {
        var direction = document.querySelectorAll('.directionsResultTotal')[m];
        direction.innerHTML = distanceTotalFormatted;
      }

      jQuery('.directionsResultTimeTotal').html((moment.duration(durationTotal, 'seconds').get('days') * 24 + moment.duration(durationTotal, 'seconds').get('hours')  ) + "h " + moment.duration(durationTotal, 'seconds').get('minutes') + "min");
    }


  });
}