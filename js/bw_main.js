$( document ).ready(function() {

	if (location.protocol !== 'https:') {
		location.replace(`https:${location.href.substring(location.protocol.length)}`);
	}

	console.log( "Main loaded!" );
	$(".right_display_0").load("bw_home.html")
	$(".right_display").load("dyn_loader.html")
	console.log("Swiching css")
	$(".right_display").css("border-left","10px solid #003748")
	$(".right_display_0").css("border-left","10px solid #003748")
	global_cat_holder=""
	itemXCount=[]
	itemXCount_string=""
	global_last_selected="Beer" //for mobile select cat
	chk_ss() //to fill itemXCount to localstorage
	chk_cookie() //to chk cookie and show logout btn
	birth_year()

	//uq_id system
	// detect()

	$("body").on("contextmenu",function(e){
		return false;
	});

	document.addEventListener("keydown", function(event){
		var key = event.key || event.keyCode;

		if (key == 123) {
				return false;
		} else if ((event.ctrlKey && event.shiftKey && key == 73) || (event.ctrlKey && event.shiftKey && key == 74)) {
				return false;
		}
	}, false);

});


daddy_u_there=()=>{ //frames will nt load independently
	return true
}

scroll_view=(id)=>{document.getElementById(id).scrollIntoView();}

scroll_cords=(x,y)=>{window.scrollTo(x, y)}


birth_year=(show=true)=>{
	// check_age_auth_cookie()
	let temp=document.cookie.split(";")
	for (var i = 0; i < temp.length; i++) {
		if (temp[i].includes("age_auth=true")) {show=false}
		else if (temp[i].includes("age_auth=false")) {show=true} //never exec
	}

	//show dialogue
	if (show) {
		setTimeout(function(){
			$(".blocker").fadeIn(2000)
			$(".birth_year").slideDown(2000)
		}, 3000);
	}
	else{
		if ($("#birth_year_ip_2").is(":checked")) {}
		else{$("#validation_text_2").show();return}


		let year=$("#birth_year_ip_1").val()
		year=year.split("-")
		year=year[0]
		let d = new Date();
		d=d.getFullYear();
		age=d-year
		if (age>=21) {$("#validation_text_1").hide();create_age_auth_cookie()}
		else {$("#validation_text_1").show();return}
		$(".blocker").slideUp(1500)
		$(".birth_year").fadeOut(1500)
	}

}

create_age_auth_cookie=(exdays=1)=>{
	// create age_auth_cookie()
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = "age_auth=" + true + ";" + expires + ";path=/";
}



switch_pg=(page,cat="",hide_banner=false,scroll=false)=>{
	if (hide_banner==true) { //dynloader > show left panel only when a cat is selected
		left_panel_toggle(true)
	}

	if (cat=="all") {global_cat_holder=""} //all cat
	else if (cat.length>=2) {global_cat_holder=cat} //select specific cat
	else{}

	if (page=="catagory"){
		$(".right_display").load("dyn_loader.html")
		if (cat=="all") {
			left_panel_toggle()
			$(".right_display_0").show()
			scroll_view('right_display_main')}
		}

		else if (page=="home") {
			left_panel_toggle()
			$(".right_display_0").show()
			$(".right_display_0").load("bw_home.html")
			global_cat_holder=""
			$(".right_display").load("dyn_loader.html")
			// scroll_view('home_main') //scroll to home
		}
		else if (page=="cart") {
			$(".right_display").load("cart.html")
			left_panel_toggle()
			scroll_view("right_display_main")
		}
	}


chk_ss=()=>{
	let a=localStorage.getItem("cart")
	try {a=a.split("--")}
	catch (e) {console.log("Empty cart:"+e);return}
	// alert("Cart Before "+itemXCount)

	//if localSt cart !empty > push in global arr for further use
	if (a.length>=1) {
		for (var i = 0; i < a.length; i++) {
			itemXCount.push(a[i])
		}
	}
	// alert("Cart After "+itemXCount)
	console.log(localStorage.getItem("cart"))
}


show_login=(opr)=>{
	if (opr=="hide") {
		$(".login_form").fadeOut(500)
		$(".blocker").hide()
		$("#login_ip_1").val("")
		$("#login_ip_2").val("")
		$(".blocker").hide()
		$(".invoice").css("z-index","2")
	}
	else {
		switch_login_form("login") //to change login form for login and not create
		$(".invoice").hide()
		if (chk_cookie()) {alert("Already logged in, logout first to change acc");return}
		$(".login_form").fadeIn(500)
		$(".blocker").show()
		$("#login_ip_1").val("")
		$("#login_ip_2").val("")
	}
}



switch_login_form=(type="")=>{
	if (type=="login") {
		$("#login_head").text("Login")
		$("#login_submit_btn").attr("onclick","fetch_creds('login')");
		$("#login_text_3").show()
		return
	}
	$("#login_head").text("Create Account")
	$("#login_submit_btn").attr("onclick","fetch_creds('create')");
	$("#login_text_3").hide()
}

chk_cookie=()=>{
	let a=document.cookie
	if (a.includes("Bzwala")) {
		$("#logout_btn").fadeIn(800)
		$("#navbar_logreg").hide()

		return true
	}
	else {$("#navbar_logreg").show();return false}
}

fetch_creds=(type)=>{
	// alert("Login type:"+type)
	var a=$("#login_ip_1").val()
	var b=$("#login_ip_2").val()
	$("#login_ip_1").val("")
	$("#login_ip_2").val("")

	$.post("/validate.php", {type:type,a:a,b:b},
	function(data, status){
		// alert(data)
		if (data=="login_success" || data=="new_acc_success") {
			show_login("hide")
			$("#logout_btn").fadeIn(800)
			$("#navbar_logreg").hide()
			$("#login_form_hidden_text").hide()
		}
		else if (data=="logout_success") {$("#logout_btn").fadeOut(500);$("#navbar_logreg").fadeIn(200)}
		else if (data=="user_already_exist") {
			$("#").val("")
		}
		else if (data=="cookie_not_exist" || data=="login_fail") {
			$("#login_ip_1").val("")
			$("#login_ip_2").val("")
			$("#login_form_hidden_text").show()
		}
	}
	);

}

left_panel_toggle=(button=false)=>{
	if (button==true) {
		// alert("opening panel")
		$(".right_display_0").hide()
		$(".right_display").css("width","80%")
		//media query width chk
		if ($(window).width()<=500){
			$(".left_vertical_panel").hide()
			$(".right_display").css("width","100%")
			$("#cat_selector_mob_dropdown").show()
		}
		else {$(".left_vertical_panel").fadeIn(1000)}
	}
	else {
		// alert("closing panel")
		$(".right_display_0").hide()
		$(".left_vertical_panel").hide()
		$(".right_display").css("width","100%")
	}
}

msg_box=(msg,speed=300)=>{
	$("#msg_box_text").text(msg)
	$(".msg_box").fadeIn(speed)
}

remove_msg_box=(speed=600)=>{ $(".msg_box").fadeOut(speed) }

disp_tnc=(name)=>{
	if (name=="tnc") {$(".right_display").load("terms_conditions.html");scroll_view("right_display_main")}
	else if (name=="pp") {$(".right_display").load("privacy_policy.html");scroll_view("right_display_main")}
	else if (name=="rp") {$(".right_display").load("refund_policy.html");scroll_view("right_display_main")}
}
