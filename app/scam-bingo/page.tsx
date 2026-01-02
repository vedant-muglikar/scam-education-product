"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveScore } from "@/lib/score-actions";

interface RedFlag {
  id: string;
  label: string;
  description: string;
}

interface Scenario {
  id: number;
  title: string;
  content: string;
  redFlagsPresent: string[];
  isScam: boolean;
}

const redFlags: RedFlag[] = [
  { id: "urgency", label: "Urgency", description: "Act now or else..." },
  {
    id: "too-good",
    label: "Too Good to Be True",
    description: "Unrealistic rewards",
  },
  {
    id: "suspicious-link",
    label: "Suspicious Link",
    description: "Misspelled or odd URL",
  },
  {
    id: "emotional",
    label: "Emotional Manipulation",
    description: "Fear, flattery, guilt",
  },
  {
    id: "payment",
    label: "Payment Request",
    description: "Gift cards / crypto",
  },
  {
    id: "unknown-sender",
    label: "Unknown Sender",
    description: "Not in contacts",
  },
  { id: "grammar", label: "Grammar Mistakes", description: "Poor language" },
  {
    id: "fake-authority",
    label: "Fake Authority",
    description: "Pretending to be official",
  },
  {
    id: "personal-info",
    label: "Personal Info Request",
    description: "SSN, passwords, etc.",
  },
  {
    id: "threats",
    label: "Threats",
    description: "Legal action or consequences",
  },
  {
    id: "unsolicited",
    label: "Unsolicited Contact",
    description: "You didn't request this",
  },
  {
    id: "requests-secrecy",
    label: "Requests Secrecy",
    description: "Don't tell anyone",
  },
];

const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Email from 'Bank Security'",
    isScam: true,
    content: `Subject: URGENT ACTION REQUIRED - Account Suspended

Dear Valued Customer,

Your account has been temporarily suspended due to suspicious activity detected on your account. You have 24 hours to verify your identity or your account will be permanently closed and funds forfeited.

Click here immediately: www.secure-bank-verify.net/account

You will need to provide:
- Full name and address
- Social Security Number
- Account number and PIN
- Credit card details for verification

Failure to comply will result in legal action and account termination.

Best Regards,
Bank Security Team
Protect Your Account Now!`,
    redFlagsPresent: [
      "urgency",
      "suspicious-link",
      "emotional",
      "fake-authority",
      "personal-info",
      "threats",
    ],
  },
  {
    id: 2,
    title: "Legitimate Bank Security Alert",
    isScam: false,
    content: `Subject: Security Alert for Your Account

Hello John Smith,

We noticed a login attempt from a new device in San Francisco, CA on December 19, 2025 at 2:45 PM EST.

If this was you, no action is needed.

If this wasn't you, please:
1. Log in to your account through our official app or website at www.realbank.com
2. Go to Security Settings
3. Review your recent activity
4. Change your password if needed

You can also call us directly at 1-800-REAL-BANK (found on the back of your card).

For security, we will never ask for your password, PIN, or full account number via email.

Best regards,
Real Bank Security Team

This is an automated message. Please do not reply to this email.`,
    redFlagsPresent: [],
  },
  {
    id: 3,
    title: "Social Media Message",
    isScam: true,
    content: `Hey! 😊

Its me! I saw your name on this list of winners for a $500 Amazon gift card giveaway! I already claimed mine and it only took 5 minutes.

You just need to:
1. Click this link: bit.ly/gift500now
2. Fill out a quick survey
3. Pay a $5 processing fee with a gift card
4. Receive your $500 within 24 hours!

But you need to hurry - only 50 spots left and they're going fast! I'd hate for you to miss out on this incredible opportunity.

Don't tell anyone else about this - I want my friends to benefit first!

Let me know when you get yours! 💰`,
    redFlagsPresent: [
      "urgency",
      "too-good",
      "suspicious-link",
      "emotional",
      "payment",
      "grammar",
      "requests-secrecy",
    ],
  },
  {
    id: 4,
    title: "Company IT Department Email",
    isScam: false,
    content: `Subject: Scheduled System Maintenance - December 22, 2025

Dear Team,

This is a reminder that our IT department will be performing scheduled system maintenance on:

Date: Saturday, December 22, 2025
Time: 2:00 AM - 6:00 AM EST
Systems Affected: Email, Internal Portal

During this time:
- Email services may be temporarily unavailable
- The employee portal will be offline
- No action is required from you

If you need to access critical systems during this window, please contact the IT Help Desk at extension 5500 before December 20th.

For questions, contact: it-support@yourcompany.com

Thank you for your patience.

IT Department
Your Company Inc.`,
    redFlagsPresent: [],
  },
  {
    id: 5,
    title: "Tech Support Call Script",
    isScam: true,
    content: `"Hello, this is Microsoft Technical Support calling about your computer. Our systems detected that your Windows license has expired and your computer is infected with several dangerous viruses right now.

If we don't fix this immediately, all your personal files, photos, and bank information will be stolen by hackers within the next few hours. Your computer will be permanently damaged.

I need you to go to your computer right now and download our remote access software.

You must pay for our lifetime protection plan using iTunes gift cards or Bitcoin for $299.

This is very urgent and confidential. Do not hang up or talk to anyone else. Your entire identity is at risk. We must act fast or you could lose everything!

Do you have access to a computer right now?"`,
    redFlagsPresent: [
      "urgency",
      "emotional",
      "fake-authority",
      "payment",
      "personal-info",
      "threats",
      "unsolicited",
      "requests-secrecy",
    ],
  },
  {
    id: 6,
    title: "Online Order Confirmation",
    isScam: false,
    content: `Subject: Your Order Confirmation #ORD-2025-12345

Hi Sarah,

Thank you for your order!

Order Details:
- Order Number: ORD-2025-12345
- Date: December 19, 2025
- Items: 1x Wireless Headphones ($79.99)
- Shipping: Standard (5-7 business days)
- Total: $84.99

Shipping Address:
Sarah Johnson
123 Main Street
Anytown, NY 10001

Your order will ship within 1-2 business days. You'll receive a tracking number once it ships.

To track your order, log in to your account at www.legitimatestore.com

Questions? Contact our customer service at support@legitimatestore.com or call 1-800-555-0123 (Mon-Fri, 9AM-5PM EST).

Thanks for shopping with us!

Legitimate Store Team`,
    redFlagsPresent: [],
  },
];

