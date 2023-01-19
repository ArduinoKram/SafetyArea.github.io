var cpl = 0;

function openBatch() {
  var lang = $('#openBatch').prop('lang') || "en";
  if (typeof ga !== 'undefined') ga('send', 'event', 'Batch', 'btnClicked');
  var link = (lang === 'de') ?
    'https://bulk.luftlinie.org/?utm_source=website&utm_medium=link&utm_campaign=btn' :
    'https://bulk.distance.to/?utm_source=website&utm_medium=link&utm_campaign=btn';

  window.open(link, '_new');
}

function getDistance() {
    var _disdiv = jQuery('div.adp-summary span[jsdisplay="distance"]').html();
		unit = jQuery('.unit').html();
		//console.log(_disdiv);
		_disdiv = _disdiv.replace(unit,'');
		//_disdiv =  _disdiv.replace(',','.');
		//if(_disdiv < 10) console.log('kleiner');
    jQuery('#strck').append(_disdiv+ ' ' +unit);
		jQuery('#direction a.unit').html(unit);
		jQuery('ul.info li span#erg').append(_disdiv+ ' ' + unit);
		//console.log(_disdiv);
}

 function getDistanceLatLng (strt,end) {
    if (typeof(arguments[0]) != 'object') return false;

		//console.log(strt.lat());

    var ent = 0;
    var welt = 6378.137;
    var koord = new Array();
    koord[0] = new Array(strt.lat(), strt.lng());
    koord[1] = new Array(end.lat(), end.lng());
    //koord[0] = arguments[0][0].split(',');
    //koord[1] = arguments[0][1].split(',');

		//console.log(koord);

    for (var x=0;x<koord.length;x++) {
      if (typeof(koord[x + 1]) != 'undefined') {
        var erste_breite = koord[x][0];
        var erste_laenge = koord[x][1];
        var erste_breite_rad = deg2rad(erste_breite);
        var erste_laenge_rad = deg2rad(erste_laenge);
        var zweite_breite = koord[x + 1][0];
        var zweite_laenge = koord[x + 1][1];
        var zweite_breite_rad = deg2rad(zweite_breite);
        var zweite_laenge_rad = deg2rad(zweite_laenge);
        var dis = Math.acos((Math.sin(erste_breite_rad) * Math.sin(zweite_breite_rad)) +(Math.cos(erste_breite_rad) * Math.cos(zweite_breite_rad)) *Math.cos(zweite_laenge_rad - erste_laenge_rad))*welt;
        ent+= dis;
      }
    }
    var entfernung = ent*1000;
    return (typeof(arguments[1]) == 'undefined')? Math.round(entfernung):(arguments[1] == 'mi')? Math.round(entfernung*0.621371192):Math.round(entfernung);
  }


  function parseinput(ort){

    if (/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(ort)) return ort;

    var name = $.map(ort.split(','), function (name){
      return name.trim();
    }).join(',');

    var sign = [" ","/"];
    var replace= ["-","-"];
    for (var i = 0; i < sign.length; i++){
      while(name.search(sign[i]) != -1) {
        name = name.replace(sign[i], replace[i]);
      }
    }
    /*while(name.search(/\./) != -1) {
      name = name.replace(/\./, "-");
    }*/
    while(name.search("--") != -1) {
      name = name.replace("--", "-");
    }
    if(name.substr(name.length-1, name.length) == "-") name = name.substr(0, name.length-1);
    if(name.substr(0, 1) == "-") name = name.substr(1, name.length);
    return name;
  }

  function addWaypoint(link, placeholder, value) {
    value = value || '';

    if (value) {
      if (!$('.bd').last().val()) {
        $('.bd').last().val(value);
        return;
      }
    }

    var html = $('<div class="typeaheadOuter"><input type="text" value="' + value + '" class="bd empty" placeholder="'+ placeholder +'" style="display: block" /></div>');
    var br = $('<br>');

    if (!link) link = $('.btn').last();

    $(link).after(br);
    br.after(html);
    enableAutocomplete(html.children('.bd'));
  }

  function countroute() {
    var url = [];
    var inputFields = document.querySelectorAll('.bd');

    for (var i = 0; i < inputFields.length; i++) {
      if (inputFields[i].value) url.push(encodeURI(parseinput(inputFields[i].value)));
    }

    if (url.length) self.location.href = "/" + url.join('/');
  }

  function deg2rad (a) {
      return (a / 180) * Math.PI;
  }

   function getDistance () {
      if (typeof(arguments[0]) != 'object') return false;

      var ent = 0;
      var welt = 6378.137;
      var koord = new Array();
      koord[0] = new Array(arguments[0][0][0], arguments[0][0][1]);
      koord[1] = new Array(arguments[0][1][0], arguments[0][1][1]);
      //koord[0] = arguments[0][0].split(',');
      //koord[1] = arguments[0][1].split(',');
      for (var x=0;x<koord.length;x++) {
        if (typeof(koord[x + 1]) != 'undefined') {
          var erste_breite = koord[x][0];
          var erste_laenge = koord[x][1];
          var erste_breite_rad = deg2rad(erste_breite);
          var erste_laenge_rad = deg2rad(erste_laenge);
          var zweite_breite = koord[x + 1][0];
          var zweite_laenge = koord[x + 1][1];
          var zweite_breite_rad = deg2rad(zweite_breite);
          var zweite_laenge_rad = deg2rad(zweite_laenge);
          var dis = Math.acos((Math.sin(erste_breite_rad) * Math.sin(zweite_breite_rad)) +(Math.cos(erste_breite_rad) * Math.cos(zweite_breite_rad)) *Math.cos(zweite_laenge_rad - erste_laenge_rad))*welt;
          ent+= dis;
        }
      }
      var entfernung = ent*1000;
      return (typeof(arguments[1]) == 'undefined')? Math.round(entfernung):(arguments[1] == 'mi')? Math.round(entfernung*0.621371192):Math.round(entfernung);
    }


    function dump(arr,level) {
  	var dumped_text = "";
  	if(!level) level = 0;

  	//The padding given at the beginning of the line.
  	var level_padding = "";
  	for(var j=0;j<level+1;j++) level_padding += "    ";

  	if(typeof(arr) == 'object') { //Array/Hashes/Objects
  		for(var item in arr) {
  			var value = arr[item];

  			if(typeof(value) == 'object') { //If it is an array,
  				dumped_text += level_padding + "'" + item + "' ...\n";
  				dumped_text += dump(value,level+1);
  			} else {
  				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
  			}
  		}
  	} else { //Stings/Chars/Numbers etc.
  		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
  	}
  	return dumped_text;
  }

