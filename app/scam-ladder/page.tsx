"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Dices, Trophy, RotateCcw } from "lucide-react";
import { saveScore } from "@/lib/score-actions";

interface Question {
  id: number;
  question: string;
  options: [string, string];
  correctAnswer: 0 | 1;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    question:
      "An email asks you to verify your account by clicking a link. What should you do?",
    options: [
      "Click the link immediately",
      "Go directly to the official website",
    ],
    correctAnswer: 1,
    explanation:
      "Never click links in unsolicited emails. Always navigate to official websites directly through your browser.",
  },
  {
    id: 2,
    question:
      "You receive a text saying you won a prize. It asks for your SSN to claim it. Your response?",
    options: ["Provide your SSN", "Ignore and report as spam"],
    correctAnswer: 1,
    explanation:
      "Legitimate prizes never require sensitive information like SSN. This is a clear scam attempt.",
  },
  {
    id: 3,
    question:
      "A caller claims to be from tech support saying your computer has a virus. What do you do?",
    options: ["Hang up immediately", "Follow their instructions"],
    correctAnswer: 0,
    explanation:
      "Tech companies don't make unsolicited calls about viruses. This is a common scam tactic.",
  },
  {
    id: 4,
    question:
      "An email has spelling errors and urgent language. Should you trust it?",
    options: ["No, it's suspicious", "Yes, if it looks official"],
    correctAnswer: 0,
    explanation:
      "Poor grammar and urgency are major red flags. Legitimate companies proofread their communications.",
  },
  {
    id: 5,
    question:
      "A social media message from a 'friend' asks you to click a link urgently. What should you do?",
    options: [
      "Click to help your friend",
      "Contact friend through another method",
    ],
    correctAnswer: 1,
    explanation:
      "Accounts can be hacked. Always verify unusual requests through a different communication channel.",
  },
  {
    id: 6,
    question:
      "An investment offers guaranteed high returns with no risk. Is this legitimate?",
    options: [
      "No, it's too good to be true",
      "Yes, sounds like a great opportunity",
    ],
    correctAnswer: 0,
    explanation:
      "All investments carry risk. Promises of guaranteed high returns are classic scam indicators.",
  },
  {
    id: 7,
    question:
      "You get an email from your 'bank' with a suspicious sender address. What do you do?",
    options: ["Reply with your info", "Call your bank directly"],
    correctAnswer: 1,
    explanation:
      "Always verify suspicious emails by contacting your bank through official channels, not by replying.",
  },
  {
    id: 8,
    question:
      "A website asks for payment via gift cards only. Is this a red flag?",
    options: ["Yes, very suspicious", "No, it's a normal payment method"],
    correctAnswer: 0,
    explanation:
      "Gift cards are a favorite payment method for scammers because they're untraceable and irreversible.",
  },
  {
    id: 9,
    question:
      "An online seller has no reviews and offers prices far below market value. Should you buy?",
    options: ["No, too risky", "Yes, great deal!"],
    correctAnswer: 0,
    explanation:
      "Unrealistically low prices and no reviews are warning signs of fraudulent sellers.",
  },
  {
    id: 10,
    question:
      "A romance interest you've never met asks for money. What do you do?",
    options: ["Send money to help", "Cut off contact immediately"],
    correctAnswer: 1,
    explanation:
      "Romance scams are common. Never send money to someone you haven't met in person.",
  },
  {
    id: 11,
    question:
      "An email threatens legal action unless you pay immediately. Should you comply?",
    options: ["No, verify independently", "Yes, to avoid trouble"],
    correctAnswer: 0,
    explanation:
      "Legitimate legal matters follow formal procedures. Threats via email are typically scams.",
  },
  {
    id: 12,
    question:
      "A job offer requires you to pay upfront for training or equipment. Is this legitimate?",
    options: ["No, it's a scam", "Yes, it's normal"],
    correctAnswer: 0,
    explanation:
      "Real employers pay you, not the other way around. Upfront payment requests are scam indicators.",
  },
  {
    id: 13,
    question:
      "You see a social media ad for a miracle product with only testimonials as proof. Trust it?",
    options: ["No, need verified evidence", "Yes, testimonials prove it works"],
    correctAnswer: 0,
    explanation:
      "Testimonials can be fake. Look for scientific evidence and verified reviews from trusted sources.",
  },
  {
    id: 14,
    question:
      "A charity asks for donations in cryptocurrency only. Is this legitimate?",
    options: ["No, suspicious payment method", "Yes, modern approach"],
    correctAnswer: 0,
    explanation:
      "Legitimate charities offer multiple payment options. Crypto-only requests are highly suspicious.",
  },
  {
    id: 15,
    question:
      "An email says your package is delayed and needs immediate payment to release it. What do you do?",
    options: ["Pay to get your package", "Check with the retailer directly"],
    correctAnswer: 1,
    explanation:
      "Shipping companies don't ask for random payments via email. Verify through official channels.",
  },
  {
    id: 16,
    question:
      "You're asked to keep a transaction secret from family/friends. Is this a red flag?",
    options: ["Yes, major red flag", "No, it's just private business"],
    correctAnswer: 0,
    explanation:
      "Requests for secrecy are a huge warning sign. Legitimate businesses don't ask you to hide transactions.",
  },
];

