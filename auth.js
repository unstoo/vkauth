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
                oAuth =  "5885886",
                scope = "wall,friends",
                redirect = "unstoo.github.io/vkauth/",
                display = "popup",
                v = "5.52";   
            location = `${API}client_id=${oAuth}&scope=${scope}&redirect_uri=${redirect}&$display={display}&v=${v}&response_type=token`;
        }           
    };  
  
  var JSONP = { 
    getFriends: function() {
      window.friends = [];
      this.appendJSONPcb();
      var query = `https://api.vk.com/method/friends.get?fields=true&order=random&count=5&v=5.52&access_token=1205819480d97eecb9123072c6d3ff63b9cac2b75cbdc6206e275a1e90e99140c937942870d37784d776b&callback=jsonpCb`
      var script = document.createElement('script');
      script.src = query;
      document.getElementsByTagName("head")[0].appendChild(script);
      this.renderFriends();            
    },

    appendJSONPcb: function() {      
      var callback = document.createElement('script');
      callback.innerHTML = `function jsonpCb(result) { 
        result.response.items.forEach( el => { 
          window.friends.push(el.first_name + " " + el.last_name );
          } 
        )}`;
      document.head.appendChild(callback);
    },

    renderFriends: function() {
      console.log('rendering...', friends);

      var ul = document.createElement('ul');
      ul.id = "friends";
        window.friends.forEach( friend => ul.innerHTML = `<li>${friend}</li>` );
    }
  };
  
  var hash = location.hash;
  location.hash = "";

  // Token is already stored.
  if(window.localStorage.access_token) { 

    JSONP.getFriends();

  // Initial authorization.
  } else  if (hash.includes("access_token")) {

    // Save authorization response to localStorage.
    var keyValuePair = [];
    hash = hash.slice(1, hash.length);    
    hash = hash.split('&');    
    hash.forEach( value => {
        keyValuePair = value.split("=");
        window.localStorage[keyValuePair[0]] = keyValuePair[1];
    });    

    JSONP.getFriends();
  
  // In absence of a token in any form.
  } else {
    AuthButton.render();
  } 
}());