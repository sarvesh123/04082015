	// This function is called when someone finishes with the Login
  	// Button.  See the onlogin handler attached to it in the sample
  	// code below.
  	function checkLoginState() {
    	FB.getLoginStatus(function(response) {
      		statusChangeCallback(response);
    	});
  	}

  	// This is called with the results from from FB.getLoginStatus().
  	function statusChangeCallback(response) {
    	console.log('statusChangeCallback');
    	console.log(response);
    	// The response object is returned with a status field that lets the
    	// app know the current login status of the person.
    	// Full docs on the response object can be found in the documentation
    	// for FB.getLoginStatus().
    	if (response.status === 'connected') {
      		// Logged into your app and Facebook.
      		if ( canPublish() ) {
      			postToFeed();
      		}
      		else {
      			loginFb();
      		}
    	}
    	else if (response.status === 'not_authorized') {
      		// The person is logged into Facebook, but not your app.
      		loginFb();
    	}
    	else {
      		// The person is not logged into Facebook, so we're not sure if
      		// they are logged into this app or not.
      		document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
    	}
  	}

  	// Here we run a very simple test of the Graph API after login is
  	// successful.  See statusChangeCallback() for when this call is made.
  	function postToFeed() {
    	/* make the API call */
		FB.api(
		    "/me/feed",
		    "POST",
		    {
		        "message": document.getElementById('share-message').innerHTML
		    },
		    function (response) {
		    	console.log(response);
		      if (response && !response.error) {
		        /* handle the result */
		      }
		    }
		);
	}

	function loginFb() {
		FB.login(function(response){
			if (response.status === 'connected') {
			    // Logged into your app and Facebook.
			    console.log(response.authResponse.accessToken);
			    postToFeed();
			}
			else if (response.status === 'not_authorized') {
			    // The person is logged into Facebook, but not your app.
			    alert("You need to authorize inorder to post to Facebook.");
			}
			else {
			    // The person is not logged into Facebook, so we're not sure if
			    // they are logged into this app or not.
			    alert("You need to login into Facebook.");
			}
		}, { scope: 'publish_actions' });
	}

	function canPublish() {
		FB.api( 
      		'/me/permissions',
      		'GET',
      		{},
      		function (response) {
      			if ( response.data[0].permission == 'publish_actions' ) {
      				return true;
      			}
      			else {
      				return false;
      			}
      		}
      	);
	}