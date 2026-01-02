"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Trophy,
  Clock,
  Zap,
} from "lucide-react";
import { saveScore } from "@/lib/score-actions";

interface FlashCard {
  id: number;
  message: string;
  isScam: boolean;
  explanation: string;
}

const flashCards: FlashCard[] = [
  {
    id: 1,
    message:
      "Congrats! You've won a gift card. Just verify your bank details to claim.",
    isScam: true,
    explanation:
      "Requests for bank details to claim a prize is a major red flag. Legitimate prizes never require financial information.",
  },
  {
    id: 2,
    message:
      "Your school portal requires password reset through the official app at school.edu/reset",
    isScam: false,
    explanation:
      "If the domain is correct (.edu for schools) and you initiated the reset, this is likely safe. Always verify the URL.",
  },
  {
    id: 3,
    message:
      "URGENT! Your account will be suspended in 24 hours. Click here immediately!",
    isScam: true,
    explanation:
      "Urgency tactics and threats of account suspension are classic phishing techniques designed to make you act without thinking.",
  },
  {
    id: 4,
    message:
      "Hi! It's Sarah from math class. Can you help me with homework? Here's the assignment link.",
    isScam: true,
    explanation:
      "Even if it seems like someone you know, verify through another channel. Accounts can be compromised.",
  },
  {
    id: 5,
    message:
      "Your package delivery requires a $2 customs fee. Track your package here: [legitimate courier site]",
    isScam: false,
    explanation:
      "If the link goes to a legitimate, verified courier website, small customs fees are normal for international packages.",
  },
  {
    id: 6,
    message:
      "You're pre-approved for a credit card! No credit check needed, just send us your SSN.",
    isScam: true,
    explanation:
      "Legitimate financial institutions never ask for SSN via unsolicited messages. This is identity theft bait.",
  },
  {
    id: 7,
    message:
      "Your subscription to Netflix will renew tomorrow. Manage subscriptions in your account settings.",
    isScam: false,
    explanation:
      "Standard renewal notifications that don't ask for information or pressure you to click suspicious links are typically legitimate.",
  },
  {
    id: 8,
    message:
      "You've been selected for a survey! Earn $500 for 5 minutes of your time.",
    isScam: true,
    explanation:
      "Unrealistic compensation for minimal effort is too good to be true. Legitimate surveys pay much less.",
  },
  {
    id: 9,
    message:
      "Final notice: Your tax refund of $1,247 is waiting. Download form to claim.",
    isScam: true,
    explanation:
      "Tax agencies contact you through official mail, not unsolicited messages. They never ask you to download forms from messages.",
  },
  {
    id: 10,
    message:
      "Password reset requested. If this wasn't you, ignore this email. Link expires in 1 hour.",
    isScam: false,
    explanation:
      "Legitimate password reset emails include expiration times and don't pressure you if you didn't request it.",
  },
];

