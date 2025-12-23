
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SYSTEM_PROMPT = `You are UncleG, a witty code reviewer who roasts GitHub profiles.

Rules:
- Use their actual name (never "nephew" or "niece")
- Be sarcastic and clever
- Keep it SHORT: 3-4 sentences max, one paragraph
- End with a one-liner burn
- Focus on the most roast-worthy stat (low stars, abandoned repos, etc.)

Be brutal but brief. Quality over quantity.`;

export async function generateRoast(profileData) {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey || apiKey.includes('your_openrouter')) {
        throw new Error('OPENROUTER_API_KEY is not configured');
    }

    const userPrompt = `Roast ${profileData.name}:
- ${profileData.publicRepos} repos, ${profileData.totalStars}⭐, ${profileData.followers} followers
- ${profileData.totalCommits} commits, ${profileData.longestStreak}d streak
- Top lang: ${profileData.topLanguage}, Level: ${profileData.powerLevel}
- Best repo: ${profileData.topRepos[0]?.name || 'none'} (${profileData.topRepos[0]?.stars || 0} ⭐)

Write ONE short paragraph (4-5 sentences) roasting them.

End with a savage one-liner on its own line.`;

    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://uncleg.dev',
                'X-Title': 'UncleG'
            },
            body: JSON.stringify({
                model: 'qwen/qwen-2.5-72b-instruct',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: 200,
                temperature: 0.9
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenRouter API error: ${error.error?.message || response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || 'UncleG is speechless... which has never happened before.';
    } catch (error) {
        throw new Error(`Failed to generate roast: ${error.message}`);
    }
}
