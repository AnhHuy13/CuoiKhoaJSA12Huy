
const AIRLABS_KEY = '4fac5b35-18c2-406e-b75c-003ef4459241';

async function fetchFlightResults() {
    const searchData = JSON.parse(localStorage.getItem('userSearch')) || {
        from: 'SGN', 
        to: 'HAN', 
        depDate: '2026-04-04'
    };

    document.getElementById('user-from').innerText = searchData.from;
    document.getElementById('user-to').innerText = searchData.to;
    document.getElementById('user-dep-date').innerText = searchData.depDate;

    try {
        const url = `https://airlabs.co/api/v9/schedules?dep_iata=${searchData.from}&arr_iata=${searchData.to}&api_key=${AIRLABS_KEY}`;

        const response = await fetch(url);
        const result = await response.json();

        const container = document.getElementById('flight-results-list');
        const template = document.getElementById('ticket-template');
        container.innerHTML = '';

        if (!result.response || result.response.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info text-center p-5">
                    <h4>Rất tiếc!</h4>
                    <p>Hiện tại Bamboo Airways chưa có chuyến bay thẳng từ <b>${searchData.from}</b> đến <b>${searchData.to}</b> vào ngày này.</p>
                    <button class="btn btn-success mt-3" onclick="window.history.back()">Quay lại tìm chặng khác</button>
                </div>`;
            return;
        }

        result.response.slice(0, 10).forEach(flight => {
            const clone = template.content.cloneNode(true);

            clone.querySelector('.dep-time').innerText = flight.dep_time || "--:--";
            clone.querySelector('.arr-time').innerText = flight.arr_time || "--:--";
            clone.querySelector('.dep-code').innerText = flight.dep_iata;
            clone.querySelector('.arr-code').innerText = flight.arr_iata;
            
            clone.querySelector('.dur-val').innerText = flight.duration ? flight.duration + "m" : "2h 15m";

            const randomPrice = Math.floor(Math.random() * (4000000 - 1500000 + 1)) + 1500000;
            const formattedPrice = new Intl.NumberFormat('vi-VN').format(randomPrice);
            clone.querySelector('.price-val').innerHTML = `${formattedPrice} <span>VND</span>`;

            container.appendChild(clone);
        });

    } catch (error) {
        console.error("Lỗi AirLabs:", error);
        document.getElementById('flight-results-list').innerHTML = "Lỗi kết nối API. Vui lòng thử lại!";
    }
}

document.addEventListener('DOMContentLoaded', fetchFlightResults);