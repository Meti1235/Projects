console.log("live") //API personalized key under
// https://api.openweathermap.org/data/2.5/forecast?q=skopje&units=metric&APPID=02c381cd2d2a71e1d009fd2998f2dca8

let navService = {
   
    navItems: document.getElementsByClassName("nav-item"),
    citySearchInput: document.getElementById("citySearchInput"),
    citySearchBtn: document.getElementById("citySearchBtn"),
    pages: document.getElementById("pages").children,
    temperatureToday: document.getElementById("temperatureToday"),
    temperatureWeek: document.getElementById("temperatureWeek"),
    weatherCity: document.getElementById("weatherCity"),
    hourlyWeatherCity: document.getElementById("hourlyWeatherCity"),
    hourlyResult: document.getElementById("hourlyResult"),

    activeNav: function(item){
        for (let navItem of this.navItems) {
            navItem.classList.remove("active");
        }
        item.classList.add("active");
    },
    showPages: function(page){
        for (let pageElement of this.pages) {
            pageElement.style.display = "none";
        }
        page.style.display = "block";
    }, 
    createEventListener: function(allCityNames){
        for(let i = 0; i < this.navItems.length; i++){
            this.navItems[i].addEventListener("click", function(){
                // this in addEventListener points to the item that has the event listener
                navService.activeNav(this);
                navService.showPages(navService.pages[i]);
            })
        }
        
        this.citySearchBtn.addEventListener("click", function(e){
            e.preventDefault();
           
            //we are taking the first letter of the word and Capitalizing it "S"+"kopje" we are cutting the first letter from the word and adding both parts together
         if(citySearchInput.value === ''){
           alert("Please enter a City Name")
         }
         weatherService.city = navService.citySearchInput.value[0].toUpperCase() + navService.citySearchInput.value.slice(1);
           if(!allCityNames.includes(weatherService.city)){
            return alert("Please enter a Valid! City Name")
           } 
           navService.temperatureToday.innerHTML ='';
           navService.temperatureWeek.innerHTML ='';
            weatherService.getData();
            
    })
    },

    getTemperature: function(response){
               let  tempArray = response.list
                let combinedTempArray = []
                for (i = 0; i < 8; i++) { // DAY 1
                    combinedTempArray.push(tempArray[i].main.temp_max)
                    combinedTempArray.push(tempArray[i].main.temp_min)
                   };
                let sortedTemArray = combinedTempArray.sort((a, b) => a-b)
                let highestTemperature = Math.round(sortedTemArray[sortedTemArray.length - 1])
                console.log(highestTemperature) //highest temperature
                let lowestTemperature = Math.round(sortedTemArray[0])
                console.log(lowestTemperature) //lowest temperature
                let tempTotal = 0
                for (i = 0; i < 16; i++) {
                    tempTotal = tempTotal  + combinedTempArray[i]
                       };
                let tempAverage = Math.round(tempTotal/16)
                console.log(tempAverage) // average temperature
                       //humidity
                let humidityArray = [];
                humidityArray.push = response.list
                let dailyHumidityArray = []
                for (i = 0; i < 8; i++) {
                    dailyHumidityArray.push(humidityArray.push[i].main.humidity)
                   };
                   let sortedHumidityArray = dailyHumidityArray.sort((a, b) => a-b)
                    let highestHumidity = Math.round(sortedHumidityArray[sortedHumidityArray.length - 1])
                    console.log(highestHumidity) //highest humidity
                    let lowestHumidity = Math.round(sortedHumidityArray[0])
                    console.log(lowestHumidity) //lowest humidity
                    let totalHumidity = 0
                    for (i = 0; i < 8; i++) {
                        totalHumidity = totalHumidity  + dailyHumidityArray[i]
                           };
                    let averageHumidity = Math.round(totalHumidity/8)
                    console.log(averageHumidity)
               this.weatherCity.innerHTML = `<h1>Weather for ${weatherService.city}</h1><h4> Welcome to an above average weather app! </h4>`
               this.hourlyWeatherCity.innerHTML = `<h1>Hourly Data for ${weatherService.city}</h1>`
                this.printHomeTables(highestTemperature,tempAverage,lowestTemperature,highestHumidity,averageHumidity,lowestHumidity)  
                
    },

    printHomeTables: function(highestTemperature,tempAverage,lowestTemperature,highestHumidity,averageHumidity,lowestHumidity){
        this.temperatureToday.innerHTML =
           `
           <h2>Today's Weather</h2>
           <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">Highest Temperature</th>
                <th scope="col">Average Temperature</th>
                <th scope="col">Lowest Temperature</th>
              </tr>
            </thead>
            <tbody>
              <tr>
              <td class="tableText">${highestTemperature}°C </td>
              <td class="tableText">${tempAverage}°C</td>
              <td class="tableText">${lowestTemperature}°C</td>
              </tr>
            </tbody>
          </table>

          <h2>Today's Humidity</h2>
                <table class="table table-striped">
                 <thead>
                   <tr>
                     <th scope="col">Highest Humidity</th>
                     <th scope="col">Average Humidity</th>
                     <th scope="col">Lowest Humidity</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr>
                   <td class="tableText">${highestHumidity}%</td>
                   <td class="tableText">${averageHumidity}%</td>
                   <td class="tableText">${lowestHumidity}%</td>
                   </tr>
                 </tbody>
               </table>
          `
            
    },

    getWeekWeather: function(response,forCounter1,forCounter2,iconCounter3,dayCounter4){
        let tempArray = response.list;
        let combinedTempArray = [];
        
                for (i = forCounter1; i < forCounter2; i++) {
                    combinedTempArray.push(tempArray[i].main.temp_max)
                    combinedTempArray.push(tempArray[i].main.temp_min)
                   };
                let sortedTemArray = combinedTempArray.sort((a, b) => a-b)
                let highestTemperature = Math.round(sortedTemArray[sortedTemArray.length - 1])
                console.log(highestTemperature) //highest temperature
                let lowestTemperature = Math.round(sortedTemArray[0])
                console.log(lowestTemperature) //lowest temperature
                
                let weekendArray = ["Tomorrow", "Monday", "Tuesday", "Wednesday", "Thursday", "Firday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Firday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Firday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Firday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Firday", "Saturday", "Sunday"]
                let todaysDate = new Date();
                let todaysDay = todaysDate.getDay()
                let weatherDay= weekendArray[todaysDay + dayCounter4]


                this.temperatureWeek.innerHTML +=
                `
                <h3> Weather for ${weatherDay} </h3>
                <table class="table table-striped">
                 <tbody>
                 <tr>
                   <th>Highest/Lowest Temperature</th>
                   </tr>
                   <tr>
                   <td class="tableText">  ${highestTemperature}/${lowestTemperature}°C <img src="http://openweathermap.org/img/w/${response.list[iconCounter3].weather[0].icon}.png" alt=""></td>
                   </tr>
                 </tbody>
               </table>
               `
               
              
                if(forCounter2 > 39) return  ''
                if(forCounter2 < 39) return this.getWeekWeather(response, forCounter1+8, forCounter2+8,iconCounter3+8,dayCounter4+1);
        },

    getHourlyWeather: function(response){
        let combinedHourlyArray = response.list
        let hourlyTempArray = [];
        let iconArray = [];
        let descriptionArray = [];
        let dateArray = [];
        let humidityArray = [];
        let windSpeedArray = [];
        for (i = 0; i < 8; i++) { 
            hourlyTempArray.push(combinedHourlyArray[i].main.temp_max)
            iconArray.push(combinedHourlyArray[i].weather[0].icon)
            descriptionArray.push(combinedHourlyArray[i].weather[0].description)
            dateArray.push(combinedHourlyArray[i].dt_txt.slice(10))  
            humidityArray.push(combinedHourlyArray[i].main.humidity) 
            windSpeedArray.push(combinedHourlyArray[i].wind.speed) 
           }

           for(i=0; i <8; i++){
           this.hourlyResult.innerHTML += 
           `
           <div class="row">
            <div class="col-md-2 tableText" > <img src="http://openweathermap.org/img/w/${iconArray[i]}.png" alt=""></img>  </div>
            <div class="col-md-2 tableText"> <b> It looks like</b> <br> ${descriptionArray[i]}  </div>
            <div class="col-md-2 tableText"> <b> Houlry weather</b> <br> ${dateArray[i]} </div>
            <div class="col-md-2 tableText"> <b> Temperature of</b> <br> ${hourlyTempArray[i]}°C   </div>
            <div class="col-md-2 tableText"> <b> Humidity of </b> <br>${humidityArray[i]}%  </div>
            <div class="col-md-2 tableText"> <b> Wind speed of </b> <br>${windSpeedArray[i]} m/s </div>
        </div>
          `
    
        
        }
}



}

