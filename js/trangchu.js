let curIdx = 0;
let diemDen = [];
let mapTen = {};


async function LoadMapTen() {
    console.log("Đang kết nối cơ sở dữ liệu địa danh...");
    try {
        const res = await fetch('../data/MapTen.json');
        if (!res.ok) throw new Error("Mã lỗi 404: Không tìm thấy file MapTen.json");
        mapTen = await res.json();
        console.log("Hệ thống đã tải danh sách tên địa danh thành công.");
    } catch (err) {
        console.error("Lỗi nghiêm trọng: " + err.message);
    }
}


document.addEventListener('DOMContentLoaded', async function() {
    console.log("Hệ thống đang khởi tạo các thành phần giao diện...");
    
    FetchData();
    await LoadMapTen();

    const today = new Date().toISOString().split('T')[0];
    const depInput = document.getElementById('departure-date');
    const retInput = document.getElementById('return-date');

    if (depInput) {
        depInput.min = today;
    }

    if (retInput) {
        retInput.min = today;
    }

    depInput?.addEventListener('change', function() {
        if (retInput) {
            retInput.min = depInput.value;
            if (retInput.value && retInput.value < depInput.value) {
                retInput.value = depInput.value;
                console.warn("Ngày về đã được tự động điều chỉnh theo ngày đi.");
            }
        }
    });

    setupSwapButton();
    setupSearchButton();
    
    console.log("Hệ thống đã sẵn sàng phục vụ!");
});


function setupSwapButton() {
    const swapBtn = document.getElementById('swap-button');
    const fromEl = document.getElementById('from-airport');
    const toEl = document.getElementById('to-airport');

    if (swapBtn) {
        swapBtn.addEventListener('click', function() {
            const valFrom = fromEl.value;
            const valTo = toEl.value;

            console.log("Yêu cầu hoán đổi: " + valFrom + " <-> " + valTo);

            if (!valFrom || !valTo) {
                console.error("Lỗi: Một trong hai địa điểm đang bị trống. Không thể hoán đổi.");
                if (!fromEl.value) fromEl.value = "SGN";
                if (!toEl.value) toEl.value = "HAN";
                return;
            }

            const tempValue = valFrom;
            fromEl.value = valTo;
            toEl.value = tempValue;

            fromEl.dispatchEvent(new Event('change'));
            toEl.dispatchEvent(new Event('change'));

            console.log("Hoán đổi thành công: " + fromEl.value + " ⇄ " + toEl.value);
        });
    }
}


function setupSearchButton() {
    const searchBtn = document.getElementById('search-flight-btn');
    if (!searchBtn) return;

    searchBtn.addEventListener('click', function(e) {
        console.log("Đang xác thực thông tin hành trình...");

        const fromEl = document.getElementById('from-airport');
        const toEl = document.getElementById('to-airport');
        const depDateEl = document.getElementById('departure-date');
        const retDateEl = document.getElementById('return-date');
        const passEl = document.getElementById('passenger-count');
        const isRoundTrip = document.getElementById('round-trip').checked;

        const fromCode = fromEl.value;
        const toCode = toEl.value;
        const depDate = depDateEl.value;
        const retDate = retDateEl ? retDateEl.value : "";
        const passengers = parseInt(passEl ? passEl.value : 1);

        const fromName = mapTen[fromCode] || fromCode;
        const toName = mapTen[toCode] || toCode;

        console.table({
            "Khởi hành": fromName,
            "Điểm đến": toName,
            "Ngày đi": depDate || "Trống",
            "Ngày về": retDate || (isRoundTrip ? "Thiếu" : "N/A"),
            "Hành khách": passengers
        });

        if (!depDate || depDate.trim() === "") {
            alert("Vui lòng nhập ngày khởi hành!");
            depDateEl.focus();
            return;
        }

        if (isRoundTrip && (!retDate || retDate.trim() === "")) {
            alert("Vui lòng chọn ngày về cho hành trình khứ hồi!");
            retDateEl.focus();
            return;
        }

        if (fromCode === toCode) {
            alert("Điểm đi và điểm đến không được trùng nhau!");
            return;
        }

        if (isNaN(passengers) || passengers <= 0) {
            alert("Số lượng hành khách không hợp lệ!");
            return;
        }

        const searchParams = { 
            from: fromCode, 
            fromName: fromName, 
            to: toCode, 
            toName: toName, 
            depDate, 
            retDate, 
            passengers 
        };
        
        localStorage.setItem('userSearch', JSON.stringify(searchParams));
        console.log("Dữ liệu hợp lệ. Đang chuyển hướng chuyển hướng...");

        setTimeout(() => {
            window.location.href = 'datve.html'; 
        }, 500);
    });
}


async function FetchData() {
    try {
        const phanHoi = await fetch('../data/KhamPhaDiemDen.json');
        const data = await phanHoi.json();
        diemDen = Array.isArray(data) ? data : (data.diemDen || []);
        if (diemDen.length > 0) {
            await ChenData(curIdx); 
            setupSliderButtons();
        }
    } catch (error) { 
        console.error("Lỗi Fetch Slider:", error); 
    }
}

async function getTemp(cityName) {
    const apiKey = "382305a70df2ca37af76ffb327e87faf"; 
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric`);
        let data = await response.json();
        return Math.round(data.main.temp);
    } catch (error) { 
        return 28;
    }
}

async function ChenData(index) {
    const item = diemDen[index];
    if (!item) return;
    const temp = await getTemp(item.city);
    
    document.getElementById('city-name').innerText = item.city;
    document.getElementById('country-name').innerText = item.country;
    document.getElementById('temperature').innerText = "Nhiệt độ: " + temp + " °C"; 
    document.getElementById('city-description').innerText = item.description;
    document.getElementById('view-detail-link').href = item.link;
    document.getElementById('hero-container').style.backgroundImage = "url('" + item.bgImage + "')";
}

function setupSliderButtons() {
    document.getElementById('next-dest')?.addEventListener('click', async () => {
        curIdx = (curIdx + 1) % diemDen.length;
        await ChenData(curIdx);
    });
    document.getElementById('prev-dest')?.addEventListener('click', async () => {
        curIdx = (curIdx - 1 + diemDen.length) % diemDen.length;
        await ChenData(curIdx);
    });
}