// Show variable Distances
function showVarDistance(strt,end,count,color) {

		//console.log(strt+' '+end);

		var _dist = getDistanceLatLng(strt,end)/1000;

		cpl += _dist;

		if(count == 1) {
				$('#vardist').fadeIn();
				$('#result').append("<li style='color:"+color+"'>" + formatMoney(_dist,2,sep,decp) + "km</li>");
		}
		else {

				$('#result').append("<li style='color:"+color+"'>" + formatMoney(getDistanceLatLng(strt,end)/1000,2,sep,decp) + "km</li>");
				$('#result').scrollTop($('#result').height());
		}
		$('#cpl').html("<li>= "+ formatMoney(cpl,2,sep,decp) + "km</li>");
}

$(document).keypress(function(event) {
	if (event.which == '13') countroute();
});

// First char upper case
$('.bd').keyup(function(event) {
	var textBox = event.target;
	var start = textBox.selectionStart;
	var end = textBox.selectionEnd;
  if (!textBox.value.match(/^\w+\.\w+\.\w+$/)) {
	   textBox.value = textBox.value.charAt(0).toUpperCase() + textBox.value.slice(1);
  }
	textBox.setSelectionRange(start, end);
});


$('.reset').click(function(event){
    //for(x=0;x<count;x++){
    //}
    map.removeOverlay(marker[3]);

  });



