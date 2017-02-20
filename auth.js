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
  
  // JSONP injection to workaround CORS restrictions.
  var JSONP = { 
    getFriends: function(friendsCount) {
      
      this.initBoilerplate();

      // Inject JSONP requests.
      // Client name.
      var query = `https://api.vk.com/method/users.get?user_ids=${localStorage.user_id}&&v=5.52&callback=JSONPCBClient`;
      var script = document.createElement('script');
      script.src = query;
      document.head.appendChild(script);

      // Friends.
      var queryFriends = `https://api.vk.com/method/friends.get?fields=true&order=random&count=${friendsCount}&v=5.52&access_token=${localStorage.access_token}&callback=JSONPCBFriends`;
      var script = document.createElement('script');
      script.src = queryFriends;
      document.head.appendChild(script);      
    },

    initBoilerplate: function() {      
      // Friends object resides in global namespace. 
      friends = [],
      friends.parent = "";

      // Private vars
      var list = document.getElementById('friends');
      var client = document.getElementById('client');
      // Public method
      friends.render = function() {
        client.innerHTML = friends.parent;      
        friends.forEach( (friend) =>  list.innerHTML += `<li>${friend}</li>` );
    } 
      
      // Append callbacks for JSONP response processing. 
      // Client's name.
      var callbackClient = document.createElement('script');
      callbackClient.innerHTML = `function JSONPCBClient(result) {
          friends.parent = result.response[0].first_name + " " + result.response[0].last_name;
      }`;
      document.head.appendChild(callbackClient);

      // Friends.
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

  // Main logic.
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

    // No token.
    AuthButton.render();
  } 
}());