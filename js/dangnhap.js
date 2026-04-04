document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("password");
    const toggleBtn = document.getElementById("togglePassword");
    const icon = toggleBtn.querySelector("i");
    const dangnhapBtn = document.getElementById("dangnhapBtn");

    toggleBtn.addEventListener("click", function () {
        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        
        icon.classList.toggle("fa-eye");
        icon.classList.toggle("fa-eye-slash");
    });

    dangnhapBtn.addEventListener("click", function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const pass = passwordInput.value.trim();

        const users = JSON.parse(localStorage.getItem('userList')) || [];
        const found = users.find(u => u.email === email && u.pass === pass);

        if (found) {
            localStorage.setItem('currentUser', JSON.stringify(found));
            alert("Đăng nhập thành công!");
            window.location.href = "trangchu.html";
        } else {
            alert("Sai thông tin!");
        }
    });
});