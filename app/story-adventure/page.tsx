"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle, CheckCircle } from "lucide-react"

interface StoryNode {
  id: string
  text: string
  options: Array<{
    text: string
    nextId: string
  }>
  isEnding?: boolean
  scamType?: string
  redFlags?: string[]
  tips?: string[]
}

const storyData: Record<string, StoryNode> = {
  start: {
    id: "start",
    text: "You receive a message on your phone: 'Congratulations! You've been selected as a winner of the Digital Citizenship Award! Click here to claim your $500 prize.' What do you do?",
    options: [
      { text: "Click the link to see what it's about", nextId: "click-link" },
      { text: "Check if the website is legitimate first", nextId: "check-website" },
      { text: "Contact the support agent mentioned", nextId: "contact-agent" },
      { text: "Ignore it completely", nextId: "ignore" },
    ],
  },
  "click-link": {
    id: "click-link",
    text: "The link takes you to a website that looks official. It shows logos and asks you to 'verify your identity' by entering your email, phone number, and bank details to receive the prize. What do you do?",
    options: [
      { text: "Enter my details to claim the prize", nextId: "enter-details" },
      { text: "Look more carefully at the website URL", nextId: "check-url" },
    ],
  },
  "check-website": {
    id: "check-website",
    text: "You investigate the website. It uses official-looking seals and badges, claims to be endorsed by major tech companies, and has testimonials from 'previous winners.' The URL is digitalcitzenaward.com (note the misspelling). Do you proceed?",
    options: [
      { text: "It looks legitimate enough, proceed", nextId: "proceed-anyway" },
      { text: "The misspelled URL is suspicious", nextId: "spot-url-issue" },
    ],
  },
  "contact-agent": {
    id: "contact-agent",
    text: "You reach out to the 'support agent' listed. They respond immediately, asking for your full name, address, and last 4 digits of your social security number 'for verification purposes.' They say you need to act fast because the offer expires in 2 hours.",
    options: [
      { text: "Provide the information requested", nextId: "provide-info" },
      { text: "Ask why they need this information", nextId: "question-agent" },
    ],
  },
  ignore: {
    id: "ignore",
    text: "Smart choice to be cautious! However, three days later, you receive a follow-up message: 'URGENT: Your Digital Citizenship Award will be forfeited. You have 24 hours to claim or face legal action for prize abandonment.' Your friend also messages saying they saw your name on the winners list.",
    options: [
      { text: "Check with my friend about it", nextId: "friend-confirms" },
      { text: "Ignore the threat - it's still suspicious", nextId: "final-ignore" },
    ],
  },
  "enter-details": {
    id: "enter-details",
    text: "You've been scammed! After entering your details, the site crashes. Days later, you notice unauthorized charges on your bank account and receive spam calls constantly.",
    isEnding: true,
    scamType: "Phishing Scam with Identity Theft",
    redFlags: [
      "Unsolicited prize notification",
      "Urgency tactics",
      "Request for sensitive financial information",
      "Too good to be true offer",
    ],
    tips: [
      "Never share financial details on unfamiliar websites",
      "Legitimate prizes don't require payment or personal banking info",
      "Always verify unsolicited prize notifications through official channels",
      "Use two-factor authentication on all accounts",
    ],
  },
  "check-url": {
    id: "check-url",
    text: "Good instinct! You notice the URL is 'digita1citizenaward.com' (with a number 1 instead of letter l). This is a common scam tactic. You've avoided entering your details, but you're still on a malicious site.",
    isEnding: true,
    scamType: "Avoided Direct Scam, But Exposed to Risk",
    redFlags: [
      "Suspicious URL with character substitution",
      "Immediate request for personal information",
      "No legitimate verification process",
    ],
    tips: [
      "Always check URLs carefully for misspellings or character substitutions",
      "Legitimate organizations use secure, verified domains",
      "Close suspicious websites immediately",
      "Report phishing attempts to proper authorities",
    ],
  },
  "proceed-anyway": {
    id: "proceed-anyway",
    text: "You proceed and enter your email. The site asks for phone verification, then payment information 'to cover processing fees of $5.' You've been scammed! The site steals your information.",
    isEnding: true,
    scamType: "Multi-Stage Phishing Scam",
    redFlags: [
      "Misspelled domain name",
      "Fake endorsements and testimonials",
      "Request for payment to receive a prize",
      "Progressive information gathering",
    ],
    tips: [
      "Real prizes never require payment to claim",
      "Verify organization legitimacy through independent research",
      "Misspelled URLs are major red flags",
      "Be wary of websites with fake testimonials",
    ],
  },
  "spot-url-issue": {
    id: "spot-url-issue",
    text: "Excellent observation! The misspelled URL is a classic scam technique called 'typosquatting.' You've successfully identified the scam before falling victim!",
    isEnding: true,
    scamType: "Scam Avoided - Typosquatting Detected",
    redFlags: ["Misspelled domain name", "Unsolicited prize offer", "Fake official-looking website design"],
    tips: [
      "Always verify URLs letter by letter",
      "Scammers often buy domains similar to legitimate ones",
      "Use bookmarks for important websites instead of clicking links",
      "When in doubt, contact organizations through official channels",
    ],
  },
  "provide-info": {
    id: "provide-info",
    text: "You've been scammed! The 'agent' was a scammer. They now have enough information to attempt identity theft. You start receiving suspicious credit card applications in your name.",
    isEnding: true,
    scamType: "Social Engineering Identity Theft",
    redFlags: [
      "Immediate response (automated bot or prepared scammer)",
      "Request for sensitive personal information",
      "Artificial urgency (2 hour deadline)",
      "Unsolicited contact",
    ],
    tips: [
      "Never share SSN or sensitive data over unsolicited messages",
      "Legitimate organizations won't pressure you with tight deadlines",
      "Verify identities through official contact methods",
      "Monitor your credit report regularly",
    ],
  },
  "question-agent": {
    id: "question-agent",
    text: "The agent gets defensive: 'This is standard procedure. If you don't trust us, we'll give your prize to the next person.' This pressure tactic is suspicious, but they sound convincing. What do you do?",
    options: [
      { text: "Give them the information to avoid losing out", nextId: "give-in-pressure" },
      { text: "End the conversation - this is a red flag", nextId: "end-conversation" },
    ],
  },
  "friend-confirms": {
    id: "friend-confirms",
    text: "Your 'friend' confirms they saw you on the list and already claimed their prize by paying a small processing fee. But wait - you notice the message is from a slightly different account than your friend's usual one. You've encountered a compromised account scam!",
    isEnding: true,
    scamType: "Account Compromise + Prize Scam",
    redFlags: [
      "Legal threats for not claiming a prize",
      "Friend's account is slightly different (likely compromised)",
      "Request for payment to receive prize",
      "Multiple pressure tactics",
    ],
    tips: [
      "Verify contacts through alternative channels (call them directly)",
      "Check account details carefully - scammers clone accounts",
      "Legal action threats for unclaimed prizes are fake",
      "Enable security features on all social media accounts",
    ],
  },
  "final-ignore": {
    id: "final-ignore",
    text: "Perfect decision! You trusted your instincts despite the threats and social proof. Legal action for not claiming an unsolicited prize is nonsense. You've successfully avoided the scam!",
    isEnding: true,
    scamType: "Scam Avoided - Resisted Multiple Tactics",
    redFlags: [
      "Escalating threats (legal action)",
      "Fake urgency",
      "Social engineering through 'friend' confirmation",
      "Multiple follow-up attempts",
    ],
    tips: [
      "Trust your instincts when something feels wrong",
      "Legitimate organizations don't threaten legal action for unclaimed prizes",
      "Scammers use multiple tactics to wear down resistance",
      "Block and report persistent scam attempts",
    ],
  },
  "give-in-pressure": {
    id: "give-in-pressure",
    text: "You've been scammed! The pressure tactic worked. The scammer now has your sensitive information and disappears. You're at risk for identity theft.",
    isEnding: true,
    scamType: "Pressure-Based Social Engineering Scam",
    redFlags: [
      "Defensive reaction when questioned",
      "Threat of losing opportunity",
      "Emotional manipulation",
      "Unwillingness to allow verification time",
    ],
    tips: [
      "Legitimate organizations respect your need to verify",
      "Pressure tactics are major red flags",
      "Take time to think through important decisions",
      "It's okay to walk away from suspicious situations",
    ],
  },
  "end-conversation": {
    id: "end-conversation",
    text: "Excellent judgment! You recognized the pressure tactics and defensive behavior as red flags. You've successfully avoided the scam by trusting your instincts!",
    isEnding: true,
    scamType: "Scam Avoided - Recognized Pressure Tactics",
    redFlags: [
      "Defensive behavior when questioned",
      "Artificial scarcity threats",
      "Unwillingness to provide verification",
    ],
    tips: [
      "Always trust your gut when something feels wrong",
      "Legitimate services answer questions patiently",
      "Pressure and threats are manipulation tactics",
      "You can always verify later if the offer is real",
    ],
  },
}

