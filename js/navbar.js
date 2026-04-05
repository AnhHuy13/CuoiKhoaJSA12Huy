document.addEventListener("DOMContentLoaded", function () {
    const authMenu = document.getElementById("auth-menu");
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(currentUser)

    if (currentUser) {
        authMenu.innerHTML = `
            <li class="nav-item">
                <span class="nav-link fw-bold" style="color: #00305B;">Xin chào, ${currentUser.name || currentUser.email}</span>
            </li>
            <li class="nav-item">
                <a class="nav-link text-danger" href="#" id="logout-btn" style="cursor: pointer;">Đăng xuất</a>
            </li>
            <li>
                <img alt="Avatar" height="20" src="https://www.bambooairways.com/o/com.bav.header.languages/assets/Unlogin_Avatar.png" width="20" />
            </li>
        `;

        document.getElementById("logout-btn").addEventListener("click", function (e) {
            e.preventDefault();
            if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
                localStorage.removeItem('currentUser');
                window.location.reload();
            }
        });
    }
});