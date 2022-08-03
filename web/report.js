let src=["./draw.js","./tontoff.js","./UsageData.js","./SavingsData.js"];
		function Do(){
			console.log("internet");
			let x=document.createElement("script");
			x.src="https://www.gstatic.com/charts/loader.js";
			document.body.appendChild(x);
			setTimeout(()=>{
				src.forEach((a)=>{
				let x=document.createElement("script");
				x.src=a;
				document.body.appendChild(x);
			});
			},500);
		}
		$(document).ready(function () {
  		try {
			$.ajax({
      		  url: "http://google.com",
       		 dataType: 'jsonp',
       		 jsonpCallback: Do,
        	 jsonp: false,
    		});
 		 }
		catch (err) {
 		   console.log(err.message);
  		} 
		});