document.addEventListener("DOMContentLoaded", function () {
    const cardInput = document.getElementById("cardNumber");
    const cvvInput = document.getElementById("cvv");
    const paymentForm = document.querySelector("form");
    const totalPriceElement = document.querySelector(".total-amount-box h4");

    const finalTotal = localStorage.getItem("totalPrice");
    
    if (finalTotal && finalTotal !== "") {
        totalPriceElement.innerText = finalTotal;
    } else {
        totalPriceElement.innerText = "Chưa có thông tin giá!";
        totalPriceElement.style.color = "red";
    }

    cardInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        let formattedValue = value.match(/.{1,4}/g);
        
        if (formattedValue) {
            e.target.value = formattedValue.join("-").substring(0, 19);
        }
    });

    cvvInput.addEventListener("input", function (e) {
        if (e.target.value.length > 4) {
            e.target.value = e.target.value.slice(0, 4);
        }
    });

    paymentForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const cardName = document.getElementById("cardName").value.trim();
        const cardNumber = cardInput.value;
        const cvv = cvvInput.value;

        if (cardName.length < 5) {
            alert("Vui lòng nhập đầy đủ họ tên in trên thẻ!");
            return;
        }

        if (cardNumber.length < 19) {
            alert("Vui lòng nhập đủ 16 số thẻ tín dụng!");
            return;
        }

        if (cvv.length < 3) {
            alert("Mã CVV phải có ít nhất 3 chữ số!");
            return;
        }

        const submitBtn = document.getElementById("submitBtn");
        const originalText = submitBtn.innerText;
        
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.7";
        submitBtn.innerHTML = `<i class="bi bi-arrow-repeat spin"></i> Đang xác thực giao dịch...`;

        setTimeout(() => {
            alert("Thanh toán thành công! Mã đặt chỗ (PNR) của bạn sẽ được gửi về Email.");
            
            
            window.location.href = "trangchu.html"; 
        }, 2500);
    });
});

const style = document.createElement('style');
document.head.appendChild(style);