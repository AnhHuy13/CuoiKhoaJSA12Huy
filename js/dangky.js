const hoInput = document.getElementById('ho-input');
const tenInput = document.getElementById('tendem-input');
const dobInput = document.getElementById('dob');
const genderSelect = document.getElementById('gender-input');
const emailInput = document.getElementById('email-input');
const phoneInput = document.getElementById('phone');
const password = document.getElementById('password-input');
const confirmPass = document.getElementById('confirm-password');
const dieuKhoan = document.getElementById('thefirst');
const adsAccept = document.getElementById('thesecond');
const buttonSubmit = document.getElementById('submitBtn');

buttonSubmit.addEventListener('click', (e) => {
    e.preventDefault();

    const ho = hoInput.value.trim();
    const ten = tenInput.value.trim();
    const dob = dobInput.value;
    const gender = genderSelect.value;
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const pass = password.value;
    const confirm = confirmPass.value;

    if (!ho || !ten || !dob || !gender || !email || !phone || !pass || !confirm) {
        alert("Vui lòng điền đầy đủ tất cả các trường có dấu (*)");
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Email không đúng định dạng (ví dụ: abc@gmail.com)");
        return;
    }

    if (isNaN(phone) || phone.length < 10 || phone.length > 11) {
        alert("Số điện thoại không hợp lệ!");
        return;
    }

    if (pass.length < 6) {
        alert("Mật khẩu phải có ít nhất 6 ký tự!");
        return;
    }

    if (pass !== confirm) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
    }

    if (!dieuKhoan.checked) {
        alert("Bạn phải đồng ý với Điều khoản sử dụng!");
        return;
    }

    alertHoanThanh();
    window.location.href = "dangnhap.html";
});

function alertHoanThanh(userData) {
    let users = JSON.parse(localStorage.getItem('userList')) || [];

    const isExisted = users.some(u => u.email === userData.email);
    if (isExisted) {
        alert("Email này đã được đăng ký rồi ông giáo ạ!");
        return false;
    }

    users.push(userData);

    localStorage.setItem('userList', JSON.stringify(users));

    alert("Bạn đã thành công tạo tài khoản mới!");
    return true;
}