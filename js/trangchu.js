let curIdx = 0;
let diemDen = [];

async function FetchData() {
    try {
        const phanHoi = await fetch('../data/KhamPhaDiemDen.json');
        if (!phanHoi.ok) {
            throw new Error("Không tìm thấy file json");
        }
        const data = await phanHoi.json();
        
        if (Array.isArray(data)) {
            diemDen = data;
        } else if (data && data.diemDen) {
            diemDen = data.diemDen;
        } else {
            throw new Error("Cấu trúc JSON không đúng!");
        }

        if (diemDen.length > 0) {
            await ChenData(curIdx); 
            Button();
        }
    } catch (error) {
        console.error("Lỗi FetchData:", error.message);
    }
}

async function getTemp(cityName) {
    let apiKey = "382305a70df2ca37af76ffb327e87faf"; 
    let safeCityName = encodeURIComponent(cityName); 
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${safeCityName}&appid=${apiKey}&units=metric`;

    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error("Lỗi API");
        let dataWeather = await response.json();
        return dataWeather.main.temp;
    } catch (error) {
        return 28;
    }
}

let currentTemp; 

async function ChenData(index) {
    const item = diemDen[index];
    if (!item) return;

    currentTemp = Math.round(await getTemp(item.city));

    const cityName = document.getElementById('city-name');
    const countryName = document.getElementById('country-name');
    const temperature = document.getElementById('temperature');
    const description = document.getElementById('city-description');
    const link = document.getElementById('view-detail-link');
    const container = document.getElementById('hero-container');

    if (cityName) cityName.innerText = item.city;
    if (countryName) countryName.innerText = item.country;
    
    if (temperature) temperature.innerText = `Nhiệt độ: ${currentTemp} °C`; 
    
    if (description) description.innerText = item.description;
    if (link) link.href = item.link;
    if (container) container.style.backgroundImage = `url('${item.bgImage}')`;
}

function Button() {
    const nextBtn = document.getElementById('next-dest');
    const prevBtn = document.getElementById('prev-dest');

    if (nextBtn) {
        nextBtn.addEventListener('click', async () => {
            curIdx = (curIdx + 1) % diemDen.length;
            await ChenData(curIdx);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', async () => {
            curIdx = (curIdx - 1 + diemDen.length) % diemDen.length;
            await ChenData(curIdx);
        });
    }
}

document.getElementById('search-flight-btn').addEventListener('click', () => {
    const searchParams = {
        from: document.getElementById('from-airport').value,
        to: document.getElementById('to-airport').value,
        depDate: document.getElementById('departure-date').value || '2026-04-04',
        passengers: document.querySelector('input[type="number"]').value
    };
    
    localStorage.setItem('userSearch', JSON.stringify(searchParams));
    
    window.location.href = '../html/datve.html'; 
});

document.addEventListener('DOMContentLoaded', FetchData);