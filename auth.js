(function(){

var hash = location.hash,
    AuthButton = {  

    button: null,

    render: function (options) {
      if (!this.button) {
        var makeButton = document.createElement('button');
        makeButton.id = "Auth_button";
        makeButton.innerText = "Auth";       
        this.button = makeButton; 
        this.button.addEventListener("click", this.handler); 
        document.body.appendChild(makeButton);
      }      
    },
    handler: (e) => {
        console.log(this);
        var options = {};
        var API = "https://oauth.vk.com/authorize?",
            oAuth = options.app || "5885886",
            scope = options.scope || "wall,friends",
            redirect = options.redirect || `unstoo.github.io/vkauth/`,
            display = options.display || "popup";

        // oAuthWindow = window.open(
        //   `${oAuth}&${scope}&${redirect}&${display}&v=5.52&response_type=token`
        // );
        location = `${API}client_id=${oAuth}&scope=${scope}&redirect_uri=${redirect}&$display={display}&v=5.52&response_type=token`;
    } ,
    removeHandler: () => {        
        this.button.removeEventListener("click", this.handler);
    }
};

if (hash) { 
  var user = {},
      key_value = [];

  hash = hash.slice(1, hash.length);    
  hash = hash.split('&');
  
  hash.forEach((value, i) => {
      key_value = value.split("=");
      user[key_value[0]] = key_value[1];
  });   

  var keysOfInterest = ['access_token', 'user_id'];

} else {
  AuthButton.render();
} 

}()); // IIFE