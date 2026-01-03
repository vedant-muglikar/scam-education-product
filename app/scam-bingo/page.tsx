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

interface SafeIndicator {
  id: string;
  label: string;
  description: string;
}

interface Scenario {
  id: number;
  title: string;
  content: string;
  redFlagsPresent: string[];
  safeIndicatorsPresent: string[];
  isScam: boolean;
}

const prompt =
  "You are a cybersecurity awareness training content generator.\n\nReturn ONLY valid TypeScript code.\n\nGenerate a constant named `scenarios` of type `Scenario[]` that contains EXACTLY 6 case scenarios.\n\nThe output MUST be an array in this exact format:\n\nconst scenarios: Scenario[] = [\n  {\n    id: number,\n    title: string,\n    isScam: boolean,\n    content: string,\n    redFlagsPresent: string[],\n    safeIndicatorsPresent: string[]\n  }\n];\n\nStrict Rules:\n1. The array must contain exactly 6 objects.\n2. IDs must be sequential from 1 to 6.\n3. Scam scenarios:\n   - isScam must be true\n   - redFlagsPresent must contain multiple values\n   - safeIndicatorsPresent must be an empty array\n4. Legitimate scenarios:\n   - isScam must be false\n   - safeIndicatorsPresent must contain multiple values\n   - redFlagsPresent must be an empty array\n5. Do NOT mix redFlagsPresent and safeIndicatorsPresent in the same object.\n6. Use realistic content such as emails, messages, or call scripts.\n7. Use multiline strings with backticks (`) for the content field.\n8. Do NOT include explanations, comments, markdown, or extra text outside the array.\n\nAllowed redFlagsPresent values:\n- urgency\n- suspicious-link\n- emotional\n- fake-authority\n- personal-info\n- threats\n- too-good\n- payment\n- grammar\n- unsolicited\n- requests-secrecy\n\nAllowed safeIndicatorsPresent values:\n- verified-sender\n- official-domain\n- no-pressure\n- contact-info\n- professional-tone\n- no-sensitive-request\n- verifiable-info\n- reasonable-request\n- expected-communication\n- transparent-terms\n- secure-methods\n\nEnsure a balanced mix of scam and legitimate scenarios.";

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

const greenFlags: SafeIndicator[] = [
  {
    id: "verified-sender",
    label: "Verified Sender",
    description: "Known legitimate source",
  },
  {
    id: "official-domain",
    label: "Official Domain",
    description: "Correct company URL",
  },
  {
    id: "no-pressure",
    label: "No Pressure",
    description: "Reasonable timeframe",
  },
  {
    id: "contact-info",
    label: "Valid Contact Info",
    description: "Real phone/email provided",
  },
  {
    id: "expected-communication",
    label: "Expected Communication",
    description: "You initiated this",
  },
  {
    id: "professional-tone",
    label: "Professional Tone",
    description: "Clear, proper language",
  },
  {
    id: "secure-methods",
    label: "Secure Payment Methods",
    description: "Standard payment options",
  },
  {
    id: "transparent-terms",
    label: "Transparent Terms",
    description: "Clear policies stated",
  },
  {
    id: "verifiable-info",
    label: "Verifiable Information",
    description: "Details can be confirmed",
  },
  {
    id: "no-sensitive-request",
    label: "No Sensitive Requests",
    description: "Doesn't ask for passwords/SSN",
  },
  {
    id: "proper-branding",
    label: "Proper Branding",
    description: "Correct logos and formatting",
  },
  {
    id: "reasonable-request",
    label: "Reasonable Request",
    description: "Makes logical sense",
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
    safeIndicatorsPresent: [],
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
    safeIndicatorsPresent: [
      "verified-sender",
      "official-domain",
      "no-pressure",
      "contact-info",
      "professional-tone",
      "no-sensitive-request",
      "verifiable-info",
      "reasonable-request",
    ],
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
    safeIndicatorsPresent: [],
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
    safeIndicatorsPresent: [
      "verified-sender",
      "official-domain",
      "no-pressure",
      "contact-info",
      "expected-communication",
      "professional-tone",
      "transparent-terms",
      "reasonable-request",
    ],
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
    safeIndicatorsPresent: [],
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
    safeIndicatorsPresent: [
      "verified-sender",
      "official-domain",
      "no-pressure",
      "contact-info",
      "expected-communication",
      "professional-tone",
      "secure-methods",
      "verifiable-info",
    ],
  },
];

