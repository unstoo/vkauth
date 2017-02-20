(function(){
  var AuthButton = {  
        button: null,
        render: function() {    
            console.log(42);  
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
  var friends = { 
    render: function() {

    }
  };
  
  var hash = location.hash;

  if (hash.includes("access_token") || window.localStorage.access_token) { 
    var keyValuePair = [];
    hash = hash.slice(1, hash.length);    
    hash = hash.split('&');
    
    hash.forEach( value => {
        keyValuePair = value.split("=");
        window.localStorage[keyValuePair[0]] = keyValuePair[1];
    });

    console.log(window.localStorage); 

    var keysOfInterest = ['access_token', 'user_id'];

  } else {
    AuthButton.render();
  } 

}());