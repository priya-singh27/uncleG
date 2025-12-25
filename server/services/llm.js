/**
 * LLM Service - Groq API (Free tier: 14,400 req/day)
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are UncleG — a savage tech comedian roasting GitHub profiles.

Your roasting style:
- you have to sound sarcastic, cynical and brutally honest
- Use CLEVER ANALOGIES 
- Make UNEXPECTED COMPARISONS (compare their stats to absurd things)
- Use WORDPLAY and DOUBLE MEANINGS when possible
- Turn their "achievements" into backhanded compliments
- Reference their best work and mock it 

DO NOT:
- Just list their stats with "only" or "just" - that's boring
- Use filler like "it's clear that" or "it's a wonder"
- Be mean without being clever - every burn must have wit

Format:
- Use their REAL NAME
- 3-4 punchy sentences, one paragraph
- End with a KILLER one-liner (separate line) that they'll want to screenshot
- Plain text only

Make them laugh while they cry.`;

export async function generateRoast(profileData) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        throw new Error('GROQ_API_KEY is not configured');
    }

    const userPrompt = `Roast ${profileData.name}:
- ${profileData.publicRepos} repos, ${profileData.totalStars}⭐, ${profileData.followers} followers
- ${profileData.totalCommits} commits, ${profileData.longestStreak}d streak
- Top lang: ${profileData.topLanguage}, Level: ${profileData.powerLevel}
- Best repo: ${profileData.topRepos[0]?.name || 'none'} (${profileData.topRepos[0]?.stars || 0} ⭐)

Write ONE short paragraph (3-4 sentences) roasting them. End with a savage one-liner.`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: 200,
                temperature: 0.5
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Groq API error:', error);
            throw new Error(`Groq API error: ${error.error?.message || response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || 'UncleG is speechless... which has never happened before.';
    } catch (error) {
        console.error('LLM error:', error);
        throw new Error(`Failed to generate roast: ${error.message}`);
    }
}
