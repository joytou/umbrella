function hideMap(){
    window.history.back(1);
	document.getElementById("map_canvas").style.display="none";
}
window.addEventListener("popstate", hideMap, false);
function showMap(boths=false){
    window.history.pushState('forward', null, location.href); 
    var positioning = weui.loading('定位中', {className: 'custom-classname'});
    var myPoint = new sogou.maps.Point(12623628.163069487,2634378.258496523);
    changeSize();
    document.getElementById("map_canvas").style.display="block";
    var StartEnd = new Array();
    var myOptions = {
      zoom: 20,
      mapControlType: 4,
      center: myPoint,
	  //设置高清地图
	  hdMap:true,
      mapTypeId: sogou.maps.MapTypeId.ROADMAP
    }
    var map = new sogou.maps.Map(document.getElementById("map_canvas"), myOptions);
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(pos){
            map.setCenter(new sogou.maps.LatLng(pos.coords.latitude,pos.coords.longitude));
            positioning.hide();
            weui.toast('定位成功',1000);
        },
        function(e){
            positioning.hide();
            var errMsg = {  
            1: '用户拒绝了位置服务',  
            2: '无法获取地址位置信息',  
            3: '获取地理位置信息超时',
            4: '出现未知错误'  
        };  
            weui.topTips(errMsg[e.code], 1000);
        },
        {
            timeout:3000
        });
    }
    sogou.maps.event.addListener(map,"click",function(mouseEvent){
        var point = mouseEvent.point;
		var pName;
		if(startP==null){
		    pName = "出发地";
		}else if(endP==null){
		    pName = "目的地";
		}else{
		    pName = "";
		}
		var marker = new sogou.maps.Marker({
			 map:map,
			 draggable:true,
			 position:point,
			 label:{visible:true,align:"BOTTOM"},
			 title:pName
		});
		if(startP==null){
		    startP = marker;
		}else if(endP==null){
		    endP = marker;
		}else{
		    marker.setMap(null);
		}
		sogou.maps.event.addListener(marker,"click",function(event){
		if(marker == startP){
		    startP = null;
		}else if(marker == endP){
		    endP = null;
		}
		marker.setMap(null);
     });
        sogou.maps.event.addListener(marker,"dragend",function(event){
        if(marker == startP){
		    alert("start");
		}else if(marker == endP){
		    alert("end");
		}
     });
		        document.getElementById("Departures").value="//api.map.sogou.com/engine/api/static/image+{'points':'"+startP.getPosition()+"','labels':'"+startP.getTitle()+"','center':'"+startP.getPosition()+"','city':'广州','zoom':18,'baseRMP':'174'}.png";
		    document.getElementById("Destination").value="//api.map.sogou.com/engine/api/static/image+{'points':'"+endP.getPosition()+"','labels':'"+endP.getTitle()+"','center':'"+endP.getPosition()+"','city':'广州','zoom':18,'baseRMP':'174'}.png";
		    //map.clearAll();
		    //hideMap();
    });
}

function changeSize() { 
	var showMap = document.getElementById("map_canvas"); 
	showMap.style.width = document.documentElement.clientWidth + "px"; 
	showMap.style.height = document.documentElement.clientHeight + "px"; 
}
var startP = null;
var endP = null;
window.onresize = changeSize;
