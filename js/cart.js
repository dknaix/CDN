$( document ).ready(function() {
	console.log( "Cart Loaded!" );
	try {parent.daddy_u_there()} //parent chk
	catch (e) {location.replace("/404.html");return}

	global_total=0
	global_eligible=false
	global_trackid="0"
	global_dmd_total=0
	fetch_items_by_id()
	// getOS()
	// getBrowser()
	// fetch_items()

	$('select').on('change', function() { //evt listner for on change for select
		// alert( "Will re calc val" );
		fetch_items_from_cart(true) //fetch and update new qty
		fetch_items_by_id(true,true)//just count new total
		// alert("New global total="+global_total)
		$(".sub_total_text").text("Sub Total: ₹"+global_total)
		$("#eligibility_text_2").html("")

		if (global_total>=2000) {global_eligible=true;$("#eligibility_text_2").html("<br>POD Unavailable for orders above 1999")}

		let considerate_total= global_total-global_dmd_total
		// alert("Considerate total="+global_total+"-"+global_dmd_total+"="+(parseInt(global_total)-parseInt(global_dmd_total)))

		if (considerate_total>550) {global_eligible=true;$(".eligibility_text").html("Your Order is <b>Eligible</b> for <b>Free Home Delivery</b>")}
		else if(global_total>=300 && global_total<=550) {global_eligible=true;$(".eligibility_text").html("Your Order is <b>Eligible</b> for Home Delivery")}
		else if(global_total>550) {global_eligible=true;$(".eligibility_text").html("Your Order is <b>Eligible</b> for Home Delivery")}
		else {global_eligible=false;$(".eligibility_text").html("Your Order is <b>Not Eligible</b> for Home Delivery")}
	});


});

function val_email(data) {
	var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	if (data.match(validRegex)) {return true;}
	else {return false}
}

//common fn for 2 opr (using arg)
fetch_items_by_id=(for_invoice=false,only_total=false)=>{
	//fetch localStorage data
	let temp=localStorage.getItem("cart")
	if (temp==null) {
		console.log("cart empty")
		itemXCount=[]
		$(".empty_cart").show()
		$("#sub_total_text_btn").prop('disabled', true);

		$(".cart_header_conatiner").hide()
		$(".sub_total_conatiner").hide()

		return}

	else{
		$(".empty_cart").hide()
		$("#sub_total_text_btn").prop('disabled', false);
		$(".cart_header_conatiner").show()
		$(".sub_total_conatiner").show()
	}
	temp=temp.split("--")
	// alert("split TEMp "+temp)
	var temp2=[] //just item arr
	var temp3=[] //just count array
	for (var i = 0; i < temp.length; i++) {
		let a=temp[i]
		a=a.split("x")
		temp2.push(a[0])
		temp3.push(a[1])
	}

	//now sending post to fetch item details by itemid only no count
	$(".invoice_table td").remove()
	$(".rmv_me").remove()
	var total=0
	$.ajaxSetup({async:false}) //to properly calc total, all post must be in sync
	global_dmd_total=0
	for (var j = 0; j < temp2.length; j++) {
		if (temp2[j]=="") {continue}//patch to prevent empty post req and cause err
		$.post("/validate.php", {fetch_items_by_id:temp2[j]},
			function(data, status){
				// alert(data);


				let data0=data.split("--")
				if (data0.length<=1) {return} //no data
				$(".place_order_btn_cart").show()
				if ($(window).width()<=500){
					$(".place_order_btn_cart").hide()
					console.log("Width < hiding btn")
				}
				//dynamic divvisior here
				let dyn_divisor=7
				let iters=data0.length/dyn_divisor
				for (var i = 0; i < iters; i++) {
					let a=data0[0+(dyn_divisor*i)]
					let b=data0[1+(dyn_divisor*i)]
					let c=data0[2+(dyn_divisor*i)]
					let d=data0[3+(dyn_divisor*i)]
					let e=data0[4+(dyn_divisor*i)]
					let f=data0[5+(dyn_divisor*i)]
					let g=temp3[j]
					let h=data0[6+(dyn_divisor*i)]
					total+= parseInt(e)*temp3[j]

					if (d=="Cigarettes") {global_dmd_total+= parseInt(e)*temp3[j]} //calc dmd to subs later

					if (for_invoice==false && only_total==false) {item_injector(a,b,c,d,e,f,g,h)}
					else if(for_invoice==true && only_total==false) {b=b+' '+h;invoice_item_injector(a,b,c,d,e,f,g)}
					else {}//for only total no injection
				}
			}
		);
	}
	$.ajaxSetup({async:true})
	global_total=total
	if (global_total==0 || global_total=="0") { //show empty cart if total 0
		itemXCount=[]
		$(".empty_cart").show()
		$("#sub_total_text_btn").prop('disabled', true);


		$(".cart_header_conatiner").hide()
		$(".sub_total_conatiner").hide()
	}
	$(".sub_total_text").text("Sub Total: ₹"+global_total)

	//change eligible text
	$("#eligibility_text_2").html("")
	if (global_total>=2000) {global_eligible=true;$("#eligibility_text_2").html("<br>POD Unavailable for orders above 1999")}

	let considerate_total= global_total-global_dmd_total
	// alert("Considerate total="+global_total+"-"+global_dmd_total+"="+(parseInt(global_total)-parseInt(global_dmd_total)))

	if (considerate_total>550) {global_eligible=true;$(".eligibility_text").html("Your Order is <b>Eligible</b> for <b>Free Home Delivery</b>")}
	else if(global_total>=300 && global_total<=550) {global_eligible=true;$(".eligibility_text").html("Your Order is <b>Eligible</b> for Home Delivery")}
	else if(global_total>550) {global_eligible=true;$(".eligibility_text").html("Your Order is <b>Eligible</b> for Home Delivery")}
	else {global_eligible=false;$(".eligibility_text").html("Your Order is <b>Not Eligible</b> for Home Delivery")}

	if (only_total==true) {return}
	if (for_invoice==true) {invoice_item_injector(a="",b="",c="",d="",e="",f="",g="",total)} //not using a,b,.. as they are block vars (let a=)
}

