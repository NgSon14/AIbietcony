// ========== CONFIG API ==========
const API_KEY = "AIzaSyD9cbFgJeg2QRXQzGHINOPW4qcIqlOFdrM";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// ========== UI Elements ==========
const username = document.getElementById("username");
const age = document.getElementById("age");
const gender = document.getElementById("gender");
const phone = document.getElementById("phone");
const linkface = document.getElementById("linkface");
const statusInput = document.getElementById("statusInput");

// Image Analysis Elements
const uploadImageBtn = document.getElementById("uploadImageBtn");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const previewImg = document.getElementById("previewImg");
const analyzeImageBtn = document.getElementById("analyzeImageBtn");

const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");
const sampleBtn = document.getElementById("sampleBtn");
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const saveBtn = document.getElementById("saveBtn");
const matchBtn = document.getElementById("matchBtn");

const resultBox = document.getElementById("resultBox");

// ========== Heart Effect ==========
function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.innerHTML = "💖";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = Math.random() * 20 + 15 + "px";
  document.querySelector(".hearts").appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 5000);
}
setInterval(createHeart, 800);

// ========== Handle Sample Data ==========
sampleBtn.addEventListener("click", () => {
  statusInput.value = "Mỗi tối đều nhớ đến ai đó, nhưng chẳng dám nhắn tin 💌";
});

// ========== Handle File Upload ==========
uploadBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        resultBox.innerHTML = "📂 Nội dung tệp đã tải lên:<br>" + content.substring(0, 300) + "...";
        statusInput.value = content.substring(0, 200);
      } catch (err) {
        resultBox.innerHTML = "❌ Lỗi đọc tệp: " + err.message;
      }
    };
    reader.readAsText(file);
  }
});

// ========== Handle Save Info ==========
saveBtn.addEventListener("click", () => {
  if (!username.value || !age.value || !gender.value) {
    alert("⚠️ Vui lòng nhập đầy đủ Tên, Tuổi và Giới tính!");
    return;
  }
  const userData = {
    username: username.value,
    age: age.value,
    gender: gender.value,
    phone: phone.value,
    linkface: linkface.value,
    status: statusInput.value
  };

  let storedUsers = JSON.parse(localStorage.getItem("users")) || [];
  storedUsers.push(userData);
  localStorage.setItem("users", JSON.stringify(storedUsers));

  alert("✅ Đã lưu thông tin!");
});

// ========== Handle Matchmaking ==========
matchBtn.addEventListener("click", () => {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.length < 2) {
    resultBox.innerHTML = "⚠️ Chưa đủ dữ liệu để ghép đôi!";
    return;
  }

  // Tách riêng Nam và Nữ
  let males = users.filter(u => u.gender === "Nam");
  let females = users.filter(u => u.gender === "Nữ");

  if (males.length === 0 || females.length === 0) {
    resultBox.innerHTML = "❌ Không có dữ liệu để ghép đôi Nam - Nữ.";
    return;
  }

  // Chọn ngẫu nhiên 1 Nam + 1 Nữ
  let male = males[Math.floor(Math.random() * males.length)];
  let female = females[Math.floor(Math.random() * females.length)];

  resultBox.innerHTML = `
    💘 Ghép đôi thành công! 💘<br><br>
    <b>👦 Nam:</b><br>
    🔹 Tên: ${male.username}<br>
    🔹 Tuổi: ${male.age}<br>
    🔹 SĐT: ${male.phone || "Chưa có"}<br>
    🔹 Facebook: <a href="${male.linkface}" target="_blank">${male.linkface || "Chưa có"}</a><br>
    🔹 Status: ${male.status || "Chưa nhập"}<br><br>

    <b>👩 Nữ:</b><br>
    🔹 Tên: ${female.username}<br>
    🔹 Tuổi: ${female.age}<br>
    🔹 SĐT: ${female.phone || "Chưa có"}<br>
    🔹 Facebook: <a href="${female.linkface}" target="_blank">${female.linkface || "Chưa có"}</a><br>
    🔹 Status: ${female.status || "Chưa nhập"}<br>
  `;
});
// ========== Handle Analyze ==========
analyzeBtn.addEventListener("click", async () => {
  const text = statusInput.value.trim();
  if (!text) {
    resultBox.innerHTML = "⚠️ Vui lòng nhập status để phân tích!";
    return;
  }

  resultBox.innerHTML = "⏳ Đang phân tích...";

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Phân tích status sau để xác định trạng thái tình cảm (độc thân, đang hẹn hò, hay mập mờ): ${text}`
          }]
        }]
      })
    });

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Không có kết quả.";
    
    // Format the AI response text
    const formattedText = aiText
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold text
      .replace(/^\d+\./gm, '<br><br>$&') // New lines for numbered points
      .replace(/^\*/gm, '<br>•') // Bullet points for asterisks
      .replace(/\n/g, '<br>'); // Handle regular line breaks
    
    resultBox.innerHTML = `<b>Kết quả:</b><br>${formattedText}`;
  } catch (err) {
    resultBox.innerHTML = "❌ Lỗi khi gọi AI: " + err.message;
  }
});

// ========== Handle Image Analysis ==========
uploadImageBtn.addEventListener("click", () => {
  imageInput.click();
});

imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

analyzeImageBtn.addEventListener("click", async () => {
  const image = previewImg.src;
  if (!image) {
    resultBox.innerHTML = "⚠️ Vui lòng tải ảnh lên trước khi phân tích!";
    return;
  }

  resultBox.innerHTML = "⏳ Đang phân tích ảnh...";

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Hãy phân tích ảnh này và cho biết những đặc điểm nổi bật về trạng thái cảm xúc, tâm trạng hoặc tình cảm mà bạn có thể nhận thấy:" },
            { inlineData: { mimeType: "image/jpeg", data: image.split(",")[1] } }
          ]
        }]
      })
    });

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Không có kết quả phân tích.";
    
    // Format the AI response text
    const formattedText = aiText
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold text
      .replace(/^\d+\./gm, '<br><br>$&') // New lines for numbered points
      .replace(/^\*/gm, '<br>•') // Bullet points for asterisks
      .replace(/\n/g, '<br>'); // Handle regular line breaks
    
    resultBox.innerHTML = `
      <b>📷 Kết quả phân tích ảnh:</b><br>
      ${formattedText}
    `;
  } catch (err) {
    resultBox.innerHTML = "❌ Lỗi khi phân tích ảnh: " + err.message;
  }
});

// ========== Handle Clear ==========
clearBtn.addEventListener("click", () => {
  username.value = "";
  age.value = "";
  gender.value = "";
  phone.value = "";
  linkface.value = "";
  statusInput.value = "";
  imagePreview.style.display = "none";
  previewImg.src = "";
  resultBox.innerHTML = "Kết quả sẽ hiển thị tại đây...";
});
