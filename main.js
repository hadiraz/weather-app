const apiKey = "40df4b7149b88609d86e544c6283abf8";
const mainItemsBox = document.querySelector(".app-weather-items");
const allItems = document.querySelectorAll(".app-weather-item");
const submitBtn = document.querySelector(".submit-btn");
const errorBox = document.querySelector(".error");
let saveBtn = document.querySelectorAll(".save-btn");
let removeBtn = document.querySelectorAll(".remove-btn");
let localSaves;
alert("* If the contents are not loaded please turn on VPN *")
saveBtn.forEach(function(item,index){
    item.addEventListener("click" , event => saveCity(event));
});
removeBtn.forEach(function(item,index){
    item.addEventListener("click" , event => removeCity(event));
});
window.addEventListener("load",getApiData("tehran"))
submitBtn.addEventListener("click" , event => getApiData());
(function(){
    localSaves = JSON.parse(localStorage.getItem("saved_cities"));
    localSaves.forEach(function(item,index){
        getApiData(item);

    })
    
})()
async function getApiData (customInput=null){
    let input ; 
    let setClass = 0;
    if(customInput != null){
        input = customInput
    }else{
        input = document.querySelector(".input-box").value; 
    }
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${apiKey}&units=metric`;
    if(customInput!==null){
        setClass = 1
    }
    try{
        fetch(url)
        .then((response) => response.json())
        .then(weatherInfo => addItems(weatherInfo,setClass))
        .catch(() => {""});
    } catch{

    }
}

function addItems(data,setClass){
    let savedClass = "";
    if(data.message!="" && data.cod!=""){
        showError(data.message);
    }
    if(setClass==1){
        savedClass = "saved";
    }
    const {main , name , sys , weather} = data ;
    const weatherMain = weather[0].main ; 
    const weatherDesc = weather[0].description ;
    const weatherIcon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg` 
    const country = sys.country ;
    const {temp , temp_max , temp_min , feels_like} = main;
    const item =`
    <div class="item-top-menu">
    <i class="fas fa-bookmark save-btn ${savedClass}"></i>
    <i class="fas fa-trash-alt remove-btn"></i>
    </div>
    <span class="temp-image">
    <img src="${weatherIcon}">
    </span>
    <span class="item-city-name">
    <span class="item-city-name">
    <span class="city-country">
    <span>${country}</span>
    ,
    <span class="city-name">${name}</span> 
    </span>
    <p class="real-temp">
    <i class="fas fa-thermometer-three-quarters">
    </i> 
    ${Math.floor(temp)}
    </p>
    </span>
    </span>
    <p class="weather-desc">
    ${weatherMain}
    <span>${weatherDesc}</span>
    </p>
    <span class="city-temp">
    <span><i class="fas fa-temperature-high"></i> ${temp_max.toFixed(1)}</span>
    <span><i class="fas fa-temperature-low"></i> ${Math.floor(temp_min)}</span>
    </span>
    `;
    const spanItem = document.createElement("span");
    spanItem.className = "app-weather-item" ;
    spanItem.innerHTML = item ;
    mainItemsBox.appendChild(spanItem);
    showError("",1);
    saveBtn = document.querySelectorAll(".save-btn");
    removeBtn = document.querySelectorAll(".remove-btn");
    saveBtn.forEach(function(item,index){
        item.addEventListener("click" , event => saveCity(event));
    });
    removeBtn.forEach(function(item,index){
        item.addEventListener("click" , event => removeCity(event));
    });
}

function showError(text="",off=0){
    errorBox.style.display = "flex";
    if(text!=""){
        errorBox.innerText = text;
    }
    if(off===1){
        errorBox.style.display="none";
    }
}

function saveCity(event){
    const cityName = event.target.parentElement.parentElement.querySelector(".city-name").innerText;
    const classList = event.target.classList;
    classList.toggle("saved");
    let localSaves;
    if(localStorage.getItem("saved_cities") == null){
        localStorage.setItem("saved_cities" , JSON.stringify([]));
    }
    localSaves = JSON.parse(localStorage.getItem("saved_cities"));
    if(event.target.classList.contains("saved")){
        localSaves.push(cityName);
        localSavesSort =new Set(localSaves);
        localStorage.setItem("saved_cities" , JSON.stringify([...localSavesSort]));
    }else{
        const cityIndex = localSaves.indexOf(cityName);
        localSaves.splice(cityIndex , 1);
        localStorage.setItem("saved_cities" , JSON.stringify([...localSaves]));
    }
    
}

function removeCity(event){
    const parent = event.target.parentElement.parentElement;
    const cityName = parent.querySelector(".city-name").innerText;
    const confirmRemove = confirm(`Are you sure want to delete ${cityName} ?`);
    
    if(confirmRemove===true){
        localSaves = JSON.parse(localStorage.getItem("saved_cities"));
        const memberIndex = localSaves.indexOf(cityName) 
        localSaves.splice(memberIndex,1);
        localStorage.setItem("saved_cities",JSON.stringify(localSaves));
        parent.remove();
    }
}