
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

const getHeaders = (token = null) => ({
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'UncleG-Roaster',
    ...(token && { 'Authorization': `Bearer ${token}` })
});

export async function fetchGitHubProfile(username) {
    const token = process.env.GITHUB_TOKEN;

    try {
        // Fetch user profile via REST
        const userResponse = await fetch(`${GITHUB_API_BASE}/users/${username}`, {
            headers: getHeaders(token)
        });

        if (!userResponse.ok) {
            if (userResponse.status === 404) {
                throw new Error(`User "${username}" not found on GitHub`);
            }
            throw new Error(`GitHub API error: ${userResponse.status}`);
        }

        const user = await userResponse.json();

        // Fetch repositories via REST (up to 100)
        const reposResponse = await fetch(
            `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=100`,
            { headers: getHeaders(token) }
        );
        const repos = reposResponse.ok ? await reposResponse.json() : [];

        // Fetch contribution data via GraphQL (if token available)
        let contributionData = null;
        if (token) {
            contributionData = await fetchContributionData(username, token);
        }

        // Fetch recent events for activity analysis
        const eventsResponse = await fetch(
            `${GITHUB_API_BASE}/users/${username}/events/public?per_page=100`,
            { headers: getHeaders(token) }
        );
        const events = eventsResponse.ok ? await eventsResponse.json() : [];

        // Calculate language stats
        const languageStats = calculateLanguageStats(repos);

        // Calculate activity patterns from events (fallback if no GraphQL data)
        const activityPatterns = analyzeActivityPatterns(events);

        // Use GraphQL data if available, otherwise fall back to REST estimates
        const totalStars = contributionData?.totalStars ??
            repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

        const totalCommits = contributionData?.totalCommits ??
            events.filter(e => e.type === 'PushEvent')
                .reduce((sum, e) => sum + (e.payload?.commits?.length || 0), 0);

        // Total contributions = commits + PRs (matching git-wrapped)
        const totalContributions = contributionData?.contributionsThisYear ?? totalCommits;

        const longestStreak = contributionData?.longestStreak ?? activityPatterns.streak;
        const currentStreak = contributionData?.currentStreak ?? activityPatterns.streak;

        // Most active day from GraphQL or events
        const mostActiveDay = contributionData?.mostActiveDay ?? activityPatterns.mostActiveDay;

        // Find most starred repo
        const mostStarredRepo = repos.reduce((max, repo) =>
            (repo.stargazers_count > (max?.stargazers_count || 0)) ? repo : max, null);

        // Calculate power level
        const powerLevel = calculatePowerLevel(user, repos, totalStars, totalCommits);

        const profileData = {
            username: user.login,
            name: user.name || user.login,
            bio: user.bio || 'No bio provided',
            company: user.company || 'Unemployed (or hiding it)',
            location: user.location || 'Location unknown',
            blog: user.blog || null,
            twitterUsername: user.twitter_username || null,
            publicRepos: user.public_repos,
            publicGists: user.public_gists || 0,
            followers: user.followers,
            following: user.following,
            createdAt: user.created_at,
            avatarUrl: user.avatar_url,

            // Repository insights
            topRepos: repos
                .filter(r => !r.fork)
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 5)
                .map(repo => ({
                    name: repo.name,
                    description: repo.description || 'No description',
                    language: repo.language || 'Unknown',
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    isForked: repo.fork,
                    updatedAt: repo.updated_at
                })),

            // Language stats
            languages: Object.keys(languageStats).slice(0, 5),
            topLanguage: Object.keys(languageStats)[0] || 'Unknown',
            languageBreakdown: languageStats,

            // Star counts
            totalStars,
            totalForks: repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0),
            starsPerRepo: repos.length > 0 ? (totalStars / repos.length).toFixed(1) : 0,

            // Repo counts
            forkedRepos: repos.filter(r => r.fork).length,
            originalRepos: repos.filter(r => !r.fork).length,

            // Contribution stats (from GraphQL)
            totalCommits,
            totalContributions,
            recentCommits: totalCommits, // For backward compatibility
            longestStreak,
            currentStreak,
            activityStreak: currentStreak, // For backward compatibility

            // Activity patterns
            mostActiveDay,
            mostActiveHour: activityPatterns.mostActiveHour,
            contributionsThisYear: contributionData?.contributionsThisYear ?? 0,
            contributionWeeks: contributionData?.contributionWeeks ?? [],

            // Power metrics
            powerLevel: powerLevel.level,
            powerScore: powerLevel.score,
            universalRank: calculateUniversalRank(user.followers, totalStars, totalCommits),

            // Most starred repo
            mostStarredRepo: mostStarredRepo ? {
                name: mostStarredRepo.name,
                stars: mostStarredRepo.stargazers_count,
                language: mostStarredRepo.language
            } : null,

            // Account age
            accountAgeYears: Math.floor(
                (new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24 * 365)
            ),
            accountAgeDays: Math.floor(
                (new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24)
            ),

            // Ratios
            followRatio: user.following > 0 ? (user.followers / user.following).toFixed(2) : user.followers,

            // Data source indicator
            dataSource: token ? 'GraphQL + REST' : 'REST only'
        };

        console.log(`📊 Fetched profile for ${username} via ${JSON.stringify(profileData)}`);
        return profileData;
    } catch (error) {
        throw new Error(`Failed to fetch GitHub profile: ${error.message}`);
    }
}

