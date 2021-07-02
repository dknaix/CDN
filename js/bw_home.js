$( document ).ready(function() {
	console.log( "Home Loaded!" );

	try {parent.daddy_u_there()} //parent chk
	catch (e) {location.replace("/404.html");return}
	global_slider_pos=0

	// if (screen.width<500) {
	// 	$("#apk_banner_img").attr("src","img/misc/apk_banner_mob.jpg")
	// 	$("#apk_download_btn").css("display","inline-block")
	// }

	scroll_view("main_header_scroll_id")

	loop()
});

slider_pos=(direction)=>{
	// alert("global_slider_pos before="+global_slider_pos)
	if (direction=="left") {
		global_slider_pos-=1
		if (global_slider_pos<=-1) {global_slider_pos=2}
	}
	else {
		global_slider_pos+=1
		if (global_slider_pos>=3) {global_slider_pos=0}
	}
	// alert("global_slider_pos="+global_slider_pos)
	$("#slide_0").hide()
	$("#slide_1").hide()
	$("#slide_2").hide()
	let temp="#slide_"+global_slider_pos
	// alert(temp)
	$(temp).fadeIn(1500)
}

loop=()=>{ //auto carousal slider
	var intervalId = window.setInterval(function(){
		slider_pos("right")
	}, 8500);


}
