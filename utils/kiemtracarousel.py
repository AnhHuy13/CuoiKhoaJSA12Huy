import os
from bs4 import BeautifulSoup

def check_file_for_carousel(html_file_path):
    """
    Kiểm tra một file HTML cụ thể xem có chứa carousel hay không.
    """
    try:
        with open(html_file_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
    except Exception as e:
        return f"Lỗi đọc file: {e}"

    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Tìm kiếm bất kỳ thẻ div nào có class="carousel"
    carousel_tag = soup.find('div', class_='carousel')
    
    if carousel_tag:
        return True, "CÓ"
    else:
        return False, "KHÔNG"

def check_directory_for_carousels(root_dir):
    """
    Duyệt qua thư mục gốc và các thư mục con để tìm và kiểm tra carousel.
    """
    print(f"Bắt đầu kiểm tra Carousel trong thư mục: {root_dir}")
    print("=" * 70)
    
    files_with_carousel = []
    files_missing_carousel = []

    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".html"):
                file_path = os.path.join(dirpath, filename)
                
                has_carousel, result_text = check_file_for_carousel(file_path)
                
                print(f"[{result_text:<4}] {file_path}")
                
                if has_carousel:
                    files_with_carousel.append(file_path)
                else:
                    files_missing_carousel.append(file_path)

    print("\n" + "=" * 70)
    print(f"TỔNG KẾT: Đã kiểm tra {len(files_with_carousel) + len(files_missing_carousel)} file HTML.")
    
    if files_missing_carousel:
        print("\n⚠️ DANH SÁCH CÁC FILE THIẾU CAROUSEL:")
        for file in files_missing_carousel:
            print(f"- {file}")
    
    if files_with_carousel:
        print("\n✅ DANH SÁCH CÁC FILE ĐÃ CÓ CAROUSEL:")
        for file in files_with_carousel:
            print(f"- {file}")

# --- Ví dụ sử dụng ---
if __name__ == "__main__":
    
    # ĐỊNH NGHĨA THƯ MỤC CẦN XỬ LÝ
    # Ví dụ: Giả định các file HTML nằm trong thư mục ../../html
    ROOT_DIRECTORY = "./html" 
    
    # Kiểm tra tồn tại trước khi chạy
    if os.path.isdir(ROOT_DIRECTORY):
        check_directory_for_carousels(ROOT_DIRECTORY)
    else:
        print(f"Lỗi: Thư mục gốc '{ROOT_DIRECTORY}' không tồn tại. Vui lòng kiểm tra lại đường dẫn.")