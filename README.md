# ❓ Quizzler - Trò chơi câu đố Đúng/Sai (React Native + Expo)

Ứng dụng câu đố Đúng/Sai. Câu hỏi hiển thị tuần tự, người dùng chọn **Đúng** hoặc **Sai** và nhận kết quả ngay bên dưới.

## ✨ Chức năng

- Hiển thị một câu hỏi cỡ chữ lớn ở phần trên và hai nút **Đúng** (xanh lá) / **Sai** (đỏ).
- Dữ liệu câu hỏi định nghĩa bằng class `Question` và lưu trong một mảng (`questionBank`).
- So sánh câu trả lời của người dùng với đáp án đúng, thêm biểu tượng ✓ hoặc ✗ vào danh sách `scoreKeeper`.
- Hiển thị danh sách biểu tượng kết quả theo thứ tự trả lời.
- Hết câu hỏi thì hiện màn hình kết quả; bấm **Chơi lại** để quay về câu đầu và xoá điểm cũ.

**Tính năng nâng cao**

- Hiển thị tiến độ (Câu x/y) và số câu đúng.
- Xáo trộn thứ tự câu hỏi mỗi lần chơi.
- Hiệu ứng mờ dần khi chuyển câu hỏi (`Animated`).
- Rung phản hồi khác nhau khi trả lời đúng và sai (`expo-haptics`).

## 🛠 Công nghệ sử dụng

- [React Native](https://reactnative.dev/)
- [Expo SDK](https://expo.dev/)
- `expo-haptics`

## 📁 Cấu trúc thư mục

```
Quizzler/
├── screenshots/
├── App.js          (giao diện + logic trò chơi)
├── Question.js     (class Question)
├── app.json
├── package.json
└── README.md
```

## 🚀 Cài đặt và chạy

**Yêu cầu:** Node.js 18 trở lên, ứng dụng **Expo Go** trên điện thoại (hoặc emulator).

```bash
# 1. Clone dự án
git clone https://github.com/<username>/<repo>.git
cd <repo>

# 2. Cài thư viện
npm install

# 3. Chạy ứng dụng
npx expo start
```
