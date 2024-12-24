//!EXPORTS
export default async function getCountryData(){
    const countryData = await fetch('../data.json');
    return await countryData.json();
}
//!FUNCTIONS
function createCountry(container, flag, name, population, region, capital, id){
    //Creating the elements
    const country = document.createElement('a');
    country.href = 'details.html';
    country.classList.add('countries__country');
    country.classList.add('country');
    country.id = id;
    const countryFlag = document.createElement('a');
    countryFlag.href = 'details.html';
    countryFlag.classList.add('country__flag');
    const img = document.createElement('img');
    img.dataset.src = flag;
    img.src = '';
    img.alt = name;
    const countryInfo = document.createElement('div');
    countryInfo.classList.add('country__info');
    const countryName = document.createElement('a');
    countryName.href = 'details.html';
    countryName.classList.add('country__name');
    countryName.textContent = name;
    const countryPopulation = document.createElement('p');
    countryPopulation.classList.add('country__population');
    const populationTitle = document.createElement('span');
    populationTitle.classList.add('info_title');
    populationTitle.textContent = 'Population: ';
    const populationValue = document.createElement('span');
    populationValue.classList.add('info_value');
    populationValue.textContent = population;
    const countryRegion = document.createElement('p');
    countryRegion.classList.add('country__region');
    const regionTitle = document.createElement('span');
    regionTitle.classList.add('info_title');
    regionTitle.textContent = 'Region: ';
    const regionValue = document.createElement('span');
    regionValue.classList.add('info_value');
    regionValue.textContent = region;
    const countryCapital = document.createElement('p');
    countryCapital.classList.add('country__capital');
    const capitalTitle = document.createElement('span');
    capitalTitle.classList.add('info_title');
    capitalTitle.textContent = 'Capital: ';
    const capitalValue = document.createElement('span');
    capitalValue.classList.add('info_value');
    capitalValue.textContent = capital;
    //Appending the elements
    container.append(country);
    country.append(countryFlag);
    countryFlag.appendChild(img);
    country.append(countryInfo);
    countryInfo.appendChild(countryName);
    countryInfo.appendChild(countryPopulation);
    countryPopulation.appendChild(populationTitle);
    countryPopulation.appendChild(populationValue);
    countryInfo.appendChild(countryRegion);
    countryRegion.appendChild(regionTitle);
    countryRegion.appendChild(regionValue);
    countryInfo.appendChild(countryCapital);
    countryCapital.appendChild(capitalTitle);
    countryCapital.appendChild(capitalValue);
}
function activateDarkMode(body, darkModeBtn){
    const btnText = darkModeBtn.querySelector("span");
    darkModeBtn.addEventListener("click", function(e){
        body.classList.toggle("dark-mode");
        sessionStorage.setItem("dark-theme", true);
        btnText.textContent = 'Light Mode';
        if(!body.classList.contains("dark-mode")){
            btnText.textContent = 'Dark Mode'
            sessionStorage.removeItem("dark-theme")
        }
    })
}
function indentifyTheme(body, darkModeBtn){
    const isDarkMode = sessionStorage.getItem("dark-theme");
    const btnText = darkModeBtn.querySelector("span");
    console.log(Boolean(isDarkMode));
    if(!isDarkMode){
        body.classList.remove("dark-mode")
    }else{
        btnText.textContent = 'Light Mode'
        body.classList.add("dark-mode")
    }
}

//!MAIN CODE
//DOM ELEMENTS
const body = document.body;
const darkModeBtn = document.querySelector(".header__button");
const searchIcon = document.querySelector('.search__icon');
const searchInput = document.querySelector('.search__input');
const searchSelect = document.querySelector('.search__select');
const selectOptions = document.querySelectorAll("option[value]");

//DARK THEME EXECUTION
indentifyTheme(body, darkModeBtn);
activateDarkMode(body, darkModeBtn);

//XML HTTP REQUEST
const xhr = new XMLHttpRequest();
xhr.open('GET', '../data.json', true);

//INTERSECTION OBSERVER
const intersectionObserver = new IntersectionObserver(entries =>{
    entries.forEach(entry => {
        const entryImage = entry.target.querySelector("img");
        if(!entry.isIntersecting){
        }else{
            entry.target.classList.add('visible');
            entryImage.src = entryImage.dataset.src;
        }
    });
}, {threshold: 0.1});

console.log(intersectionObserver);

//EVENT LISTENER FOR THE LOAD EVENT
const countryContainer = document.querySelector('.countries');
window.addEventListener("load", () => {
    xhr.onload = function() {
        if (xhr.status === 200) {
            const countryData = JSON.parse(xhr.responseText);
            countryData.sort((a, b) => b.population - a.population);
            countryData.forEach((country, id)=>{
                if(country.population === 0){
                    country.population = 'Unknown';
                }
                createCountry(
                    countryContainer, 
                    country.flag, 
                    country.name, 
                    country.population.toLocaleString('en-US', {maximumFractionDigits: 2}), 
                    country.region, 
                    country.capital,
                    id
                );
            })
            const countryElements = [...document.getElementsByClassName("country")];
            countryElements.forEach(country=>{
                intersectionObserver.observe(country);
            })
            searchSelect.addEventListener("change", function(e){
                const selectedOption = e.target.value;
                countryElements.forEach(country=>{
                    const countryRegion = country.querySelector('.country__region .info_value').textContent;
                    if(countryRegion.toLowerCase() !== selectedOption){
                        country.style.display = 'none';
                        country.classList.remove('visible');
                    }else{
                        country.style.display = 'flex';
                        country.classList.add('visible');
                    }
                    if(selectedOption === 'all'){
                        country.style.display = 'flex';
                        country.classList.add('visible');
                    }
                })
            })
            const inputSearch = searchInput.querySelector("input");
            searchIcon.addEventListener('click', function(e){
                inputSearch.focus();
            })
            searchInput.addEventListener('input', function(e){
                const searchValue = e.target.value;
                const visibleCountries = document.querySelectorAll(".visible");
                console.log(visibleCountries);
                const countries = [...countryElements].map((country, index)=>{
                    return country.querySelector('.country__name').textContent;
                })
                const notMatched = countries.filter((country, index)=>{
                    return !country.toLowerCase().includes(searchValue.toLowerCase());
                })
                countryElements.forEach((country, index)=>{
                    const countryName = country.querySelector('.country__name').textContent;
                    if(notMatched.includes(countryName)){
                        country.style.display = 'none';
                        country.classList.remove('visible');
                    }else{
                        country.style.display = 'flex';
                        country.classList.add('visible');
                    }
                })
            })
            countryContainer.addEventListener("click", function(e){
                const targetElem = e.target.closest(".country");
                localStorage.setItem('country', Number(targetElem.id))
            })
        }else{
            console.error('Error');
        }
    }
    xhr.send();
});