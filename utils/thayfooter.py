import os
from bs4 import BeautifulSoup
from glob import glob

ROOT_DIR = '.' 

FILE_PATTERN = os.path.join(ROOT_DIR, 'html', '**', '*.html') 

NEW_FOOTER_CONTENT = """
    <div class="main-footer">
     <div class="slogan-and-logo-footer">
      <img alt="Icon-Bamboo-Airways" height="50" src="https://www.bambooairways.com/o/wpbav-home-theme/css/assets/logo.png"/>
      <div class="divider-footer-logo">
      </div>
      <h5>
       HƠN CẢ MỘT CHUYẾN BAY
      </h5>
     </div>
     <div class="divider-footer">
     </div>
     <div class="install-qr-footer">
      <div class="install-app-qr">
       <img alt="qr_code_install_app" height="70" src="https://www.bambooairways.com/documents/20122/770343/app.png/4074ab42-5f15-760b-9bb7-5d522d7ff200?t=1697600790190" width="70"/>
       <div class="install-app-qr-content">
        <h6>
         Cài đặt ứng dụng
        </h6>
        <p>
         Quét mã ngay để cài đặt từ các
        </p>
        <p>
         cửa hàng ứng dụng!
        </p>
       </div>
      </div>
      <div class="install-sticker-qr">
       <img alt="qr_code_install_sticker" height="70" src="https://www.bambooairways.com/documents/20122/770343/viber-bamboo.png/a21d4733-0669-665b-4b16-a12e153b7098?t=1697600790190" width="70"/>
       <div class="install-sticker-qr-content">
        <h6>
         Cài đặt nhãn dán
        </h6>
        <p>
         Quét mã ngay để sở hữu bộ nhãn dán Viber!
        </p>
       </div>
      </div>
     </div>
     <div class="divider-footer">
     </div>
     <div class="chooser-footer">
      <div class="bambooairways-footer">
       <h5>
        Bamboo Airways
       </h5>
       <div class="bambooairways-footer-choice">
        <a href="BambooAirways/gioithieu.html">
         Giới thiệu về Bamboo Airways
        </a>
        <a href="BambooAirways/thongdiep.html">
         Thông điệp của Bamboo Airways
        </a>
        <a href="BambooAirways/nhandienthuonghieu.html">
         Nhận diện thương hiệu
        </a>
       </div>
      </div>
      <div class="dieukhoanphaply-footer">
       <h5>
        Điều khoản &amp; Pháp lý
       </h5>
       <div class="bambooairways-footer-choice">
        <a href="Dieukhoan/dieukhoan.html">
         Điều khoản sử dụng website
        </a>
       </div>
      </div>
     </div>
    </div>
"""

def replace_footer(html_file_path, new_content):
    """
    Tìm thẻ <footer> trong file HTML và thay thế nội dung của nó.
    """
    print(f"--- Đang xử lý file: {html_file_path} ---")

    try:
        with open(html_file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"[x] Lỗi: Không tìm thấy file {html_file_path}")
        return

    soup = BeautifulSoup(content, 'html.parser')
    
    footer_tag = soup.find('footer')
    
    if footer_tag:
        footer_tag.clear()
        
        new_footer_soup = BeautifulSoup(new_content, 'html.parser')
        
        for child in new_footer_soup.contents:
            if str(child).strip() != '':
                footer_tag.append(child)
        
        with open(html_file_path, 'w', encoding='utf-8') as f:
            f.write(soup.prettify(formatter=None))
            
        print(f"✅ Đã thay thế FOOTER và cập nhật {html_file_path}")
    else:
        print("❌ Không tìm thấy thẻ <footer> trong file này, bỏ qua.")

if __name__ == "__main__":
    
    html_files = glob(FILE_PATTERN, recursive=True)
    
    if not html_files:
        print(f"❌ Không tìm thấy file HTML nào trong thư mục {ROOT_DIR} theo pattern '{FILE_PATTERN}'")
    else:
        print(f"Tìm thấy {len(html_files)} file HTML để xử lý.")
        for file_path in html_files:
            replace_footer(file_path, NEW_FOOTER_CONTENT)

    print("\n\n=== Quá trình thay thế Footer hoàn tất ===")