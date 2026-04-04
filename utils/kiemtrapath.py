import os
from bs4 import BeautifulSoup
from glob import glob

ROOT_DIR = '.' 

FILE_PATTERN = os.path.join(ROOT_DIR, 'html', '**', '*.html') 

def find_and_correct_path(html_file_path):
    """
    Đọc file HTML, tìm các thẻ 'a', kiểm tra đường dẫn href, 
    và sửa đường dẫn nếu file đích tồn tại ở vị trí khác.
    """
    print(f"--- Đang xử lý file: {html_file_path} ---")

    with open(html_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    changed = False

    for tag in soup.find_all(href=True):
        original_href = tag['href']
        
        if '://' in original_href or original_href.startswith(('mailto:', '#', 'javascript:')):
            continue

        target_filename = os.path.basename(original_href)
        
        abs_target_path = os.path.normpath(os.path.join(os.path.dirname(html_file_path), original_href))
        
        if os.path.exists(abs_target_path):
            continue

        print(f"\n[!] SAI: {original_href} (File đích: {target_filename} không tìm thấy)")
        
        search_pattern = os.path.join(ROOT_DIR, '**', target_filename)
        found_files = glob(search_pattern, recursive=True)
        
        if found_files:
            new_abs_path = found_files[0]
            
            new_relative_path = os.path.relpath(new_abs_path, os.path.dirname(html_file_path))
            
            new_relative_path = os.path.normpath(new_relative_path).replace(os.path.sep, '/')
            
            tag['href'] = new_relative_path
            changed = True
            
            print(f"[*] SỬA: Thay {original_href} -> {new_relative_path}")
            print(f"    (File đích thực: {new_abs_path})")

        else:
            print(f"[x] KHÔNG TÌM THẤY file đích '{target_filename}' ở bất kỳ đâu tro\ng {ROOT_DIR}")

    if changed:
        with open(html_file_path, 'w', encoding='utf-8') as f:
            f.write(soup.prettify()) 
        print(f"\n[v] Đã lưu và cập nhật {html_file_path}")
    else:
        print("\n[-] Không có đường dẫn nào cần sửa.")

if __name__ == "__main__":
    
    html_files = glob(FILE_PATTERN, recursive=True)
    
    if not html_files:
        print(f"Không tìm thấy file HTML nào trong thư mục {ROOT_DIR} theo pattern '{FILE_PATTERN}'")
    else:
        print(f"Tìm thấy {len(html_files)} file HTML để xử lý.")
        for file_path in html_files:
            find_and_correct_path(file_path)

    print("\n\n=== Quá trình hoàn tất ===")