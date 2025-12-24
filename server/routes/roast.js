import express from 'express';
import { fetchGitHubProfile } from '../services/github.js';
import { generateRoast } from '../services/llm.js';

const router = express.Router();

router.post('/roast', async (req, res) => {
    try {
        const { username } = req.body;

        if (!username || typeof username !== 'string') {
            return res.status(400).json({ error: 'Username is required' });
        }

        const cleanUsername = username.trim().replace('@', '');
        if (!cleanUsername) {
            return res.status(400).json({ error: 'Invalid username' });
        }

        console.log(`🔥 Generating feedback for ${cleanUsername}...`);

        const profile = await fetchGitHubProfile(cleanUsername);
        const roast = await generateRoast(profile);

        console.log(`✅ Feedback generated for ${cleanUsername}`);

        res.json({
            success: true,
            username: cleanUsername,
            roast,
            profile: {
                name: profile.name,
                avatarUrl: profile.avatarUrl,
                bio: profile.bio,
                publicRepos: profile.publicRepos,
                followers: profile.followers,
                totalStars: profile.totalStars,
                totalCommits: profile.totalCommits,
                totalContributions: profile.totalContributions,
                longestStreak: profile.longestStreak,
                mostActiveDay: profile.mostActiveDay,
                topLanguage: profile.topLanguage,
                powerLevel: profile.powerLevel,
                universalRank: profile.universalRank
            }
        });

    } catch (error) {
        console.error('Error:', error.message);
        const status = error.message.includes('not found') ? 404 : 500;
        res.status(status).json({ success: false, error: error.message });
    }
});

export default router;
