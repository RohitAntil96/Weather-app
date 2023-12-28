const userTab= document.querySelector("[data-userWeather]")
const searchTab= document.querySelector("[data-searchWeather]")
const userContainer= document.querySelector(".weather-container")

const grantAccessContainer= document.querySelector(".grant-location-container")
const searchForm= document.querySelector("[data-searchForm]")
const loadingScreen= document.querySelector(".loading-container")
const userInfoContainer= document.querySelector(".user-info-container")
const errorImage= document.querySelector(".error-img")

// initial variables needs
let currentTab= userTab;
const API_KEY= "bf63aefc8340923f58796ef59ee73eff";
currentTab.classList.add("current-tab");
getCoordinatesFromStorage();


// switching tab
function switchTab(clickedTab){

    if(clickedTab!= currentTab){
        currentTab.classList.remove("current-tab");
        currentTab= clickedTab;
        currentTab.classList.add("current-tab");
    }
    if(!searchForm.classList.contains("active")){
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");

        // get coordinates(or display your weather tab)
        getCoordinatesFromStorage();
    }
}

userTab.addEventListener('click',()=>{

    // pass clicked tab as input parameter
    switchTab(userTab);
})

searchTab.addEventListener('click',()=>{

   // pass clicked tab as input parameter
   switchTab(searchTab);
})

// get coordinates from session storage
function getCoordinatesFromStorage(){
    const localCoordinates= sessionStorage.getItem('userCoordinates');
    if(!localCoordinates){
        // if we don't have local coordinates
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates= JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

async function fetchUserWeatherInfo(coordinates){
    const{lon,lat}= coordinates;

    // make grantAccessContainer invisible
    grantAccessContainer.classList.remove("active");
    
    // make loading png visible
    loadingScreen.classList.add("active");

    // API CALL
    try{
 
        // const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data= await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
    }
    catch(e){
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.remove("active");
            console.log("Error occured while fetching weather api");
    }
}

function renderWeatherInfo(weatherInfo){
  // firstly fetch the element in which we insert the value

    const cityName= document.querySelector("[data-cityName]");
    const countryIcon= document.querySelector("[data-countryIcon]");
    const desc= document.querySelector("[data-weatherDesc]");
    const weatherIcon= document.querySelector("[data-weatherIcon]");
    const temp= document.querySelector("[data-temp]");
    const windspeed= document.querySelector("[data-windspeed]");
    const humidity= document.querySelector("[data-humidity]");
    const cloudiness= document.querySelector("[data-cloudiness]");


    // now fetch the info from api and store in the UI element
    // store weather in UI

    if(weatherInfo?.cod == '401' || weatherInfo?.cod == '404'){
        userInfoContainer.classList.remove("active");
        errorImage.classList.add("active");
    }

    cityName.innerText= weatherInfo?.name;
    countryIcon.src= `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText= weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText= `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText= `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText= `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText= `${weatherInfo?.clouds?.all} %`;
}

// allow to get user location

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("your browser doesn't support this feature");
    }
}

function showPosition(position){
 const userCoordinates={
    lat: position.coords.latitude,
    lon: position.coords.longitude,
}

// store value in session storage
sessionStorage.setItem('userCoordinates',JSON.stringify(userCoordinates));
fetchUserWeatherInfo(userCoordinates);
}


const grantAccessButton= document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener('click',getLocation);


// search for city
const searchCity= document.querySelector("[data-searchInput]");

searchForm.addEventListener('submit',(e)=>{

    e.preventDefault();
    let cityName= searchCity.value;
    if(cityName===""){
        return;
    }
    else{
        fetchCityWeather(cityName);
    }
        
})

async function fetchCityWeather(city){

       loadingScreen.classList.add("active");
       userInfoContainer.classList.remove("active");
       grantAccessContainer.classList.remove("active");
       errorImage.classList.remove("active")
       

       try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
       }
       catch(e){
        alert('error occur while fetching city api');
       }
}
