$( document ).ready(function() {

	global_item_holder=[]
	console.log( "Dyn-loader loaded!" );
	try {parent.daddy_u_there()} //parent chk
	catch (e) {location.replace("/404.html");return}

	$('#cat_selector_mob_dropdown').val(global_last_selected)

	$('#cat_selector_mob_dropdown').on('change', function() {
		switch_pg('catagory',this.value)
		global_last_selected=this.value

	});




	fetch_cat()

	//css switch for UI
	if( $('.right_display_0').is(':visible') ) {$(".right_display").css("border-left","10px solid #003748")}
	else{$(".right_display").css("border-left","0px solid #003748")}
	if (screen.width<500) {$(".right_display").css("border-left","10px solid #003748")} //patch for mobile
});

apply_evt_dropdown=()=>{
	$('.qty_drop').off()
	$('.qty_drop').on('change', function() {
		let temp=this.value  // 1_val_120
		temp=temp.split("_")
		let parent_id=temp[3]
		temp=temp[2] // 120
		let selector="#"+parent_id+"_rate"
		$(selector).html("<br>₹"+temp)
	});
}

notification_1=()=>{
	$('.notification_1').slideDown(1000)
	$('.notification_1').fadeOut(2000)
}

fetch_by_cat=(catg=123)=>{
	$('#cat_selector_mob_dropdown').val(catg) //change drop val
	scroll_view('main_header_text')//scroll top
	// alert("Got catg " +catg)

	//css styling for UI
	$(".right_display").css("border-left","0px solid #003748")
	if (screen.width<500) {
		$(".right_display").css("border-left","10px solid #003748")
	}

	$(".cat_box").remove()
	$(".right_display_0").hide()
	parent.left_panel_toggle(true)
	$.post("/validate.php", {fetch_items_by_cat:catg},
		function(data, status){
			// alert(data);
			let data0=data.split("--")
			if (data0.length<=1) {console.log("No Data");return}
			// console.log(data0)
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
				let g=data0[6+(dyn_divisor*i)]
				item_injector(a,b,c,d,e,f,g)
			}

		}
	);

}



fetch_cat=()=>{
	if (global_cat_holder.length>=2) {fetch_by_cat(global_cat_holder);return}
	$.post("/validate.php", {fetch_catagory:123},
		function(data, status){
			// alert(data);
			let data0=data.split("--")
			if (data0.length<=1) {return} //no data
			//dynamic divvisior here
			let dyn_divisor=2
			let iters=data0.length/dyn_divisor
			for (var i = 0; i < iters; i++) {
				let a=data0[0+(dyn_divisor*i)]
				let b=data0[1+(dyn_divisor*i)]
				catagory_injector(a,b)
			}

		}
	);
}

catagory_injector=(a,b="")=>{
	client_item_holder='<img class="cat_box_img" src="'+b+'" alt="'+a+'"></img>'
	client_item_holder=client_item_holder+'<label class="cat_name"><br>'+a+'</label>'

	y=$('<div class="cat_box" id="'+a+'" onclick="fetch_by_cat(this.id)"></div>')
	y.append(client_item_holder)
	// alert("loc:"+loc)
	$(".dynamic_body").append(y)
}


// fetch_items=()=>{ //not used
// 	alert("Items fetch called")
// 	$.post("/validate.php", {fetch_items:123},
// 		function(data, status){
// 	  	alert(data);
// 			let data0=data.split("--")
// 			if (data0.length<=1) {alert("No Data");return}
// 			//dynamic divvisior here
// 			let dyn_divisor=7
// 			let iters=data0.length/dyn_divisor
// 			for (var i = 0; i < iters; i++) {
// 				let a=data0[0+(dyn_divisor*i)]
// 				let b=data0[1+(dyn_divisor*i)]
// 				let c=data0[2+(dyn_divisor*i)]
// 				let d=data0[3+(dyn_divisor*i)]
// 				let e=data0[4+(dyn_divisor*i)]
// 				let f=data0[5+(dyn_divisor*i)]
// 				let g=data0[6+(dyn_divisor*i)]
// 				item_injector(a,b,c,d,e,f)
// 			}
//
//   	}
// 	);
// }

