//!EXPORTS
export default async function getCountryData(){
    const countryData = await fetch('../data.json');
    return await countryData.json();
}
//DOM ELEMENTS AND VARIABLES
const body = document.body;
const darkModeBtn = document.querySelector(".header__button");
const searchIcon = document.querySelector('.search__icon');
const searchInput = document.querySelector('.search__input');
const searchSelect = document.querySelector('.search__select');
const selectOptions = document.querySelectorAll("option[value]");
const buttonIcon = document.querySelector('i');

const icons = ['icon-sun-regular', 'icon-moon-regular'];

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
        btnText.textContent = 'Dark Mode';
        buttonIcon.classList.remove(icons[0]);
        buttonIcon.classList.add(icons[1]);
        if(!body.classList.contains("dark-mode")){
            buttonIcon.classList.remove(icons[1]);
            buttonIcon.classList.add(icons[0]);
            btnText.textContent = 'Light Mode'
            sessionStorage.removeItem("dark-theme")
        }
    })
}
function indentifyTheme(body, darkModeBtn){
    const isDarkMode = sessionStorage.getItem("dark-theme");
    const btnText = darkModeBtn.querySelector("span");
    console.log(Boolean(isDarkMode));
    console.log(buttonIcon)
    if(!isDarkMode){
        buttonIcon.classList.remove(icons[1]);
        buttonIcon.classList.add(icons[0]);
        body.classList.remove("dark-mode")
    }else{
        buttonIcon.classList.remove(icons[0]);
        buttonIcon.classList.add(icons[1]);
        btnText.textContent = 'Dark Mode'
        body.classList.add("dark-mode")
    }
}
function throwError(container, message){
    const error = document.createElement('p');
    error.classList.add('error');
    error.textContent = message;
    container.append(error);
}

//!MAIN CODE

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
        try {
            const countryData = JSON.parse(xhr.responseText);
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
                    const archivedCountry = country;
                    const countryRegion = country.querySelector('.country__region .info_value').textContent;
                    
                    if(countryRegion.toLowerCase() == selectedOption
                        || selectedOption == 'all'){
                            countryContainer.append(archivedCountry);
                    }else{
                        country.remove()
                    }
                })
            })
            const inputSearch = searchInput.querySelector("input");
            searchIcon.addEventListener('click', function(e){
                inputSearch.focus();
            })
            let count = 0;
            searchInput.addEventListener('input', function(e){
                const searchValue = e.target.value;
                const countries = [...document.querySelectorAll(".country")].map(country=>{
                    return country.querySelector('.country__name').textContent;
                })
                const matched = countries.filter(country=>{
                    return country.toLowerCase().includes(searchValue.toLowerCase());
                })
                const notMatched = countries.filter(country=>{
                    return !country.toLowerCase().includes(searchValue.toLowerCase());
                })
                document.querySelectorAll(".country").forEach(country=>{
                    const countryName = country.querySelector('.country__name').textContent;
                    if(notMatched.includes(countryName)){
                        country.style.display = 'none';
                        country.classList.remove('visible');
                    }else{
                        country.style.display = 'flex';
                        country.classList.add('visible');
                    }
                })
                console.log(matched);
                if(!matched.length){
                    count++;
                    if(count <= 1) throwError(document.querySelector(".page"), 'No matches found');
                }else{
                    count = 0;
                    const error = document.querySelector("p.error");
                    if(error){
                        error.remove();
                    }
                }
            })
            countryContainer.addEventListener("click", function(e){
                const targetElem = e.target.closest(".country");
                localStorage.setItem('country', Number(targetElem.id))
            })
        }catch(err){
            document.querySelector(".countries").classList.add('failed')
            document.querySelector(".countries").insertAdjacentHTML("beforeend",
                `
                <div>
                <p class='error'>Oops! Seems like an error occured in our service! We are appologizing for this inconvinience and promise to return soon. 😢</p>
                <pre class='error'>${err}</pre>
                </div>
                `
            )
            console.error(err);
        }finally{
            document.querySelector(".countries").classList.remove('loading');
            document.querySelector(".loading").remove();
        }
    }
    xhr.send();
});