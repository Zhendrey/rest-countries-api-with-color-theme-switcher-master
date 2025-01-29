//!IMPORTS
import getCountryData from "./home.js";

//!DATA SETUP
const data = await getCountryData();
const selectedCountry = Number(localStorage.getItem('country'));
console.log(data[selectedCountry]);

//!DOM ELEMENTS
const body = document.body;
const darkModeBtn = document.querySelector(".header__button");
const countryFlag = document.querySelector(".details__flag img");
const countryName = document.querySelector(".details__name");
const countryNativeName = document.querySelector(".details__native-name");
const countryPopulation = document.querySelector(".details__population");
const countryRegion = document.querySelector(".details__region");
const countrySubRegion = document.querySelector(".details__sub-region");
const countryCapital = document.querySelector(".details__capital");
const countryTopLevelDomain = document.querySelector(".details__top-level-domain");
const countryCurrencies = document.querySelector(".details__currencies");
const countryLanguages = document.querySelector(".details__languages");
const countryList = document.querySelector(".details__border-countries-list");

//!FUNCTION CALLS AND EVENT LISTENERS
renderData(
    data[selectedCountry].flag,
    data[selectedCountry].name,
    data[selectedCountry].nativeName,
    data[selectedCountry].population.toLocaleString('en-US'),
    data[selectedCountry].region,
    data[selectedCountry].subregion,
    data[selectedCountry].capital,
    data[selectedCountry].topLevelDomain,
    data[selectedCountry].currencies,
    data[selectedCountry].languages,
    data[selectedCountry].borders,
);
countryList.addEventListener("click", function(e){
    if(e.target.tagName === "A"){
        const countryName = e.target.textContent;
        const countryIndex = data.findIndex(country => country.name === countryName);
        removeBorderCountries();
        renderData(
            data[countryIndex].flag,
            data[countryIndex].name,
            data[countryIndex].nativeName,
            data[countryIndex].population.toLocaleString('en-US'),
            data[countryIndex].region,
            data[countryIndex].subregion,
            data[countryIndex].capital,
            data[countryIndex].topLevelDomain,
            data[countryIndex].currencies,
            data[countryIndex].languages,
            data[countryIndex].borders,
        )
    }
})

//!FUNCTIONS
function renderData(
    flag,
    name, 
    nativeName, 
    population, 
    region, 
    subRegion,
    capital,
    topLevelDomain, 
    currencies, 
    languages,
    borders,
){
    countryFlag.src = flag;
    countryName.textContent = name;
    countryNativeName.textContent = nativeName;
    countryPopulation.textContent = population;
    countryRegion.textContent = region;
    countrySubRegion.textContent = subRegion;
    countryCapital.textContent = capital;
    countryTopLevelDomain.textContent = topLevelDomain;
    countryCurrencies.textContent = currencies[0].name;
    const languagesString = languages.reduce((storage, language, currentIndex, array)=>{
        let str = storage + `${language.name}, `;
        if(currentIndex === array.length - 1){
            str = storage + `${language.name}`
        }
        return str;
    }, '')
    countryLanguages.textContent = languagesString;
    const borderCountries = data.reduce((storage, country)=>{
        if(borders?.includes(country.alpha3Code)){
            storage.push(country.name);
        }
        return storage;
    }, [])
    if(borderCountries.length > 0){
        borderCountries.forEach(countryName => {
            createBorderCountry(countryList, countryName);
        })
    }else{
        countryList.insertAdjacentHTML("beforeend", 
            `
            <p class='error-text'>Error! Could not find bordering countries!</p>
            `
        )
    }
}
function removeBorderCountries(){
    const borderCountries = document.querySelectorAll(`.details__border-countries-list li`);
    console.log(borderCountries);
    borderCountries.forEach(country=>{
        country.remove();
    })
}
function createBorderCountry(countryList, countryName){
    const bullet = document.createElement("li");
    const borderCountry = document.createElement("a");
    borderCountry.href = '#' + countryList.classList[0];
    borderCountry.classList.add("details__border-country");
    borderCountry.textContent = countryName;
    countryList.appendChild(bullet);
    bullet.appendChild(borderCountry);
}