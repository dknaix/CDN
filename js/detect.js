//local store setter getter
id_key=(type="get",key="")=>{
	if (type=="set") {sessionStorage.setItem("uq_id", key);}
	else {
		var data=sessionStorage.getItem("uq_id")
		return data
	}
}



detect=()=>{

	let desktop=false
	let laptop_mobile=false

	let android=false
	let linux=false
	let mac_os=false
	let windows=false
	let ios=false
	var proxy=false

	//detect proxy
	var proxyHeader = 'via';
	var req = new XMLHttpRequest();
	req.open('GET', document.location, false);
	req.send();
	var header = req.getResponseHeader(proxyHeader);
	if (header) {var proxy=true}
	else{}

	//check battery (not working in ios/mac)
	navigator.getBattery().then(
		function(battery) {
	    if (battery.charging && battery.chargingTime === 0) {desktop=true}
			else {laptop_mobile=true}
		}
	);

	//confirm android test
	var ua = navigator.userAgent.toLowerCase();
	var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
	if(isAndroid) {android=true}
	else{}


	// check all os
	var userAgent = window.navigator.userAgent,
  platform = window.navigator.platform,
  macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
  windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
  iosPlatforms = ['iPhone', 'iPad', 'iPod'],
  os = null;
  if (macosPlatforms.indexOf(platform) !== -1) {os = 'Mac OS';}
	else if (iosPlatforms.indexOf(platform) !== -1) {ios=true;os = 'iOS';}
	else if (windowsPlatforms.indexOf(platform) !== -1) {windows=true;os = 'Windows';}
	else if (/Android/.test(userAgent)) {android=true; os = 'Android';}
	else if (!os && /Linux/.test(platform)) {linux=true; os = 'Linux';}
	// $(".container").append("<br>**Os is "+os);

	//check macos
	var OSName="Unknown OS";
	if (navigator.appVersion.indexOf("Win")!=-1){ windows=true;OSName="Windows";}
  if (navigator.appVersion.indexOf("Mac")!=-1){ mac_os=true;linux=false;OSName="MacOS";} //confirmed working



	//detect browser stats
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browserName  = navigator.appName;
	var fullVersion  = ''+parseFloat(navigator.appVersion);
	var majorVersion = parseInt(navigator.appVersion,10);
	var nameOffset,verOffset,ix;

	// In Opera 15+, the true version is after "OPR/"
	if ((verOffset=nAgt.indexOf("OPR/"))!=-1) {
	 browserName = "Opera";
	 fullVersion = nAgt.substring(verOffset+4);
	}
	// In older Opera, the true version is after "Opera" or after "Version"
	else if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
	 browserName = "Opera";
	 fullVersion = nAgt.substring(verOffset+6);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1)
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In MSIE, the true version is after "MSIE" in userAgent
	else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
	 browserName = "Microsoft Internet Explorer";
	 fullVersion = nAgt.substring(verOffset+5);
	}
	// In Chrome, the true version is after "Chrome"
	else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
	 browserName = "Chrome";
	 fullVersion = nAgt.substring(verOffset+7);
	}
	// In Safari, the true version is after "Safari" or after "Version"
	else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
	 browserName = "Safari";
	 fullVersion = nAgt.substring(verOffset+7);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1)
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In Firefox, the true version is after "Firefox"
	else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
	 browserName = "Firefox";
	 fullVersion = nAgt.substring(verOffset+8);
	}
	// In most other browsers, "name/version" is at the end of userAgent
	else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
	          (verOffset=nAgt.lastIndexOf('/')) )
	{
	 browserName = nAgt.substring(nameOffset,verOffset);
	 fullVersion = nAgt.substring(verOffset+1);
	 if (browserName.toLowerCase()==browserName.toUpperCase()) {
	  browserName = navigator.appName;
	 }
	}
	// trim the fullVersion string at semicolon/space if present
	if ((ix=fullVersion.indexOf(";"))!=-1)
	   fullVersion=fullVersion.substring(0,ix);
	if ((ix=fullVersion.indexOf(" "))!=-1)
	   fullVersion=fullVersion.substring(0,ix);

	majorVersion = parseInt(''+fullVersion,10);
	if (isNaN(majorVersion)) {
	 fullVersion  = ''+parseFloat(navigator.appVersion);
	 majorVersion = parseInt(navigator.appVersion,10);
	}

	// $(".container").append('<br>'
	//  +'Browser name  = '+browserName+'<br>'
	//  +'Full version  = '+fullVersion+'<br>'
	//  +'Major version = '+majorVersion+'<br>'
	//  +'navigator.appName = '+navigator.appName+'<br>'
	//  +'navigator.userAgent = '+navigator.userAgent+'<br>'
	// )

	// setTimeout(function(){
	// 	$(".container").append("<br><br>All Flags");
	// 	$(".container").append("<br>desktop="+desktop);
	// 	$(".container").append("<br>laptop_mobile="+laptop_mobile);
	// 	$(".container").append("<br>android="+android);
	// 	$(".container").append("<br>linux="+linux);
	// 	$(".container").append("<br>mac_os="+mac_os);
	// 	$(".container").append("<br>windows="+windows);
	// 	$(".container").append("<br>ios="+ios);
	// 	$(".container").append("<br>Browser="+browserName+" "+majorVersion);
	// 	$(".container").append("<br>Screen size="+screen.width+"x"+screen.height);
	// 	$(".container").append("<br>Proxy="+proxy);
	//  }, 3000);

	 //converting flags and logically generating results
	 var temp_arr=[]
	 var true_count=0
	 var pos_true_count
	 var dev_type="unk"
	 var os="unk"
	 var browser=browserName+" "+majorVersion
	 var s_size=screen.width+"x"+screen.height
	 var timestamp=new Date().getTime()

	 var uq_id=id_key("get")
	 if (uq_id==null) {uq_id="null"}
	else {return}




	 //determine final device type
	 if (desktop==true && laptop_mobile==true) {var dev_type="unk"}
	 else if (desktop==true && laptop_mobile==false) {var dev_type="desktop"}
	 else if (desktop==false && laptop_mobile==false) {var dev_type="laptop/mobile"}

	 //determine a single final OS / UNK
	 temp_arr.push(android)
	 temp_arr.push(windows)
	 temp_arr.push(linux)
	 temp_arr.push(mac_os)
	 temp_arr.push(ios)
	 for (var i = 0; i < temp_arr.length; i++) {
		 if (temp_arr[i]) {
			 true_count+=1
			 pos_true_count=i
		 }
	 }
	 if (true_count==1) {
		 if (pos_true_count==0) {os="android"}
		 else if (pos_true_count==1) {os="windows"}
		 else if (pos_true_count==2) {os="linux"}
		 else if (pos_true_count==3) {os="mac_os"}
		 else if (pos_true_count==4) {os="ios"}
	 }

	 // alert("final:"+dev_type+os+browser+s_size+proxy)

	 $.post("/validate.php", {timestamp:timestamp,dev_type:dev_type,os:os,s_size:s_size,proxy:proxy,log:browser},
			function(data, status){
				// alert("recv data for log:"+data);
					id_key("set","a4d8jhad5h2s9e8harskut3")
			}
		);

}

detect()