let weatherService = {
    apiKey: "02c381cd2d2a71e1d009fd2998f2dca8",
    city: "Skopje",
    apiUrl: "https://api.openweathermap.org/data/2.5/forecast",
    getData: function(){
        $.ajax({
            url: `${this.apiUrl}?q=${this.city}&units=metric&APPID=${this.apiKey}`,
            success: function (response) {
                console.log('The request succeeded!');
                console.log(response);
                navService.getTemperature(response);
                navService.getHourlyWeather(response);
                navService.getWeekWeather(response,8,16,0,1);
            }, 
            error: function(response){
                console.log('The request failed!');
                console.log(response.responseText);
            }
        });
    }
}

navService.createEventListener();
weatherService.getData()

let cityNameCall = {
    apiUrl: "https://raw.githubusercontent.com/lutangar/cities.json/master/cities.json",
    getCity: function(){
        $.ajax({
            url: this.apiUrl,
            success: function (response) {
                console.log('The request succeeded!');
                
                let resultParsed = JSON.parse(response);
               
                let allCityNames = [];
                resultParsed.forEach(function (resultParsed) {
                    allCityNames.push(resultParsed.name);
                });
                console.log(allCityNames)
        navService.createEventListener(allCityNames)

                
            }, 
            error: function(response){
                console.log('The request failed!');
                console.log(response.responseText);
            }
        });
    }
}

cityNameCall.getCity();
