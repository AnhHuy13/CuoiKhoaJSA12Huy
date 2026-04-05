const hoInput = document.getElementById('ho-input');
const tenInput = document.getElementById('tendem-input');
const dobInput = document.getElementById('dob');
const genderSelect = document.getElementById('gender-input');
const emailInput = document.getElementById('email-input');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password-input');
const confirmPassInput = document.getElementById('confirm-password');
const dieuKhoanCheckbox = document.getElementById('thefirst');
const buttonSubmit = document.getElementById('submitBtn');

buttonSubmit.addEventListener('click', (e) => {
    e.preventDefault();

    const ho = hoInput.value.trim();
    const ten = tenInput.value.trim();
    const dob = dobInput.value;
    const gender = genderSelect.value;
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const pass = passwordInput.value;
    const confirm = confirmPassInput.value;

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
        alert("Số điện thoại không hợp lệ (phải từ 10-11 số)!");
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

    if (!dieuKhoanCheckbox.checked) {
        alert("Bạn phải đồng ý với Điều khoản sử dụng!");
        return;
    }

    const newUser = {
        name: `${ho} ${ten}`,
        email: email,
        pass: pass,
        phone: phone,
        dob: dob,
        gender: gender,
        createdAt: new Date().toISOString()
    };

    const isSuccess = handleRegister(newUser);

    if (isSuccess) {
        window.location.href = "dangnhap.html";
    }
});

/**
 * Hàm xử lý lưu trữ User
 * @param {Object} userData - Đối tượng chứa thông tin user mới
 */
function handleRegister(userData) {
    let rawData = localStorage.getItem('userList');
    let users = [];

    try {
        users = rawData ? JSON.parse(rawData) : [];
        
        if (!Array.isArray(users)) {
            users = [];
        } else {
            users = users.filter(u => u !== null && typeof u === 'object');
        }
    } catch (error) {
        console.error("Lỗi đọc dữ liệu LocalStorage:", error);
        users = [];
    }

    const isExisted = users.some(u => u.email === userData.email);
    if (isExisted) {
        alert("Email này đã được đăng ký trên hệ thống!");
        return false;
    }

    users.push(userData);

    localStorage.setItem('userList', JSON.stringify(users));

    alert("Chúc mừng! Bạn đã tạo tài khoản Bamboo Airways thành công.");
    return true;
}