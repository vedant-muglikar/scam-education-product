import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Zap, Target, User } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { LogoutButton } from "@/components/LogoutButton";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">ScamSmart</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link
              href="#modules"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Modules
            </Link>
            <div className="flex items-center gap-2 ml-4 pl-4 border-l">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="text-xs">{user.email}</span>
              </div>
              <LogoutButton />
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            <span>Interactive Learning</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance leading-tight">
            Learn to Spot Scams{" "}
            <span className="text-primary">Before They Happen</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
            Experience real scam scenarios in a safe environment. Understand how
            scammers manipulate people and learn to recognize red flags through
            interactive games.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base">
              <Link href="#modules">Start Learning</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base bg-transparent">
              <Link href="#how-it-works">How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              How It Works
            </h3>
            <p className="text-muted-foreground text-pretty leading-relaxed">
              Three engaging modules designed to teach you scam detection
              through interactive experiences
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 text-center border-2 hover:border-primary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">Choose a Module</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pick from Story Adventure, Flash-Card Challenge, or Red Flag
                Hunter
              </p>
            </Card>
            <Card className="p-6 text-center border-2 hover:border-primary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">Experience Scams</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Navigate real scenarios and make decisions in a safe environment
              </p>
            </Card>
            <Card className="p-6 text-center border-2 hover:border-primary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">Learn & Improve</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get instant feedback, understand red flags, and build your
                skills
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Choose Your Learning Path
          </h3>
          <p className="text-muted-foreground text-pretty leading-relaxed">
            Each module offers a unique way to understand scam techniques and
            build your detection skills
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Story Adventure */}
          <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Target className="h-16 w-16 text-primary" />
            </div>
            <div className="p-6">
              <h4 className="text-xl font-bold mb-2">Story Adventure</h4>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Navigate branching scenarios where every path reveals different
                scam techniques. No matter your choice, you'll learn.
              </p>
              <Button asChild className="w-full" variant="default">
                <Link href="/story-adventure">Start Adventure</Link>
              </Button>
            </div>
          </Card>

          {/* Flash-Card Challenge */}
          <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-secondary/40 to-secondary/10 flex items-center justify-center">
              <Zap className="h-16 w-16 text-secondary-foreground" />
            </div>
            <div className="p-6">
              <h4 className="text-xl font-bold mb-2">Flash-Card Challenge</h4>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Race against time to identify scams vs safe messages. Build
                speed and accuracy with instant feedback.
              </p>
              <Button asChild className="w-full" variant="secondary">
                <Link href="/flash-card-challenge">Start Challenge</Link>
              </Button>
            </div>
          </Card>

          {/* Scam Bingo */}
          <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-accent/40 to-accent/10 flex items-center justify-center">
              <Shield className="h-16 w-16 text-accent-foreground" />
            </div>
            <div className="p-6">
              <h4 className="text-xl font-bold mb-2">Red Flag Hunter</h4>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Read scenarios and identify red flags on your board. Train your
                pattern recognition skills across multiple scenarios.
              </p>
              <Button
                asChild
                className="w-full bg-transparent"
                variant="outline">
                <Link href="/scam-bingo">Start Hunt</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>ScamSmart - Educational platform for digital safety awareness</p>
          <p className="mt-2">
            Learn to protect yourself and others from online scams
          </p>
        </div>
      </footer>
    </div>
  );
}
