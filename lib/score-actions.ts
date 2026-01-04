import { supabase } from "@/utils/supabase/client";

export interface GameScore {
  user_id: string;
  game_type: "flash-card" | "scam-bingo" | "story-adventure" | "scam-ladder";
  score: number;
  accuracy?: number;
  time_taken?: number;
  metadata?: Record<string, any>;
}

export async function saveScore(scoreData: Omit<GameScore, "user_id">) {
  try {
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log("Current user:", user);

    if (userError || !user) {
      console.error("Error getting user:", userError);
      return { success: false, error: "User not authenticated" };
    }

    // For scam-bingo, use the existing bingo-ranking table
    if (scoreData.game_type === "scam-bingo") {
      // First, check if user already has a score in the table
      const { data: existingData, error: fetchError } = await supabase
        .from("bingo-ranking")
        .select("*")
        .eq("user_id", user.id)
        .order("score", { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log(existingData);
      console.log(scoreData.score);
      console.log(user);

      if (fetchError) {
        console.error("Error fetching existing bingo score:", fetchError);
        return { success: false, error: fetchError.message };
      }

      // If user exists and new score is greater, update the existing row
      if (existingData && scoreData.score > existingData.score) {
        const { data, error } = await supabase
          .from("bingo-ranking")
          .update({ score: scoreData.score })
          .eq("id", existingData.id);

        if (error) {
          console.error("Error updating bingo score:", error);
          return { success: false, error: error.message };
        }

        return { success: true, data, updated: true };
      }

      // If user doesn't exist, insert new record
      if (!existingData) {
        const { data, error } = await supabase.from("bingo-ranking").insert({
          score: scoreData.score,
          email: user.email,
          user_id: user.id,
          name: user.user_metadata.name || user.email,
        });

        if (error) {
          console.error("Error inserting bingo score:", error);
          return { success: false, error: error.message };
        }

        return { success: true, data, updated: false };
      }

      // If new score is not greater, don't update but return success
      return {
        success: true,
        data: existingData,
        updated: false,
        message: "Score not higher than existing record",
      };
    }

    // For scam-ladder, use the scam_ladder_ranking table
    if (scoreData.game_type === "scam-ladder") {
      // First, check if user already has a score in the table
      const { data: existingData, error: fetchError } = await supabase
        .from("scam_ladder_ranking")
        .select("*")
        .eq("user_id", user.id)
        .order("score", { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log("Existing scam-ladder data:", existingData);
      console.log("New scam-ladder score:", scoreData.score);

      if (fetchError) {
        console.error("Error fetching existing scam-ladder score:", fetchError);
        return { success: false, error: fetchError.message };
      }

      // If user exists and new score is greater, update the existing row
      if (existingData && scoreData.score > existingData.score) {
        const { data, error } = await supabase
          .from("scam_ladder_ranking")
          .update({
            score: scoreData.score,
            accuracy: scoreData.accuracy || 0,
          })
          .eq("id", existingData.id);

        if (error) {
          console.error("Error updating scam-ladder score:", error);
          return { success: false, error: error.message };
        }

        return { success: true, data, updated: true };
      }

      // If user doesn't exist, insert new record
      if (!existingData) {
        const { data, error } = await supabase
          .from("scam_ladder_ranking")
          .insert({
            score: scoreData.score,
            accuracy: scoreData.accuracy || 0,
            email: user.email,
            user_id: user.id,
            name:
              user.user_metadata.full_name ||
              user.user_metadata.name ||
              user.email,
          });

        if (error) {
          console.error("Error inserting scam-ladder score:", error);
          return { success: false, error: error.message };
        }

        return { success: true, data, updated: false };
      }

      // If new score is not greater, don't update but return success
      return {
        success: true,
        data: existingData,
        updated: false,
        message: "Score not higher than existing record",
      };
    }

    // For other games, you can create similar tables or use a generic table
    // For now, we'll just log them
    console.log("Score for", scoreData.game_type, ":", scoreData);
    return { success: true, data: null };
  } catch (error) {
    console.error("Unexpected error saving score:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getUserScores(gameType?: string) {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "User not authenticated" };
    }

    // For scam-bingo, use the existing bingo-ranking table
    if (gameType === "scam-bingo") {
      const { data, error } = await supabase
        .from("bingo-ranking")
        .select("*")
        .eq("email", user.email)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching bingo scores:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    }

    // For other games, return empty for now
    return { success: true, data: [] };
  } catch (error) {
    console.error("Unexpected error fetching scores:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getUserHighScore(gameType: string) {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "User not authenticated" };
    }

    // For scam-bingo, use the existing bingo-ranking table
    if (gameType === "scam-bingo") {
      const { data, error } = await supabase
        .from("bingo-ranking")
        .select("*")
        .eq("email", user.email)
        .order("score", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "no rows returned"
        console.error("Error fetching high score:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    }

    // For other games, return null for now
    return { success: true, data: null };
  } catch (error) {
    console.error("Unexpected error fetching high score:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
