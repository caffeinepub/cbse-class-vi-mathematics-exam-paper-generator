import type { Question } from '../backend';
import { QuestionType } from '../backend';

export async function generateWordDocument(questions: Question[], totalMarks: number) {
  // Group questions by type
  const mcqQuestions = questions.filter((q) => q.questionType === QuestionType.mcq);
  const shortAnswerQuestions = questions.filter((q) => q.questionType === QuestionType.shortAnswer);
  const longAnswerQuestions = questions.filter((q) => q.questionType === QuestionType.longAnswer);
  const imageBasedQuestions = questions.filter((q) => q.questionType === QuestionType.imageBased);

  // Build HTML content for the document
  let htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>CBSE Class VI Mathematics - Annual Examination</title>
  <style>
    @page {
      size: A4;
      margin: 1in;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #000;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .title {
      font-size: 18pt;
      font-weight: bold;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    .subtitle {
      font-size: 14pt;
      margin-bottom: 5px;
    }
    .exam-info {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
      font-weight: bold;
    }
    .instructions {
      margin: 20px 0;
    }
    .instructions h2 {
      font-size: 14pt;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .instructions ol {
      margin-left: 20px;
    }
    .instructions li {
      margin-bottom: 5px;
    }
    .section {
      margin: 30px 0;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 14pt;
      font-weight: bold;
      margin: 20px 0 15px 0;
      text-transform: uppercase;
      border-bottom: 2px solid #000;
      padding-bottom: 5px;
    }
    .question {
      margin: 15px 0;
      page-break-inside: avoid;
    }
    .question-number {
      font-weight: bold;
    }
    .marks {
      font-style: italic;
      color: #333;
    }
    .options {
      margin-left: 30px;
      margin-top: 5px;
    }
    .option {
      margin: 3px 0;
    }
    .image-container {
      margin: 10px 0;
      text-align: center;
    }
    .image-container img {
      max-width: 400px;
      max-height: 300px;
      border: 1px solid #ccc;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      font-weight: bold;
    }
    @media print {
      body {
        padding: 0;
      }
      .section {
        page-break-after: auto;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">Central Board of Secondary Education</div>
    <div class="subtitle">Class VI - Mathematics</div>
    <div class="subtitle">Annual Examination</div>
  </div>

  <div class="exam-info">
    <span>Time: 3 Hours</span>
    <span>Maximum Marks: ${totalMarks}</span>
  </div>

  <div class="instructions">
    <h2>General Instructions:</h2>
    <ol>
      <li>All questions are compulsory.</li>
      <li>Read each question carefully before answering.</li>
      <li>Show all necessary working and calculations.</li>
      <li>Use of calculator is not permitted.</li>
    </ol>
  </div>
`;

  let questionNumber = 1;

  // Section A - MCQs
  if (mcqQuestions.length > 0) {
    htmlContent += `
  <div class="section">
    <div class="section-title">Section A - Multiple Choice Questions</div>
`;
    for (const question of mcqQuestions) {
      htmlContent += `
    <div class="question">
      <span class="question-number">${questionNumber}.</span> ${escapeHtml(question.content)}
      <span class="marks">[${Number(question.marks)} mark${Number(question.marks) > 1 ? 's' : ''}]</span>
`;
      if (question.options && question.options.length > 0) {
        htmlContent += `      <div class="options">
`;
        question.options.forEach((option, idx) => {
          htmlContent += `        <div class="option">${String.fromCharCode(97 + idx)}) ${escapeHtml(option)}</div>
`;
        });
        htmlContent += `      </div>
`;
      }
      htmlContent += `    </div>
`;
      questionNumber++;
    }
    htmlContent += `  </div>
`;
  }

  // Section B - Short Answer Questions
  if (shortAnswerQuestions.length > 0) {
    htmlContent += `
  <div class="section">
    <div class="section-title">Section B - Short Answer Questions</div>
`;
    for (const question of shortAnswerQuestions) {
      htmlContent += `
    <div class="question">
      <span class="question-number">${questionNumber}.</span> ${escapeHtml(question.content)}
      <span class="marks">[${Number(question.marks)} mark${Number(question.marks) > 1 ? 's' : ''}]</span>
    </div>
`;
      questionNumber++;
    }
    htmlContent += `  </div>
`;
  }

  // Section C - Long Answer Questions
  if (longAnswerQuestions.length > 0) {
    htmlContent += `
  <div class="section">
    <div class="section-title">Section C - Long Answer Questions</div>
`;
    for (const question of longAnswerQuestions) {
      htmlContent += `
    <div class="question">
      <span class="question-number">${questionNumber}.</span> ${escapeHtml(question.content)}
      <span class="marks">[${Number(question.marks)} mark${Number(question.marks) > 1 ? 's' : ''}]</span>
    </div>
`;
      questionNumber++;
    }
    htmlContent += `  </div>
`;
  }

  // Section D - Image Based Questions
  if (imageBasedQuestions.length > 0) {
    htmlContent += `
  <div class="section">
    <div class="section-title">Section D - Picture/Diagram Based Questions</div>
`;
    for (const question of imageBasedQuestions) {
      htmlContent += `
    <div class="question">
      <span class="question-number">${questionNumber}.</span> ${escapeHtml(question.content)}
      <span class="marks">[${Number(question.marks)} mark${Number(question.marks) > 1 ? 's' : ''}]</span>
`;
      if (question.image) {
        try {
          const imageUrl = question.image.getDirectURL();
          htmlContent += `
      <div class="image-container">
        <img src="${imageUrl}" alt="Question diagram" />
      </div>
`;
        } catch (error) {
          console.error('Error loading image:', error);
          htmlContent += `
      <div class="image-container">
        <em>[Image not available]</em>
      </div>
`;
        }
      }
      htmlContent += `    </div>
`;
      questionNumber++;
    }
    htmlContent += `  </div>
`;
  }

  htmlContent += `
  <div class="footer">
    *** End of Question Paper ***
  </div>
</body>
</html>
`;

  // Create a Blob with the HTML content
  const blob = new Blob([htmlContent], { type: 'application/msword' });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `CBSE_Class_VI_Mathematics_Annual_Exam_${new Date().getFullYear()}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