var fail = function(data) {
  console.log("fail");
}

var getW3w = function (query, callback) {
  var url = 'https://api.what3words.com/v2/autosuggest';
  const params =  {
    lang: 'en',
    addr: query,
    key: '50KXASEB',
    count: 5,
  };
  $.getJSON(url, params )
  .done(function(response) {
    callback({
      suggestions: $.map(response.suggestions, function(dataItem) {
        return { value: dataItem.words, data: dataItem.geometry };
      })
    });
  });
}

var getArcGis = function (query, callback) {
  var url = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest';
  const params =  {
    text: query,
    outFields: '*',
    maxSuggestions: 5,
    f: 'json'
  };
  $.getJSON(url, params )
  .done(function(response) {
    callback({
      suggestions: $.map(response.suggestions, function(dataItem) {
        return { value: dataItem.text, data: dataItem.magicKey };
      })
    });
  });
}

var enableAutocomplete = function (container) {

  $(container).autocomplete({
    autoSelectFirst: true,
    lookup: function (query, done) {
      if (query.match(/^\w+\.\w+\.\w+$/)) {
        getW3w(query, function (result) {
          done(result);
        });
      } else {
        getArcGis(query, function (result) {
          done(result);
        });
      }
    },
    onSelect: function (suggestion) { }
  });
}


// *** Document Ready
$(document).ready(function() {

  $('#calcDistance').click(function(event) {
    countroute();
  });

  $('#openBatch').click(function(event) {
    openBatch();
  });

  $('.bd').click(function(event){
   $(this).select();
  });


   $('.bd').each(function() {
     enableAutocomplete(this);
   });

  // if ($('#start').length) $('#start').focus();
  // else $('#end').focus();

  // Change Unit
  $(".unit").click(function(event){
	  var test = $("#airline").not(".unit").html();
	  test = test * 0.621371192;
	  $("#airline").empty();
	  $("#airline").append(Math.round(test));
	  $(".unit").empty();
	  $(".unit").append(" mi");
  });

  // Languge Selector
  $(".local").click(function(event){
	  $("#language").css("display","inline");
	  $("#logo h1 a span").css("color","#ffffff");
	  $("#logo h1 a span").css("text-shadow","0 0 1px #fff");
  });
  $("#language .close").click(function(event){
	  $("#language").fadeOut();
	  $("#logo h1 a span").css("color","#333333");
  });


  // Usage
  // Log usage overlay shown
  if ($('.usage').length) {
    if (typeof ga !== 'undefined') ga('send', 'event', 'Usage', 'showOverlay');
  }
  // Log usage link click
  $('#usage .consentText a').click(function(e) {
    e.preventDefault();
    if (typeof ga !== 'undefined') ga('send', 'event', 'Usage', 'linkClicked');
    $('#usage').css({ display: 'none' });
    $('.content').removeClass('fadeout');
    window.open(this.href, '_blank');
  });

  $('#usageOpen').click(function (e) {
    e.preventDefault();
    var date = new Date();
    date.setTime(date.getTime() + (60 * 60 * 1000));
    $.cookie("distanceto_batch", 1, { expires : date });
    if (typeof ga !== 'undefined') ga('send', 'event', 'Usage', 'open');
    $('#usage').css({ display: 'none' });
    $('.content').removeClass('fadeout');
    window.open(this.href, '_blank');
  });
  $('#usageClose').click(function (e) {
    var date = new Date();
    date.setTime(date.getTime() + (60 * 60 * 1000));
    $.cookie("distanceto_batch", -1, { expires : date });
    if (typeof ga !== 'undefined') ga('send', 'event', 'Usage', 'closed');
    $('#usage').css({ display: 'none' });
    $('.content').removeClass('fadeout');
  });

});