/**
 * Fetch contribution data via GraphQL API
 */
async function fetchContributionData(username, token) {
    const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
          totalRepositoryContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                weekday
              }
            }
          }
        }
        repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
          totalCount
          nodes {
            stargazerCount
          }
        }
      }
    }
  `;

    try {
        const response = await fetch(GITHUB_GRAPHQL_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'UncleG-Roaster'
            },
            body: JSON.stringify({ query, variables: { username } })
        });

        if (!response.ok) {
            console.warn('GraphQL request failed, falling back to REST data');
            return null;
        }

        const data = await response.json();

        if (data.errors) {
            console.warn('GraphQL errors:', data.errors);
            return null;
        }

        const user = data.data?.user;
        if (!user) return null;

        const contributions = user.contributionsCollection;
        const calendar = contributions.contributionCalendar;

        // Calculate total stars from all repos
        const totalStars = user.repositories.nodes.reduce(
            (sum, repo) => sum + (repo.stargazerCount || 0), 0
        );

        // Calculate streaks from contribution calendar
        const { longestStreak, currentStreak } = calculateStreaksFromCalendar(calendar);

        // Find most active day of week
        const mostActiveDay = findMostActiveDay(calendar);

        // Get full year of contributions for the graph
        const recentWeeks = calendar.weeks.map(week =>
            week.contributionDays.map(day => day.contributionCount)
        );

        return {
            totalCommits: contributions.totalCommitContributions,
            totalPRs: contributions.totalPullRequestContributions,
            totalIssues: contributions.totalIssueContributions,
            contributionsThisYear: calendar.totalContributions,
            totalStars,
            longestStreak,
            currentStreak,
            mostActiveDay,
            contributionWeeks: recentWeeks
        };
    } catch (error) {
        console.warn('GraphQL fetch error:', error.message);
        return null;
    }
}

/**
 * Calculate streaks from contribution calendar
 */
function calculateStreaksFromCalendar(calendar) {
    const allDays = calendar.weeks.flatMap(week => week.contributionDays);

    let longestStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;

    // Process days in chronological order
    for (let i = 0; i < allDays.length; i++) {
        if (allDays[i].contributionCount > 0) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    }

    // Calculate current streak (from most recent day backwards)
    for (let i = allDays.length - 1; i >= 0; i--) {
        // Skip today if no contributions yet (give benefit of doubt)
        const isToday = allDays[i].date === new Date().toISOString().split('T')[0];

        if (allDays[i].contributionCount > 0) {
            currentStreak++;
        } else if (!isToday) {
            break;
        }
    }

    return { longestStreak, currentStreak };
}

/**
 * Find the most active day of the week
 */
function findMostActiveDay(calendar) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayCounts = new Array(7).fill(0);

    calendar.weeks.forEach(week => {
        week.contributionDays.forEach(day => {
            dayCounts[day.weekday] += day.contributionCount;
        });
    });

    const maxIndex = dayCounts.indexOf(Math.max(...dayCounts));
    return dayNames[maxIndex];
}

/**
 * Calculate language statistics from repos
 */
function calculateLanguageStats(repos) {
    const langCount = {};

    repos.forEach(repo => {
        if (repo.language && !repo.fork) {
            langCount[repo.language] = (langCount[repo.language] || 0) + 1;
        }
    });

    return Object.entries(langCount)
        .sort((a, b) => b[1] - a[1])
        .reduce((obj, [lang, count]) => {
            obj[lang] = count;
            return obj;
        }, {});
}

/**
 * Analyze activity patterns from events (fallback)
 */
function analyzeActivityPatterns(events) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayCounts = new Array(7).fill(0);
    const hourCounts = new Array(24).fill(0);
    const activeDates = new Set();

    events.forEach(event => {
        const date = new Date(event.created_at);
        dayCounts[date.getDay()]++;
        hourCounts[date.getHours()]++;
        activeDates.add(date.toISOString().split('T')[0]);
    });

    const maxDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
    const mostActiveDay = dayCounts[maxDayIndex] > 0 ? dayNames[maxDayIndex] : 'Unknown';

    const maxHourIndex = hourCounts.indexOf(Math.max(...hourCounts));
    const mostActiveHour = hourCounts[maxHourIndex] > 0
        ? `${maxHourIndex}:00 - ${maxHourIndex + 1}:00`
        : 'Unknown';

    // Simple streak from sorted dates
    const dates = Array.from(activeDates).sort().reverse();
    let streak = dates.length > 0 ? 1 : 0;

    for (let i = 0; i < dates.length - 1; i++) {
        const diff = (new Date(dates[i]) - new Date(dates[i + 1])) / (1000 * 60 * 60 * 24);
        if (diff === 1) streak++;
        else break;
    }

    return { mostActiveDay, mostActiveHour, streak };
}

/**
 * Calculate power level based on GitHub metrics
 */
function calculatePowerLevel(user, repos, totalStars, totalCommits = 0) {
    let score = 0;

    // Followers (max 25 points)
    score += Math.min(user.followers / 100, 25);

    // Stars (max 25 points)
    score += Math.min(totalStars / 50, 25);

    // Commits (max 20 points)
    score += Math.min(totalCommits / 100, 20);

    // Repos (max 15 points)
    score += Math.min(repos.filter(r => !r.fork).length / 5, 15);

    // Account age (max 10 points)
    const ageYears = (new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24 * 365);
    score += Math.min(ageYears * 2, 10);

    // Bio & company bonus (5 points)
    if (user.bio) score += 2.5;
    if (user.company) score += 2.5;

    score = Math.round(score);

    let level;
    if (score >= 80) level = 'Legendary';
    else if (score >= 60) level = 'Master';
    else if (score >= 40) level = 'Expert';
    else if (score >= 25) level = 'Adventurer';
    else if (score >= 10) level = 'Explorer';
    else level = 'Novice';

    return { score, level };
}

/**
 * Calculate universal rank percentile
 */
function calculateUniversalRank(followers, totalStars, totalCommits = 0) {
    const combined = followers + totalStars + (totalCommits / 10);

    if (combined >= 10000) return 'Top 1%';
    if (combined >= 1000) return 'Top 5%';
    if (combined >= 500) return 'Top 10%';
    if (combined >= 100) return 'Top 20%';
    if (combined >= 50) return 'Top 30%';
    if (combined >= 20) return 'Top 40%';
    if (combined >= 10) return 'Top 50%';
    return 'Top 60%';
}
