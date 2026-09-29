/**
 * scorer.ts — PURE function of stored LLM reviews + judge output.
 *
 * There is NO seeded jitter, NO token overlap heuristics, NO additive
 * Round 2 bonus/penalty. The transcript causally determines the score
 * because the reviews/judge were generated FROM the transcript by an LLM.
 *
 * Formula:
 *   view(A→B) = 0.7 * would_see_again_A + 0.3 * mean(need_scores_A) * 10
 *   score(A→B) = 0.5 * view(A→B) + 0.3 * judge_mutual + 0.2 * view(B→A)
 */

import { SideReview } from "./review";
import { JudgeReview } from "./judge";

export interface ScoreComponents {
  viewAToB: number;
  viewBToA: number;
  scoreAToB: number;
  scoreBToA: number;
  mutualScore: number;
}

/**
 * Compute the directional "view" score from one side review.
 *   view = 0.7 * would_see_again + 0.3 * mean(need_scores) * 10
 */
function computeView(review: SideReview): number {
  const meanNeeds =
    review.need_scores.length > 0
      ? review.need_scores.reduce((acc, n) => acc + n.score, 0) /
        review.need_scores.length
      : 7; // neutral default if no needs scored
  return 0.7 * review.would_see_again + 0.3 * meanNeeds * 10;
}

/**
 * Pure scoring function. Takes exactly the stored reviews and judge output.
 * No randomness, no profile heuristics, no additive bonuses.
 */
export function computeScores(
  reviewA: SideReview,
  reviewB: SideReview,
  judgeReview: JudgeReview
): ScoreComponents {
  const viewAToB = computeView(reviewA);
  const viewBToA = computeView(reviewB);

  const scoreAToB = Number(
    (0.5 * viewAToB + 0.3 * judgeReview.mutual_score + 0.2 * viewBToA).toFixed(
      1
    )
  );
  const scoreBToA = Number(
    (0.5 * viewBToA + 0.3 * judgeReview.mutual_score + 0.2 * viewAToB).toFixed(
      1
    )
  );

  return {
    viewAToB: Number(viewAToB.toFixed(1)),
    viewBToA: Number(viewBToA.toFixed(1)),
    scoreAToB,
    scoreBToA,
    mutualScore: judgeReview.mutual_score,
  };
}

/**
 * Seed-based tiebreak: deterministic pick between two equal scores.
 * Seeds may ONLY be used for tiebreaking, never for the score itself.
 */
export function seedTiebreak(
  seedA: string,
  seedB: string,
  scoreA: number,
  scoreB: number
): "A" | "B" | "tie" {
  if (Math.abs(scoreA - scoreB) > 0.01) {
    return scoreA > scoreB ? "A" : "B";
  }
  // Exact tie: use lexicographic ordering of seed strings
  return seedA < seedB ? "A" : "B";
}
