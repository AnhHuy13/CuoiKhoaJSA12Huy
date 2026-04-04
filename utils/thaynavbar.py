import os
import re
from bs4 import BeautifulSoup

# --- CẤU HÌNH ---
# 1. Định nghĩa Navbar mới (TEMPLATE)
# Bạn cần thay thế nội dung sau bằng HTML Navbar MỚI mà bạn muốn áp dụng.
NEW_NAVBAR_HTML = """
<nav class="navbar bg-light">
      <div class="navbar-container">
        <div class="navbar-left">
          <a class="navbar-brand" href="../trangchu.html">
            <img
              alt="Logo"
              height="40"
              src="https://www.bambooairways.com/o/wpbav-home-theme/css/assets/logo.png"
            />
          </a>
        </div>
        <div class="navbar-center">
          <ul class="navbar-nav main-menu">
            <li class="nav-item">
              <a class="nav-link" href="../Khampha/khampha.html"> Khám phá </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="./Mangduongbay.html"> Thông tin hành trình </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="./BambooClub/GioithieuQuyenloi.html"> Bamboo Club </a>
            </li>
          </ul>
        </div>
        <div class="navbar-right">
          <ul class="navbar-nav right-menu">
            <li class="signin-li">
              <a class="signin-option-navbar" href="./dangnhap.html"> Đăng nhập </a>
            </li>
            <li>
              <a class="signup-option-navbar" href="./dangky.html"> Đăng ký </a>
            </li>
            <li>
              <img
                alt="Avatar"
                height="20"
                src="https://www.bambooairways.com/o/com.bav.header.languages/assets/Unlogin_Avatar.png"
                width="20"
              />
            </li>
          </ul>
        </div>
      </div>
    </nav>
"""
# -----------------------------

def replace_navbar_in_file(file_path, new_navbar_html):
    """Đọc file, tìm thẻ <nav>, và thay thế nội dung của nó."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return f"Lỗi đọc file: {e}"

    # Sử dụng BeautifulSoup để tìm thẻ <nav>
    soup = BeautifulSoup(content, 'html.parser')
    old_nav = soup.find('nav')

    if old_nav:
        # Tạo một đối tượng BeautifulSoup từ HTML Navbar mới
        new_nav_soup = BeautifulSoup(new_navbar_html, 'html.parser')
        
        # Thay thế thẻ <nav> cũ bằng nội dung mới
        old_nav.replace_with(new_nav_soup.nav)
        
        # Lưu nội dung đã thay đổi
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
            
        return "THÀNH CÔNG"
    else:
        return "KHÔNG TÌM THẤY thẻ <nav>"

def replace_navbar_in_directory(root_dir):
    """Duyệt qua thư mục và thư mục con để thay thế Navbar."""
    print(f"Bắt đầu thay thế Navbar trong thư mục: {root_dir}")
    print("=" * 70)
    
    count_success = 0
    count_fail = 0

    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".html"):
                file_path = os.path.join(dirpath, filename)
                
                result = replace_navbar_in_file(file_path, NEW_NAVBAR_HTML)
                
                if result == "THÀNH CÔNG":
                    count_success += 1
                    print(f"✅ {file_path} - Thay thế thành công.")
                else:
                    count_fail += 1
                    print(f"❌ {file_path} - {result}")

    print("\n" + "=" * 70)
    print(f"TỔNG KẾT: Hoàn thành thay thế Navbar cho {count_success} file. Thất bại: {count_fail} file.")

# --- Ví dụ sử dụng ---
if __name__ == "__main__":
    
    # ĐỊNH NGHĨA THƯ MỤC CẦN XỬ LÝ
    # Ví dụ: Giả định các file HTML nằm trong thư mục ../../html
    ROOT_DIRECTORY = "./html" 
    
    # Kiểm tra tồn tại trước khi chạy
    if os.path.isdir(ROOT_DIRECTORY):
        replace_navbar_in_directory(ROOT_DIRECTORY)
    else:
        print(f"Lỗi: Thư mục gốc '{ROOT_DIRECTORY}' không tồn tại. Vui lòng kiểm tra lại đường dẫn.")