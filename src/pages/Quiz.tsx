import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';


interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex?: number; 
}


const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which of these best describes your current career stage?',
    options: ['Student', 'Recent graduate', 'Early career professional', 'Career changer'],
  },
  {
    id: 'q2',
    question: 'Which skill area are you most interested in developing?',
    options: ['Technical/Programming', 'Design', 'Business/Management', 'Data & Analytics'],
  },
];

interface StudentInfo {
  fullName: string;
  email: string;
  phone: string;
}

type QuizStep = 'info' | 'quiz' | 'complete';

const emptyStudentInfo: StudentInfo = { fullName: '', email: '', phone: '' };

const Quiz = () => {
  const { toast } = useToast();

  const [step, setStep] = useState<QuizStep>('info');
  const [studentInfo, setStudentInfo] = useState<StudentInfo>(emptyStudentInfo);
  const [infoErrors, setInfoErrors] = useState<Partial<StudentInfo>>({});

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [validationMessage, setValidationMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;


  const validateStudentInfo = () => {
    const errors: Partial<StudentInfo> = {};

    if (!studentInfo.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!studentInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setInfoErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStudentInfo()) {
      setStep('quiz');
    }
  };


  const handleSelectOption = (optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }));
    setValidationMessage('');
  };

  const handleNext = () => {
   
    if (answers[currentQuestion.id] === undefined) {
      setValidationMessage('Please select an option before continuing.');
      return;
    }

    if (isLastQuestion) {
      submitQuiz();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setValidationMessage('');
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setValidationMessage('');
    }
  };


  const submitQuiz = async () => {
    setIsSubmitting(true);

    try {
      const formattedAnswers = quizQuestions.map((q) => ({
        questionId: q.id,
        question: q.question,
        selectedOption: q.options[answers[q.id]],
      }));

      let score: number | null = null;
      const hasScoring = quizQuestions.some((q) => q.correctIndex !== undefined);
      if (hasScoring) {
        score = quizQuestions.reduce((total, q) => {
          if (q.correctIndex !== undefined && answers[q.id] === q.correctIndex) {
            return total + 1;
          }
          return total;
        }, 0);
      }

      const { error } = await supabase
        .from('quiz_submissions' as any)
        .insert({
          full_name: studentInfo.fullName.trim(),
          email: studentInfo.email.trim(),
          phone: studentInfo.phone.trim() || null,
          answers: formattedAnswers,
          score,
        } as any);

      if (error) throw error;

      setStep('complete');
    } catch (error) {
      console.error('Quiz submission error:', error);
      toast({
        title: 'Submission failed',
        description: 'Something went wrong while submitting your quiz. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Career Quiz - AI Career Navigator</title>
        <meta name="description" content="Take a short quiz to help us personalize your career guidance." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container-custom py-8">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="max-w-xl mx-auto">
            <AnimatePresence mode="wait">
            
              {step === 'info' && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="glass-card p-8">
                    <h1 className="text-2xl font-bold text-primary mb-2">Career Quiz</h1>
                    <p className="text-muted-foreground mb-6">
                      Tell us a bit about yourself before we begin.
                    </p>

                    <form onSubmit={handleInfoSubmit} className="space-y-4" noValidate>
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={studentInfo.fullName}
                          onChange={(e) =>
                            setStudentInfo((prev) => ({ ...prev, fullName: e.target.value }))
                          }
                          aria-invalid={!!infoErrors.fullName}
                          aria-describedby={infoErrors.fullName ? 'fullName-error' : undefined}
                          placeholder="Jane Doe"
                        />
                        {infoErrors.fullName && (
                          <p id="fullName-error" role="alert" className="text-sm text-destructive mt-1">
                            {infoErrors.fullName}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={studentInfo.email}
                          onChange={(e) =>
                            setStudentInfo((prev) => ({ ...prev, email: e.target.value }))
                          }
                          aria-invalid={!!infoErrors.email}
                          aria-describedby={infoErrors.email ? 'email-error' : undefined}
                          placeholder="jane@example.com"
                        />
                        {infoErrors.email && (
                          <p id="email-error" role="alert" className="text-sm text-destructive mt-1">
                            {infoErrors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number (optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={studentInfo.phone}
                          onChange={(e) =>
                            setStudentInfo((prev) => ({ ...prev, phone: e.target.value }))
                          }
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <Button type="submit" className="btn-primary w-full mt-2">
                        Start Quiz
                      </Button>
                    </form>
                  </Card>
                </motion.div>
              )}

          
              {step === 'quiz' && currentQuestion && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="glass-card p-8">
                    <p className="text-sm text-muted-foreground mb-2">
                      Question {currentQuestionIndex + 1} of {quizQuestions.length}
                    </p>
                    <h2 className="text-xl font-semibold text-primary mb-6">
                      {currentQuestion.question}
                    </h2>

                    <div className="space-y-3" role="radiogroup" aria-label={currentQuestion.question}>
                      {currentQuestion.options.map((option, index) => {
                        const isSelected = answers[currentQuestion.id] === index;
                        return (
                          <button
                            key={index}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => handleSelectOption(index)}
                            className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
                              isSelected
                                ? 'border-secondary bg-secondary/10 text-primary font-medium'
                                : 'border-border hover:bg-muted text-foreground'
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>

                    
                    <div aria-live="polite" role="status" className="mt-4 min-h-[1.5rem]">
                      {validationMessage && (
                        <p className="text-sm text-destructive">{validationMessage}</p>
                      )}
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentQuestionIndex === 0}
                      >
                        Back
                      </Button>
                      <Button type="button" onClick={handleNext} disabled={isSubmitting} className="btn-primary">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : isLastQuestion ? (
                          'Submit'
                        ) : (
                          'Next'
                        )}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}

            
              {step === 'complete' && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="glass-card p-8 text-center">
                    <CheckCircle2 className="w-16 h-16 text-secondary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-primary mb-2">Thank you, {studentInfo.fullName}!</h2>
                    <p className="text-muted-foreground mb-6">
                      Your responses have been submitted successfully.
                    </p>
                    <Link to="/dashboard">
                      <Button className="btn-primary">Back to Dashboard</Button>
                    </Link>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default Quiz;