item_injector=(a,b,c,d,e,f,g)=>{
	//Code to remove repetaing items and merge in qty
	var new_b=b.split(" ") //KingFisher 650ml > ["King","Fisher","strong","650ml"]
	new_b=new_b.slice(0,new_b.length-1);   //removing "650ml"
	new_b=new_b.join(' '); //King Fisher Strong
	// alert("final op:"+new_b)

	if (global_item_holder.includes(new_b)) { //duplicate and appending item
		// console.log("Will skip "+new_b+" and add ml>>"+g)
		//not find its orignal div and get its selector
		let new_b_spl=new_b.split(" ")
		new_b_spl=new_b_spl[0]+" "+new_b_spl[1]
		let holder="label:contains("+new_b_spl+")"
		let finding=$(holder).attr('name')
		// alert("OG id of "+new_b+" is "+finding)
		finding=finding.split("_")
		finding=finding[0]
		var parent_id="_"+finding //for dropdown

		let val_holder=a+"_val_"+e+parent_id
		let temp_str='<option value="'+val_holder+'">'+g+'</option>'

		let selector="select[name='"+finding+"dropdown']"
		console.log("repeat brand qty "+g+" selector:"+selector)
		$(selector).append(temp_str)
		return
	}
	else{ //first time and displayed div
		global_item_holder.push(new_b)
		var parent_id="_"+a
		// $("#"+a+"_item.qty_drop").append(temp_str)
	}
	// alert("glob arr: "+global_item_holder)

	let rate_holder=a+"_rate"
	let item_id=a
	let drop_id=a+"dropdown"
	let b_name=a+"_sign_btn"
	item_id=item_id+"_item"
	if (b.length>=24) {b=b.slice(0,20);b=b+"..."} //The string ... slicer
	client_item_holder='<img class="item_box_img" src="'+f+'"></img>'
	client_item_holder=client_item_holder+'<label name="'+item_id+'"><br>'+b+'</label><label id="'+rate_holder+'"><br>₹'+e+'</label>'
	client_item_holder+='<div class="slider_div" >'
	client_item_holder+='<select class="qty_drop" name="'+drop_id+'"><option value="'+a+'_val_'+e+parent_id+'">'+g+'</option></select>'
	client_item_holder+='<button class="item_box_input_signs" name="'+b_name+'" onclick="inc_dec(\'-\',this)">-</button><input id="'+a+'" class="item_box_input" maxlength="2" value="1"></input>'
	client_item_holder+='<button class="item_box_input_signs" name="'+b_name+'" onclick="inc_dec(\'+\',this)">+</button><br><button class="add_to_cart" name="'+a+'" onclick="add_to_cart(this)">Add to Cart</button></div>'


	y=$('<div class="item_box" id="'+item_id+'"></div>')
	y.append(client_item_holder)
	// alert("loc:"+loc)
	$(".dynamic_body").append(y)
	apply_evt_dropdown()
}

inc_dec=(sign,name)=>{
	let id=name.name
	id=id.split("_")
	id=id[0] //fetch id of input
	let prechk=$("#"+id).val()
	prechk=parseInt(prechk)
	if (prechk<1) {$("#"+id).val(1);return}
	console.log("Btn press for: "+id)
	if (sign=="+") {
		let orignal=$("#"+id).val()
		orignal=parseInt(orignal)+1
		$("#"+id).val(orignal)
	}
	else {
		let orignal=$("#"+id).val()
		orignal=parseInt(orignal)-1
		if (orignal<=0) {return}
		$("#"+id).val(orignal)
	}
}

add_to_cart=(name)=>{
	let repeat_flag=false
	let item=name.name

	//get item id from selected dropdown qty_ml
	let finder=".qty_drop[name='"+item+"dropdown']"
	finder=$(finder).val()
	finder=finder.split("_")
	finder=finder[0]
	item=finder
	// alert("Got item id: "+finder)

	let val=$("#"+name.name).val()
	let itemXCount_temp=item+"x"+val
	if (itemXCount.length==0) {notification_1();itemXCount.push(itemXCount_temp);repeat_flag=true}
	else {
		for (var i = 0; i < itemXCount.length; i++) {
			//get item_id in arr
			let temp=itemXCount[i]
			temp=temp.split("x")
			temp=temp[0]
			// alert(temp)

			//get item_id in new-push
			let temp2=itemXCount_temp.split("x")
			temp2=temp2[0]
			// alert(temp2)

			if (temp==temp2){repeat_flag=true}//repeat_flag set
		}
	}

	if (repeat_flag==false){notification_1();itemXCount.push(itemXCount_temp)}
	// alert(itemXCount)

	//now stringify itemXCount array and store in localStorage
	if (itemXCount.length==1){
		itemXCount_string=itemXCount[0]
		localStorage.setItem("cart", itemXCount_string);
	}
	else {
		var temp3=""
		for (var i = 0; i < itemXCount.length; i++) {
			temp3=temp3+itemXCount[i]+"--"
		}
		temp3=temp3.slice(0,-2);
		itemXCount_string=temp3
		localStorage.setItem("cart", itemXCount_string);
	}
	// alert("Stringify "+itemXCount_string)
}
