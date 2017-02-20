(function(){

  var AuthButton = {  
        render: function() {  
            var button = document.createElement('button');
            button.id = "Auth_button";
            button.innerText = "Auth";       
            button.addEventListener("click", this.handler);   
            document.body.appendChild(button);  
        },

        handler: function() {
            var API = "https://oauth.vk.com/authorize?",
                app =  "5885886",
                scope = "wall,friends",
                redirect = "unstoo.github.io/vkauth/",
                display = "popup",
                v = "5.52";   
            window.location = `${API}client_id=${app}&scope=${scope}&redirect_uri=${redirect}&$display={display}&v=${v}&response_type=token`;
        }           
    };  
  
  // JSONP injection to workaround CORS restrictions applied by Github pages.
  var JSONP = { 
    getFriends: function(friendsCount) {
      
      this.initBoilerplate();
      
      // Get client name
      var query = `https://api.vk.com/method/users.get?user_ids=${localStorage.user_id}&&v=5.52&callback=JSONPCBClient`;
      var script = document.createElement('script');
      script.src = query;
      document.head.appendChild(script);

      // Get friends
      var queryFriends = `https://api.vk.com/method/friends.get?fields=true&order=random&count=${friendsCount}&v=5.52&access_token=1205819480d97eecb9123072c6d3ff63b9cac2b75cbdc6206e275a1e90e99140c937942870d37784d776b&callback=JSONPCBFriends`;
      var script = document.createElement('script');
      script.src = queryFriends;
      document.head.appendChild(script);
      
    },

    initBoilerplate: function() {
      
      // Friends object in global namespace 
      friends = [];

      // Private vars
      var list = document.getElementById('friends');
      var client = document.getElementById('client');

      friends.render = function() {
        client.innerHTML = friends.parent;      
        friends.forEach( (friend) =>  list.innerHTML += `<li>${friend}</li>` );
    } 
      
      // Inject JSONP callbacks that extracts names and invokes render method in async fashion. 
      // Details of a client.
      var callbackClient = document.createElement('script');
      callbackClient.innerHTML = `function JSONPCBClient(result) {
          friends.parent = result.response[0].first_name + " " + result.response[0].last_name;
      }`;
      document.head.appendChild(callbackClient);

      // Details of friends.
      var callbackFriends = document.createElement('script');
      callbackFriends.innerHTML = `function JSONPCBFriends(result) { 
        result.response.items.forEach( el => { 
          friends.push(el.first_name + " " + el.last_name);
        });                  
        friends.render();
      }`;
      document.head.appendChild(callbackFriends);
    }    
  };
  

  // Main logic
  var hash = location.hash;
  location.hash = "";
  var friendsCount = 5;
 
  if(window.localStorage.access_token) {

    // Token is already stored.
    JSONP.getFriends(friendsCount);
  
  } else  if (hash.includes("access_token")) { 
    // Initial authorization.
    // Save token and other data to localStorage.
    var keyValuePair = [];
    hash = hash.slice(1, hash.length);    
    hash = hash.split('&');    
    hash.forEach( value => {
        keyValuePair = value.split("=");
        window.localStorage[keyValuePair[0]] = keyValuePair[1];
    });    

    JSONP.getFriends(friendsCount);  
  
  } else {      
    // In absence of a token in any form show the button.
    AuthButton.render();
  } 
}());