import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Question from './Question';

// Danh sách câu hỏi (List<Question> trong Dart)
const questionBank = [
  new Question('Nước sôi ở 100°C ở điều kiện áp suất tiêu chuẩn.', true),
  new Question('Hà Nội là thủ đô của Việt Nam.', true),
  new Question('Con người chỉ sử dụng 10% bộ não của mình.', false),
  new Question('Cá voi là một loài cá.', false),
  new Question('Sông Mê Kông chảy qua lãnh thổ Việt Nam.', true),
  new Question('Mặt Trăng tự phát ra ánh sáng.', false),
  new Question('Cơ thể người trưởng thành có 206 chiếc xương.', true),
  new Question('Flutter sử dụng ngôn ngữ lập trình Dart.', true),
  new Question('React Native do Google phát triển.', false),
  new Question('Sa mạc Sahara nằm ở châu Á.', false),
  new Question('Vàng có ký hiệu hóa học là Au.', true),
  new Question('Một năm nhuận có 365 ngày.', false),
  new Question('Trái Đất quay quanh Mặt Trời.', true),
];

// Xáo trộn thứ tự câu hỏi (Fisher-Yates)
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const haptic = (fn) => {
  try {
    fn();
  } catch (e) {}
};

export default function App() {
  // Tương đương các biến trạng thái trong State<QuizPage>
  const [questions, setQuestions] = useState(() => shuffle(questionBank));
  const [questionNumber, setQuestionNumber] = useState(0);
  const [scoreKeeper, setScoreKeeper] = useState([]); // mảng true/false
  const [finished, setFinished] = useState(false);

  const fade = useRef(new Animated.Value(1)).current;

  const total = questions.length;
  const currentQuestion = questions[questionNumber];
  const correctCount = scoreKeeper.filter(Boolean).length;

  // Hiệu ứng mờ dần khi chuyển câu hỏi
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [questionNumber, fade]);

  const checkAnswer = (userPickedAnswer) => {
    if (finished) return;

    const isCorrect = currentQuestion.questionAnswer === userPickedAnswer;

    haptic(() =>
      Haptics.notificationAsync(
        isCorrect
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error
      )
    );

    setScoreKeeper((prev) => [...prev, isCorrect]);

    if (questionNumber >= total - 1) {
      setFinished(true); // hết câu hỏi
    } else {
      setQuestionNumber((n) => n + 1);
    }
  };

  // Thiết lập lại trạng thái: xoá điểm, quay về câu đầu, xáo lại câu hỏi
  const reset = () => {
    setQuestions(shuffle(questionBank));
    setQuestionNumber(0);
    setScoreKeeper([]);
    setFinished(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* Thanh thông tin */}
      <View style={styles.infoBar}>
        <Text style={styles.infoText}>
          Câu {Math.min(questionNumber + 1, total)}/{total}
        </Text>
        <Text style={styles.infoText}>Đúng: {correctCount}</Text>
      </View>

      {/* Expanded: phần câu hỏi chiếm nhiều không gian nhất (flex: 5) */}
      <View style={styles.questionArea}>
        {finished ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Hoàn thành!</Text>
            <Text style={styles.resultScore}>
              Bạn đúng {correctCount}/{total} câu
            </Text>
            <Pressable
              onPress={reset}
              style={({ pressed }) => [styles.restartButton, pressed && styles.pressed]}
            >
              <Text style={styles.restartText}>Chơi lại</Text>
            </Pressable>
          </View>
        ) : (
          <Animated.Text style={[styles.questionText, { opacity: fade }]}>
            {currentQuestion.questionText}
          </Animated.Text>
        )}
      </View>

      {/* Hai nút Đúng / Sai */}
      <View style={styles.buttonArea}>
        <Pressable
          disabled={finished}
          onPress={() => checkAnswer(true)}
          style={({ pressed }) => [
            styles.answerButton,
            { backgroundColor: '#2E7D32' },
            (pressed || finished) && styles.pressed,
          ]}
        >
          <Text style={styles.answerText}>Đúng</Text>
        </Pressable>

        <Pressable
          disabled={finished}
          onPress={() => checkAnswer(false)}
          style={({ pressed }) => [
            styles.answerButton,
            { backgroundColor: '#C62828' },
            (pressed || finished) && styles.pressed,
          ]}
        >
          <Text style={styles.answerText}>Sai</Text>
        </Pressable>
      </View>

      {/* Row: danh sách biểu tượng kết quả (scoreKeeper) */}
      <View style={styles.scoreRow}>
        {scoreKeeper.map((ok, i) => (
          <Text
            key={i}
            style={[styles.icon, { color: ok ? '#4CAF50' : '#F44336' }]}
          >
            {ok ? '✓' : '✗'}
          </Text>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 12,
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  infoText: {
    color: '#9E9E9E',
    fontSize: 15,
    fontWeight: '500',
  },
  questionArea: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  questionText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 36,
  },
  buttonArea: {
    flex: 2,
    justifyContent: 'center',
  },
  answerButton: {
    flex: 1,
    marginVertical: 6,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.6,
  },
  scoreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    minHeight: 40,
    paddingVertical: 8,
  },
  icon: {
    fontSize: 24,
    fontWeight: '700',
    marginRight: 6,
  },
  resultBox: {
    alignItems: 'center',
  },
  resultTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
  },
  resultScore: {
    color: '#BDBDBD',
    fontSize: 20,
    marginTop: 10,
  },
  restartButton: {
    marginTop: 24,
    backgroundColor: '#1565C0',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 10,
  },
  restartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});