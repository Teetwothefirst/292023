// $('.carousel').carousel()


const signup = document.getElementById("signupForm");
signup.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const firstName = document.getElementById("Firstname").value;
    const lastName = document.getElementById("Lastname").value;
    const password = document.getElementById("Password").value

    fetch(`http://localhost:8000/signup`, {
        method: "POST",
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify({email: email, firstName: firstName, lastName:lastName,password:password}),
    }).then(response =>  response.json())
    .then(res => {
        if(res.result === 1){
            window.location.replace("./index.html");
        }
    }).catch(err => {
             if(err === 'ERR_NETWORK'){
                window.alert("No internet connection");
            }else{
                console.log(err)
                window.alert("An error occured");
            }
    })
});

// OPEN THE DOOR
function onit(){
    const userID =  JSON.parse(localStorage.getItem("userInfo"));
    fetch(`http://localhost:8000/door`, {
        method: "POST",
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify({door: 1, email: userID?.email}),   
        mode: "cors"  
    })
    .then(response => response.json())
    .then((res)=>{
        if(res.result === 1){
            alert("Door is opened")
        }
    })
}

// CLOSE THE DOOR
function offit(){
    const userID =  JSON.parse(localStorage.getItem("userInfo"));
    fetch(`http://localhost:8000/door`, {
        method: "POST",
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify({door: 0, email: userID?.email}),   
        mode: "cors"  
    })
    .then(response => response.json())
    .then((res)=>{
        if(res.result === 1){
            alert("Door is closed")
        }
    })
}

// Reading the position of the slider
//1 is on and 0 is off
//

const slider = document.getElementById("slider");
slider.addEventListener("input", function() {
  const sliderPosition = slider.value;
  console.log("Slider position:", sliderPosition);
});
slider = document.getElementById("slider");
let isOn = false;
slider.addEventListener("input", function() {
  const sliderPosition = slider.value;
  isOn = sliderPosition >= slider.max / 2;
  console.log("Slider position:", sliderPosition, "isOn:", isOn);
});

