import { supabase } from "@/utils/supabase/client";

export interface LeaderboardEntry {
  id: string;
  email: string;
  score: number;
  created_at: string;
  user_id: string;
  name: string;
}

export interface ScamLadderLeaderboardEntry {
  id: string;
  email: string;
  score: number;
  accuracy: number;
  created_at: string;
  user_id: string;
  name: string;
}

export async function getLeaderboard(limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from("bingo-ranking")
      .select("*")
      .order("score", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching leaderboard:", error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Unexpected error fetching leaderboard:", error);
    return { success: false, error: "An unexpected error occurred", data: [] };
  }
}

export async function getCurrentUserRank() {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "User not authenticated", rank: null };
    }

    // Get user's score
    const { data: userData, error: userScoreError } = await supabase
      .from("bingo-ranking")
      .select("score")
      .eq("user_id", user.id)
      .maybeSingle();

    if (userScoreError || !userData) {
      return { success: true, rank: null, score: null };
    }

    // Count how many users have a higher score
    const { count, error: countError } = await supabase
      .from("bingo-ranking")
      .select("*", { count: "exact", head: true })
      .gt("score", userData.score);

    if (countError) {
      console.error("Error calculating rank:", countError);
      return { success: false, error: countError.message, rank: null };
    }

    return {
      success: true,
      rank: (count || 0) + 1,
      score: userData.score,
    };
  } catch (error) {
    console.error("Unexpected error calculating rank:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
      rank: null,
    };
  }
}

export async function getScamLadderLeaderboard(limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from("scam_ladder_ranking")
      .select("*")
      .order("score", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching scam-ladder leaderboard:", error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Unexpected error fetching scam-ladder leaderboard:", error);
    return { success: false, error: "An unexpected error occurred", data: [] };
  }
}

export async function getCurrentUserScamLadderRank() {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "User not authenticated", rank: null };
    }

    // Get user's score
    const { data: userData, error: userScoreError } = await supabase
      .from("scam_ladder_ranking")
      .select("score, accuracy")
      .eq("user_id", user.id)
      .maybeSingle();

    if (userScoreError || !userData) {
      return { success: true, rank: null, score: null, accuracy: null };
    }

    // Count how many users have a higher score
    const { count, error: countError } = await supabase
      .from("scam_ladder_ranking")
      .select("*", { count: "exact", head: true })
      .gt("score", userData.score);

    if (countError) {
      console.error("Error calculating scam-ladder rank:", countError);
      return { success: false, error: countError.message, rank: null };
    }

    return {
      success: true,
      rank: (count || 0) + 1,
      score: userData.score,
      accuracy: userData.accuracy,
    };
  } catch (error) {
    console.error("Unexpected error calculating scam-ladder rank:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
      rank: null,
    };
  }
}
