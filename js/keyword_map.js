var scripts = document.getElementsByTagName('script');
var myScript = scripts[ scripts.length - 1 ];

var queryString = myScript.src.replace(/^[^\?]+\??/,'');

var params = parseQuery( queryString );

// 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
var infowindow = new daum.maps.InfoWindow({zIndex:1});

var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new daum.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

// 지도를 생성합니다
var map = new daum.maps.Map(mapContainer, mapOption);

// 장소 검색 객체를 생성합니다
var ps = new daum.maps.services.Places();

var condition = params.q.indexOf('(');

params.q = condition > -1 && params.q.substring(0,condition) || params.q;

// 키워드로 장소를 검색합니다
ps.keywordSearch(params.q, placesSearchCB);

// 키워드 검색 완료 시 호출되는 콜백함수 입니다
function placesSearchCB (status, data, pagination) {
    if (status === daum.maps.services.Status.OK) {

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        var bounds = new daum.maps.LatLngBounds();

        if (data && data.places && data.places.length) {
        	displayMarker(data.places[0]);
			bounds.extend(new daum.maps.LatLng(data.places[0].latitude, data.places[0].longitude));
        }

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
    }
    else {
    	$("#map").length > 0 && $("#map").remove();
    }
}

// 지도에 마커를 표시하는 함수입니다
function displayMarker(place) {

    // 마커를 생성하고 지도에 표시합니다
    var marker = new daum.maps.Marker({
        map: map,
        position: new daum.maps.LatLng(place.latitude, place.longitude)
    });

    // 마커에 클릭이벤트를 등록합니다
//    daum.maps.event.addListener(marker, 'click', function() {
//        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
//        infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.title + '</div>');
//        infowindow.open(map, marker);
//    });

    infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.title + '</div>');
    infowindow.open(map, marker);

    $('<div id="mapInfo">주소 : '+place.address+'<br/>신주소 : '+ place.newAddress +'<br/>전화번호 : '+place.phone+'</div><br/>').insertAfter("#map");

    isEmpty = false;
}
function parseQuery ( query ) {
   var Params = new Object ();
   if ( ! query ) return Params; // return empty object
   var Pairs = query.split(/[;&]/);
   for ( var i = 0; i < Pairs.length; i++ ) {
      var KeyVal = Pairs[i].split('=');
      if ( ! KeyVal || KeyVal.length != 2 ) continue;
      var key = unescape( KeyVal[0] );
      var val = unescape( KeyVal[1] );
      val = val.replace(/\+/g, ' ');
      Params[key] = val;
   }
   return Params;
}