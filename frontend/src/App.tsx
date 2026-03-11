import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { QuestionManager } from './components/QuestionManager';
import { ExamGenerator } from './components/ExamGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                CBSE Class VI Mathematics
              </h1>
              <p className="text-lg text-muted-foreground">
                Annual Exam Paper Generator - Ganit Prakash New Book
              </p>
            </div>

            <Tabs defaultValue="generate" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="generate">Generate Paper</TabsTrigger>
                <TabsTrigger value="manage">Manage Questions</TabsTrigger>
              </TabsList>

              <TabsContent value="generate" className="space-y-6">
                <ExamGenerator />
              </TabsContent>

              <TabsContent value="manage" className="space-y-6">
                <QuestionManager />
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