item_injector=(a,b,c,d,e,f,g,h="")=>{

	// alert("Recv "+a+b+c+d+e+f)
	let item_id=a
	let b_name=a+"_sign_btn_cart"
	item_id=item_id+"_item"

	let ip_id=a+"_cart_inp"
	let td_id=a+"_cart_td"
	let td_del=a+"_cart_del"
	let new_allin_one=b+" "+h+'<br>'+c+' - '+d+'<br>₹'+e
	// if (b.length>=24) {b=b.slice(0,20);b=b+"..."} //The string ... slicer

	client_item_holder='<td ><img src="'+f+'" alt="'+b+'"></td><td id="'+td_id+' " class="all_in_one_td">'+new_allin_one
	// client_item_holder+='<br><button class="item_box_input_signs" name='+b_name+' onclick="inc_dec_cart(\'-\',this)">-</button><input id="'+ip_id+'" type="number" value="'+g+'"><button class="item_box_input_signs" name='+b_name+' onclick="inc_dec_cart(\'+\',this)">+</button></td>'
	client_item_holder+='<br><label class="td_txt_2">QTY&nbsp</label><select id="'+ip_id+'"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option> </select>'
	client_item_holder+='<label class="td_txt_3" id="'+td_del+'" onclick="delete_item_cart(this)">&nbsp| Delete item</label></td>'

	y=$('<tr></tr>')
	y.append(client_item_holder)
	// alert("loc:"+loc)
	$(".cart_table").append(y)
	$("#"+ip_id).val(g)
}







gen_invoice=()=>{
	if (global_eligible==false) {
		msg_box("Minimum Order is ₹300")
		return
	}
	$(".blocker").fadeIn(500)
	$(".invoice").fadeIn(500)
	fetch_items_from_cart()
}


