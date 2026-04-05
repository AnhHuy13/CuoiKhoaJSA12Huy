document.addEventListener('DOMContentLoaded', function() {
    const searchData = JSON.parse(localStorage.getItem('userSearch'));
    if (!searchData) {
        window.location.href = 'trangchu.html';
        return;
    }

    updateSummaryBar(searchData);
    fetchFlightResults(searchData);
});

function updateSummaryBar(data) {
    document.getElementById('user-from').innerText = data.from;
    document.getElementById('user-to').innerText = data.to;
    document.getElementById('from-label').innerText = data.fromName || "";
    document.getElementById('to-label').innerText = data.toName || "";
    document.getElementById('user-dep-date').innerText = formatDate(data.depDate);
    document.getElementById('user-ret-date').innerText = data.retDate ? formatDate(data.retDate) : "Một chiều";
    document.getElementById('user-passenger').innerText = data.passengers + " Người lớn";
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    const days = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];
    return `${days[d.getDay()]}, ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

async function fetchFlightResults(data) {
    const container = document.getElementById('flight-results-list');
    const template = document.getElementById('ticket-template');
    
    container.innerHTML = '<div class="text-center p-5"><h4>Đang tìm chuyến bay tốt nhất cho bạn...</h4></div>';

    const apiKey = "e1400ca2-07f8-41a8-9899-808721c5f962";
    const apiUrl = `https://airlabs.co/api/v9/schedules?dep_iata=${data.from}&arr_iata=${data.to}&api_key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (result.response && result.response.length > 0) {
            container.innerHTML = "";
            const flights = result.response.slice(0, 10);

            flights.forEach(flight => {
                const clone = template.content.cloneNode(true);

                let flightIATA = flight.flight_iata || flight.flight_number || "QH202";
                if (!flightIATA.startsWith("QH")) {
                    flightIATA = "QH" + (flightIATA.replace(/\D/g, "") || Math.floor(Math.random() * 900 + 100));
                }

                clone.querySelector('.dep-time').innerText = flight.dep_time || "08:15";
                clone.querySelector('.arr-time').innerText = flight.arr_time || "10:30";
                clone.querySelector('.dep-code').innerText = flight.dep_iata;
                clone.querySelector('.arr-code').innerText = flight.arr_iata;
                clone.querySelector('.flight-number').innerText = flightIATA;

                const duration = flight.duration ? `${Math.floor(flight.duration/60)}h ${flight.duration%60}m` : "2h 15m";
                clone.querySelector('.dur-val').innerText = duration;

                const randomPrice = Math.floor(Math.random() * (3800000 - 1200000 + 1)) + 1200000;
                const formattedPrice = new Intl.NumberFormat('vi-VN').format(randomPrice);
                
                const priceEl = clone.querySelector('.price-val');
                priceEl.innerHTML = `${formattedPrice} <span>VND</span>`;

                const selectBtn = clone.querySelector('.price-val').closest('.btn-booking') || clone.querySelector('.price-val');

                if (selectBtn) {
                    selectBtn.style.cursor = "pointer";
                    selectBtn.addEventListener('click', function() {
                        const selectedFlight = {
                            flightNumber: flightIATA,
                            depTime: flight.dep_time || "08:15",
                            arrTime: flight.arr_time || "10:30",
                            from: flight.dep_iata,
                            to: flight.arr_iata,
                            price: randomPrice,
                            date: data.depDate
                        };

                        localStorage.setItem('selectedFlight', JSON.stringify(selectedFlight));
                        console.log("Đã chọn vé:", selectedFlight);
                        window.location.href = 'hanhkhach.html';
                    });
                }

                container.appendChild(clone);
            });
        } else {
            container.innerHTML = '<div class="alert alert-warning">Không có chuyến bay.</div>';
        }
    } catch (error) {
        console.error("Lỗi:", error);
        container.innerHTML = '<div class="alert alert-danger">Lỗi kết nối API.</div>';
    }
}