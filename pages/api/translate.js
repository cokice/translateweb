// pages/api/translate.js

import OpenAI from 'openai';
import languages from '../../utils/languages';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: '仅支持 POST 方法' });
        return;
    }

    const { inputText, sourceLang, targetLang } = req.body;

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_API_URL,
    });

    const getLanguageName = (code) => {
        const lang = languages.find((lang) => lang.code === code);
        return lang ? lang.name : code;
    };

    const messages = [
        {
            role: 'system',
            content: `从现在开始你是一个专业的翻译助手。请将用户提供的文本从${
                sourceLang === 'auto' ? '自动检测的语言' : getLanguageName(sourceLang)
            }翻译成${getLanguageName(targetLang)}。请保留原文本的格式，不要添加任何额外的说明，翻译的目标语言要符合当地人的习惯，地道，标准。也不要莫名奇妙翻译出其他语言出来，最多只可保留专有名词不翻译`,
        },
        { role: 'user', content: inputText },
    ];

    try {
        const completion = await openai.chat.completions.create({
            model: 'chatgpt-4o-latest',
            messages: messages,
            stream: true,
        });

        res.writeHead(200, {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
            'X-Accel-Buffering': 'no',
        });

        for await (const part of completion) {
            const content = part.choices[0]?.delta?.content || '';
            if (content) {
                res.write(`data: ${content}\n\n`);
                res.flush?.();
            }
        }
        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        console.error('请求错误：', error);
        res.status(500).json({ error: '服务器错误' });
    }
}