export default function ScamBingoPage() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedFlags, setSelectedFlags] = useState<Set<string>>(new Set());
  const [gameStarted, setGameStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [scenarioResults, setScenarioResults] = useState<
    { [key: string]: "correct" | "incorrect" | "missed" }[]
  >([]);
  const [scoreSaved, setScoreSaved] = useState(false);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentScenario(0);
    setSelectedFlags(new Set());
    setTimeElapsed(0);
    setGameOver(false);
    setScore(0);
    setScenarioResults([]);
    setScoreSaved(false);
  };

  const toggleFlag = (flagId: string) => {
    const newSelected = new Set(selectedFlags);
    if (newSelected.has(flagId)) {
      newSelected.delete(flagId);
    } else {
      newSelected.add(flagId);
    }
    setSelectedFlags(newSelected);
  };

  const submitBingo = () => {
    const scenario = scenarios[currentScenario];
    const correctFlags = new Set(scenario.redFlagsPresent);
    const selected = selectedFlags;

    const flagResults: { [key: string]: "correct" | "incorrect" | "missed" } =
      {};

    let correct = 0;
    let incorrect = 0;

    selected.forEach((flag) => {
      if (correctFlags.has(flag)) {
        correct++;
        flagResults[flag] = "correct";
      } else {
        incorrect++;
        flagResults[flag] = "incorrect";
      }
    });

    correctFlags.forEach((flag) => {
      if (!selected.has(flag)) {
        flagResults[flag] = "missed";
      }
    });

    const missed = correctFlags.size - correct;

    const roundScore = Math.max(0, correct * 10 - incorrect * 5 - missed * 3);
    setScore(score + roundScore);

    setScenarioResults([...scenarioResults, flagResults]);

    if (currentScenario + 1 >= scenarios.length) {
      setGameOver(true);
    } else {
      setCurrentScenario(currentScenario + 1);
      setSelectedFlags(new Set());
    }
  };

  const restartGame = () => {
    setGameStarted(false);
    setCurrentScenario(0);
    setSelectedFlags(new Set());
    setTimeElapsed(0);
    setGameOver(false);
    setScore(0);
    setScenarioResults([]);
    setScoreSaved(false);
  };

  // Save score when game ends
  useEffect(() => {
    if (gameOver && !scoreSaved) {
      const maxPossibleScore = scenarios.length * 10 * 12;
      const accuracy = Math.min(
        100,
        Math.round((score / maxPossibleScore) * 100)
      );

      // Calculate total correct, incorrect, and missed flags
      let totalCorrect = 0;
      let totalIncorrect = 0;
      let totalMissed = 0;

      scenarioResults.forEach((result) => {
        Object.values(result).forEach((status) => {
          if (status === "correct") totalCorrect++;
          else if (status === "incorrect") totalIncorrect++;
          else if (status === "missed") totalMissed++;
        });
      });

      saveScore({
        game_type: "scam-bingo",
        score: score,
        accuracy: accuracy,
        time_taken: timeElapsed,
        metadata: {
          scenarios_completed: scenarios.length,
          total_correct: totalCorrect,
          total_incorrect: totalIncorrect,
          total_missed: totalMissed,
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
  }, [gameOver, scoreSaved, score, timeElapsed, scenarioResults]);

  const getFlagStatus = (flagId: string) => {
    for (const result of scenarioResults) {
      if (result[flagId]) {
        return result[flagId];
      }
    }
    return null;
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Home</span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Red Flag Hunter</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Read detailed scam scenarios and identify all the red flags
                present. Mark them on your board!
              </p>
            </div>

            <Card className="p-8 mb-8">
              <h2 className="text-xl font-semibold mb-4">How to Play</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Read each scenario carefully looking for scam red flags
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Click on red flag cards that you spot in the scenario
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Complete all scenarios to see your total detection score
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Faster completion with high accuracy earns bonus points
                  </span>
                </li>
              </ul>
            </Card>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Red Flag Reference</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {redFlags.map((flag) => (
                  <Card key={flag.id} className="p-4">
                    <div className="font-semibold text-xs mb-1">
                      {flag.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {flag.description}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Button onClick={startGame} size="lg" className="text-lg px-8">
                Start Red Flag Hunt
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (gameOver) {
    const maxPossibleScore = scenarios.length * 10 * 12;
    const performancePercent = Math.min(
      100,
      Math.round((score / maxPossibleScore) * 100)
    );

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Home</span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 mb-6">
              <Trophy className="h-10 w-10 text-accent-foreground" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Hunt Complete!</h2>
            <p className="text-lg text-muted-foreground mb-8">
              You've analyzed all scenarios
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {score}
                </div>
                <div className="text-sm text-muted-foreground">Total Score</div>
              </Card>
              <Card className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {Math.floor(timeElapsed / 60)}:
                  {(timeElapsed % 60).toString().padStart(2, "0")}
                </div>
                <div className="text-sm text-muted-foreground">Time Taken</div>
              </Card>
              <Card className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {scenarios.length}
                </div>
                <div className="text-sm text-muted-foreground">Scenarios</div>
              </Card>
            </div>

            <Card className="p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Your Performance</h3>
              <div className="space-y-4 text-left">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      Detection Skills
                    </span>
                    <span className="font-semibold">{performancePercent}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${performancePercent}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {performancePercent >= 80
                    ? "Excellent! You have a strong ability to identify scam red flags."
                    : performancePercent >= 60
                    ? "Good work! Keep practicing to improve your scam detection skills."
                    : "Keep learning! Review the scenarios to better recognize red flags."}
                </p>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={restartGame} className="flex-1">
                Play Again
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 bg-transparent">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const scenario = scenarios[currentScenario];
  const correctFlags = new Set(scenario.redFlagsPresent);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Exit</span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-lg font-semibold">
                {Math.floor(timeElapsed / 60)}:
                {(timeElapsed % 60).toString().padStart(2, "0")}
              </span>
            </div>
            <div className="font-mono text-lg font-semibold">{score} pts</div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <div className="text-sm text-muted-foreground mb-2">
              Scenario {currentScenario + 1} of {scenarios.length}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {scenario.title}
              <span
                className={cn(
                  "ml-3 text-sm px-2 py-1 rounded-md",
                  scenario.isScam
                    ? "bg-red-500/10 text-red-500"
                    : "bg-green-500/10 text-green-500"
                )}>
                {scenario.isScam ? "Scam" : "Safe"}
              </span>
            </h2>
            <p className="text-sm text-muted-foreground">
              {scenario.isScam
                ? "This is a scam - find all the red flags!"
                : "This is legitimate - check carefully before marking flags"}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6 h-fit">
              <h3 className="text-lg font-semibold mb-4">Read Carefully</h3>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted-foreground">
                  {scenario.content}
                </pre>
              </div>
            </Card>

            <div>
              <Card className="p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  Spot the Red Flags
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {redFlags.map((flag) => {
                    const flagStatus = getFlagStatus(flag.id);
                    return (
                      <button
                        key={flag.id}
                        onClick={() => toggleFlag(flag.id)}
                        className={cn(
                          "relative p-3 rounded-lg border-2 transition-all text-left h-24 flex flex-col items-center justify-center",
                          selectedFlags.has(flag.id)
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card hover:border-primary/50",
                          flagStatus && "pointer-events-none"
                        )}>
                        <div className="font-semibold text-xs text-center mb-1">
                          {flag.label}
                        </div>
                        {flagStatus && (
                          <div
                            className={cn(
                              "absolute bottom-1 right-1 w-3 h-3 rounded-full",
                              flagStatus === "correct" && "bg-green-500",
                              flagStatus === "incorrect" && "bg-red-500",
                              flagStatus === "missed" && "bg-yellow-500"
                            )}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Correct</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>Wrong</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span>Missed</span>
                  </div>
                </div>
              </Card>

              <Button onClick={submitBingo} className="w-full" size="lg">
                {currentScenario + 1 < scenarios.length
                  ? "Next Scenario"
                  : "Finish Hunt"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
