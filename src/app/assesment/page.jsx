// "use client";
// import { useState, useEffect } from "react";
// import { generateGeminiResponse } from "../../../configs/AImodel";
// import { useRouter } from "next/navigation";

// const SCIENCE_TOPICS = [
//   "Quantum Physics", "Molecular Biology", "Climate Change", "Genetics", 
//   "Neuroscience", "Organic Chemistry", "Astrophysics", "Ecology",
//   "Thermodynamics", "Cell Biology", "Evolution", "Atomic Structure",
//   "Renewable Energy", "Marine Biology", "Photosynthesis", "DNA Replication"
// ];

// export default function QuizPage() {
//   const router = useRouter();
//   const [selectedTopic, setSelectedTopic] = useState('');
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [quizGenerated, setQuizGenerated] = useState(false);
//   const [showResults, setShowResults] = useState(false);
//   const [score, setScore] = useState(0);
//   const [threshold] = useState(60);

//   useEffect(() => {
//     // Select random topic on component mount
//     const randomTopic = SCIENCE_TOPICS[Math.floor(Math.random() * SCIENCE_TOPICS.length)];
//     setSelectedTopic(randomTopic);
//   }, []);

//   const generateQuiz = async () => {
//     if (!selectedTopic) return;
    
//     setLoading(true);
//     try {
//       const prompt = `Generate a quiz on "${selectedTopic}" with exactly 5 multiple choice questions and 2 subjective questions. 

// Format the response as follows:

// MCQ QUESTIONS:
// 1. [Question text]
// A) [Option 1]
// B) [Option 2] 
// C) [Option 3]
// D) [Option 4]
// CORRECT: A

// 2. [Question text]
// A) [Option 1]
// B) [Option 2]
// C) [Option 3] 
// D) [Option 4]
// CORRECT: B

// [Continue for questions 3-5]

// SUBJECTIVE QUESTIONS:
// 6. [Question text]

// 7. [Question text]

// Make the questions moderately challenging and educational.`;

//       const result = await generateGeminiResponse(prompt);
//       parseQuizData(result);
//       setQuizGenerated(true);
//     } catch (err) {
//       console.error("Error generating quiz:", err);
//       alert("Error generating quiz. Please try again.");
//     }
//     setLoading(false);
//   };

//   const parseQuizData = (response) => {
//     const lines = response.split('\n').filter(line => line.trim());
//     const parsedQuestions = [];
//     let currentQuestion = null;

//     for (let i = 0; i < lines.length; i++) {
//       const line = lines[i].trim();
      
//       // Check for question number
//       const questionMatch = line.match(/^(\d+)\.\s*(.+)/);
//       if (questionMatch) {
//         // Save previous question
//         if (currentQuestion) {
//           parsedQuestions.push(currentQuestion);
//         }
        
//         const questionNum = parseInt(questionMatch[1]);
//         const questionText = questionMatch[2];
        
//         if (questionNum <= 5) {
//           // MCQ question
//           currentQuestion = {
//             id: questionNum,
//             type: 'mcq',
//             question: questionText,
//             options: [],
//             correctAnswer: ''
//           };
//         } else {
//           // Subjective question
//           currentQuestion = {
//             id: questionNum,
//             type: 'subjective',
//             question: questionText
//           };
//         }
//       }
//       // Parse options for MCQ
//       else if (currentQuestion && currentQuestion.type === 'mcq' && /^[A-D]\)/.test(line)) {
//         const optionText = line.substring(2).strip();
//         currentQuestion.options.push(optionText);
//       }
//       // Parse correct answer
//       else if (line.startsWith('CORRECT:')) {
//         if (currentQuestion && currentQuestion.type === 'mcq') {
//           currentQuestion.correctAnswer = line.split(':')[1].trim();
//         }
//       }
//     }
    
//     // Add last question
//     if (currentQuestion) {
//       parsedQuestions.push(currentQuestion);
//     }

//     // Fallback if parsing fails
//     if (parsedQuestions.length < 7) {
//       const fallbackQuestions = createFallbackQuestions();
//       setQuestions(fallbackQuestions);
//     } else {
//       setQuestions(parsedQuestions);
//     }
//   };

//   const createFallbackQuestions = () => {
//     return [
//       {
//         id: 1,
//         type: 'mcq',
//         question: `What is a key principle in ${selectedTopic}?`,
//         options: ['Principle A', 'Principle B', 'Principle C', 'Principle D'],
//         correctAnswer: 'A'
//       },
//       {
//         id: 2,
//         type: 'mcq',
//         question: `Which method is commonly used in ${selectedTopic} research?`,
//         options: ['Method X', 'Method Y', 'Method Z', 'Method W'],
//         correctAnswer: 'B'
//       },
//       {
//         id: 3,
//         type: 'mcq',
//         question: `What application is related to ${selectedTopic}?`,
//         options: ['Application 1', 'Application 2', 'Application 3', 'Application 4'],
//         correctAnswer: 'C'
//       },
//       {
//         id: 4,
//         type: 'mcq',
//         question: `Which characteristic defines ${selectedTopic}?`,
//         options: ['Feature A', 'Feature B', 'Feature C', 'Feature D'],
//         correctAnswer: 'A'
//       },
//       {
//         id: 5,
//         type: 'mcq',
//         question: `What is the significance of ${selectedTopic}?`,
//         options: ['Significance 1', 'Significance 2', 'Significance 3', 'Significance 4'],
//         correctAnswer: 'D'
//       },
//       {
//         id: 6,
//         type: 'subjective',
//         question: `Explain the importance of ${selectedTopic} in modern science.`
//       },
//       {
//         id: 7,
//         type: 'subjective',
//         question: `Describe a real-world application of ${selectedTopic}.`
//       }
//     ];
//   };

//   const handleAnswerChange = (questionId, answer) => {
//     setAnswers(prev => ({
//       ...prev,
//       [questionId]: answer
//     }));
//   };

//   const calculateScore = () => {
//     let correctAnswers = 0;
//     const mcqQuestions = questions.filter(q => q.type === 'mcq');
    
//     mcqQuestions.forEach(question => {
//       if (answers[question.id] === question.correctAnswer) {
//         correctAnswers++;
//       }
//     });

//     return (correctAnswers / mcqQuestions.length) * 100;
//   };

//   const submitQuiz = () => {
//     const calculatedScore = calculateScore();
//     setScore(calculatedScore);
//     setShowResults(true);
//   };

//   const goToFollowUp = () => {
//     // Store quiz data in localStorage for the follow-up page
//     const quizData = {
//       topic: selectedTopic,
//       score: score,
//       threshold: threshold,
//       answers: answers,
//       questions: questions
//     };
//     localStorage.setItem('quizData', JSON.stringify(quizData));
//     router.push('/follow-up');
//   };

//   const resetQuiz = () => {
//     const newTopic = SCIENCE_TOPICS[Math.floor(Math.random() * SCIENCE_TOPICS.length)];
//     setSelectedTopic(newTopic);
//     setQuestions([]);
//     setAnswers({});
//     setQuizGenerated(false);
//     setShowResults(false);
//     setScore(0);
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
//       <div className="bg-white rounded-xl shadow-lg p-8">
//         <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
//           Science Quiz Challenge
//         </h1>
        
//         <div className="text-center mb-8">
//           <h2 className="text-2xl font-semibold text-blue-600 mb-2">
//             Topic: {selectedTopic}
//           </h2>
//           <p className="text-gray-600">
//             5 Multiple Choice + 2 Subjective Questions
//           </p>
//           <p className="text-sm text-gray-500 mt-1">
//             Passing Threshold: {threshold}%
//           </p>
//         </div>

