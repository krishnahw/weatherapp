const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[ data-searchweather]");
const userContainer = document.querySelector(".weather-container");

const grantAccesscontainer = document.querySelector(".grant-location");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


// initally variable

let currentTab = userTab;
const API_KEY = "51d423ac9f05504b4a0972a318921789";
currentTab.classList.add("current-tab");

// change tab

function switchTab(clickTab){
    if(currentTab != clickTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickTab;
        currentTab.classList.add("current-tab");


        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccesscontainer.classList.remove("active");
            searchForm.classList.add("active");
        }else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

function getfromSessionStorage(){
    const localCoordinate = sessionStorage.getItem("user-coordinate"); // Fix typo
    if (!localCoordinate) {
        grantAccesscontainer.classList.add("active");
    } else {
        const coordinate = JSON.parse(localCoordinate);
        fetchUserWeatherByCoordinate(coordinate);
    }
    
}


async function fetchUserWeatherByCoordinate(coordinate){
    const {lat, lon} = coordinate;
    grantAccesscontainer.classList.remove("active");

    loadingScreen.classList.add("active");

    try{
        const respons = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await respons.json();
        
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);

    }
    catch(err){
        // hw
        alert("An error occurred while fetching weather data. Please try again.");
    
    }
}


function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-contryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloud = document.querySelector("[data-clouds]");


    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}@2x.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText =`${weatherInfo?.main?.humidity}%`;
    cloud.innerText = `${weatherInfo?.clouds?.all}%`;

}


function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
    }else{
        // show alert
        alert("data can't be fetch");
        
    }
}

function showposition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const coordinates = { lat, lon };
    sessionStorage.setItem("user-coordinate", JSON.stringify(coordinates)); // Store valid data
    fetchUserWeatherByCoordinate(coordinates);
}


const grantAccess = document.querySelector("[data-grantAccess]");
grantAccess.addEventListener("click", getlocation)

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value.trim();
    if(cityName === ""){
         return;
    }else{

    fetchUserWeatherInfo(cityName);
    }
});

async function fetchUserWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccesscontainer.classList.remove("active");
    

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data =await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        alert("location not found");
       
    }
}
    



































// console.log(" hi ");
// const API_KEY = "51d423ac9f05504b4a0972a318921789";

// async function showWeather(city) {
//   const respons = await fetch(
//     `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
//   );

//   const data = await respons.json();
//   console.log(data.main.temp);
//   console.log("weather data:->" + data);

//   let newParagraph = document.createElement("p");
//   newParagraph.textContent = `${data.main.temp}`;
//   document.body.appendChild(newParagraph);
// }

// const button = document.querySelector(".button");

// button.addEventListener("click", () => {
//   const city = document.querySelector(".search").value.trim();
//   if (city) {
//     showWeather(city);
//   } else {
//     alert("Not available");
//   }
// });
