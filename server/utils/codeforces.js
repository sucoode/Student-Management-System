import axios from "axios";
import { subDays } from "date-fns";

export const fetchRatingInfo = async (handle) => {
  const res = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
  const result = res.data.result;

  const currentRating = result[result.length - 1]?.newRating || 0;
  const maxRating = Math.max(...result.map((c) => c.newRating));

  return { currentRating, maxRating };
};

export const fetchSolvedMap = async (handle) => {
  const submissionsRes = await axios.get(
    `https://codeforces.com/api/user.status?handle=${handle}`
  );
  const submissions = submissionsRes.data.result;
  const solvedMap = {};

  submissions.forEach((sub) => {
    if (sub.verdict === "OK" && sub.contestId) {
      const key = `${sub.contestId}-${sub.problem.index}`;
      solvedMap[key] = true;
    }
  });

  return solvedMap;
};


export const fetchContestsWithUnsolved = async (handle) => {
  const ratingRes = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
  const ratingData = ratingRes.data.result;

  const now = new Date();
  const cutoffDate = subDays(now, 365);

  const filteredContests = ratingData
    .map(c => ({
      contestId: c.contestId,
      contestName: c.contestName,
      rank: c.rank,
      oldRating: c.oldRating,
      newRating: c.newRating,
      date: new Date(c.ratingUpdateTimeSeconds * 1000)
    }))
    .filter(c => c.date > cutoffDate);

  const solvedMap = await fetchSolvedMap(handle);
  const contestsWithUnsolved = [];

  for (const contest of filteredContests) {
    try {
      const standingsRes = await axios.get(
        `https://codeforces.com/api/contest.standings?contestId=${contest.contestId}&from=1&count=1`
      );

      const problems = standingsRes.data.result.problems;
      const unsolvedCount = problems.reduce((count, problem) => {
        const key = `${contest.contestId}-${problem.index}`;
        return solvedMap[key] ? count : count + 1;
      }, 0);

      contestsWithUnsolved.push({
        ...contest,
        totalProblems: problems.length,
        unsolvedProblems: unsolvedCount
      });
    } catch (err) {
      console.warn(`Failed to fetch problems for contest ${contest.contestId}`, err.message);
      contestsWithUnsolved.push({
        ...contest,
        totalProblems: 0,
        unsolvedProblems: 0
      });
    }
  }

  return contestsWithUnsolved;
};













export const fetchSubmissions = async (handle) => {
  const submissionsRes = await axios.get(
    `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1000`
  );
  const submissionsResult = submissionsRes.data.result;
  const cutoffDate = subDays(new Date(), 90);
  const submissions = submissionsResult
    .filter((sub) => sub.verdict === "OK" && sub.problem.rating && new Date(sub.creationTimeSeconds * 1000) >= cutoffDate)
    .map((sub) => ({
      problemId: `${sub.problem.contestId}-${sub.problem.index}`,
      rating: sub.problem.rating,
      date: new Date(sub.creationTimeSeconds * 1000),
    }));
    console.log("Fetched submissions")
  return { submissions };
};






// export const fetchCFContests = async (handle) => {
//   const res = await axios.get(
//     `https://codeforces.com/api/user.rating?handle=${handle}`
//   );
//   const result = res.data.result;

//   const now = new Date();
//   const cutoffDate = subDays(now, 365); // Only include contests within last 365 days

//   const allContests = result.map((c) => ({
//     contestId: c.contestId,
//     contestName: c.contestName,
//     rank: c.rank,
//     oldRating: c.oldRating,
//     newRating: c.newRating,
//     date: new Date(c.ratingUpdateTimeSeconds * 1000),
//   }));

//   const filteredContests = allContests.filter((c) => c.date > cutoffDate);

//   const currentRating = result[result.length - 1]?.newRating || 0;
//   const maxRating = Math.max(...result.map((c) => c.newRating));

//   // Get solved map from submissions
//   const submissionsRes = await axios.get(
//     `https://codeforces.com/api/user.status?handle=${handle}`
//   );
//   const submissions = submissionsRes.data.result;
//   const solvedMap = {};

//   submissions.forEach((sub) => {
//     if (sub.verdict === "OK" && sub.contestId) {
//       const key = `${sub.contestId}-${sub.problem.index}`;
//       solvedMap[key] = true;
//     }
//   });

//   const contestsWithUnsolved = [];

//   for (const contest of filteredContests) {
//     try {
//       const standingsRes = await axios.get(
//         `https://codeforces.com/api/contest.standings?contestId=${contest.contestId}&from=1&count=1`
//       );

//       const problems = standingsRes.data.result.problems;

//       const unsolvedCount = problems.reduce((count, problem) => {
//         const key = `${contest.contestId}-${problem.index}`;
//         return solvedMap[key] ? count : count + 1;
//       }, 0);

//       contestsWithUnsolved.push({
//         ...contest,
//         totalProblems: problems.length,
//         unsolvedProblems: unsolvedCount,
//       });
//     } catch (err) {
//       console.warn(
//         `Failed to fetch problems for contest ${contest.contestId}`,
//         err.message
//       );
//       contestsWithUnsolved.push({
//         ...contest,
//         totalProblems: 0,
//         unsolvedProblems: 0,
//       });
//     }
//   }

//   return {
//     contests: contestsWithUnsolved,
//     currentRating,
//     maxRating,
//   };
// };

