import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

MIN_HREF_LENGTH = 3
IGNORED_DOMAINS = ["#"]
IGNORED_SCHEMES = ["mailto", "tel"]

def get_line_number(content, tag_string):
    """
    Cố gắng tìm số dòng của thẻ HTML.
    """
    try:
        lines = content.splitlines()
        short_tag = tag_string[:100]
        for i, line in enumerate(lines):
            if short_tag in line:
                return i + 1
        return 'N/A'
    except:
        return 'N/A'

def check_file_for_missing_links(html_file_path):
    """
    Thực hiện kiểm tra các thẻ <a> trong một file HTML cụ thể.
    """
    try:
        with open(html_file_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
    except FileNotFoundError:
        print(f"Lỗi: Không tìm thấy file tại đường dẫn '{html_file_path}'")
        return []
    except Exception as e:
        print(f"Lỗi khi đọc file {html_file_path}: {e}")
        return []

    soup = BeautifulSoup(html_content, 'html.parser')
    all_links = soup.find_all('a', href=True)
    potential_issues = []
    
    for link in all_links:
        href = link.get('href', '').strip()
        link_text = link.get_text().strip()
        line_num = get_line_number(html_content, str(link))
        
        issue_type = None

        if href and urlparse(href).scheme in IGNORED_SCHEMES:
            continue

        if not href:
            issue_type = "HREF TRỐNG"
        elif href == "#":
            issue_type = "HREF CHỈ CÓ # (Placeholder)"
        elif len(href) > 0 and len(href) <= MIN_HREF_LENGTH and href not in IGNORED_DOMAINS:
            issue_type = f"HREF RẤT NGẮN (<={MIN_HREF_LENGTH} ký tự)"
        
        if issue_type:
            potential_issues.append({
                "file": html_file_path,
                "type": issue_type,
                "href": href,
                "text": link_text if len(link_text) < 50 else link_text[:47] + "...",
                "line": line_num,
            })
            
    return potential_issues

def check_directory_recursively(root_dir):
    """
    Duyệt qua thư mục gốc và các thư mục con để tìm và kiểm tra tất cả các file HTML.
    """
    total_issues = []
    html_files_checked = 0

    print(f"Bắt đầu duyệt và kiểm tra thư mục gốc: {root_dir}\n" + "="*70)

    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".html"):
                file_path = os.path.join(dirpath, filename)
                html_files_checked += 1
                
                issues = check_file_for_missing_links(file_path)
                
                if issues:
                    total_issues.extend(issues)
                    print(f"🚨 Phát hiện {len(issues)} vấn đề trong file: {file_path}")
                else:
                    print(f"✅ File OK: {file_path}")

    print("\n" + "="*70)
    print(f"TỔNG KẾT: Đã kiểm tra {html_files_checked} file HTML.")
    
    if total_issues:
        print(f"\n⚠️ TỔNG CỘNG {len(total_issues)} VẤN ĐỀ TIỀM ẨN CẦN XỬ LÝ:\n")
        
        print(f"{'FILE':<50} | {'DÒNG':<6} | {'LOẠI VẤN ĐỀ':<30} | {'HREF':<15} | {'NỘI DUNG TEXT':<20}")
        print("-" * 130)
        
        for issue in total_issues:
            short_file = os.path.basename(issue['file'])
            print(f"{short_file:<50} | {issue['line']:<6} | {issue['type']:<30} | {issue['href'][:13]:<15} | {issue['text']:<20}")

    else:
        print("🎉 HOÀN TẤT! Không tìm thấy liên kết trống hoặc placeholder nào trong tất cả các file HTML.")


if __name__ == "__main__":
    
    
    ROOT_DIRECTORY = "./html"
    
    if os.path.isdir(ROOT_DIRECTORY):
        check_directory_recursively(ROOT_DIRECTORY)
    else:
        print(f"Lỗi: Thư mục gốc '{ROOT_DIRECTORY}' không tồn tại. Vui lòng kiểm tra lại đường dẫn.")