export default function StoryAdventurePage() {
  const [currentNodeId, setCurrentNodeId] = useState("start")
  const [showResults, setShowResults] = useState(false)

  const currentNode = storyData[currentNodeId]

  const handleChoice = (nextId: string) => {
    setCurrentNodeId(nextId)
    if (storyData[nextId].isEnding) {
      setShowResults(true)
    }
  }

  const handleRestart = () => {
    setCurrentNodeId("start")
    setShowResults(false)
  }

  if (showResults && currentNode.isEnding) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Home</span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                {currentNode.scamType?.includes("Avoided") ? (
                  <CheckCircle className="h-8 w-8 text-primary" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                )}
              </div>
              <h2 className="text-3xl font-bold mb-2">Scenario Complete</h2>
              <p className="text-xl text-muted-foreground">{currentNode.scamType}</p>
            </div>

            <Card className="p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Red Flags You Encountered
              </h3>
              <ul className="space-y-2">
                {currentNode.redFlags?.map((flag, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span className="text-muted-foreground">{flag}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Key Takeaways
              </h3>
              <ul className="space-y-2">
                {currentNode.tips?.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleRestart} className="flex-1">
                Try Another Path
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Story Adventure</h1>
            <p className="text-muted-foreground">Navigate the scenario and see how different choices lead to scams</p>
          </div>

          <Card className="p-8 mb-6">
            <p className="text-lg leading-relaxed mb-8">{currentNode.text}</p>

            <div className="space-y-3">
              {currentNode.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleChoice(option.nextId)}
                  variant="outline"
                  className="w-full text-left justify-start h-auto py-4 px-6"
                >
                  <span className="font-medium mr-3 text-primary">{String.fromCharCode(65 + index)}.</span>
                  <span>{option.text}</span>
                </Button>
              ))}
            </div>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>Remember: All paths lead to learning opportunities!</p>
          </div>
        </div>
      </main>
    </div>
  )
}
