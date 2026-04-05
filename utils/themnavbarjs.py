import os
from bs4 import BeautifulSoup

# --- CẤU HÌNH ---
HTML_DIRECTORY = "./html"  # Thư mục chứa các file HTML của cậu
JS_FILENAME = "navbar.js"  # Tên file script cần thêm

# Các file ngoại lệ KHÔNG THÊM navbar.js (vì đã có logic riêng)
EXCLUDE_FILES = [
    "datve.html", 
    "hanhkhach.html", 
    "chondichvu.html", 
    "payment.html",
    "thanhtoan.html",
    "dangnhap.html",
    "dangky.html"
]

def inject_navbar_script(file_path, root_dir):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        soup = BeautifulSoup(content, 'html.parser')
        filename = os.path.basename(file_path)

        # 1. Kiểm tra xem file có trong danh sách đen không
        if filename in EXCLUDE_FILES:
            print(f"[-] Bỏ qua (Ngoại lệ): {filename}")
            return

        # 2. Kiểm tra xem đã có script này chưa để tránh trùng lặp
        if soup.find('script', src=lambda x: x and JS_FILENAME in x):
            print(f"[-] Bỏ qua: {filename} (Đã có {JS_FILENAME})")
            return

        # 3. Tính toán đường dẫn tương đối đến thư mục js
        # Giả định cấu trúc: /html/index.html và /js/navbar.js
        # Hoặc /html/Khampha/abc.html và /js/navbar.js
        rel_dir = os.path.relpath(os.path.dirname(file_path), root_dir)
        if rel_dir == ".":
            js_path = f"../js/{JS_FILENAME}" # Nếu file nằm ngay trong /html
        else:
            # Nếu file nằm sâu hơn (ví dụ /html/Khampha)
            depth = len(rel_dir.split(os.sep))
            prefix = "../" * (depth + 1)
            js_path = f"{prefix}js/{JS_FILENAME}"

        if soup.body:
            # Tạo tag script mới
            new_script = soup.new_tag("script", src=js_path)
            soup.body.append(new_script)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                # formatter=None để giữ nguyên code không bị đổi thực thể HTML
                f.write(soup.prettify(formatter=None))
            print(f"[+] Đã thêm {JS_FILENAME} vào: {filename} (Path: {js_path})")
        else:
            print(f"[!] Lỗi: {filename} không có thẻ <body>")

    except Exception as e:
        print(f"[!] Lỗi xử lý {file_path}: {e}")

if __name__ == "__main__":
    if not os.path.exists(HTML_DIRECTORY):
        print(f"Thư mục {HTML_DIRECTORY} không tồn tại! Hãy kiểm tra lại đường dẫn.")
    else:
        print(f"🚀 Bắt đầu quét và thêm {JS_FILENAME}...")
        for root, dirs, files in os.walk(HTML_DIRECTORY):
            for file in files:
                if file.endswith(".html"):
                    file_path = os.path.join(root, file)
                    inject_navbar_script(file_path, HTML_DIRECTORY)
        print("\n✨ Hoàn thành!")