export default function ScamBingoPage() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedFlags, setSelectedFlags] = useState<Set<string>>(new Set());
  const [gameStarted, setGameStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [scenarioSelections, setScenarioSelections] = useState<Set<string>[]>(
    []
  );
  const [scoreSaved, setScoreSaved] = useState(false);
  const [safetyChoice, setSafetyChoice] = useState<"safe" | "unsafe" | null>(
    null
  );
  const [scenarioClassifications, setScenarioClassifications] = useState<
    ("safe" | "unsafe")[]
  >([]);
  const [generatedScenarios, setGeneratedScenarios] =
    useState<Scenario[]>(scenarios);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);
  useEffect(() => {
    generateNewScenarios();
  }, []);
  const startGame = () => {
    setGameStarted(true);
    setCurrentScenario(0);
    setSelectedFlags(new Set());
    setTimeElapsed(0);
    setGameOver(false);
    setScore(0);
    setScenarioSelections([]);
    setScoreSaved(false);
    setSafetyChoice(null);
    setScenarioClassifications([]);
  };

  const generateNewScenarios = async () => {
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || "Failed to generate scenarios";
        const details = data.details || data.message || "";
        throw new Error(`${errorMsg}${details ? ": " + details : ""}`);
      }

      if (data.scenarios && Array.isArray(data.scenarios)) {
        setGeneratedScenarios(data.scenarios);
        setGenerationError(null);
      } else {
        throw new Error("Invalid scenarios format received");
      }
    } catch (error) {
      console.error("Error generating scenarios:", error);
      setGenerationError(
        error instanceof Error ? error.message : "Failed to generate scenarios"
      );
    } finally {
      setIsGenerating(false);
    }
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
    if (!safetyChoice) return;

    // Store the current selections and classification
    setScenarioSelections([...scenarioSelections, new Set(selectedFlags)]);
    setScenarioClassifications([...scenarioClassifications, safetyChoice]);

    if (currentScenario + 1 >= generatedScenarios.length) {
      // Calculate final score when all scenarios are complete
      let totalScore = 0;
      const allSelections = [...scenarioSelections, new Set(selectedFlags)];
      const allClassifications = [...scenarioClassifications, safetyChoice];

      allSelections.forEach((selections, index) => {
        const scenario = generatedScenarios[index];
        const userClassification = allClassifications[index];

        // Check if classification is correct (unsafe = scam, safe = not scam)
        const classificationCorrect =
          (userClassification === "unsafe" && scenario.isScam) ||
          (userClassification === "safe" && !scenario.isScam);

        // Add bonus for correct classification
        let roundScore = classificationCorrect ? 20 : 0;

        // Score flags based on classification
        if (userClassification === "unsafe") {
          // Score red flags for unsafe scenarios
          const correctFlags = new Set(scenario.redFlagsPresent);
          let correct = 0;
          let incorrect = 0;

          selections.forEach((flag) => {
            if (correctFlags.has(flag)) {
              correct++;
            } else {
              incorrect++;
            }
          });

          const missed = correctFlags.size - correct;
          const flagScore = Math.max(
            0,
            correct * 10 - incorrect * 5 - missed * 3
          );
          roundScore += flagScore;
        } else if (userClassification === "safe") {
          // Score safe indicators for safe scenarios
          const correctIndicators = new Set(scenario.safeIndicatorsPresent);
          let correct = 0;
          let incorrect = 0;

          selections.forEach((flag) => {
            if (correctIndicators.has(flag)) {
              correct++;
            } else {
              incorrect++;
            }
          });

          const missed = correctIndicators.size - correct;
          const flagScore = Math.max(
            0,
            correct * 10 - incorrect * 5 - missed * 3
          );
          roundScore += flagScore;
        }

        totalScore += roundScore;
      });

      setScore(totalScore);
      setGameOver(true);
    } else {
      setCurrentScenario(currentScenario + 1);
      setSelectedFlags(new Set());
      setSafetyChoice(null);
    }
  };

  const restartGame = () => {
    setGameStarted(false);
    setCurrentScenario(0);
    setSelectedFlags(new Set());
    setTimeElapsed(0);
    setGameOver(false);
    setScore(0);
    setScenarioSelections([]);
    setSafetyChoice(null);
    setScenarioClassifications([]);
    setScoreSaved(false);
    generateNewScenarios();
  };

  // Save score when game ends
  useEffect(() => {
    if (gameOver && !scoreSaved) {
      const maxPossibleScore = generatedScenarios.length * 10 * 12;
      const accuracy = Math.min(
        100,
        Math.round((score / maxPossibleScore) * 100)
      );

      saveScore({
        game_type: "scam-bingo",
        score: score,
        accuracy: accuracy,
        time_taken: timeElapsed,
        metadata: {
          scenarios_completed: generatedScenarios.length,
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
  }, [gameOver, scoreSaved, score, timeElapsed]);

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-emerald-500/5">
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-md shadow-sm">
          <div className="container mx-auto px-4 py-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Home</span>
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

            
            <div className="text-center space-y-4">
              {generationError && (
                <Card className="p-4 bg-red-500/10 border-red-500/50">
                  <p className="text-sm text-red-500">{generationError}</p>
                </Card>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={startGame}
                  size="lg"
                  className="text-lg px-8"
                  disabled={isGenerating}
                >
                  Start Red Flag Hunt
                </Button>
                {isGenerating&&<Button
                  onClick={generateNewScenarios}
                  variant="outline"
                  size="lg"
                  className="text-lg px-8"
                  disabled={isGenerating}
                >
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Generating...
                  </>
                </Button>}
              </div>

              <div>
                <Button asChild variant="outline" size="lg">
                  <Link href="/scam-bingo/leaderboard">
                    <Trophy className="h-4 w-4 mr-2" />
                    View Leaderboard
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (gameOver) {
    const maxPossibleScore = generatedScenarios.length * 10 * 12;
    const performancePercent = Math.min(
      100,
      Math.round((score / maxPossibleScore) * 100)
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-emerald-500/5">
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-md shadow-sm">
          <div className="container mx-auto px-4 py-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Home</span>
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
                  {generatedScenarios.length}
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
                className="flex-1 bg-transparent"
              >
                <Link href="/scam-bingo/leaderboard">
                  <Trophy className="h-4 w-4 mr-2" />
                  Leaderboard
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 bg-transparent"
              >
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const scenario = generatedScenarios[currentScenario];
  const correctFlags = new Set(scenario.redFlagsPresent);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-emerald-500/5">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Exit</span>
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
              Scenario {currentScenario + 1} of {generatedScenarios.length}
            </div>
            <h2 className="text-2xl font-bold mb-4">{scenario.title}</h2>
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
              {!safetyChoice ? (
                <Card className="p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Is this scenario Safe or Unsafe?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Read the scenario carefully and decide if this is legitimate
                    or a potential scam.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => setSafetyChoice("safe")}
                      variant="outline"
                      size="lg"
                      className="h-24 flex flex-col gap-2 bg-green-500/10 hover:bg-green-500/20 border-green-500"
                    >
                      <span className="text-2xl">✓</span>
                      <span className="font-semibold">Safe</span>
                    </Button>
                    <Button
                      onClick={() => setSafetyChoice("unsafe")}
                      variant="outline"
                      size="lg"
                      className="h-24 flex flex-col gap-2 bg-red-500/10 hover:bg-red-500/20 border-red-500"
                    >
                      <span className="text-2xl">⚠</span>
                      <span className="font-semibold">Unsafe</span>
                    </Button>
                  </div>
                </Card>
              ) : safetyChoice === "unsafe" ? (
                <>
                  <Card className="p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        Spot the Red Flags
                      </h3>
                      <Button
                        onClick={() => {
                          setSafetyChoice(null);
                          setSelectedFlags(new Set());
                        }}
                        variant="ghost"
                        size="sm"
                      >
                        Change Classification
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      You marked this as <strong>Unsafe</strong>. Now identify
                      the red flags:
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      {redFlags.map((flag) => {
                        return (
                          <button
                            key={flag.id}
                            onClick={() => toggleFlag(flag.id)}
                            className={cn(
                              "relative p-3 rounded-lg border-2 transition-all text-left h-24 flex flex-col items-center justify-center",
                              selectedFlags.has(flag.id)
                                ? "border-primary bg-primary/10"
                                : "border-border bg-card hover:border-primary/50"
                            )}
                          >
                            <div className="font-semibold text-xs text-center mb-1">
                              {flag.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </Card>
                  <Button onClick={submitBingo} className="w-full" size="lg">
                    {currentScenario + 1 < generatedScenarios.length
                      ? "Next Scenario"
                      : "Finish Hunt"}
                  </Button>
                </>
              ) : (
                <>
                  <Card className="p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        Identify Safe Indicators
                      </h3>
                      <Button
                        onClick={() => {
                          setSafetyChoice(null);
                          setSelectedFlags(new Set());
                        }}
                        variant="ghost"
                        size="sm"
                      >
                        Change Classification
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      You marked this as <strong>Safe</strong>. Now identify the
                      indicators that make it legitimate:
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      {greenFlags.map((flag) => {
                        return (
                          <button
                            key={flag.id}
                            onClick={() => toggleFlag(flag.id)}
                            className={cn(
                              "relative p-3 rounded-lg border-2 transition-all text-left h-24 flex flex-col items-center justify-center",
                              selectedFlags.has(flag.id)
                                ? "border-green-500 bg-green-500/10"
                                : "border-border bg-card hover:border-green-500/50"
                            )}
                          >
                            <div className="font-semibold text-xs text-center mb-1">
                              {flag.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </Card>
                  <Button onClick={submitBingo} className="w-full" size="lg">
                    {currentScenario + 1 < generatedScenarios.length
                      ? "Next Scenario"
                      : "Finish Hunt"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
