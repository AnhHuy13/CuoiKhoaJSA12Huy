import os
from bs4 import BeautifulSoup

EXCLUDE_FILES = [
    "datve.html", 
    "hanhkhach.html", 
    "chondichvu.html", 
    "payment.html",
    "thanhtoan.html"
]

NEW_NAVBAR_HTML = """
<nav class="navbar bg-light">
  <div class="navbar-container">
    <div class="navbar-left">
      <a class="navbar-brand" href="../trangchu.html">
        <img alt="Logo" height="40" src="https://www.bambooairways.com/o/wpbav-home-theme/css/assets/logo.png" />
      </a>
    </div>
    <div class="navbar-center">
      <ul class="navbar-nav main-menu">
        <li class="nav-item"><a class="nav-link" href="../Khampha/khampha.html"> Khám phá </a></li>
        <li class="nav-item"><a class="nav-link" href="./Mangduongbay.html"> Thông tin hành trình </a></li>
        <li class="nav-item"><a class="nav-link" href="./BambooClub/GioithieuQuyenloi.html"> Bamboo Club </a></li>
      </ul>
    </div>
    <div class="navbar-right">
      <ul class="navbar-nav right-menu" id="auth-menu">
        <li class="signin-li">
          <a class="signin-option-navbar" href="./dangnhap.html"> Đăng nhập </a>
        </li>
        <li>
          <a class="signup-option-navbar" href="./dangky.html"> Đăng ký </a>
        </li>
        <li>
          <img alt="Avatar" height="20" src="https://www.bambooairways.com/o/com.bav.header.languages/assets/Unlogin_Avatar.png" width="20" />
        </li>
      </ul>
    </div>
  </div>
</nav>
"""

def replace_navbar_in_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        soup = BeautifulSoup(content, 'html.parser')
        old_nav = soup.find('nav')

        if old_nav:
            new_nav_soup = BeautifulSoup(NEW_NAVBAR_HTML, 'html.parser')
            old_nav.replace_with(new_nav_soup.nav)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(soup.prettify(formatter="html"))
            return "THÀNH CÔNG"
        return "KHÔNG TÌM THẤY <nav>"
    except Exception as e:
        return f"LỖI: {str(e)}"

def run_update(root_dir):
    print(f"🚀 Đang quét thư mục: {root_dir}")
    success, skip, fail = 0, 0, 0

    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".html"):
                if filename in EXCLUDE_FILES:
                    print(f"🟡 Bỏ qua (Ngoại lệ): {filename}")
                    skip += 1
                    continue
                
                file_path = os.path.join(dirpath, filename)
                result = replace_navbar_in_file(file_path)
                
                if result == "THÀNH CÔNG":
                    success += 1
                    print(f"✅ Đã cập nhật: {filename}")
                else:
                    fail += 1
                    print(f"❌ Thất bại {filename}: {result}")

    print(f"\n✨ HOÀN THÀNH: Thành công {success} | Bỏ qua {skip} | Lỗi {fail}")

if __name__ == "__main__":
    ROOT_PATH = "./html" 
    if os.path.exists(ROOT_PATH):
        run_update(ROOT_PATH)
    else:
        print("Lỗi: Đường dẫn thư mục không đúng!")