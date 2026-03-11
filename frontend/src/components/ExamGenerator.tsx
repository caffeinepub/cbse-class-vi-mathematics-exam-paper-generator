import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { FileDown, Loader2, FileText } from 'lucide-react';
import { useQuestions } from '../hooks/useQueries';
import { toast } from 'sonner';
import { generateWordDocument } from '../lib/documentGenerator';
import type { Question } from '../backend';

interface ChapterSelection {
  [key: number]: boolean;
}

interface QuestionCounts {
  mcq: number;
  shortAnswer: number;
  longAnswer: number;
}

export function ExamGenerator() {
  const { data: allQuestions, isLoading } = useQuestions();
  const [selectedChapters, setSelectedChapters] = useState<ChapterSelection>({
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true,
  });
  const [questionCounts, setQuestionCounts] = useState<QuestionCounts>({
    mcq: 10,
    shortAnswer: 5,
    longAnswer: 3,
  });
  const [totalMarks, setTotalMarks] = useState(80);
  const [isGenerating, setIsGenerating] = useState(false);

  const chapters = [4, 5, 6, 7, 8, 9, 10];

  const handleChapterToggle = (chapter: number) => {
    setSelectedChapters((prev) => ({
      ...prev,
      [chapter]: !prev[chapter],
    }));
  };

  const handleGenerate = async () => {
    const selectedChapterNumbers = Object.entries(selectedChapters)
      .filter(([_, selected]) => selected)
      .map(([chapter]) => Number(chapter));

    if (selectedChapterNumbers.length === 0) {
      toast.error('Please select at least one chapter');
      return;
    }

    if (!allQuestions || allQuestions.length === 0) {
      toast.error('No questions available. Please add questions first.');
      return;
    }

    setIsGenerating(true);

    try {
      // Filter questions by selected chapters
      const filteredQuestions = allQuestions.filter((q) =>
        selectedChapterNumbers.includes(Number(q.chapter))
      );

      if (filteredQuestions.length === 0) {
        toast.error('No questions found for selected chapters');
        setIsGenerating(false);
        return;
      }

      // Separate questions by type
      const mcqQuestions = filteredQuestions.filter((q) => q.questionType === 'mcq');
      const shortAnswerQuestions = filteredQuestions.filter((q) => q.questionType === 'shortAnswer');
      const longAnswerQuestions = filteredQuestions.filter((q) => q.questionType === 'longAnswer');
      const imageBasedQuestions = filteredQuestions.filter((q) => q.questionType === 'imageBased');

      // Randomly select questions
      const selectedQuestions: Question[] = [];

      // Select MCQs
      const shuffledMcq = [...mcqQuestions].sort(() => Math.random() - 0.5);
      selectedQuestions.push(...shuffledMcq.slice(0, questionCounts.mcq));

      // Select Short Answer
      const shuffledShort = [...shortAnswerQuestions].sort(() => Math.random() - 0.5);
      selectedQuestions.push(...shuffledShort.slice(0, questionCounts.shortAnswer));

      // Select Long Answer
      const shuffledLong = [...longAnswerQuestions].sort(() => Math.random() - 0.5);
      selectedQuestions.push(...shuffledLong.slice(0, questionCounts.longAnswer));

      // Add some image-based questions if available
      if (imageBasedQuestions.length > 0) {
        const shuffledImage = [...imageBasedQuestions].sort(() => Math.random() - 0.5);
        selectedQuestions.push(...shuffledImage.slice(0, 2));
      }

      if (selectedQuestions.length === 0) {
        toast.error('Not enough questions available for the selected criteria');
        setIsGenerating(false);
        return;
      }

      // Generate Word document
      await generateWordDocument(selectedQuestions, totalMarks);

      toast.success('Exam paper generated successfully!');
    } catch (error) {
      console.error('Error generating document:', error);
      toast.error('Failed to generate exam paper. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Configure Exam Paper
          </CardTitle>
          <CardDescription>
            Select chapters and specify the number of questions for each type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chapter Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Select Chapters (Ganit Prakash)</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {chapters.map((chapter) => (
                <div
                  key={chapter}
                  className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <Checkbox
                    id={`chapter-${chapter}`}
                    checked={selectedChapters[chapter]}
                    onCheckedChange={() => handleChapterToggle(chapter)}
                  />
                  <Label
                    htmlFor={`chapter-${chapter}`}
                    className="cursor-pointer font-medium text-sm"
                  >
                    Ch {chapter}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Question Counts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mcq-count">MCQs</Label>
              <Input
                id="mcq-count"
                type="number"
                min="0"
                max="50"
                value={questionCounts.mcq}
                onChange={(e) =>
                  setQuestionCounts((prev) => ({ ...prev, mcq: Number(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="short-count">Short Answer</Label>
              <Input
                id="short-count"
                type="number"
                min="0"
                max="20"
                value={questionCounts.shortAnswer}
                onChange={(e) =>
                  setQuestionCounts((prev) => ({ ...prev, shortAnswer: Number(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="long-count">Long Answer</Label>
              <Input
                id="long-count"
                type="number"
                min="0"
                max="10"
                value={questionCounts.longAnswer}
                onChange={(e) =>
                  setQuestionCounts((prev) => ({ ...prev, longAnswer: Number(e.target.value) }))
                }
              />
            </div>
          </div>

          {/* Total Marks */}
          <div className="space-y-2">
            <Label htmlFor="total-marks">Total Marks</Label>
            <Input
              id="total-marks"
              type="number"
              min="10"
              max="200"
              value={totalMarks}
              onChange={(e) => setTotalMarks(Number(e.target.value))}
              className="max-w-xs"
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            size="lg"
            className="w-full sm:w-auto"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-5 w-5" />
                Generate Exam Paper
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-accent/50 border-accent">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Note:</strong> The exam paper will be generated in Microsoft Word (.docx)
              format with:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Professional formatting with section headings</li>
              <li>Proper marks distribution for each question</li>
              <li>Instructions for students</li>
              <li>Image-based questions (where available)</li>
              <li>Moderate difficulty level suitable for annual examination</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
