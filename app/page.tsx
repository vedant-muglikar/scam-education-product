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

  console.log(user.user_metadata);
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <Shield className="h-9 w-9 text-primary transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              ScamSmart
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-all hover:translate-y-[-2px]">
              How It Works
            </Link>
            <Link
              href="#modules"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-all hover:translate-y-[-2px]">
              Modules
            </Link>
            <div className="flex items-center gap-3 ml-4 pl-6 border-l border-border/50">
              <div className="flex items-center gap-3">
                <img
                  className="w-11 h-11 rounded-full object-cover border-2 border-primary/30 hover:border-primary shadow-md hover:shadow-primary/30 transition-all cursor-pointer"
                  src={user.user_metadata.avatar_url}
                  alt="user avatar"
                />
                <span className="text-sm font-medium hidden lg:block">
                  {user.user_metadata.full_name}
                </span>
              </div>
              <LogoutButton />
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:50px_50px] [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/20 text-primary text-sm font-semibold mb-8 shadow-lg hover:shadow-primary/20 transition-all">
            <Shield className="h-4 w-4" />
            <span>Interactive Learning Platform</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold mb-8 text-balance leading-[1.1] tracking-tight">
            Learn to Spot Scams{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-blue-600 bg-clip-text text-transparent">
              Before They Happen
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground/90 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            Experience real scam scenarios in a safe environment. Understand how
            scammers manipulate people and learn to recognize red flags through
            interactive games.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Button
              asChild
              size="lg"
              className="text-base px-8 py-6 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all">
              <Link href="#modules">Start Learning →</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base px-8 py-6 bg-background/50 backdrop-blur-sm border-2 hover:bg-background/80 transition-all">
              <Link href="#how-it-works">How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="bg-gradient-to-b from-muted/20 to-background py-20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-5 text-balance tracking-tight">
              How It Works
            </h3>
            <p className="text-lg text-muted-foreground/80 leading-relaxed">
              Three engaging modules designed to teach you scam detection
              through interactive experiences
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 text-center border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold bg-gradient-to-br from-primary to-blue-600 bg-clip-text text-transparent">
                  1
                </span>
              </div>
              <h4 className="font-bold text-xl mb-3">Choose a Module</h4>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                Pick from Story Adventure, Flash-Card Challenge, or Red Flag
                Hunter
              </p>
            </Card>
            <Card className="p-8 text-center border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold bg-gradient-to-br from-primary to-blue-600 bg-clip-text text-transparent">
                  2
                </span>
              </div>
              <h4 className="font-bold text-xl mb-3">Experience Scams</h4>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                Navigate real scenarios and make decisions in a safe environment
              </p>
            </Card>
            <Card className="p-8 text-center border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold bg-gradient-to-br from-primary to-blue-600 bg-clip-text text-transparent">
                  3
                </span>
              </div>
              <h4 className="font-bold text-xl mb-3">Learn & Improve</h4>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                Get instant feedback, understand red flags, and build your
                skills
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section
        id="modules"
        className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold mb-5 text-balance tracking-tight">
            Choose Your Learning Path
          </h3>
          <p className="text-lg text-muted-foreground/80 leading-relaxed">
            Each module offers a unique way to understand scam techniques and
            build your detection skills
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Story Adventure */}
          <Card className="overflow-hidden group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 border-border/50 hover:border-primary/50 hover:-translate-y-1">
            <div className="h-56 bg-gradient-to-br from-primary/30 via-primary/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px]" />
              <Target className="h-20 w-20 text-primary relative z-10 group-hover:scale-110 transition-transform" />
            </div>
            <div className="p-7 bg-card/50 backdrop-blur-sm">
              <h4 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                Story Adventure
              </h4>
              <p className="text-sm text-muted-foreground/80 mb-5 leading-relaxed min-h-[4rem]">
                Navigate branching scenarios where every path reveals different
                scam techniques. No matter your choice, you'll learn.
              </p>
              <Button
                asChild
                className="w-full shadow-md hover:shadow-lg transition-shadow"
                variant="default">
                <Link href="/story-adventure">Start Adventure →</Link>
              </Button>
            </div>
          </Card>

          {/* Flash-Card Challenge */}
          <Card className="overflow-hidden group hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 border-border/50 hover:border-yellow-500/50 hover:-translate-y-1">
            <div className="h-56 bg-gradient-to-br from-yellow-500/30 via-yellow-500/10 to-orange-500/5 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px]" />
              <Zap className="h-20 w-20 text-yellow-600 relative z-10 group-hover:scale-110 transition-transform" />
            </div>
            <div className="p-7 bg-card/50 backdrop-blur-sm">
              <h4 className="text-2xl font-bold mb-3 group-hover:text-yellow-600 transition-colors">
                Flash-Card Challenge
              </h4>
              <p className="text-sm text-muted-foreground/80 mb-5 leading-relaxed min-h-[4rem]">
                Race against time to identify scams vs safe messages. Build
                speed and accuracy with instant feedback.
              </p>
              <Button
                asChild
                className="w-full shadow-md hover:shadow-lg transition-shadow bg-yellow-600 hover:bg-yellow-700 text-white">
                <Link href="/flash-card-challenge">Start Challenge →</Link>
              </Button>
            </div>
          </Card>

          {/* Scam Bingo */}
          <Card className="overflow-hidden group hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 border-border/50 hover:border-emerald-500/50 hover:-translate-y-1">
            <div className="h-56 bg-gradient-to-br from-emerald-500/30 via-emerald-500/10 to-teal-500/5 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px]" />
              <Shield className="h-20 w-20 text-emerald-600 relative z-10 group-hover:scale-110 transition-transform" />
            </div>
            <div className="p-7 bg-card/50 backdrop-blur-sm">
              <h4 className="text-2xl font-bold mb-3 group-hover:text-emerald-600 transition-colors">
                Red Flag Hunter
              </h4>
              <p className="text-sm text-muted-foreground/80 mb-5 leading-relaxed min-h-[4rem]">
                Read scenarios and identify red flags on your board. Train your
                pattern recognition skills across multiple scenarios.
              </p>
              <Button
                asChild
                className="w-full shadow-md hover:shadow-lg transition-shadow border-2 border-emerald-600/50 hover:bg-emerald-600/10"
                variant="outline">
                <Link href="/scam-bingo">Start Hunt →</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-gradient-to-b from-muted/20 to-background py-12 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              ScamSmart
            </span>
          </div>
          <p className="text-muted-foreground/80 mb-2 font-medium">
            Educational platform for digital safety awareness
          </p>
          <p className="text-sm text-muted-foreground/60">
            Learn to protect yourself and others from online scams
          </p>
        </div>
      </footer>
    </div>
  );
}
