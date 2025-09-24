# 💘 AI Phân Tích & Ghép Đôi Tình Yêu 

> Chào mừng bạn đến với dự án "AI Phân Tích & Ghép Đôi Tình Yêu"!  
> Một play-date nhỏ cho HTML/CSS/JS: cho nhập info, up ảnh, gọi API AI để phân tích status/ảnh, lưu người dùng, và... ghép đôi random cho vui. 😋

---

## Mục lục
1. [Tổng quan nhanh](#1-tổng-quan-nhanh)  
2. [Các tập tin chính (và mình làm gì)](#2-các-tập-tin-chính-và-mình-làm-gì)  
3. [Chạy thử (Quick Start)](#3-chạy-thử-quick-start)  
4. [Cảnh báo bảo mật & quyền riêng tư (quan trọng!)](#4-cảnh-báo-bảo-mật--quyền-riêng-tư-quan-trọng)  
5. [Gợi ý cải tiến (to-do & nice-to-have)](#5-gợi-ý-cải-tiến-to-do--nice-to-have)  
6. [Đóng góp & License](#6-đóng-góp--license)

---

## 1. Tổng quan nhanh
Ứng dụng nhỏ này cho phép người dùng nhập thông tin cá nhân + status, tải lên ảnh để AI phân tích cảm xúc/tình trạng tình cảm, lưu dữ liệu tạm trong `localStorage`, và có nút "Ghép Đôi" chọn 1 nam + 1 nữ ngẫu nhiên để hiển thị.  
👉 Giao diện dễ thương, hiệu ứng trái tim bay khắp màn hình. ✨

---

## 2. Các tập tin chính (và mình làm gì)
- `index.html` — cấu trúc giao diện, form input, nút chức năng, chỗ hiển thị kết quả.  
- `style.css` — style nền gradient, layout 2 cột responsive, các button xịn sò, hiệu ứng trái tim animation, custom scrollbar.  
- `script.js` — logic toàn bộ app: xử lý nút, local file upload/read, lưu users vào `localStorage`, gọi API AI (Generative Language), phân tích ảnh (gửi base64), tạo heart effect, ghép đôi, v.v.  

> Mỗi file đã được ghi rành mạch — mở `index.html` là thấy kết quả liền (nhưng để gọi API AI thì cần config thêm, xem phần **Chạy thử**).

---

## 3. Chạy thử (Quick Start) 🚀
**Yêu cầu:** trình duyệt hiện đại. Nếu muốn dùng tính năng gọi AI, cần có API key (và nên chạy một proxy server để *không* bung API key lên client).

**Cách nhanh (không dùng AI):**
1. Tải 3 file vào cùng 1 thư mục.  
2. Mở terminal, chạy:
```
# từ thư mục chứa index.html
python -m http.server 8000
# rồi mở http://localhost:8000 trong trình duyệt
Thử nhập tên, age, status, nhấn Lưu, Ghép Đôi để thử tính năng localStorage.
```
Nếu bạn muốn gọi API AI:

Không commit API key vào repo công khai!

Thiết lập 1 server proxy để lưu API key an toàn. Ví dụ Node.js mini-proxy:
```
// server.js
require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json({ limit: '10mb' }));

app.post('/api/generate', async (req, res) => {
  try {
    const resp = await fetch(`${process.env.GEN_URL}?key=${process.env.GEN_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Proxy running: http://localhost:3000'));
```
## 4. Cảnh báo bảo mật & quyền riêng tư ⚠️
API key trong script.js — tuyệt đối không commit key này vào GitHub public.

Tránh gọi API trực tiếp từ client: hãy chuyển sang proxy server.

XSS (Cross-Site Scripting): code hiện dùng innerHTML để render kết quả → cần sanitize (ví dụ với DOMPurify).

Dữ liệu user trong localStorage: không an toàn nếu dùng thật. Nếu cần, hãy mã hoá hoặc lưu trên server.

Phân tích ảnh/khuôn mặt: xin phép người dùng, và tránh lưu trữ nếu không cần thiết.

---

## 5. Gợi ý cải tiến (to-do & nice-to-have) ✨
Di chuyển API key lên server.

Sanitize toàn bộ input/output (DOMPurify, textContent).

Thêm validation form chi tiết hơn.

Không hiển thị raw HTML từ API.

Thêm accessibility (label, aria).

Rate limit API call + loading state.

Giảm lag hiệu ứng trái tim.

Viết unit test cho logic ghép đôi & validation.

---

## 6. Đóng góp & License
Muốn đóng góp? Fork → tạo branch → PR.
License: MIT (tự do, vui vẻ).
