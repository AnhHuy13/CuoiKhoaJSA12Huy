document.addEventListener('DOMContentLoaded', function() {
    const flight = JSON.parse(localStorage.getItem('selectedFlight'));
    const passenger = JSON.parse(localStorage.getItem('passengerInfo'));
    const searchData = JSON.parse(localStorage.getItem('userSearch'));

    const insuranceRadios = document.querySelectorAll('input[name="insurance"]');
    const loungeRadios = document.querySelectorAll('input[name="lounge"]');
    const baggageInput = document.querySelector('input[type="number"]');
    const btnToPayment = document.getElementById('btn-to-payment');
    const totalPriceElement = document.getElementById('total-price');

    const PRICE_INSURANCE = 249000;
    const PRICE_LOUNGE = 450000;
    const PRICE_BAGGAGE_PER_UNIT = 65000;
    let baseFlightPrice = flight ? flight.price : 0;

    if (!flight || !passenger) {
        alert("Thiếu thông tin chuyến bay hoặc hành khách. Vui lòng đặt lại!");
        window.location.href = 'datve.html';
        return;
    }

    function updateTotal() {
        let extraTotal = 0;

        const isInsuranceSelected = document.querySelector('input[name="insurance"][value="yes"]').checked;
        if (isInsuranceSelected) extraTotal += PRICE_INSURANCE;

        const isLoungeSelected = document.getElementById('loungeYes')?.checked;
        if (isLoungeSelected) extraTotal += PRICE_LOUNGE;

        const baggageQuantity = parseInt(baggageInput?.value) || 0;
        extraTotal += (baggageQuantity * PRICE_BAGGAGE_PER_UNIT);

        const finalTotal = baseFlightPrice + extraTotal;
        
        const formattedTotal = new Intl.NumberFormat('vi-VN').format(finalTotal) + " VND";
        totalPriceElement.textContent = formattedTotal;

        localStorage.setItem("totalPrice", formattedTotal);
    }

    function initUI() {
        if(searchData) {
            document.getElementById('route-header').textContent = `${searchData.fromName} → ${searchData.toName}`;
        }

        const formattedBase = new Intl.NumberFormat('vi-VN').format(baseFlightPrice) + " VND";
        document.getElementById('base-price').textContent = formattedBase;

        document.getElementById('p-name').textContent = `${passenger.name}`.toUpperCase();
        document.getElementById('p-contact').textContent = `${passenger.email} | ${passenger.phone}`;

        const container = document.getElementById('flight-summary-list');
        const template = document.getElementById('flight-item-template');
        const clone = template.content.cloneNode(true);

        clone.querySelector('.dep-time').textContent = flight.depTime;
        clone.querySelector('.arr-time').textContent = flight.arrTime;
        clone.querySelector('.dep-code').textContent = flight.fromCode || flight.from;
        clone.querySelector('.arr-code').textContent = flight.toCode || flight.to;
        clone.querySelector('.flight-no').textContent = "Chuyến bay: " + flight.flightNumber;
        container.appendChild(clone);

        updateTotal();
    }


    insuranceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll('.insurance-radio-card').forEach(card => card.classList.remove('active'));
            this.closest('.insurance-radio-card').classList.add('active');
            updateTotal();
        });
    });

    loungeRadios.forEach(radio => {
        radio.addEventListener('change', updateTotal);
    });

    if(baggageInput) {
        baggageInput.addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
            updateTotal();
        });
    }

    btnToPayment.addEventListener('click', function() {
        window.location.href = '../html/payment.html';
    });

    initUI();
});