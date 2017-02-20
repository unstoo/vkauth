(function(){
  function JSONPcb(result) {
          console.log(result)
      }

  var AuthButton = {  
        button: null,
        render: function() {  
            var makeButton = document.createElement('button');
            makeButton.id = "Auth_button";
            makeButton.innerText = "Auth";       
            makeButton.addEventListener("click", this.handler); 
            this.button = makeButton;  
            document.body.appendChild(this.button);  
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
      var query = `https://api.vk.com/method/friends.get?fields=true&order=random&count=5&v=5.52&access_token=1205819480d97eecb9123072c6d3ff63b9cac2b75cbdc6206e275a1e90e99140c937942870d37784d776b&callback=JSONPcb`
      var script = document.createElement('SCRIPT');
      script.src = query;
      document.getElementsByTagName("head")[0].appendChild(script);            
    },
  };
  
  var hash = location.hash;
  location.hash = "";

  if(window.localStorage.access_token) { 

    JSONP.getFriends();

  } else  if (hash.includes("access_token")) {

    var keyValuePair = [];
    hash = hash.slice(1, hash.length);    
    hash = hash.split('&');
    
    hash.forEach( value => {
        keyValuePair = value.split("=");
        window.localStorage[keyValuePair[0]] = keyValuePair[1];
    });    
    console.log(window.localStorage);
    JSONP.getFriends();

  } else {

    AuthButton.render();

  } 
}());