import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Plus, Trash2, Edit, Loader2, Image as ImageIcon } from 'lucide-react';
import { useQuestions, useAddQuestion, useDeleteQuestion, useUpdateQuestion } from '../hooks/useQueries';
import { toast } from 'sonner';
import { QuestionType, type QuestionUpdateArgs } from '../backend';
import { ExternalBlob } from '../backend';

export function QuestionManager() {
  const { data: questions, isLoading } = useQuestions();
  const addQuestion = useAddQuestion();
  const deleteQuestion = useDeleteQuestion();
  const updateQuestion = useUpdateQuestion();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [formData, setFormData] = useState<QuestionUpdateArgs>({
    chapter: 4n,
    questionType: QuestionType.mcq,
    difficulty: 'moderate',
    marks: 1n,
    content: '',
    options: [],
    correctAnswer: '',
    image: undefined,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      chapter: 4n,
      questionType: QuestionType.mcq,
      difficulty: 'moderate',
      marks: 1n,
      content: '',
      options: [],
      correctAnswer: '',
      image: undefined,
    });
    setEditingQuestion(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageBlob: ExternalBlob | undefined = undefined;

      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        imageBlob = ExternalBlob.fromBytes(uint8Array);
      }

      const questionData: QuestionUpdateArgs = {
        ...formData,
        image: imageBlob,
      };

      if (editingQuestion) {
        await updateQuestion.mutateAsync({ id: editingQuestion, args: questionData });
        toast.success('Question updated successfully');
      } else {
        await addQuestion.mutateAsync(questionData);
        toast.success('Question added successfully');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error('Failed to save question');
    }
  };

  const handleEdit = (question: any) => {
    setEditingQuestion(question.id);
    setFormData({
      chapter: question.chapter,
      questionType: question.questionType,
      difficulty: question.difficulty,
      marks: question.marks,
      content: question.content,
      options: question.options || [],
      correctAnswer: question.correctAnswer,
      image: question.image,
    });
    if (question.image) {
      setImagePreview(question.image.getDirectURL());
    }
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestion.mutateAsync(id);
        toast.success('Question deleted successfully');
      } catch (error) {
        console.error('Error deleting question:', error);
        toast.error('Failed to delete question');
      }
    }
  };

  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case QuestionType.mcq:
        return 'MCQ';
      case QuestionType.shortAnswer:
        return 'Short Answer';
      case QuestionType.longAnswer:
        return 'Long Answer';
      case QuestionType.imageBased:
        return 'Image Based';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Question Bank</CardTitle>
              <CardDescription>Manage questions from Ganit Prakash chapters 4-10</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
                  <DialogDescription>
                    Fill in the details for the question from Ganit Prakash book
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="chapter">Chapter</Label>
                      <Select
                        value={formData.chapter.toString()}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, chapter: BigInt(value) }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[4, 5, 6, 7, 8, 9, 10].map((ch) => (
                            <SelectItem key={ch} value={ch.toString()}>
                              Chapter {ch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="questionType">Question Type</Label>
                      <Select
                        value={formData.questionType}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, questionType: value as QuestionType }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={QuestionType.mcq}>MCQ</SelectItem>
                          <SelectItem value={QuestionType.shortAnswer}>Short Answer</SelectItem>
                          <SelectItem value={QuestionType.longAnswer}>Long Answer</SelectItem>
                          <SelectItem value={QuestionType.imageBased}>Image Based</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="marks">Marks</Label>
                    <Input
                      id="marks"
                      type="number"
                      min="1"
                      max="10"
                      value={Number(formData.marks)}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, marks: BigInt(e.target.value) }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Question Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, content: e.target.value }))
                      }
                      rows={4}
                      required
                    />
                  </div>

                  {formData.questionType === QuestionType.mcq && (
                    <div className="space-y-2">
                      <Label>Options (one per line)</Label>
                      <Textarea
                        value={formData.options?.join('\n') || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            options: e.target.value.split('\n').filter((opt) => opt.trim()),
                          }))
                        }
                        rows={4}
                        placeholder="Option A&#10;Option B&#10;Option C&#10;Option D"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="correctAnswer">Correct Answer</Label>
                    <Textarea
                      id="correctAnswer"
                      value={formData.correctAnswer}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, correctAnswer: e.target.value }))
                      }
                      rows={2}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Image (Optional)</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-w-full h-auto max-h-48 rounded-lg border"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={addQuestion.isPending || updateQuestion.isPending}>
                      {(addQuestion.isPending || updateQuestion.isPending) && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {editingQuestion ? 'Update' : 'Add'} Question
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : questions && questions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Chapter</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell>
                        <Badge variant="outline">Ch {Number(question.chapter)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge>{getQuestionTypeLabel(question.questionType)}</Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="flex items-start gap-2">
                          {question.image && (
                            <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                          )}
                          <span className="line-clamp-2">{question.content}</span>
                        </div>
                      </TableCell>
                      <TableCell>{Number(question.marks)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(question)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(question.id)}
                            disabled={deleteQuestion.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No questions added yet. Click "Add Question" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