interface PlayerState {
  position: number;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
}

export default function ScamLadderPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [twoPlayerMode, setTwoPlayerMode] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [player1, setPlayer1] = useState<PlayerState>({
    position: 0,
    score: 0,
    correctAnswers: 0,
    totalQuestions: 0,
  });
  const [player2, setPlayer2] = useState<PlayerState>({
    position: 0,
    score: 0,
    correctAnswers: 0,
    totalQuestions: 0,
  });
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState<Set<number>>(new Set());
  const [availableQuestions, setAvailableQuestions] =
    useState<Question[]>(questions);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  const BOARD_SIZE = 16;
  const WIN_POSITION = 15;

  // Get current player state
  const getCurrentPlayerState = () => (currentPlayer === 1 ? player1 : player2);
  const setCurrentPlayerState = (
    updater: (prev: PlayerState) => PlayerState
  ) => {
    if (currentPlayer === 1) {
      setPlayer1(updater);
    } else {
      setPlayer2(updater);
    }
  };

  const fetchQuestionsFromAPI = async () => {
    try {
      setIsLoadingQuestions(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Generate exactly 16 scam awareness questions in this exact JSON format:
[
  {
    "id": 1,
    "question": "question text",
    "options": ["option 1", "option 2"],
    "correctAnswer": 0 or 1,
    "explanation": "explanation text"
  }
]

Each question should test knowledge about:
- Phishing emails and links
- Social engineering tactics
- Financial scams
- Romance scams
- Tech support scams
- Investment fraud
- Identity theft
- Online shopping scams

Provide exactly 2 options per question. The correctAnswer should be 0 or 1 (index of correct option).`,
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      if (
        data.scenarios &&
        Array.isArray(data.scenarios) &&
        data.scenarios.length > 0
      ) {
        // Map the scenarios to match our Question interface
        const formattedQuestions: Question[] = data.scenarios.map(
          (q: any, index: number) => ({
            id: q.id || index + 1,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          })
        );

        setAvailableQuestions(formattedQuestions);
        return formattedQuestions;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error(
        "Failed to fetch questions from API, using default questions:",
        error
      );
      setAvailableQuestions(questions);
      return questions;
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Fetch questions when page loads
  useEffect(() => {
    fetchQuestionsFromAPI();
  }, []);

  useEffect(() => {
    if (gameOver && !scoreSaved && gameStarted) {
      const currentPlayerState = getCurrentPlayerState();
      const percentage =
        currentPlayerState.totalQuestions > 0
          ? Math.round(
              (currentPlayerState.correctAnswers /
                currentPlayerState.totalQuestions) *
                100
            )
          : 0;
      const finalScore = currentPlayerState.score;

      saveScore({
        game_type: "scam-ladder",
        score: finalScore,
        time_taken: 0,
        accuracy: percentage,
        metadata: {
          scenarios_completed: currentPlayerState.totalQuestions,
          mode: twoPlayerMode ? "two-player" : "single-player",
          player: twoPlayerMode ? `Player ${winner}` : undefined,
        },
      }).then(() => {
        setScoreSaved(true);
      });
    }
  }, [gameOver, scoreSaved, gameStarted, twoPlayerMode, winner]);

  const getRandomQuestion = (): Question => {
    const availableQuestionsFiltered = availableQuestions.filter(
      (q) => !usedQuestions.has(q.id)
    );
    if (availableQuestionsFiltered.length === 0) {
      setUsedQuestions(new Set());
      return availableQuestions[
        Math.floor(Math.random() * availableQuestions.length)
      ];
    }
    return availableQuestionsFiltered[
      Math.floor(Math.random() * availableQuestionsFiltered.length)
    ];
  };

  const startGame = (multiplayer: boolean = false) => {
    setTwoPlayerMode(multiplayer);
    setGameStarted(true);
    setCurrentPlayer(1);
    setPlayer1({
      position: 0,
      score: 0,
      correctAnswers: 0,
      totalQuestions: 0,
    });
    setPlayer2({
      position: 0,
      score: 0,
      correctAnswers: 0,
      totalQuestions: 0,
    });
    setGameOver(false);
    setWinner(null);
    setScoreSaved(false);
    setUsedQuestions(new Set());

    presentQuestion();
  };

  const presentQuestion = () => {
    const question = getRandomQuestion();
    setCurrentQuestion(question);
    setShowQuestion(true);
    setSelectedAnswer(null);
    setShowResult(false);
    setDiceRoll(null);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || !currentQuestion) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);
    setCurrentPlayerState((prev) => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
    }));
    setUsedQuestions((prev) => new Set([...prev, currentQuestion.id]));

    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    if (isCorrect) {
      setCurrentPlayerState((prev) => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        score: prev.score + 100,
      }));
    } else {
      setCurrentPlayerState((prev) => ({
        ...prev,
        score: prev.score - 50,
      }));
    }
  };

  const handleContinue = () => {
    if (selectedAnswer === null || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    if (isCorrect) {
      rollDice();
    } else {
      moveBackward();
    }
  };

  const rollDice = () => {
    setIsRolling(true);
    const roll = Math.floor(Math.random() * 6) + 1;

    setTimeout(() => {
      setDiceRoll(roll);
      setIsRolling(false);

      setTimeout(() => {
        moveForward(roll);
      }, 1000);
    }, 1000);
  };

  const moveForward = (spaces: number) => {
    const currentPlayerState = getCurrentPlayerState();
    const newPosition = Math.min(
      currentPlayerState.position + spaces,
      WIN_POSITION
    );
    setCurrentPlayerState((prev) => ({
      ...prev,
      position: newPosition,
    }));

    setTimeout(() => {
      if (newPosition >= WIN_POSITION) {
        setGameOver(true);
        setWinner(currentPlayer);
        setShowQuestion(false);
      } else {
        if (twoPlayerMode) {
          // Switch to the other player
          setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        }
        presentQuestion();
      }
    }, 500);
  };

  const moveBackward = () => {
    const currentPlayerState = getCurrentPlayerState();
    const newPosition = Math.max(currentPlayerState.position - 1, 0);
    setCurrentPlayerState((prev) => ({
      ...prev,
      position: newPosition,
    }));

    setTimeout(() => {
      if (twoPlayerMode) {
        // Switch to the other player
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }
      presentQuestion();
    }, 500);
  };

  const resetGame = () => {
    setGameStarted(false);
    setTwoPlayerMode(false);
    setCurrentPlayer(1);
    setPlayer1({
      position: 0,
      score: 0,
      correctAnswers: 0,
      totalQuestions: 0,
    });
    setPlayer2({
      position: 0,
      score: 0,
      correctAnswers: 0,
      totalQuestions: 0,
    });
    setShowQuestion(false);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setShowResult(false);
    setDiceRoll(null);
    setGameOver(false);
    setWinner(null);
    setScoreSaved(false);
    setUsedQuestions(new Set());
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-500/5">
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-md shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Scam Ladder Challenge</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Climb to the top by answering scam awareness questions
                correctly!
              </p>
            </div>

            <Card className="p-8 mb-8">
              <h2 className="text-xl font-semibold mb-4">How to Play</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Answer questions about scam detection and online safety
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong>Correct answer:</strong> Roll the dice and move
                    forward that many squares
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong>Wrong answer:</strong> Move back 1 square
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Start from bottom-right and reach the top-left to win!
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    +100 points for correct answers, -50 for incorrect
                  </span>
                </li>
              </ul>
            </Card>

            <div className="text-center space-y-4">
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => startGame(false)}
                  size="lg"
                  className="text-lg px-8"
                  disabled={isLoadingQuestions}>
                  {isLoadingQuestions
                    ? "Generating Questions..."
                    : "Single Player"}
                </Button>
                <Button
                  onClick={() => startGame(true)}
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8"
                  disabled={isLoadingQuestions}>
                  {isLoadingQuestions
                    ? "Generating Questions..."
                    : "Two Players"}
                </Button>
              </div>
              <div>
                <Button asChild variant="outline" size="lg">
                  <Link href="/scam-ladder/leaderboard">View Leaderboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (gameOver) {
    const winnerState = winner === 1 ? player1 : player2;
    const accuracy =
      winnerState.totalQuestions > 0
        ? Math.round(
            (winnerState.correctAnswers / winnerState.totalQuestions) * 100
          )
        : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-500/5">
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-md shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
              <Trophy className="h-10 w-10 text-primary" />
            </div>

            <h2 className="text-4xl font-bold mb-4">
              🎉 {twoPlayerMode ? `Player ${winner} Wins!` : "You Won!"}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Congratulations!{" "}
              {twoPlayerMode ? `Player ${winner} has` : "You've"} reached the
              top of the ladder!
            </p>

            <Card className="p-8 mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">
                    {winnerState.score}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Final Score
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">
                    {accuracy}%
                  </div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">
                    {winnerState.correctAnswers}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Correct Answers
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">
                    {winnerState.totalQuestions}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Questions
                  </div>
                </div>
              </div>
            </Card>

            {twoPlayerMode && (
              <Card className="p-6 mb-8 bg-muted/50">
                <h3 className="font-semibold mb-4">Final Scores</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div
                    className={cn(
                      "p-4 rounded-lg border",
                      winner === 1 ? "bg-primary/10 border-primary" : "bg-card"
                    )}>
                    <div className="font-bold mb-2">Player 1</div>
                    <div>Score: {player1.score}</div>
                    <div>Position: {player1.position + 1}/16</div>
                  </div>
                  <div
                    className={cn(
                      "p-4 rounded-lg border",
                      winner === 2 ? "bg-primary/10 border-primary" : "bg-card"
                    )}>
                    <div className="font-bold mb-2">Player 2</div>
                    <div>Score: {player2.score}</div>
                    <div>Position: {player2.position + 1}/16</div>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex gap-4 justify-center">
              <Button onClick={resetGame} size="lg">
                <RotateCcw className="h-4 w-4 mr-2" />
                Play Again
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/scam-ladder/leaderboard">View Leaderboard</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-500/5">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Exit</span>
          </Link>

          <div className="flex items-center gap-6">
            {twoPlayerMode && (
              <div className="text-sm font-semibold px-3 py-1 rounded-full bg-primary/20 text-primary">
                Player {currentPlayer}'s Turn
              </div>
            )}
            {twoPlayerMode ? (
              <>
                <div
                  className={cn(
                    "text-sm",
                    currentPlayer === 1 ? "font-bold" : "opacity-50"
                  )}>
                  <span className="text-muted-foreground">P1 Position: </span>
                  <span>{player1.position + 1}/16</span>
                </div>
                <div
                  className={cn(
                    "text-sm",
                    currentPlayer === 1 ? "font-bold" : "opacity-50"
                  )}>
                  <span className="text-muted-foreground">P1 Score: </span>
                  <span>{player1.score}</span>
                </div>
                <div className="h-6 w-px bg-border" />
                <div
                  className={cn(
                    "text-sm",
                    currentPlayer === 2 ? "font-bold" : "opacity-50"
                  )}>
                  <span className="text-muted-foreground">P2 Position: </span>
                  <span>{player2.position + 1}/16</span>
                </div>
                <div
                  className={cn(
                    "text-sm",
                    currentPlayer === 2 ? "font-bold" : "opacity-50"
                  )}>
                  <span className="text-muted-foreground">P2 Score: </span>
                  <span>{player2.score}</span>
                </div>
              </>
            ) : (
              <>
                <div className="text-sm">
                  <span className="text-muted-foreground">Position: </span>
                  <span className="font-bold">{player1.position + 1}/16</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Score: </span>
                  <span className="font-bold">{player1.score}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6 items-start">
            {/* Game Board - Left Side */}
            <Card className="p-5 flex-shrink-0">
              <div className="grid grid-cols-4 gap-3 w-[400px]">
                {Array.from({ length: BOARD_SIZE }).map((_, index) => {
                  // Convert position to row and column for display
                  // Zig-zag pattern for 4x4 grid
                  const row = Math.floor(index / 4);
                  const col = index % 4;

                  // Calculate display position for zig-zag (starting from bottom-right)
                  let displayRow = 3 - row; // Reverse rows so 0 is bottom
                  let displayCol;

                  // Adjust so we start from bottom-right and alternate direction each row
                  if (displayRow % 2 === 0) {
                    // Even rows (0, 2 from bottom): right to left
                    displayCol = 3 - col;
                  } else {
                    // Odd rows (1, 3 from bottom): left to right
                    displayCol = col;
                  }

                  const isPlayer1Position = index === player1.position;
                  const isPlayer2Position =
                    index === player2.position && twoPlayerMode;
                  const isBothPlayersHere =
                    isPlayer1Position && isPlayer2Position;
                  const isPassed1 = index < player1.position;
                  const isPassed2 = index < player2.position && twoPlayerMode;
                  const isFinish = index === WIN_POSITION;
                  const isStart = index === 0;

                  return (
                    <div
                      key={index}
                      style={{
                        gridRow: displayRow + 1,
                        gridColumn: displayCol + 1,
                      }}
                      className={cn(
                        "aspect-square rounded-lg border-2 flex flex-col items-center justify-center font-semibold text-base transition-all p-7 relative",
                        (isPlayer1Position || isPlayer2Position) &&
                          "border-primary bg-primary/20 scale-110 shadow-lg",
                        (isPassed1 || isPassed2) &&
                          !isPlayer1Position &&
                          !isPlayer2Position &&
                          "border-primary/30 bg-primary/5",
                        !isPassed1 &&
                          !isPassed2 &&
                          !isPlayer1Position &&
                          !isPlayer2Position &&
                          "border-border bg-card",
                        isFinish &&
                          "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500",
                        isStart &&
                          "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500"
                      )}>
                      {isBothPlayersHere ? (
                        <div className="text-2xl">🎯🎯</div>
                      ) : isPlayer1Position && !isPlayer2Position ? (
                        <div className="text-2xl">
                          {twoPlayerMode ? "🔵" : "🎯"}
                        </div>
                      ) : isPlayer2Position && !isPlayer1Position ? (
                        <div className="text-2xl">🔴</div>
                      ) : isFinish &&
                        !isPlayer1Position &&
                        !isPlayer2Position ? (
                        <div className="text-2xl">🏆</div>
                      ) : isStart &&
                        !isPlayer1Position &&
                        !isPlayer2Position ? (
                        <div className="text-2xl">🚀</div>
                      ) : (
                        <span className="text-muted-foreground">
                          {index + 1}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              {twoPlayerMode && (
                <div className="mt-4 flex items-center justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-lg">🔵</span>
                    <span className="text-muted-foreground">Player 1</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg">🔴</span>
                    <span className="text-muted-foreground">Player 2</span>
                  </div>
                </div>
              )}
            </Card>

            {/* Question Card - Right Side */}
            {showQuestion && currentQuestion && (
              <Card className="p-8 flex-1">
                {twoPlayerMode && (
                  <div className="mb-4 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-center">
                    <span className="font-bold text-primary">
                      {currentPlayer === 1 ? "🔵" : "🔴"} Player {currentPlayer}
                      's Turn
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-6">
                  {currentQuestion.question}
                </h3>

                <div className="space-y-4 mb-6">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={selectedAnswer !== null}
                      className={cn(
                        "w-full p-4 rounded-lg border-2 text-left transition-all",
                        selectedAnswer === null &&
                          "hover:border-primary hover:bg-primary/5 cursor-pointer",
                        selectedAnswer === index &&
                          index === currentQuestion.correctAnswer &&
                          "border-green-500 bg-green-500/10",
                        selectedAnswer === index &&
                          index !== currentQuestion.correctAnswer &&
                          "border-red-500 bg-red-500/10",
                        selectedAnswer !== null &&
                          selectedAnswer !== index &&
                          "opacity-50",
                        selectedAnswer !== null && "cursor-not-allowed"
                      )}>
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {selectedAnswer === index &&
                          index === currentQuestion.correctAnswer && (
                            <span className="text-green-500">✓</span>
                          )}
                        {selectedAnswer === index &&
                          index !== currentQuestion.correctAnswer && (
                            <span className="text-red-500">✗</span>
                          )}
                      </div>
                    </button>
                  ))}
                </div>

                {showResult && (
                  <div className="space-y-4">
                    <Card
                      className={cn(
                        "p-4",
                        selectedAnswer === currentQuestion.correctAnswer
                          ? "bg-green-500/10 border-green-500/50"
                          : "bg-red-500/10 border-red-500/50"
                      )}>
                      <p className="text-sm mb-2 font-semibold">
                        {selectedAnswer === currentQuestion.correctAnswer
                          ? "✓ Correct!"
                          : "✗ Incorrect"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {currentQuestion.explanation}
                      </p>
                    </Card>

                    {diceRoll !== null && (
                      <Card className="p-4 bg-primary/5 border-primary/30">
                        <p className="text-center text-lg font-bold">
                          🎲 You rolled a {diceRoll}! Moving forward {diceRoll}{" "}
                          {diceRoll === 1 ? "square" : "squares"}!
                        </p>
                      </Card>
                    )}

                    {!isRolling && diceRoll === null && (
                      <Button
                        onClick={handleContinue}
                        className="w-full"
                        size="lg">
                        {selectedAnswer === currentQuestion.correctAnswer ? (
                          <>
                            <Dices className="h-5 w-5 mr-2" />
                            Roll the Dice
                          </>
                        ) : (
                          <>Move Back 1 Square</>
                        )}
                      </Button>
                    )}

                    {isRolling && (
                      <div className="text-center py-4">
                        <Dices className="h-12 w-12 mx-auto animate-bounce text-primary" />
                        <p className="mt-2 text-muted-foreground">Rolling...</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
