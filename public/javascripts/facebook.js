window.fbAsyncInit = function() {
				FB.init({
					appId      : '1301395986543748',
					cookie     : true,  // enable cookies to allow the server to access 
										// the session
					xfbml      : true,  // parse social plugins on this page
					version    : 'v2.8' // use graph api version 2.8
				});
			};

			(function(d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s); js.id = id;
				js.src = "//connect.facebook.net/en_US/sdk.js";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));


			function checkLoginState() {
				FB.getLoginStatus(function(response) {
					statusChangeCallback(response);
					console.log("-------------------------------");
					console.log(response);
					console.log("-------------------------------");
				});
			}

			function statusChangeCallback(response) {
				console.log('statusChangeCallback');
				console.log(response);
				// The response object is returned with a status field that lets the
				// app know the current login status of the person.
				// Full docs on the response object can be found in the documentation
				// for FB.getLoginStatus().
				if (response.status === 'connected') {
					// Logged into your app and Facebook.
					alert('Logged.');
					testAPI();
				} else {
					// The person is not logged into your app or we are unable to tell.
					//document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
					alert('Please log into this app.');
				}
			}