//         {!quizGenerated ? (
//           <div className="text-center py-12">
//             <button
//               onClick={generateQuiz}
//               disabled={loading}
//               className="px-8 py-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 transition-colors text-lg"
//             >
//               {loading ? (
//                 <div className="flex items-center">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                   Generating Quiz...
//                 </div>
//               ) : (
//                 'Generate Quiz'
//               )}
//             </button>
//           </div>
//         ) : showResults ? (
//           <div className="text-center py-8">
//             <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-8 mb-8">
//               <h3 className="text-2xl font-bold mb-4 text-gray-800">Quiz Results</h3>
//               <div className="text-5xl font-bold mb-4 text-blue-600">{score.toFixed(1)}%</div>
//               <div className={`text-xl font-medium mb-4 ${
//                 score >= threshold ? 'text-green-600' : 'text-orange-600'
//               }`}>
//                 {score >= threshold ? '🎉 Excellent Performance!' : '📚 Needs Improvement'}
//               </div>
//               <p className="text-gray-600 mb-6 text-lg">
//                 {score >= threshold 
//                   ? 'Great job! You\'re ready for advanced topics.'
//                   : 'Let\'s work on strengthening your foundation.'
//                 }
//               </p>
//               <div className="flex gap-4 justify-center">
//                 <button
//                   onClick={goToFollowUp}
//                   className={`px-8 py-3 text-white rounded-lg font-medium transition-colors ${
//                     score >= threshold 
//                       ? 'bg-green-500 hover:bg-green-600' 
//                       : 'bg-orange-500 hover:bg-orange-600'
//                   }`}
//                 >
//                   {score >= threshold ? 'Explore Advanced Topics' : 'Get Learning Help'}
//                 </button>
//                 <button
//                   onClick={resetQuiz}
//                   className="px-8 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
//                 >
//                   Try New Topic
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {questions.map((question, index) => (
//               <div key={question.id} className="border rounded-lg p-6 bg-gray-50">
//                 <h3 className="font-semibold text-lg mb-4 text-gray-800">
//                   {index + 1}. {question.question}
//                 </h3>
                
//                 {question.type === 'mcq' ? (
//                   <div className="space-y-3">
//                     {['A', 'B', 'C', 'D'].map((option, optIndex) => (
//                       <label key={option} className="flex items-center space-x-3 cursor-pointer hover:bg-white p-3 rounded transition-colors">
//                         <input
//                           type="radio"
//                           name={`question-${question.id}`}
//                           value={option}
//                           onChange={(e) => handleAnswerChange(question.id, e.target.value)}
//                           className="text-blue-500 w-4 h-4"
//                         />
//                         <span className="text-gray-700">
//                           {option}) {question.options[optIndex] || `Option ${option}`}
//                         </span>
//                       </label>
//                     ))}
//                   </div>
//                 ) : (
//                   <textarea
//                     className="w-full p-4 border rounded-lg resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Write your detailed answer here..."
//                     onChange={(e) => handleAnswerChange(question.id, e.target.value)}
//                     value={answers[question.id] || ''}
//                   />
//                 )}
//               </div>
//             ))}
            
//             <div className="text-center pt-6">
//               <button
//                 onClick={submitQuiz}
//                 disabled={Object.keys(answers).length < 5}
//                 className="px-8 py-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg"
//               >
//                 Submit Quiz
//               </button>
//               <p className="text-sm text-gray-500 mt-2">
//                 Complete at least the multiple choice questions to submit
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


//working code


// "use client";
// import { useState, useEffect } from "react";
// import { generateGeminiResponse } from "../../../configs/AImodel";
// import { useRouter } from "next/navigation";

// const SCIENCE_TOPICS = [
//   "Quantum Physics", "Molecular Biology", "Climate Change", "Genetics", 
//   "Neuroscience", "Organic Chemistry", "Astrophysics", "Ecology",
//   "Thermodynamics", "Cell Biology", "Evolution", "Atomic Structure",
//   "Renewable Energy", "Marine Biology", "Photosynthesis", "DNA Replication"
// ];

// export default function QuizPage() {
//   const router = useRouter();
//   const [selectedTopic, setSelectedTopic] = useState('');
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [quizGenerated, setQuizGenerated] = useState(false);
//   const [showResults, setShowResults] = useState(false);
//   const [score, setScore] = useState(0);
//   const [threshold] = useState(60);

//   useEffect(() => {
//     // Select random topic on component mount
//     const randomTopic = SCIENCE_TOPICS[Math.floor(Math.random() * SCIENCE_TOPICS.length)];
//     setSelectedTopic(randomTopic);
//   }, []);

//   const generateQuiz = async () => {
//     if (!selectedTopic) return;
    
//     setLoading(true);
//     try {
//       const prompt = `Generate a quiz on "${selectedTopic}" with exactly 5 multiple choice questions and 2 subjective questions. 

// Format the response as follows:

// MCQ QUESTIONS:
// 1. [Question text]
// A) [Option 1]
// B) [Option 2] 
// C) [Option 3]
// D) [Option 4]
// CORRECT: A

// 2. [Question text]
// A) [Option 1]
// B) [Option 2]
// C) [Option 3] 
// D) [Option 4]
// CORRECT: B

// [Continue for questions 3-5]

// SUBJECTIVE QUESTIONS:
// 6. [Question text]

// 7. [Question text]

// Make the questions moderately challenging and educational.`;

//       const result = await generateGeminiResponse(prompt);
//       parseQuizData(result);
//       setQuizGenerated(true);
//     } catch (err) {
//       console.error("Error generating quiz:", err);
//       alert("Error generating quiz. Please try again.");
//     }
//     setLoading(false);
//   };

//   const parseQuizData = (response) => {
//     const lines = response.split('\n').filter(line => line.trim());
//     const parsedQuestions = [];
//     let currentQuestion = null;

//     for (let i = 0; i < lines.length; i++) {
//       const line = lines[i].trim();
      
//       // Check for question number
//       const questionMatch = line.match(/^(\d+)\.\s*(.+)/);
//       if (questionMatch) {
//         // Save previous question
//         if (currentQuestion) {
//           parsedQuestions.push(currentQuestion);
//         }
        
//         const questionNum = parseInt(questionMatch[1]);
//         const questionText = questionMatch[2];
        
//         if (questionNum <= 5) {
//           // MCQ question
//           currentQuestion = {
//             id: questionNum,
//             type: 'mcq',
//             question: questionText,
//             options: [],
//             correctAnswer: ''
//           };
//         } else {
//           // Subjective question
//           currentQuestion = {
//             id: questionNum,
//             type: 'subjective',
//             question: questionText
//           };
//         }
//       }
//       // Parse options for MCQ
//       else if (currentQuestion && currentQuestion.type === 'mcq' && /^[A-D]\)/.test(line)) {
//         const optionText = line.substring(2).trim();
//         currentQuestion.options.push(optionText);
//       }
//       // Parse correct answer
//       else if (line.startsWith('CORRECT:')) {
//         if (currentQuestion && currentQuestion.type === 'mcq') {
//           currentQuestion.correctAnswer = line.split(':')[1].trim();
//         }
//       }
//     }
    
//     // Add last question
//     if (currentQuestion) {
//       parsedQuestions.push(currentQuestion);
//     }

//     // Fallback if parsing fails
//     if (parsedQuestions.length < 7) {
//       const fallbackQuestions = createFallbackQuestions();
//       setQuestions(fallbackQuestions);
//     } else {
//       setQuestions(parsedQuestions);
//     }
//   };

//   const createFallbackQuestions = () => {
//     return [
//       {
//         id: 1,
//         type: 'mcq',
//         question: `What is a key principle in ${selectedTopic}?`,
//         options: ['Principle A', 'Principle B', 'Principle C', 'Principle D'],
//         correctAnswer: 'A'
//       },
//       {
//         id: 2,
//         type: 'mcq',
//         question: `Which method is commonly used in ${selectedTopic} research?`,
//         options: ['Method X', 'Method Y', 'Method Z', 'Method W'],
//         correctAnswer: 'B'
//       },
//       {
//         id: 3,
//         type: 'mcq',
//         question: `What application is related to ${selectedTopic}?`,
//         options: ['Application 1', 'Application 2', 'Application 3', 'Application 4'],
//         correctAnswer: 'C'
//       },
//       {
//         id: 4,
//         type: 'mcq',
//         question: `Which characteristic defines ${selectedTopic}?`,
//         options: ['Feature A', 'Feature B', 'Feature C', 'Feature D'],
//         correctAnswer: 'A'
//       },
//       {
//         id: 5,
//         type: 'mcq',
//         question: `What is the significance of ${selectedTopic}?`,
//         options: ['Significance 1', 'Significance 2', 'Significance 3', 'Significance 4'],
//         correctAnswer: 'D'
//       },
//       {
//         id: 6,
//         type: 'subjective',
//         question: `Explain the importance of ${selectedTopic} in modern science.`
//       },
//       {
//         id: 7,
//         type: 'subjective',
//         question: `Describe a real-world application of ${selectedTopic}.`
//       }
//     ];
//   };

//   const handleAnswerChange = (questionId, answer) => {
//     setAnswers(prev => ({
//       ...prev,
//       [questionId]: answer
//     }));
//   };

//   const calculateScore = () => {
//     let correctAnswers = 0;
//     const mcqQuestions = questions.filter(q => q.type === 'mcq');
    
//     mcqQuestions.forEach(question => {
//       if (answers[question.id] === question.correctAnswer) {
//         correctAnswers++;
//       }
//     });

//     return (correctAnswers / mcqQuestions.length) * 100;
//   };

//   const submitQuiz = () => {
//     const calculatedScore = calculateScore();
//     setScore(calculatedScore);
//     setShowResults(true);
//   };

//   const goToFollowUp = () => {
//     // Store quiz data in localStorage for the follow-up page
//     const quizData = {
//       topic: selectedTopic,
//       score: score,
//       threshold: threshold,
//       answers: answers,
//       questions: questions
//     };
//     localStorage.setItem('quizData', JSON.stringify(quizData));
//     router.push('/follow-up');
//   };

//   const resetQuiz = () => {
//     const newTopic = SCIENCE_TOPICS[Math.floor(Math.random() * SCIENCE_TOPICS.length)];
//     setSelectedTopic(newTopic);
//     setQuestions([]);
//     setAnswers({});
//     setQuizGenerated(false);
//     setShowResults(false);
//     setScore(0);
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
//       <div className="bg-white rounded-xl shadow-lg p-8">
//         <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
//           Science Quiz Challenge
//         </h1>
        
//         <div className="text-center mb-8">
//           <h2 className="text-2xl font-semibold text-blue-600 mb-2">
//             Topic: {selectedTopic}
//           </h2>
//           <p className="text-gray-600">
//             5 Multiple Choice + 2 Subjective Questions
//           </p>
//           <p className="text-sm text-gray-500 mt-1">
//             Passing Threshold: {threshold}%
//           </p>
//         </div>

//         {!quizGenerated ? (
//           <div className="text-center py-12">
//             <button
//               onClick={generateQuiz}
//               disabled={loading}
//               className="px-8 py-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 transition-colors text-lg"
//             >
//               {loading ? (
//                 <div className="flex items-center">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                   Generating Quiz...
//                 </div>
//               ) : (
//                 'Generate Quiz'
//               )}
//             </button>
//           </div>
//         ) : showResults ? (
//           <div className="text-center py-8">
//             <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-8 mb-8">
//               <h3 className="text-2xl font-bold mb-4 text-gray-800">Quiz Results</h3>
//               <div className="text-5xl font-bold mb-4 text-blue-600">{score.toFixed(1)}%</div>
//               <div className={`text-xl font-medium mb-4 ${
//                 score >= threshold ? 'text-green-600' : 'text-orange-600'
//               }`}>
//                 {score >= threshold ? '🎉 Excellent Performance!' : '📚 Needs Improvement'}
//               </div>
//               <p className="text-gray-600 mb-6 text-lg">
//                 {score >= threshold 
//                   ? 'Great job! You\'re ready for advanced topics.'
//                   : 'Let\'s work on strengthening your foundation.'
//                 }
//               </p>
//               <div className="flex gap-4 justify-center">
//                 <button
//                   onClick={goToFollowUp}
//                   className={`px-8 py-3 text-white rounded-lg font-medium transition-colors ${
//                     score >= threshold 
//                       ? 'bg-green-500 hover:bg-green-600' 
//                       : 'bg-orange-500 hover:bg-orange-600'
//                   }`}
//                 >
//                   {score >= threshold ? 'Explore Advanced Topics' : 'Get Learning Help'}
//                 </button>
//                 <button
//                   onClick={resetQuiz}
//                   className="px-8 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
//                 >
//                   Try New Topic
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {questions.map((question, index) => (
//               <div key={question.id} className="border rounded-lg p-6 bg-gray-50">
//                 <h3 className="font-semibold text-lg mb-4 text-gray-800">
//                   {index + 1}. {question.question}
//                 </h3>
                
//                 {question.type === 'mcq' ? (
//                   <div className="space-y-3">
//                     {['A', 'B', 'C', 'D'].map((option, optIndex) => (
//                       <label key={option} className="flex items-center space-x-3 cursor-pointer hover:bg-white p-3 rounded transition-colors">
//                         <input
//                           type="radio"
//                           name={`question-${question.id}`}
//                           value={option}
//                           onChange={(e) => handleAnswerChange(question.id, e.target.value)}
//                           className="text-blue-500 w-4 h-4"
//                         />
//                         <span className="text-gray-700">
//                           {option}) {question.options[optIndex] || `Option ${option}`}
//                         </span>
//                       </label>
//                     ))}
//                   </div>
//                 ) : (
//                   <textarea
//                     className="w-full p-4 border rounded-lg resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Write your detailed answer here..."
//                     onChange={(e) => handleAnswerChange(question.id, e.target.value)}
//                     value={answers[question.id] || ''}
//                   />
//                 )}
//               </div>
//             ))}
            
//             <div className="text-center pt-6">
//               <button
//                 onClick={submitQuiz}
//                 disabled={Object.keys(answers).length < 5}
//                 className="px-8 py-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg"
//               >
//                 Submit Quiz
//               </button>
//               <p className="text-sm text-gray-500 mt-2">
//                 Complete at least the multiple choice questions to submit
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// working 
// "use client";
// import { useState } from "react";
// import { generateGeminiResponse } from "../../../configs/AImodel";
// import jsPDF from 'jspdf';
// import { useRouter } from "next/navigation";

// // Complete syllabus data
// const SYLLABUS_DATA = {
//   "Class 6": {
//     "Mathematics": [
//       "Divisibility", "The Use of Letters in Place of Numbers", "Order of Operations and the Use of Brackets",
//       "Point, Line, Plane", "Angles", "Pairs of Angles", "Indices", "Natural Numbers and Whole Numbers",
//       "Decimal Fractions – Division", "Squares and Square Roots", "Ratio and Proportion", "Perimeter",
//       "Profit and Loss", "Integers", "Equations in One Variable", "Algebraic Expressions", "Simple Interest",
//       "Percentage", "Triangles", "Properties of Triangles", "Geometric Constructions", "Area", "Bar Graphs",
//       "Volume", "Circle"
//     ],
//     "General Science": [
//       "Our Natural Resources", "Diversity in Living Things and their Classification", "Disaster Management",
//       "The Living World", "Substances in Daily Use", "Substances in the Surroundings – Their States and Properties",
//       "Nutrition and Diet", "Our Skeletal System and the Skin", "Motion and Types of Motion",
//       "Characteristics and Classification of Living Things", "Parts of Plants and their Structure",
//       "Force and Types of Force", "Work and Energy", "Simple Machines", "Measurement & Estimates of Measurements",
//       "Sound", "Methods of Separating Substances", "Organ Systems", "Our Environment",
//       "Our Earth and its Special Features", "Social Environment"
//     ]
//   },
//   "Class 7": {
//     "Science": [
//       "Natural Resources", "Water – A Natural Resource", "Food and Protection of Food", "Properties of Water",
//       "Acids, Bases and Salts", "Control and Co-ordination", "Health and Disease", "Food and Nutrition",
//       "Circulation of Blood", "Reproduction in Living Things", "The Organisation of Living Things",
//       "Electric Charge", "Sound – Production of Sound", "Propagation of Sound", "Classification of Substances",
//       "Transmission of Heat", "Effects of Heat", "Propagation of Light"
//     ],
//     "Mathematics": [
//       "Indices", "Variation", "Averages", "Properties of Triangles", "Theorem of Pythagoras",
//       "Construction of Triangles", "Equations in One Variable", "Product Of Algebraic Expressions",
//       "Factors of Algebraic Expressions", "Quadrilaterals", "Types of Quadrilaterals",
//       "Construction of Quadrilaterals", "Rational Numbers", "Operations on Rational Numbers",
//       "Simple Interest", "Profit and Loss", "Area", "Identity", "Circle", "Congruence",
//       "Volume and Surface Area", "Joint Bar Graphs"
//     ]
//   },
//   "Class 8": {
//     "Mathematics": [
//       "Irrational and Real Numbers", "Square and Square Root", "Quadrilateral", "Parallel Lines",
//       "Area", "The Circle", "The Circumference and Area Of A Circle", "Statistics", "Identities",
//       "Variation and Proportion", "Equations in One Variable", "Indices", "Cubes and Cube Roots",
//       "Construction of Quadrilaterals", "Arc of a Circle", "Compound Interest", "Polynomials",
//       "Joint Bar Graphs", "Discount and Commission", "Volume and Surface Area", "Factors of polynomials",
//       "Division of Polynomials"
//     ],
//     "General Science": [
//       "Living World and Classification of Microbes", "Health and Diseases", "Force and Pressure",
//       "Current Electricity and Magnetism", "Inside the Atom", "Composition of Matter", "Metals and Nonmetals",
//       "Pollution", "Disaster Management", "Cell and Cell Organelles", "Human Body and Organ System",
//       "Introduction to Acid and Base", "Chemical Change and Chemical Bond", "Measurement and Effects of Heat",
//       "Sound", "Reflection of Light", "Man made Materials", "Ecosystems", "Life Cycle of Stars"
//     ]
//   }
// };

// const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];

// export default function QuizPage() {
//   const router = useRouter();
//   const [selectedClass, setSelectedClass] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [selectedTopic, setSelectedTopic] = useState('');
//   const [selectedDifficulty, setSelectedDifficulty] = useState('');
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [quizGenerated, setQuizGenerated] = useState(false);

//   const generateQuiz = async () => {
//     if (!selectedTopic || !selectedDifficulty) {
//       alert("Please select topic and difficulty level");
//       return;
//     }
    
//     setLoading(true);
//     try {
//       const prompt = `Generate a ${selectedDifficulty.toLowerCase()} level quiz on "${selectedTopic}" for ${selectedClass} students with exactly 10 multiple choice questions only. 

// Format the response as follows:

// 1. [Question text]
// A) [Option 1]
// B) [Option 2] 
// C) [Option 3]
// D) [Option 4]
// CORRECT: A

// 2. [Question text]
// A) [Option 1]
// B) [Option 2]
// C) [Option 3] 
// D) [Option 4]
// CORRECT: B

// [Continue for questions 3-10]

// Make the questions educational and appropriate for ${selectedClass} level. Focus only on multiple choice questions - no subjective questions.`;

//       const result = await generateGeminiResponse(prompt);
//       parseQuizData(result);
//       setQuizGenerated(true);
//     } catch (err) {
//       console.error("Error generating quiz:", err);
//       alert("Error generating quiz. Please try again.");
//     }
//     setLoading(false);
//   };

//   const parseQuizData = (response) => {
//     const lines = response.split('\n').filter(line => line.trim());
//     const parsedQuestions = [];
//     let currentQuestion = null;

//     for (let i = 0; i < lines.length; i++) {
//       const line = lines[i].trim();
      
//       const questionMatch = line.match(/^(\d+)\.\s*(.+)/);
//       if (questionMatch) {
//         if (currentQuestion) {
//           parsedQuestions.push(currentQuestion);
//         }
        
//         const questionNum = parseInt(questionMatch[1]);
//         const questionText = questionMatch[2];
        
//         currentQuestion = {
//           id: questionNum,
//           type: 'mcq',
//           question: questionText,
//           options: [],
//           correctAnswer: ''
//         };
//       }
//       else if (currentQuestion && /^[A-D]\)/.test(line)) {
//         const optionText = line.substring(2).trim();
//         currentQuestion.options.push(optionText);
//       }
//       else if (line.startsWith('CORRECT:')) {
//         if (currentQuestion) {
//           currentQuestion.correctAnswer = line.split(':')[1].trim();
//         }
//       }
//     }
    
//     if (currentQuestion) {
//       parsedQuestions.push(currentQuestion);
//     }

//     if (parsedQuestions.length < 10) {
//       const fallbackQuestions = createFallbackQuestions();
//       setQuestions(fallbackQuestions);
//     } else {
//       setQuestions(parsedQuestions);
//     }
//   };

//   const createFallbackQuestions = () => {
//     const questions = [];
//     for (let i = 1; i <= 10; i++) {
//       questions.push({
//         id: i,
//         type: 'mcq',
//         question: `Question ${i} about ${selectedTopic}?`,
//         options: [`Option A for question ${i}`, `Option B for question ${i}`, `Option C for question ${i}`, `Option D for question ${i}`],
//         correctAnswer: 'A'
//       });
//     }
//     return questions;
//   };

//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     const pageHeight = doc.internal.pageSize.height;
//     let yPosition = 20;

//     doc.setFontSize(16);
//     doc.text(`Quiz: ${selectedTopic}`, 20, yPosition);
//     yPosition += 10;
//     doc.setFontSize(12);
//     doc.text(`Class: ${selectedClass} | Subject: ${selectedSubject} | Difficulty: ${selectedDifficulty}`, 20, yPosition);
//     yPosition += 20;

//     questions.forEach((question, index) => {
//       if (yPosition > pageHeight - 40) {
//         doc.addPage();
//         yPosition = 20;
//       }

//       doc.setFontSize(11);
//       const questionText = `${index + 1}. ${question.question}`;
//       const splitQuestion = doc.splitTextToSize(questionText, 170);
//       doc.text(splitQuestion, 20, yPosition);
//       yPosition += splitQuestion.length * 5 + 5;

//       question.options.forEach((option, optIndex) => {
//         const optionText = `${String.fromCharCode(65 + optIndex)}) ${option}`;
//         const splitOption = doc.splitTextToSize(optionText, 160);
//         doc.text(splitOption, 30, yPosition);
//         yPosition += splitOption.length * 5 + 2;
//       });
//       yPosition += 10;
//     });

//     doc.save(`${selectedTopic}_Quiz.pdf`);
//   };

//   const checkAnalytics = () => {
//     const quizData = {
//       topic: selectedTopic,
//       class: selectedClass,
//       subject: selectedSubject,
//       difficulty: selectedDifficulty,
//       questions: questions
//     };
//     localStorage.setItem('quizAnalytics', JSON.stringify(quizData));
//     router.push('/analytics');
//   };

//   const resetQuiz = () => {
//     setSelectedClass('');
//     setSelectedSubject('');
//     setSelectedTopic('');
//     setSelectedDifficulty('');
//     setQuestions([]);
//     setQuizGenerated(false);
//   };

//   const getSubjects = () => {
//     return selectedClass ? Object.keys(SYLLABUS_DATA[selectedClass] || {}) : [];
//   };

//   const getTopics = () => {
//     return (selectedClass && selectedSubject) ? SYLLABUS_DATA[selectedClass][selectedSubject] || [] : [];
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
//       <div className="bg-white rounded-xl shadow-lg p-8">
//         <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
//           Educational Quiz Generator
//         </h1>
        
//         {!quizGenerated ? (
//           <div className="space-y-6 mb-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
//                 <select
//                   value={selectedClass}
//                   onChange={(e) => {
//                     setSelectedClass(e.target.value);
//                     setSelectedSubject('');
//                     setSelectedTopic('');
//                   }}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">Select Class</option>
//                   {Object.keys(SYLLABUS_DATA).map(cls => (
//                     <option key={cls} value={cls}>{cls}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
//                 <select
//                   value={selectedSubject}
//                   onChange={(e) => {
//                     setSelectedSubject(e.target.value);
//                     setSelectedTopic('');
//                   }}
//                   disabled={!selectedClass}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
//                 >
//                   <option value="">Select Subject</option>
//                   {getSubjects().map(subject => (
//                     <option key={subject} value={subject}>{subject}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
//                 <select
//                   value={selectedTopic}
//                   onChange={(e) => setSelectedTopic(e.target.value)}
//                   disabled={!selectedSubject}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
//                 >
//                   <option value="">Select Topic</option>
//                   {getTopics().map(topic => (
//                     <option key={topic} value={topic}>{topic}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
//                 <select
//                   value={selectedDifficulty}
//                   onChange={(e) => setSelectedDifficulty(e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">Select Difficulty</option>
//                   {DIFFICULTY_LEVELS.map(level => (
//                     <option key={level} value={level}>{level}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="text-center py-8">
//               <button
//                 onClick={generateQuiz}
//                 disabled={loading || !selectedTopic || !selectedDifficulty}
//                 className="px-8 py-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 transition-colors text-lg"
//               >
//                 {loading ? (
//                   <div className="flex items-center">
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     Generating Quiz...
//                   </div>
//                 ) : (
//                   'Generate Quiz'
//                 )}
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 mb-8">
//               <h2 className="text-2xl font-bold mb-2 text-gray-800">
//                 Quiz Generated: {selectedTopic}
//               </h2>
//               <p className="text-gray-600">
//                 Class: {selectedClass} | Subject: {selectedSubject} | Difficulty: {selectedDifficulty}
//               </p>
//               <p className="text-gray-600">Total Questions: {questions.length}</p>
//             </div>

//             <div className="space-y-6 mb-8">
//               {questions.map((question, index) => (
//                 <div key={question.id} className="border rounded-lg p-6 bg-gray-50">
//                   <h3 className="font-semibold text-lg mb-4 text-gray-800">
//                     {index + 1}. {question.question}
//                   </h3>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     {['A', 'B', 'C', 'D'].map((option, optIndex) => (
//                       <div key={option} className="flex items-center space-x-3 p-3 bg-white rounded border">
//                         <span className="font-medium text-blue-600">{option})</span>
//                         <span className="text-gray-700">
//                           {question.options[optIndex] || `Option ${option}`}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="flex flex-wrap gap-4 justify-center">
//               <button
//                 onClick={downloadPDF}
//                 className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
//               >
//                 📄 Download Quiz as PDF
//               </button>
              
//               <button
//                 onClick={checkAnalytics}
//                 className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
//               >
//                 📊 Review Answers
//               </button>
              
//               <button
//                 onClick={resetQuiz}
//                 className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
//               >
//                 🔄 Generate New Quiz
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// "use client";
// import { useState } from "react";
// import { generateGeminiResponse } from "../../../configs/AImodel";
// import jsPDF from 'jspdf';
// import { useRouter } from "next/navigation";

// // Complete syllabus data
// const SYLLABUS_DATA = {
//   "Class 6": {
//     "Mathematics": [
//       "Divisibility", "The Use of Letters in Place of Numbers", "Order of Operations and the Use of Brackets",
//       "Point, Line, Plane", "Angles", "Pairs of Angles", "Indices", "Natural Numbers and Whole Numbers",
//       "Decimal Fractions – Division", "Squares and Square Roots", "Ratio and Proportion", "Perimeter",
//       "Profit and Loss", "Integers", "Equations in One Variable", "Algebraic Expressions", "Simple Interest",
//       "Percentage", "Triangles", "Properties of Triangles", "Geometric Constructions", "Area", "Bar Graphs",
//       "Volume", "Circle"
//     ],
//     "General Science": [
//       "Our Natural Resources", "Diversity in Living Things and their Classification", "Disaster Management",
//       "The Living World", "Substances in Daily Use", "Substances in the Surroundings – Their States and Properties",
//       "Nutrition and Diet", "Our Skeletal System and the Skin", "Motion and Types of Motion",
//       "Characteristics and Classification of Living Things", "Parts of Plants and their Structure",
//       "Force and Types of Force", "Work and Energy", "Simple Machines", "Measurement & Estimates of Measurements",
//       "Sound", "Methods of Separating Substances", "Organ Systems", "Our Environment",
//       "Our Earth and its Special Features", "Social Environment"
//     ]
//   },
//   "Class 7": {
//     "Science": [
//       "Natural Resources", "Water – A Natural Resource", "Food and Protection of Food", "Properties of Water",
//       "Acids, Bases and Salts", "Control and Co-ordination", "Health and Disease", "Food and Nutrition",
//       "Circulation of Blood", "Reproduction in Living Things", "The Organisation of Living Things",
//       "Electric Charge", "Sound – Production of Sound", "Propagation of Sound", "Classification of Substances",
//       "Transmission of Heat", "Effects of Heat", "Propagation of Light"
//     ],
//     "Mathematics": [
//       "Indices", "Variation", "Averages", "Properties of Triangles", "Theorem of Pythagoras",
//       "Construction of Triangles", "Equations in One Variable", "Product Of Algebraic Expressions",
//       "Factors of Algebraic Expressions", "Quadrilaterals", "Types of Quadrilaterals",
//       "Construction of Quadrilaterals", "Rational Numbers", "Operations on Rational Numbers",
//       "Simple Interest", "Profit and Loss", "Area", "Identity", "Circle", "Congruence",
//       "Volume and Surface Area", "Joint Bar Graphs"
//     ]
//   },
//   "Class 8": {
//     "Mathematics": [
//       "Irrational and Real Numbers", "Square and Square Root", "Quadrilateral", "Parallel Lines",
//       "Area", "The Circle", "The Circumference and Area Of A Circle", "Statistics", "Identities",
//       "Variation and Proportion", "Equations in One Variable", "Indices", "Cubes and Cube Roots",
//       "Construction of Quadrilaterals", "Arc of a Circle", "Compound Interest", "Polynomials",
//       "Joint Bar Graphs", "Discount and Commission", "Volume and Surface Area", "Factors of polynomials",
//       "Division of Polynomials"
//     ],
//     "General Science": [
//       "Living World and Classification of Microbes", "Health and Diseases", "Force and Pressure",
//       "Current Electricity and Magnetism", "Inside the Atom", "Composition of Matter", "Metals and Nonmetals",
//       "Pollution", "Disaster Management", "Cell and Cell Organelles", "Human Body and Organ System",
//       "Introduction to Acid and Base", "Chemical Change and Chemical Bond", "Measurement and Effects of Heat",
//       "Sound", "Reflection of Light", "Man made Materials", "Ecosystems", "Life Cycle of Stars"
//     ]
//   }
// };

// const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];
// const LANGUAGE_OPTIONS = [
//   { value: "english", label: "English" },
//   { value: "marathi", label: "मराठी (Marathi)" },
//   { value: "both", label: "Both (English + मराठी)" }
// ];

// export default function QuizPage() {
//   const router = useRouter();
//   const [selectedClass, setSelectedClass] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [selectedTopic, setSelectedTopic] = useState('');
//   const [selectedDifficulty, setSelectedDifficulty] = useState('');
//   const [selectedLanguage, setSelectedLanguage] = useState('english');
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [quizGenerated, setQuizGenerated] = useState(false);

//   const generateQuiz = async () => {
//     if (!selectedTopic || !selectedDifficulty || !selectedLanguage) {
//       alert("Please select topic, difficulty level, and language");
//       return;
//     }
    
//     setLoading(true);
//     try {
//       let languageInstruction = "";
      
//       if (selectedLanguage === "marathi") {
//         languageInstruction = `Generate the entire quiz in Marathi language (मराठी भाषेत). All questions and options should be in proper Marathi script with correct grammar and vocabulary. Use formal Marathi suitable for educational content.`;
//       } else if (selectedLanguage === "both") {
//         languageInstruction = `Generate a bilingual quiz with each question in both English and Marathi. Format each question as follows:
        
// English: [English question]
// मराठी: [Marathi translation]

// Options should also be in both languages for each option.`;
//       } else {
//         languageInstruction = "Generate the entire quiz in clear, proper English language suitable for educational purposes.";
//       }

//       const prompt = `${languageInstruction}

// Generate a ${selectedDifficulty.toLowerCase()} level quiz on "${selectedTopic}" for ${selectedClass} students with exactly 10 multiple choice questions only. 

// ${selectedLanguage === "both" ? `
// Format the response for bilingual content as follows:

// 1. English: [English Question text]
//    मराठी: [Marathi Question text]
// A) English: [English Option 1] | मराठी: [Marathi Option 1]
// B) English: [English Option 2] | मराठी: [Marathi Option 2] 
// C) English: [English Option 3] | मराठी: [Marathi Option 3]
// D) English: [English Option 4] | मराठी: [Marathi Option 4]
// CORRECT: A

// ` : `
// Format the response as follows:

// 1. [Question text]
// A) [Option 1]
// B) [Option 2] 
// C) [Option 3]
// D) [Option 4]
// CORRECT: A

// `}

// [Continue for questions 2-10]

// Make the questions educational and appropriate for ${selectedClass} level. Focus only on multiple choice questions - no subjective questions. ${selectedLanguage === "marathi" || selectedLanguage === "both" ? "Ensure Marathi translations are accurate, grammatically correct, and use appropriate educational terminology." : ""}`;

//       const result = await generateGeminiResponse(prompt);
//       parseQuizData(result);
//       setQuizGenerated(true);
//     } catch (err) {
//       console.error("Error generating quiz:", err);
//       alert("Error generating quiz. Please try again.");
//     }
//     setLoading(false);
//   };

//   const parseQuizData = (response) => {
//     const lines = response.split('\n').filter(line => line.trim());
//     const parsedQuestions = [];
//     let currentQuestion = null;

//     for (let i = 0; i < lines.length; i++) {
//       const line = lines[i].trim();
      
//       // Handle different question formats based on language selection
//       const questionMatch = line.match(/^(\d+)\.\s*(.+)/);
//       if (questionMatch) {
//         if (currentQuestion) {
//           parsedQuestions.push(currentQuestion);
//         }
        
//         const questionNum = parseInt(questionMatch[1]);
//         let questionText = questionMatch[2];
        
//         // Check if this is a bilingual question
//         let marathiQuestion = '';
//         if (selectedLanguage === "both") {
//           if (questionText.includes('English:')) {
//             questionText = questionText.replace('English:', '').trim();
//           }
//           // Look for Marathi part in next line
//           if (i + 1 < lines.length && lines[i + 1].includes('मराठी:')) {
//             marathiQuestion = lines[i + 1].replace('मराठी:', '').trim();
//             i++; // Skip the Marathi line as we've processed it
//           }
//         }
        
//         currentQuestion = {
//           id: questionNum,
//           type: 'mcq',
//           question: questionText,
//           marathiQuestion: marathiQuestion,
//           options: [],
//           marathiOptions: [],
//           correctAnswer: ''
//         };
//       }
//       else if (currentQuestion && /^[A-D]\)/.test(line)) {
//         let optionText = line.substring(2).trim();
//         let marathiOption = '';
        
//         if (selectedLanguage === "both" && optionText.includes('|')) {
//           const parts = optionText.split('|');
//           if (parts.length >= 2) {
//             optionText = parts[0].replace('English:', '').trim();
//             marathiOption = parts[1].replace('मराठी:', '').trim();
//           }
//         }
        
//         currentQuestion.options.push(optionText);
//         if (marathiOption) {
//           currentQuestion.marathiOptions.push(marathiOption);
//         }
//       }
//       else if (line.startsWith('CORRECT:')) {
//         if (currentQuestion) {
//           currentQuestion.correctAnswer = line.split(':')[1].trim();
//         }
//       }
//     }
    
//     if (currentQuestion) {
//       parsedQuestions.push(currentQuestion);
//     }

//     if (parsedQuestions.length < 10) {
//       const fallbackQuestions = createFallbackQuestions();
//       setQuestions(fallbackQuestions);
//     } else {
//       setQuestions(parsedQuestions);
//     }
//   };

//   const createFallbackQuestions = () => {
//     const questions = [];
    
//     for (let i = 1; i <= 10; i++) {
//       const baseQuestion = {
//         id: i,
//         type: 'mcq',
//         question: `Question ${i} about ${selectedTopic}?`,
//         marathiQuestion: selectedLanguage === "both" || selectedLanguage === "marathi" ? `${selectedTopic} संबंधित प्रश्न ${i}?` : '',
//         options: [
//           `Option A for question ${i}`,
//           `Option B for question ${i}`,
//           `Option C for question ${i}`,
//           `Option D for question ${i}`
//         ],
//         marathiOptions: selectedLanguage === "both" || selectedLanguage === "marathi" ? [
//           `प्रश्न ${i} साठी पर्याय अ`,
//           `प्रश्न ${i} साठी पर्याय ब`,
//           `प्रश्न ${i} साठी पर्याय क`,
//           `प्रश्न ${i} साठी पर्याय ड`
//         ] : [],
//         correctAnswer: 'A'
//       };
      
//       if (selectedLanguage === "marathi") {
//         baseQuestion.question = baseQuestion.marathiQuestion;
//         baseQuestion.options = baseQuestion.marathiOptions;
//         baseQuestion.marathiQuestion = '';
//         baseQuestion.marathiOptions = [];
//       }
      
//       questions.push(baseQuestion);
//     }
//     return questions;
//   };

//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     const pageHeight = doc.internal.pageSize.height;
//     let yPosition = 20;

//     // Add font for Marathi support if needed
//     doc.setFont("helvetica");
//     doc.setFontSize(16);
    
//     // Title
//     const quizTitle = selectedLanguage === 'marathi' 
//       ? `प्रश्नमंजुषा: ${selectedTopic}` 
//       : selectedLanguage === 'both'
//       ? `Quiz / प्रश्नमंजुषा: ${selectedTopic}`
//       : `Quiz: ${selectedTopic}`;
    
//     doc.text(quizTitle, 20, yPosition);
//     yPosition += 10;
//     doc.setFontSize(12);
    
//     // Header information
//     const headerText = selectedLanguage === 'marathi' 
//       ? `वर्ग: ${selectedClass} | विषय: ${selectedSubject} | कठीणता: ${selectedDifficulty}`
//       : selectedLanguage === 'both'
//       ? `Class / वर्ग: ${selectedClass} | Subject / विषय: ${selectedSubject} | Difficulty / कठीणता: ${selectedDifficulty}`
//       : `Class: ${selectedClass} | Subject: ${selectedSubject} | Difficulty: ${selectedDifficulty}`;
    
//     doc.text(headerText, 20, yPosition);
//     yPosition += 20;

//     questions.forEach((question, index) => {
//       // Check if we need a new page
//       if (yPosition > pageHeight - 60) {
//         doc.addPage();
//         yPosition = 20;
//       }

//       doc.setFontSize(11);
      
//       // Question text
//       let questionText = `${index + 1}. ${question.question}`;
//       if (selectedLanguage === 'both' && question.marathiQuestion) {
//         questionText += `\n    मराठी: ${question.marathiQuestion}`;
//       }
      
//       const splitQuestion = doc.splitTextToSize(questionText, 170);
//       doc.text(splitQuestion, 20, yPosition);
//       yPosition += splitQuestion.length * 5 + 5;

//       // Options
//       question.options.forEach((option, optIndex) => {
//         let optionText = `${String.fromCharCode(65 + optIndex)}) ${option}`;
        
//         if (selectedLanguage === 'both' && question.marathiOptions && question.marathiOptions[optIndex]) {
//           optionText += ` | ${question.marathiOptions[optIndex]}`;
//         }
        
//         const splitOption = doc.splitTextToSize(optionText, 160);
//         doc.text(splitOption, 30, yPosition);
//         yPosition += splitOption.length * 5 + 2;
//       });
      
//       yPosition += 10;
//     });

//     // Add answer key on new page
//     doc.addPage();
//     yPosition = 20;
//     doc.setFontSize(14);
//     const answerKeyTitle = selectedLanguage === 'marathi' ? 'उत्तर कळ' : selectedLanguage === 'both' ? 'Answer Key / उत्तर कळ' : 'Answer Key';
//     doc.text(answerKeyTitle, 20, yPosition);
//     yPosition += 15;
    
//     doc.setFontSize(11);
//     questions.forEach((question, index) => {
//       const answerText = `${index + 1}. ${question.correctAnswer}`;
//       doc.text(answerText, 20, yPosition);
//       yPosition += 8;
//     });

//     const filename = selectedLanguage === 'marathi' 
//       ? `${selectedTopic}_प्रश्नमंजुषा.pdf`
//       : selectedLanguage === 'both'
//       ? `${selectedTopic}_Quiz_Bilingual.pdf`
//       : `${selectedTopic}_Quiz.pdf`;
    
//     doc.save(filename);
//   };

//   const checkAnalytics = () => {
//     const quizData = {
//       topic: selectedTopic,
//       class: selectedClass,
//       subject: selectedSubject,
//       difficulty: selectedDifficulty,
//       language: selectedLanguage,
//       questions: questions
//     };
//     localStorage.setItem('quizAnalytics', JSON.stringify(quizData));
//     router.push('/analytics');
//   };

//   const resetQuiz = () => {
//     setSelectedClass('');
//     setSelectedSubject('');
//     setSelectedTopic('');
//     setSelectedDifficulty('');
//     setSelectedLanguage('english');
//     setQuestions([]);
//     setQuizGenerated(false);
//   };

//   const getSubjects = () => {
//     return selectedClass ? Object.keys(SYLLABUS_DATA[selectedClass] || {}) : [];
//   };

//   const getTopics = () => {
//     return (selectedClass && selectedSubject) ? SYLLABUS_DATA[selectedClass][selectedSubject] || [] : [];
//   };

//   const getUIText = (englishText, marathiText) => {
//     if (selectedLanguage === 'marathi') return marathiText;
//     if (selectedLanguage === 'both') return `${englishText} / ${marathiText}`;
//     return englishText;
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
//       <div className="bg-white rounded-xl shadow-lg p-8">
//         <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
//           {getUIText("Educational Quiz Generator", "शैक्षणिक प्रश्नमंजुषा जनरेटर")}
//         </h1>
        
//         {!quizGenerated ? (
//           <div className="space-y-6 mb-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   {getUIText("Class", "वर्ग")}
//                 </label>
//                 <select
//                   value={selectedClass}
//                   onChange={(e) => {
//                     setSelectedClass(e.target.value);
//                     setSelectedSubject('');
//                     setSelectedTopic('');
//                   }}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">{getUIText("Select Class", "वर्ग निवडा")}</option>
//                   {Object.keys(SYLLABUS_DATA).map(cls => (
//                     <option key={cls} value={cls}>{cls}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   {getUIText("Subject", "विषय")}
//                 </label>
//                 <select
//                   value={selectedSubject}
//                   onChange={(e) => {
//                     setSelectedSubject(e.target.value);
//                     setSelectedTopic('');
//                   }}
//                   disabled={!selectedClass}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
//                 >
//                   <option value="">{getUIText("Select Subject", "विषय निवडा")}</option>
//                   {getSubjects().map(subject => (
//                     <option key={subject} value={subject}>{subject}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   {getUIText("Topic", "विषय")}
//                 </label>
//                 <select
//                   value={selectedTopic}
//                   onChange={(e) => setSelectedTopic(e.target.value)}
//                   disabled={!selectedSubject}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
//                 >
//                   <option value="">{getUIText("Select Topic", "विषय निवडा")}</option>
//                   {getTopics().map(topic => (
//                     <option key={topic} value={topic}>{topic}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   {getUIText("Difficulty", "कठीणता")}
//                 </label>
//                 <select
//                   value={selectedDifficulty}
//                   onChange={(e) => setSelectedDifficulty(e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">{getUIText("Select Difficulty", "कठीणता निवडा")}</option>
//                   {DIFFICULTY_LEVELS.map(level => (
//                     <option key={level} value={level}>{level}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   {getUIText("Language", "भाषा")}
//                 </label>
//                 <select
//                   value={selectedLanguage}
//                   onChange={(e) => setSelectedLanguage(e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   {LANGUAGE_OPTIONS.map(lang => (
//                     <option key={lang.value} value={lang.value}>{lang.label}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="text-center py-8">
//               <button
//                 onClick={generateQuiz}
//                 disabled={loading || !selectedTopic || !selectedDifficulty}
//                 className="px-8 py-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 transition-colors text-lg"
//               >
//                 {loading ? (
//                   <div className="flex items-center">
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     {getUIText('Generating Quiz...', 'प्रश्नमंजुषा तयार करत आहे...')}
//                   </div>
//                 ) : (
//                   getUIText('Generate Quiz', 'प्रश्नमंजुषा तयार करा')
//                 )}
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 mb-8">
//               <h2 className="text-2xl font-bold mb-2 text-gray-800">
//                 {getUIText('Quiz Generated: ', 'प्रश्नमंजुषा तयार केली: ')}{selectedTopic}
//               </h2>
//               <p className="text-gray-600">
//                 {selectedLanguage === 'marathi' 
//                   ? `वर्ग: ${selectedClass} | विषय: ${selectedSubject} | कठीणता: ${selectedDifficulty} | भाषा: मराठी`
//                   : selectedLanguage === 'both'
//                   ? `Class/वर्ग: ${selectedClass} | Subject/विषय: ${selectedSubject} | Difficulty/कठीणता: ${selectedDifficulty} | Language/भाषा: Bilingual`
//                   : `Class: ${selectedClass} | Subject: ${selectedSubject} | Difficulty: ${selectedDifficulty} | Language: English`
//                 }
//               </p>
//               <p className="text-gray-600">
//                 {getUIText('Total Questions: ', 'एकूण प्रश्न: ')}{questions.length}
//               </p>
//             </div>

//             <div className="space-y-6 mb-8">
//               {questions.map((question, index) => (
//                 <div key={question.id} className="border rounded-lg p-6 bg-gray-50">
//                   <h3 className="font-semibold text-lg mb-4 text-gray-800">
//                     {index + 1}. {question.question}
//                     {selectedLanguage === 'both' && question.marathiQuestion && (
//                       <div className="text-blue-600 mt-2">
//                         मराठी: {question.marathiQuestion}
//                       </div>
//                     )}
//                   </h3>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     {['A', 'B', 'C', 'D'].map((option, optIndex) => (
//                       <div key={option} className="flex flex-col space-y-2 p-3 bg-white rounded border">
//                         <div className="flex items-center space-x-3">
//                           <span className="font-medium text-blue-600">{option})</span>
//                           <span className="text-gray-700">
//                             {question.options[optIndex] || `Option ${option}`}
//                           </span>
//                         </div>
//                         {selectedLanguage === 'both' && question.marathiOptions && question.marathiOptions[optIndex] && (
//                           <div className="flex items-center space-x-3 text-sm">
//                             <span className="font-medium text-purple-600">{option})</span>
//                             <span className="text-gray-600">
//                               {question.marathiOptions[optIndex]}
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
                  
//                   <div className="mt-4 text-sm text-green-600 font-medium">
//                     {getUIText('Correct Answer: ', 'योग्य उत्तर: ')}{question.correctAnswer}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="flex flex-wrap gap-4 justify-center">
//               <button
//                 onClick={downloadPDF}
//                 className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
//               >
//                 📄 {getUIText('Download Quiz as PDF', 'प्रश्नमंजुषा PDF म्हणून डाउनलोड करा')}
//               </button>
              
//               <button
//                 onClick={checkAnalytics}
//                 className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
//               >
//                 📊 {getUIText('Review Answers', 'उत्तरे पाहा')}
//               </button>
              
//               <button
//                 onClick={resetQuiz}
//                 className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
//               >
//                 🔄 {getUIText('Generate New Quiz', 'नवीन प्रश्नमंजुषा तयार करा')}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { generateGeminiResponse } from "../../../configs/AImodel";
import jsPDF from 'jspdf';
import { useRouter } from "next/navigation";

// Complete syllabus data
const SYLLABUS_DATA = {
  "Class 6": {
    "Mathematics": [
      "Divisibility", "The Use of Letters in Place of Numbers", "Order of Operations and the Use of Brackets",
      "Point, Line, Plane", "Angles", "Pairs of Angles", "Indices", "Natural Numbers and Whole Numbers",
      "Decimal Fractions – Division", "Squares and Square Roots", "Ratio and Proportion", "Perimeter",
      "Profit and Loss", "Integers", "Equations in One Variable", "Algebraic Expressions", "Simple Interest",
      "Percentage", "Triangles", "Properties of Triangles", "Geometric Constructions", "Area", "Bar Graphs",
      "Volume", "Circle"
    ],
    "General Science": [
      "Our Natural Resources", "Diversity in Living Things and their Classification", "Disaster Management",
      "The Living World", "Substances in Daily Use", "Substances in the Surroundings – Their States and Properties",
      "Nutrition and Diet", "Our Skeletal System and the Skin", "Motion and Types of Motion",
      "Characteristics and Classification of Living Things", "Parts of Plants and their Structure",
      "Force and Types of Force", "Work and Energy", "Simple Machines", "Measurement & Estimates of Measurements",
      "Sound", "Methods of Separating Substances", "Organ Systems", "Our Environment",
      "Our Earth and its Special Features", "Social Environment"
    ]
  },
  "Class 7": {
    "Science": [
      "Natural Resources", "Water – A Natural Resource", "Food and Protection of Food", "Properties of Water",
      "Acids, Bases and Salts", "Control and Co-ordination", "Health and Disease", "Food and Nutrition",
      "Circulation of Blood", "Reproduction in Living Things", "The Organisation of Living Things",
      "Electric Charge", "Sound – Production of Sound", "Propagation of Sound", "Classification of Substances",
      "Transmission of Heat", "Effects of Heat", "Propagation of Light"
    ],
    "Mathematics": [
      "Indices", "Variation", "Averages", "Properties of Triangles", "Theorem of Pythagoras",
      "Construction of Triangles", "Equations in One Variable", "Product Of Algebraic Expressions",
      "Factors of Algebraic Expressions", "Quadrilaterals", "Types of Quadrilaterals",
      "Construction of Quadrilaterals", "Rational Numbers", "Operations on Rational Numbers",
      "Simple Interest", "Profit and Loss", "Area", "Identity", "Circle", "Congruence",
      "Volume and Surface Area", "Joint Bar Graphs"
    ]
  },
  "Class 8": {
    "Mathematics": [
      "Irrational and Real Numbers", "Square and Square Root", "Quadrilateral", "Parallel Lines",
      "Area", "The Circle", "The Circumference and Area Of A Circle", "Statistics", "Identities",
      "Variation and Proportion", "Equations in One Variable", "Indices", "Cubes and Cube Roots",
      "Construction of Quadrilaterals", "Arc of a Circle", "Compound Interest", "Polynomials",
      "Joint Bar Graphs", "Discount and Commission", "Volume and Surface Area", "Factors of polynomials",
      "Division of Polynomials"
    ],
    "General Science": [
      "Living World and Classification of Microbes", "Health and Diseases", "Force and Pressure",
      "Current Electricity and Magnetism", "Inside the Atom", "Composition of Matter", "Metals and Nonmetals",
      "Pollution", "Disaster Management", "Cell and Cell Organelles", "Human Body and Organ System",
      "Introduction to Acid and Base", "Chemical Change and Chemical Bond", "Measurement and Effects of Heat",
      "Sound", "Reflection of Light", "Man made Materials", "Ecosystems", "Life Cycle of Stars"
    ]
  }
};

const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];
const LANGUAGE_OPTIONS = [
  { value: "english", label: "English" },
  { value: "marathi", label: "मराठी (Marathi)" },
  { value: "both", label: "Both (English + मराठी)" }
];

export default function QuizPage() {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quizGenerated, setQuizGenerated] = useState(false);

  const generateQuiz = async () => {
    if (!selectedTopic || !selectedDifficulty || !selectedLanguage) {
      alert("Please select topic, difficulty level, and language");
      return;
    }
    
    setLoading(true);
    try {
      let languageInstruction = "";
      
      if (selectedLanguage === "marathi") {
        languageInstruction = `Generate the entire quiz in Marathi language (मराठी भाषेत). All questions and options should be in proper Marathi script with correct grammar and vocabulary. Use formal Marathi suitable for educational content.`;
      } else if (selectedLanguage === "both") {
        languageInstruction = `Generate a bilingual quiz with each question in both English and Marathi. Format each question as follows:
        
English: [English question]
मराठी: [Marathi translation]

Options should also be in both languages for each option.`;
      } else {
        languageInstruction = "Generate the entire quiz in clear, proper English language suitable for educational purposes.";
      }

      const prompt = `${languageInstruction}

Generate a ${selectedDifficulty.toLowerCase()} level quiz on "${selectedTopic}" for ${selectedClass} students with exactly 10 multiple choice questions only. 

${selectedLanguage === "both" ? `
Format the response for bilingual content as follows:

1. English: [English Question text]
   मराठी: [Marathi Question text]
A) English: [English Option 1] | मराठी: [Marathi Option 1]
B) English: [English Option 2] | मराठी: [Marathi Option 2] 
C) English: [English Option 3] | मराठी: [Marathi Option 3]
D) English: [English Option 4] | मराठी: [Marathi Option 4]
CORRECT: A

` : `
Format the response as follows:

1. [Question text]
A) [Option 1]
B) [Option 2] 
C) [Option 3]
D) [Option 4]
CORRECT: A

