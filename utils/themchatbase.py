import os
from bs4 import BeautifulSoup

chatbase_script = """
<script>
  (function () {
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
      window.chatbase = (...arguments) => {
        if (!window.chatbase.q) {
          window.chatbase.q = [];
        }
        window.chatbase.q.push(arguments);
      };
      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === "q") {
            return target.q;
          }
          return (...args) => target(prop, ...args);
        },
      });
    }
    const onLoad = function () {
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = "0-NN5KEWR3pUR43vUY4Me";
      script.domain = "www.chatbase.co";
      document.body.appendChild(script);
    };
    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }
  })();
</script>
"""

def inject_script_to_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    soup = BeautifulSoup(content, 'html.parser')
    
    if soup.find('script', id="0-NN5KEWR3pUR43vUY4Me") or "chatbase" in content:
        print(f"[-] Bỏ qua: {file_path} (Đã có Chatbase)")
        return

    if soup.body:
        new_script = BeautifulSoup(chatbase_script, 'html.parser')
        soup.body.append(new_script)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(soup.prettify(formatter=None))
        print(f"[+] Đã thêm Chatbase vào: {file_path}")
    else:
        print(f"[!] Lỗi: {file_path} không có thẻ <body>")

html_directory = "./html" 

if __name__ == "__main__":
    if not os.path.exists(html_directory):
        print(f"Thư mục {html_directory} không tồn tại!")
    else:
        for root, dirs, files in os.walk(html_directory):
            for file in files:
                if file.endswith(".html"):
                    file_path = os.path.join(root, file)
                    inject_script_to_html(file_path)