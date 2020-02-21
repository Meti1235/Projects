// https://api.openweathermap.org/data/2.5/forecast?q=skopje&units=metric&APPID=02c381cd2d2a71e1d009fd2998f2dca8

let currentData = {};

let cityNameService = {
    allCityNames: null,

    sanitizeCityName: (cityName) => {
        return cityName
            .replace(/(^\s+)|(\s+$)/g, '')
            .replace(/\s{2,}/g, ' ')
            .split(' ')
            .map(splitCityName => splitCityName.charAt(0).toUpperCase() + splitCityName.substr(1))
            .join(' ');
    },

    apiUrl: 'https://raw.githubusercontent.com/lutangar/cities.json/master/cities.json',
    fetchCityNames: function () {
        $.ajax({
            url: this.apiUrl,
            success: function (response) {
                const resultParsed = JSON.parse(response);
                cityNameService.allCityNames = resultParsed.map((record) => record.name);
            },
            error: function (response) {
                console.log('The request failed!');
                console.log(response.responseText);
            }
        });
    }
};

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
    sortButton: document.getElementsByClassName("sortButton"),
    gifLoader: document.getElementById("gifLoader"),

    activeNav: function (item) {
        for (let navItem of this.navItems) {
            navItem.classList.remove("active");
        }
        item.classList.add("active");
    },

    showPages: function (page) {
        for (let pageElement of this.pages) {
            pageElement.style.display = "none";
        }
        page.style.display = "block";
    },

    createEventListener: function () {
        for (let i = 0; i < this.navItems.length; i++) {
            this.navItems[i].addEventListener("click", function () {
                // this in addEventListener points to the item that has the event listener
                navService.activeNav(this);
                navService.showPages(navService.pages[i]);
            })
        }

        this.citySearchBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (!cityNameService.allCityNames) {
                alert('This application is slow and takes a long time to load city names. Please be patient :(');
                return;
            }

            const inputName = $('#citySearchInput').val().trim();
            if (!inputName) {
                alert("Please enter a City Name");
                return;
            }

            const sanitizedName = cityNameService.sanitizeCityName(inputName);

            const known = cityNameService.allCityNames.includes(sanitizedName);
            if (!known) {
                alert("Please enter a Valid! City Name");
                return;
            }

            navService.temperatureToday.innerHTML = '';
            navService.temperatureWeek.innerHTML = '';
            navService.hourlyResult.innerHTML = '';

            weatherService.city = sanitizedName;
            weatherService.getData();

        }, true);
    },

    getTemperature: function (response) {
        let tempArray = response.list
        let combinedTempArray = []
        for (let i = 0; i < 8; i++) { // DAY 1
            combinedTempArray.push(tempArray[i].main.temp_max)
            combinedTempArray.push(tempArray[i].main.temp_min)
        }
        ;
        let sortedTemArray = combinedTempArray.sort((a, b) => a - b)
        let highestTemperature = Math.round(sortedTemArray[sortedTemArray.length - 1])
        // console.log(highestTemperature) //highest temperature
        let lowestTemperature = Math.round(sortedTemArray[0])
        // console.log(lowestTemperature) //lowest temperature
        let tempTotal = 0
        for (let i = 0; i < 16; i++) {
            tempTotal = tempTotal + combinedTempArray[i]
        }
        ;
        let tempAverage = Math.round(tempTotal / 16)
        // console.log(tempAverage) // average temperature
        //humidity
        let humidityArray = [];
        humidityArray.push = response.list
        let dailyHumidityArray = []
        for (let i = 0; i < 8; i++) {
            dailyHumidityArray.push(humidityArray.push[i].main.humidity)
        }
        ;
        let sortedHumidityArray = dailyHumidityArray.sort((a, b) => a - b)
        let highestHumidity = Math.round(sortedHumidityArray[sortedHumidityArray.length - 1])
        // console.log(highestHumidity) //highest humidity
        let lowestHumidity = Math.round(sortedHumidityArray[0])
        // console.log(lowestHumidity) //lowest humidity
        let totalHumidity = 0
        for (let i = 0; i < 8; i++) {
            totalHumidity = totalHumidity + dailyHumidityArray[i]
        }
        ;
        let averageHumidity = Math.round(totalHumidity / 8)
        // console.log(averageHumidity) average humidity
        this.weatherCity.innerHTML = `<h1>Weather for ${weatherService.city}</h1><h4> Welcome to an above average weather app! </h4>`
        this.hourlyWeatherCity.innerHTML = `<h1>Hourly Data for ${weatherService.city}</h1>`
        this.printHomeTables(highestTemperature, tempAverage, lowestTemperature, highestHumidity, averageHumidity, lowestHumidity)

    },

    //just printing a normal table
    printHomeTables: function (highestTemperature, tempAverage, lowestTemperature, highestHumidity, averageHumidity, lowestHumidity) { //getting the values from getTemperature method
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
    //printing tables with recursive function/method
    getWeekWeather: function (response, forCounter1, forCounter2, iconCounter3, dayCounter4) { // getting the response and hardcoded counter values
        let tempArray = response.list;
        let combinedTempArray = [];

        for (let i = forCounter1; i < forCounter2; i++) {
            combinedTempArray.push(tempArray[i].main.temp_max)
            combinedTempArray.push(tempArray[i].main.temp_min)
        }
        ;
        let sortedTemArray = combinedTempArray.sort((a, b) => a - b)
        let highestTemperature = Math.round(sortedTemArray[sortedTemArray.length - 1])
        // console.log(highestTemperature) //highest temperature
        let lowestTemperature = Math.round(sortedTemArray[0])
        // console.log(lowestTemperature) //lowest temperature

        let weekendArray = ["Tomorrow", "Monday", "Tuesday", "Wednesday", "Thursday", "Firday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Firday", "Saturday", "Sunday"]
        let todaysDate = new Date();
        console.log('todaysDate', todaysDate)
        let todaysDay = todaysDate.getDay()
        console.log('todaysDay', todaysDay)
        let weatherDay = weekendArray[todaysDay + dayCounter4]


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


        if (forCounter2 > 39) return ''
        if (forCounter2 < 39) return this.getWeekWeather(response, forCounter1 + 8, forCounter2 + 8, iconCounter3 + 8, dayCounter4 + 1); //increasing the counter values
    },


    //pringing table with a for loop
    getHourlyWeather: function (response) {
        let combinedHourlyArray = response.list
        let hourlyTempArray = [];
        let iconArray = [];
        let descriptionArray = [];
        const dateArray = [];
        let humidityArray = [];
        let windSpeedArray = [];
        for (let i = 0; i < 8; i++) {
            hourlyTempArray.push(Math.round(combinedHourlyArray[i].main.temp_max))
            iconArray.push(combinedHourlyArray[i].weather[0].icon)
            descriptionArray.push(combinedHourlyArray[i].weather[0].description)
            dateArray.push(combinedHourlyArray[i].dt_txt.slice(10));
            humidityArray.push(combinedHourlyArray[i].main.humidity);
            windSpeedArray.push(combinedHourlyArray[i].wind.speed)
        }

        this.addSortEventListener(hourlyTempArray, humidityArray, windSpeedArray, iconArray, descriptionArray, dateArray);


        for (let i = 0; i < 8; i++) {
            this.hourlyResult.innerHTML +=
                `
           <tr>
      <td class="td-padding"><img src="http://openweathermap.org/img/w/${iconArray[i]}.png" alt=""></img></td>
      <td class="td-padding">${descriptionArray[i]}</td>
      <td class="td-padding">${dateArray[i]}</td>
      <td class="td-padding">${hourlyTempArray[i]}°C</td>
      <td class="td-padding">${humidityArray[i]}%</td>
      <td class="td-padding">${windSpeedArray[i]}m/s</td>
    </tr>
          `
        }

    },

    addSortEventListener: function (hourlyTempArray, humidityArray, windSpeedArray, iconArray, descriptionArray, dateArray) {
        for (let i = 0; i < this.sortButton.length; i++) {
            this.sortButton[i].addEventListener("click", function () {
                console.log(`Sort button #${i} clicked`)

                newhourlyTempArray = [...hourlyTempArray]
                newhourlyTempArray.sort(function (a, b) {
                    return a - b
                });

                newhumidityArray = [...humidityArray];
                newhumidityArray.sort(function (a, b) {
                    return a - b
                });

                newwindSpeedArray = [...windSpeedArray];
                newwindSpeedArray.sort(function (a, b) {
                    return a - b
                });

                hourlyResult.innerHTML = ''

                for (let i = 0; i < 8; i++) {

                    hourlyResult.innerHTML +=
                        `
                <tr>
           <td class="td-padding"><img src="http://openweathermap.org/img/w/${iconArray[i]}.png" alt=""></img></td>
           <td class="td-padding">${descriptionArray[i]}</td>
           <td class="td-padding">${dateArray[i]}</td>
           <td class="td-padding">${newhourlyTempArray[i]}°C</td>
           <td class="td-padding">${newhumidityArray[i]}%</td>
           <td class="td-padding">${newwindSpeedArray[i]}m/s</td>
         </tr>
               `
                }

            })
        }
    }

}