//this fn only updates localStorage if any and calls 2in1 fetch fn above
fetch_items_from_cart=(on_select_change=false)=>{
		var id=""
		var count=0
		var temp_str=""
	//will fetch items from cart table not local storage, to chk changes if any
	$(".cart_table tr td").each(function() {
			// alert("iter called")
			var a=$(this).find("select").val()
			if (a!=undefined) {count=a}
			var b=$(this).attr("id")
			if (b!=undefined) {
				id=b.split("_")
				id=id[0]
				// alert("Will send item x count"+id+"x"+count)
				temp_str+=id+"x"+count+"--"
			}

		}
	);
	//update local storage
	temp_str=temp_str.slice(0,-2);
	// alert("temp_str= "+temp_str)
	localStorage.removeItem("cart");
	localStorage.setItem("cart", temp_str);
	console.log("new local: "+localStorage.getItem('cart'))
	if (on_select_change==false) {fetch_items_by_id(true)} //only to gen invoice not onchange
	else{}//if on_select is true, just update and calc total
}


invoice_item_injector=(a,b,c,d,e,f,g,total="")=>{
	// alert("Invoice h recv"+h)
	// alert("Recv "+a+b+c+d+e+f)

	//block for final total td (out of for loop td)
	if (total!="") {
		// alert("total recvd="+total)
		// b,c,d,f,g=""
		b="<b>Total</b>"
		e="<b>"+total+"</b>"
	}

	//name assignments for unique identification id+identifier
	let item_id=a
	let b_name=a+"_sign_btn_cart"
	item_id=item_id+"_item"
	let ip_id=a+"_cart_ip"
	// if (b.length>=24) {b=b.slice(0,20);b=b+"..."} //The string ... slicer

	//code to add extra 2 tr, at final total
	if (total!="") {
		let considerate_total=parseInt(global_total)-parseInt(global_dmd_total)
		// alert("Considerate total="+global_total+"-"+global_dmd_total+"="+(parseInt(global_total)-parseInt(global_dmd_total)))
		if (considerate_total>550) {var charge="0"}
		else if(global_total>=300 && global_total<=550) {var charge="40"}
		else {var charge="40"}
		e=parseInt(total)+parseInt(charge)  //add additional charges to total
		client_item_holder='<td><b>Delivery Charge</b></td><td>'+g+'</td><td>'+d+'</td><td>'+charge+'</td>'
		y=$('<tr class="rmv_me"></tr>')
		y.append(client_item_holder)
		$(".invoice_table").append(y)

		client_item_holder='<td><b>Permit Charge</b></td><td>'+g+'</td><td>'+d+'</td><td>5</td>'
		e=parseInt(e)+parseInt('5') //add additional charges to total
		e="<b>"+e+"</b>"
		y=$('<tr class="rmv_me"></tr>')
		y.append(client_item_holder)
		// alert("loc:"+loc)
		$(".invoice_table").append(y)
	}

	client_item_holder='<td>'+b+'</td>'
	client_item_holder+='<td>'+g+'</td><td>'+d+'</td><td>'+e+'</td>'

	y=$('<tr class="rmv_me"></tr>')
	y.append(client_item_holder)
	// alert("loc:"+loc)
	$(".invoice_table").append(y)

}

close_invoice=()=>{
	$(".blocker").fadeOut(500)
	$(".invoice").fadeOut(300)
	$(".invoice td").remove()
}


close_otp=()=>{
		$(".blocker").fadeOut(500)
		$(".otp_box").fadeOut(500)
}

delete_item_cart=(item)=>{
	let id="#"+item.id //for jquery reomve
	item=item.id
	item=item.split("_")
	item=item[0]
	// alert("Item is :"+item)
	old_cart_storage=localStorage.getItem("cart")
	old_cart_storage=old_cart_storage.split("--")
	var temp_str=""
	for (var i = 0; i < old_cart_storage.length; i++) {
		var temp=old_cart_storage[i]
		temp=temp.split("x")
		temp=temp[0]
		// alert("New extracted ids "+temp)
		if (temp==item) {}
		else {
			temp_str=temp_str+old_cart_storage[i]+"--"
		}
	}
	temp_str=temp_str.slice(0,-2);
	// alert("temp_str_new="+temp_str)
	localStorage.removeItem("cart");
	localStorage.setItem("cart", temp_str);
	console.log(localStorage.getItem("cart"))
	chk_ss()
	$(id).parent().parent().fadeOut(600)
	setTimeout(function(){ switch_pg('cart') }, 600);

	let empty_chk=localStorage.getItem("cart") //snipper for show empty cart after all-del item from cart
	empty_chk=empty_chk.split("--")
	console.log("Empty chk:"+empty_chk+" length:"+empty_chk.length)
	if (empty_chk.length<=0) {
		console.log("cart empty")
		itemXCount=[]
		$(".empty_cart").show()
		$("#sub_total_text_btn").prop('disabled', true);

		$(".cart_header_conatiner").hide()
		$(".sub_total_conatiner").hide()
		}
}

