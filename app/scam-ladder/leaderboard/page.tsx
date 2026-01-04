"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trophy, Medal, Award, Crown } from "lucide-react";
import {
  getScamLadderLeaderboard,
  getCurrentUserScamLadderRank,
} from "@/lib/leaderboard-actions";
import type { ScamLadderLeaderboardEntry } from "@/lib/leaderboard-actions";

export default function ScamLadderLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<ScamLadderLeaderboardEntry[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [currentUserScore, setCurrentUserScore] = useState<number | null>(null);
  const [currentUserAccuracy, setCurrentUserAccuracy] = useState<number | null>(
    null
  );

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // Fetch leaderboard
      const leaderboardResult = await getScamLadderLeaderboard(10);
      if (leaderboardResult.success) {
        setLeaderboard(leaderboardResult.data);
      }

      // Fetch current user rank
      const rankResult = await getCurrentUserScamLadderRank();
      if (rankResult.success && rankResult.rank) {
        setCurrentUserRank(rankResult.rank);
        setCurrentUserScore(rankResult.score || null);
        setCurrentUserAccuracy(rankResult.accuracy || null);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <Trophy className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getRankColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-yellow-500/10 border-yellow-500/50";
      case 2:
        return "bg-gray-400/10 border-gray-400/50";
      case 3:
        return "bg-amber-600/10 border-amber-600/50";
      default:
        return "bg-card";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-500/5">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <Link
            href="/scam-ladder"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Game</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
            <p className="text-muted-foreground">
              Top climbers in the Scam Ladder Challenge
            </p>
          </div>

          {currentUserRank && (
            <Card className="p-6 mb-6 border-primary/50 bg-primary/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Your Rank
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    #{currentUserRank}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">
                    Your Score
                  </p>
                  <p className="text-3xl font-bold">{currentUserScore}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">
                    Your Accuracy
                  </p>
                  <p className="text-3xl font-bold">{currentUserAccuracy}%</p>
                </div>
              </div>
            </Card>
          )}

          {loading ? (
            <Card className="p-8">
              <div className="text-center text-muted-foreground">
                Loading leaderboard...
              </div>
            </Card>
          ) : leaderboard.length === 0 ? (
            <Card className="p-8">
              <div className="text-center text-muted-foreground">
                No scores yet. Be the first to play!
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => {
                const position = index + 1;
                return (
                  <Card
                    key={entry.id}
                    className={`p-4 transition-all hover:shadow-md ${getRankColor(
                      position
                    )}`}>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background/50">
                        {getRankIcon(position)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-lg">#{position}</span>
                          <span className="text-sm text-muted-foreground truncate">
                            {entry.name}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(entry.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </div>

                      <div className="text-right mr-4">
                        <div className="text-2xl font-bold text-primary">
                          {entry.score}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          points
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          {entry.accuracy}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          accuracy
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="mt-8 text-center">
            <Button asChild size="lg">
              <Link href="/scam-ladder">Play Now</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