let weatherService = {
    apiKey: "02c381cd2d2a71e1d009fd2998f2dca8",
    city: "Skopje",
    apiUrl: "https://api.openweathermap.org/data/2.5/forecast",

    getData: function () {
        navService.gifLoader.innerHTML = `<img src="img/loadingBlue.gif" alt="">`
        navService.citySearchBtn.style.display = "none"
        $.ajax({
            url: `${this.apiUrl}?q=${this.city}&units=metric&APPID=${this.apiKey}`,

            success: function (response) {
                console.log('weatherService: The request succeeded! 1');
                currentData = response.list;
                navService.getTemperature(response);
                navService.getHourlyWeather(response);
                navService.getWeekWeather(response, 8, 16, 0, 1); // hardcoding the counters for the recursive function
                console.log('weatherService: currentData is', currentData)
                navService.gifLoader.innerHTML = ''
                navService.citySearchBtn.style.display = "block"
            },
            error: function (response) {
                console.log('weatherService: The request failed!');
                console.log(response.responseText);
                navService.gifLoader.innerHTML = ''
                navService.citySearchBtn.style.display = "block"
            }
        });
    }
};

let locationService = {
    getClientLocation(callback) {
        $.ajax({
            url: 'http://ip-api.com/json/?fields=city,country',
            success: (response) => callback(null, response),
            error: callback
        });
    }
};

navService.createEventListener();
cityNameService.fetchCityNames();

locationService.getClientLocation((err, location) => {
    if (err) {
        console.error(`Failed to get the user's city, falling back to Skopje. Error: ${err.responseText}`);
        weatherService.city = 'Skopje';
    } else {
        weatherService.city = location.city;
    }
    weatherService.getData();
});