`}

[Continue for questions 2-10]

Make the questions educational and appropriate for ${selectedClass} level. Focus only on multiple choice questions - no subjective questions. ${selectedLanguage === "marathi" || selectedLanguage === "both" ? "Ensure Marathi translations are accurate, grammatically correct, and use appropriate educational terminology." : ""}`;

      const result = await generateGeminiResponse(prompt);
      parseQuizData(result);
      setQuizGenerated(true);
    } catch (err) {
      console.error("Error generating quiz:", err);
      alert("Error generating quiz. Please try again.");
    }
    setLoading(false);
  };

  const parseQuizData = (response) => {
    const lines = response.split('\n').filter(line => line.trim());
    const parsedQuestions = [];
    let currentQuestion = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Handle different question formats based on language selection
      const questionMatch = line.match(/^(\d+)\.\s*(.+)/);
      if (questionMatch) {
        if (currentQuestion) {
          parsedQuestions.push(currentQuestion);
        }
        
        const questionNum = parseInt(questionMatch[1]);
        let questionText = questionMatch[2];
        
        // Check if this is a bilingual question
        let marathiQuestion = '';
        if (selectedLanguage === "both") {
          if (questionText.includes('English:')) {
            questionText = questionText.replace('English:', '').trim();
          }
          // Look for Marathi part in next line
          if (i + 1 < lines.length && lines[i + 1].includes('मराठी:')) {
            marathiQuestion = lines[i + 1].replace('मराठी:', '').trim();
            i++; // Skip the Marathi line as we've processed it
          }
        }
        
        currentQuestion = {
          id: questionNum,
          type: 'mcq',
          question: questionText,
          marathiQuestion: marathiQuestion,
          options: [],
          marathiOptions: [],
          correctAnswer: ''
        };
      }
      else if (currentQuestion && /^[A-D]\)/.test(line)) {
        let optionText = line.substring(2).trim();
        let marathiOption = '';
        
        if (selectedLanguage === "both" && optionText.includes('|')) {
          const parts = optionText.split('|');
          if (parts.length >= 2) {
            optionText = parts[0].replace('English:', '').trim();
            marathiOption = parts[1].replace('मराठी:', '').trim();
          }
        }
        
        currentQuestion.options.push(optionText);
        if (marathiOption) {
          currentQuestion.marathiOptions.push(marathiOption);
        }
      }
      else if (line.startsWith('CORRECT:')) {
        if (currentQuestion) {
          currentQuestion.correctAnswer = line.split(':')[1].trim();
        }
      }
    }
    
    if (currentQuestion) {
      parsedQuestions.push(currentQuestion);
    }

    if (parsedQuestions.length < 10) {
      const fallbackQuestions = createFallbackQuestions();
      setQuestions(fallbackQuestions);
    } else {
      setQuestions(parsedQuestions);
    }
  };

  const createFallbackQuestions = () => {
    const questions = [];
    
    for (let i = 1; i <= 10; i++) {
      const baseQuestion = {
        id: i,
        type: 'mcq',
        question: `Question ${i} about ${selectedTopic}?`,
        marathiQuestion: selectedLanguage === "both" || selectedLanguage === "marathi" ? `${selectedTopic} संबंधित प्रश्न ${i}?` : '',
        options: [
          `Option A for question ${i}`,
          `Option B for question ${i}`,
          `Option C for question ${i}`,
          `Option D for question ${i}`
        ],
        marathiOptions: selectedLanguage === "both" || selectedLanguage === "marathi" ? [
          `प्रश्न ${i} साठी पर्याय अ`,
          `प्रश्न ${i} साठी पर्याय ब`,
          `प्रश्न ${i} साठी पर्याय क`,
          `प्रश्न ${i} साठी पर्याय ड`
        ] : [],
        correctAnswer: 'A'
      };
      
      if (selectedLanguage === "marathi") {
        baseQuestion.question = baseQuestion.marathiQuestion;
        baseQuestion.options = baseQuestion.marathiOptions;
        baseQuestion.marathiQuestion = '';
        baseQuestion.marathiOptions = [];
      }
      
      questions.push(baseQuestion);
    }
    return questions;
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;

    // Set font
    doc.setFont("helvetica");
    doc.setFontSize(16);
    
    // Title - Always in English for PDF
    const quizTitle = `Quiz: ${selectedTopic}`;
    doc.text(quizTitle, 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    
    // Header information - Always in English for PDF
    const headerText = `Class: ${selectedClass} | Subject: ${selectedSubject} | Difficulty: ${selectedDifficulty}`;
    doc.text(headerText, 20, yPosition);
    yPosition += 20;

    questions.forEach((question, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(11);
      
      // Question text - Only English version in PDF
      let questionText = `${index + 1}. ${question.question}`;
      
      const splitQuestion = doc.splitTextToSize(questionText, 170);
      doc.text(splitQuestion, 20, yPosition);
      yPosition += splitQuestion.length * 5 + 5;

      // Options - Only English version in PDF
      question.options.forEach((option, optIndex) => {
        let optionText = `${String.fromCharCode(65 + optIndex)}) ${option}`;
        
        const splitOption = doc.splitTextToSize(optionText, 160);
        doc.text(splitOption, 30, yPosition);
        yPosition += splitOption.length * 5 + 2;
      });
      
      yPosition += 10;
    });

    // Add answer key on new page
    doc.addPage();
    yPosition = 20;
    doc.setFontSize(14);
    const answerKeyTitle = 'Answer Key';
    doc.text(answerKeyTitle, 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(11);
    questions.forEach((question, index) => {
      const answerText = `${index + 1}. ${question.correctAnswer}`;
      doc.text(answerText, 20, yPosition);
      yPosition += 8;
    });

    // Filename - Always English for PDF
    const filename = `${selectedTopic}_Quiz.pdf`;
    doc.save(filename);
  };

  const checkAnalytics = () => {
    const quizData = {
      topic: selectedTopic,
      class: selectedClass,
      subject: selectedSubject,
      difficulty: selectedDifficulty,
      language: selectedLanguage,
      questions: questions
    };
    localStorage.setItem('quizAnalytics', JSON.stringify(quizData));
    router.push('/analytics');
  };

  const resetQuiz = () => {
    setSelectedClass('');
    setSelectedSubject('');
    setSelectedTopic('');
    setSelectedDifficulty('');
    setSelectedLanguage('english');
    setQuestions([]);
    setQuizGenerated(false);
  };

  const getSubjects = () => {
    return selectedClass ? Object.keys(SYLLABUS_DATA[selectedClass] || {}) : [];
  };

  const getTopics = () => {
    return (selectedClass && selectedSubject) ? SYLLABUS_DATA[selectedClass][selectedSubject] || [] : [];
  };

  const getUIText = (englishText, marathiText) => {
    if (selectedLanguage === 'marathi') return marathiText;
    if (selectedLanguage === 'both') return `${englishText} / ${marathiText}`;
    return englishText;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          {getUIText("Educational Quiz Generator", "शैक्षणिक प्रश्नमंजुषा जनरेटर")}
        </h1>
        
        {!quizGenerated ? (
          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getUIText("Class", "वर्ग")}
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setSelectedSubject('');
                    setSelectedTopic('');
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{getUIText("Select Class", "वर्ग निवडा")}</option>
                  {Object.keys(SYLLABUS_DATA).map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getUIText("Subject", "विषय")}
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setSelectedTopic('');
                  }}
                  disabled={!selectedClass}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">{getUIText("Select Subject", "विषय निवडा")}</option>
                  {getSubjects().map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getUIText("Topic", "विषय")}
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  disabled={!selectedSubject}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">{getUIText("Select Topic", "विषय निवडा")}</option>
                  {getTopics().map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getUIText("Difficulty", "कठीणता")}
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{getUIText("Select Difficulty", "कठीणता निवडा")}</option>
                  {DIFFICULTY_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getUIText("Language", "भाषा")}
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {LANGUAGE_OPTIONS.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-center py-8">
              <button
                onClick={generateQuiz}
                disabled={loading || !selectedTopic || !selectedDifficulty}
                className="px-8 py-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 transition-colors text-lg"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {getUIText('Generating Quiz...', 'प्रश्नमंजुषा तयार करत आहे...')}
                  </div>
                ) : (
                  getUIText('Generate Quiz', 'प्रश्नमंजुषा तयार करा')
                )}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                {getUIText('Quiz Generated: ', 'प्रश्नमंजुषा तयार केली: ')}{selectedTopic}
              </h2>
              <p className="text-gray-600">
                {selectedLanguage === 'marathi' 
                  ? `वर्ग: ${selectedClass} | विषय: ${selectedSubject} | कठीणता: ${selectedDifficulty} | भाषा: मराठी`
                  : selectedLanguage === 'both'
                  ? `Class/वर्ग: ${selectedClass} | Subject/विषय: ${selectedSubject} | Difficulty/कठीणता: ${selectedDifficulty} | Language/भाषा: Bilingual`
                  : `Class: ${selectedClass} | Subject: ${selectedSubject} | Difficulty: ${selectedDifficulty} | Language: English`
                }
              </p>
              <p className="text-gray-600">
                {getUIText('Total Questions: ', 'एकूण प्रश्न: ')}{questions.length}
              </p>
            </div>

            <div className="space-y-6 mb-8">
              {questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-6 bg-gray-50">
                  <h3 className="font-semibold text-lg mb-4 text-gray-800">
                    {index + 1}. {question.question}
                    {selectedLanguage === 'both' && question.marathiQuestion && (
                      <div className="text-blue-600 mt-2">
                        मराठी: {question.marathiQuestion}
                      </div>
                    )}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['A', 'B', 'C', 'D'].map((option, optIndex) => (
                      <div key={option} className="flex flex-col space-y-2 p-3 bg-white rounded border">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-blue-600">{option})</span>
                          <span className="text-gray-700">
                            {question.options[optIndex] || `Option ${option}`}
                          </span>
                        </div>
                        {selectedLanguage === 'both' && question.marathiOptions && question.marathiOptions[optIndex] && (
                          <div className="flex items-center space-x-3 text-sm">
                            <span className="font-medium text-purple-600">{option})</span>
                            <span className="text-gray-600">
                              {question.marathiOptions[optIndex]}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-sm text-green-600 font-medium">
                    {getUIText('Correct Answer: ', 'योग्य उत्तर: ')}{question.correctAnswer}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={downloadPDF}
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                📄 {getUIText('Download Quiz as PDF', 'प्रश्नमंजुषा PDF म्हणून डाउनलोड करा')}
              </button>
              
              <button
                onClick={checkAnalytics}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
              >
                📊 {getUIText('Review Answers', 'उत्तरे पाहा')}
              </button>
              
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                🔄 {getUIText('Generate New Quiz', 'नवीन प्रश्नमंजुषा तयार करा')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}