reset=()=>{
	$(".invoice").hide();
	$(".blocker").fadeOut(500);
}

gen_otp=()=>{
	$("#contact_ip1_hidden_text").hide()
	$("#contact_ip2_hidden_text").hide()
	// console.log("WIll gen otp now")
	let date=new Date()
	date=date.getTime() //gen timestamp

	//need validation here
	var email=$("#invoice_ip_2").val()
	if (val_email(email)==false) {$("#contact_ip2_hidden_text").show();return}
	var ph=$("#invoice_ip_1").val()

	$.post("/validate.php", {timestamp:date,genotp:ph},
		function(data, status){
			data_new=data.split("--")
			if (data=="user_not_logged_in") {show_login()}
			else if (data=="ph_already_verified") {place_order()} //do nothing
			else if (data=="ph_already_registered") {$("#contact_ip1_hidden_text").fadeIn(300);$("#invoice_ip_1").val("")}
			else if (data=="otp_spaming_blocked") {reset();msg_box("Your have exceeded the maximim daily limit of OTP verification, retry after some time...")}
			else if(data_new[0]=="otp_send_success"){
				$(".invoice").hide()
				$(".otp_box").show()
				track_id=data_new[1]
				console.log("Got Trackid: "+track_id)
			}
			else{}//criticalerror
		}
	);

}


send_otp=()=>{
	$("#otp_box_hidden_text").hide(300)

	let date=new Date()
	date=date.getTime()

	let a=$("#otp_resp_ip").val()
	console.log("length of otp:"+a.length)
	if (a.length!=7) {
		$("#otp_box_hidden_text").fadeIn(300)
		$("#otp_resp_ip").val("")
		return
	}
	$.post("/validate.php", {timestamp:date,track_id:track_id,respotp:a},
		function(data, status){
			if (data=="otp_verify_success") {
				$(".otp_box").hide()
				$(".invoice").show()
				$("#otp_resp_ip").val("")
				$("#invoice_ip_1").prop('disabled', true); //once otp verified lock ph info
			}
			else if (data=="otp_incorrect_err") {$("#otp_box_hidden_text").fadeIn(300);$("#otp_resp_ip").val("")}
			else if (data=="otp_expired_err") {msg_box("Otp expired try again in some time");$(".otp_box").hide();$(".blocker").hide()}
		}
	);
}



place_order=()=>{
	//email validation 2nd time
	$("#contact_ip2_hidden_text").hide()
	var email=$("#invoice_ip_2").val()
	if (val_email(email)==false) {$("#contact_ip2_hidden_text").show();return}

	let date=new Date()
	date=date.getTime() //gen timestamp
	// alert("got Global total="+global_total)
	var items=localStorage.getItem("cart")
	// items=String(items)
	// alert("items="+items)
	items=items.replace(new RegExp("--", "g"),"^^") //without g flag will replace only one occurance
	// alert("after items="+items)

	let d=$("#invoice_ip_0").val() //d is top as its added later, dont change me
	let a=$("#invoice_ip_1").val()
	let b=$("#invoice_ip_2").val()
	let c=$("#invoice_ip_3").val()


	if (a.length!=10) {alert("Invalid Contact Length");return}


	$.post("/validate.php", {timestamp:date,items:items,total:global_total,d:d,a:a,b:b,place_order:c},
		function(data, status){
			// alert(data)
			if (data=="user_not_logged_in") {show_login()}
			else if(data=="order_que_sucess"){
				$("#invoice_ip_1").val("") //remove ip data only is order sucess
				$("#invoice_ip_2").val("")
				$("#invoice_ip_3").val("")
				close_invoice()
				msg_box("Your Order has been placed Successfully!!!")
				$("#invoice_ip_1").prop('disabled', false);
			}
			else {console.log("Unk err")}
		}
	);
}