export default function FlashCardChallengePage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answers, setAnswers] = useState<
    Array<{ correct: boolean; choice: boolean }>
  >([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  useEffect(() => {
    if (!isActive || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, gameOver]);

  const startGame = () => {
    setIsActive(true);
    setCurrentCardIndex(0);
    setScore(0);
    setStreak(0);
    setAnswers([]);
    setTimeLeft(60);
    setGameOver(false);
    setScoreSaved(false);
  };

  const handleAnswer = (userAnswer: boolean) => {
    const currentCard = flashCards[currentCardIndex];
    const isCorrect = userAnswer === currentCard.isScam;

    setAnswers([...answers, { correct: isCorrect, choice: userAnswer }]);

    if (isCorrect) {
      setScore(score + 10 + streak * 2);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }

    setShowResult(true);
    setShowExplanation(true);
  };

  const nextCard = () => {
    setShowResult(false);
    setShowExplanation(false);

    if (currentCardIndex + 1 >= flashCards.length) {
      setGameOver(true);
    } else {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const restartGame = () => {
    setCurrentCardIndex(0);
    setScore(0);
    setStreak(0);
    setAnswers([]);
    setShowResult(false);
    setTimeLeft(60);
    setIsActive(false);
    setGameOver(false);
    setShowExplanation(false);
    setScoreSaved(false);
  };

  // Save score when game ends
  useEffect(() => {
    if (gameOver && !scoreSaved && answers.length > 0) {
      const accuracy = Math.round(
        (answers.filter((a) => a.correct).length / answers.length) * 100
      );

      saveScore({
        game_type: "flash-card",
        score: score,
        accuracy: accuracy,
        time_taken: 60 - timeLeft,
        metadata: {
          total_cards: answers.length,
          correct: answers.filter((a) => a.correct).length,
          incorrect: answers.filter((a) => !a.correct).length,
        },
      }).then((result) => {
        if (result.success) {
          console.log("Score saved successfully");
          setScoreSaved(true);
        } else {
          console.error("Failed to save score:", result.error);
        }
      });
    }
  }, [gameOver, scoreSaved, score, answers, timeLeft]);

  if (!isActive && !gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-yellow-500/5">
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-md shadow-sm">
          <div className="container mx-auto px-4 py-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5 bg-[size:50px_50px] [mask-image:radial-gradient(white,transparent_85%)]" />
          <div className="max-w-2xl mx-auto text-center relative">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/10 mb-8 shadow-lg">
              <Zap className="h-12 w-12 text-yellow-600" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Flash-Card Challenge
            </h1>
            <p className="text-xl text-muted-foreground/90 mb-10 leading-relaxed font-light">
              Test your scam detection skills! You'll see {flashCards.length}{" "}
              messages. Quickly decide if each one is a SCAM or SAFE. Race
              against time to build your streak!
            </p>

            <Card className="p-8 mb-10 border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
              <h2 className="text-2xl font-bold mb-6">How to Play</h2>
              <ul className="text-left space-y-4 text-muted-foreground/80">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 mt-1 text-lg">•</span>
                  <span className="text-base">
                    You have 60 seconds to categorize as many cards as possible
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 mt-1 text-lg">•</span>
                  <span className="text-base">
                    Each correct answer earns points + streak bonuses
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 mt-1 text-lg">•</span>
                  <span className="text-base">
                    Wrong answers reset your streak
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 mt-1 text-lg">•</span>
                  <span className="text-base">
                    Learn from explanations after each card
                  </span>
                </li>
              </ul>
            </Card>

            <Button
              onClick={startGame}
              size="lg"
              className="text-lg px-10 py-6 bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg hover:shadow-xl transition-all">
              Start Challenge →
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (gameOver) {
    const accuracy =
      answers.length > 0
        ? Math.round(
            (answers.filter((a) => a.correct).length / answers.length) * 100
          )
        : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-yellow-500/5">
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-md shadow-sm">
          <div className="container mx-auto px-4 py-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5 bg-[size:50px_50px] [mask-image:radial-gradient(white,transparent_85%)]" />
          <div className="max-w-2xl mx-auto text-center relative">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/10 mb-8 shadow-lg">
              <Trophy className="h-12 w-12 text-yellow-600" />
            </div>
            <h2 className="text-5xl font-extrabold mb-6 tracking-tight">
              Challenge Complete!
            </h2>
            <p className="text-xl text-muted-foreground/90 mb-10 font-light">
              Here's how you performed
            </p>

            <div className="grid grid-cols-3 gap-6 mb-10">
              <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  {score}
                </div>
                <div className="text-sm text-muted-foreground/80 font-medium">
                  Total Score
                </div>
              </Card>
              <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  {accuracy}%
                </div>
                <div className="text-sm text-muted-foreground/80 font-medium">
                  Accuracy
                </div>
              </Card>
              <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  {answers.filter((a) => a.correct).length}/{answers.length}
                </div>
                <div className="text-sm text-muted-foreground/80 font-medium">
                  Correct
                </div>
              </Card>
            </div>

            <Card className="p-8 mb-10 text-left border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
              <h3 className="text-2xl font-bold mb-6">Performance Breakdown</h3>
              <div className="space-y-3">
                {flashCards.slice(0, answers.length).map((card, index) => (
                  <div
                    key={card.id}
                    className="flex items-center gap-3 p-4 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                    {answers[index]?.correct ? (
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{card.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button
                onClick={restartGame}
                size="lg"
                className="text-base px-8 py-6 bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg hover:shadow-xl transition-all">
                Play Again
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base px-8 py-6 bg-background/50 backdrop-blur-sm border-2 hover:bg-background/80 transition-all">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const currentCard = flashCards[currentCardIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-yellow-500/5">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Exit</span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-lg font-semibold">
                {timeLeft}s
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-secondary-foreground" />
              <span className="font-mono text-lg font-semibold">{streak}x</span>
            </div>
            <div className="font-mono text-lg font-semibold">{score} pts</div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:50px_50px] [mask-image:radial-gradient(white,transparent_85%)]\" />
        <div className="max-w-2xl mx-auto relative">
          <div className="text-center mb-8">
            <div className="text-sm text-muted-foreground/80 mb-3 font-medium">
              Card {currentCardIndex + 1} of {flashCards.length}
            </div>
            <div className="w-full bg-muted/40 rounded-full h-3 shadow-inner">
              <div
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-300 shadow-lg"
                style={{
                  width: `${
                    ((currentCardIndex + 1) / flashCards.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          <Card className="p-10 mb-8 border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl">
            <div className="text-center mb-10">
              <p className="text-2xl leading-relaxed font-medium">
                {currentCard.message}
              </p>
            </div>

            {!showResult ? (
              <div className="grid grid-cols-2 gap-6">
                <Button
                  onClick={() => handleAnswer(true)}
                  size="lg"
                  variant="destructive"
                  className="h-24 text-xl font-bold shadow-lg hover:shadow-xl transition-all">
                  SCAM
                </Button>
                <Button
                  onClick={() => handleAnswer(false)}
                  size="lg"
                  className="h-24 text-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all">
                  SAFE
                </Button>
              </div>
            ) : (
              <div>
                <div className="text-center mb-8">
                  {answers[answers.length - 1]?.correct ? (
                    <div className="flex items-center justify-center gap-3 text-green-600">
                      <CheckCircle className="h-10 w-10" />
                      <span className="text-3xl font-bold">Correct!</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3 text-red-600">
                      <XCircle className="h-10 w-10" />
                      <span className="text-3xl font-bold">Incorrect</span>
                    </div>
                  )}
                </div>

                {showExplanation && (
                  <div className="p-6 rounded-lg bg-muted/60 mb-8 border border-border/50">
                    <p className="text-base text-muted-foreground/90 leading-relaxed">
                      {currentCard.explanation}
                    </p>
                  </div>
                )}

                <Button
                  onClick={nextCard}
                  className="w-full shadow-lg hover:shadow-xl transition-all"
                  size="lg">
                  {currentCardIndex + 1 >= flashCards.length
                    ? "See Results →"
                    : "Next Card →"}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
