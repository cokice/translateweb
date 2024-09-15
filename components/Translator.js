// components/Translator.js

import { useState } from 'react';
import styles from '../styles/Translator.module.css';
import languages from '../utils/languages';
import { createParser } from 'eventsource-parser';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export default function Translator() {
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState('auto');
    const [targetLang, setTargetLang] = useState('zh');
    const [isTranslating, setIsTranslating] = useState(false);

    const handleTranslate = async () => {
        if (!inputText.trim()) {
            alert('请输入要翻译的文本');
            return;
        }

        setTranslatedText('');
        setIsTranslating(true);

        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inputText, sourceLang, targetLang }),
        });

        if (!response.ok) {
            setIsTranslating(false);
            setTranslatedText('翻译失败，请稍后重试');
            return;
        }

        if (!response.body) {
            setIsTranslating(false);
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let done = false;

        let result = '';
        const parser = createParser((event) => {
            if (event.type === 'event') {
                if (event.data === '[DONE]') {
                    setIsTranslating(false);
                    return;
                } else {
                    const data = event.data;
                    result += data;
                    setTranslatedText(result);
                }
            }
        });

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value, { stream: true });
            parser.feed(chunkValue);
        }
    };

    const swapLanguagesAndContent = () => {
        // 交换源语言和目标语言
        const tempLang = sourceLang;
        setSourceLang(targetLang);
        setTargetLang(tempLang);

        // 交换输入文本和翻译文本
        setInputText(translatedText);
        setTranslatedText(inputText);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(translatedText).then(() => {
            alert('翻译结果已复制到剪贴板');
        });
    };

    return (
        <div className={styles.container}>
            {/* 顶部标题 */}
            <header className={styles.header}>
                <h1 className={styles.title}>翻译</h1>
            </header>

            {/* 语言选择 */}
            <div className={styles.languageSelection}>
                <div>
                    <label>
                        源语言：
                        <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
                            {languages.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <button
                    className={styles.swapButton}
                    onClick={swapLanguagesAndContent}
                    disabled={isTranslating}
                    aria-label="交换语言和内容"
                >
                    ⇄
                </button>
                <div>
                    <label>
                        目标语言：
                        <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
                            {languages
                                .filter((lang) => lang.code !== 'auto') // 移除自动检测选项
                                .map((lang) => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.name}
                                    </option>
                                ))}
                        </select>
                    </label>
                </div>
            </div>

            {/* 文本框区域 */}
            <div className={styles.textAreas}>
                <textarea
                    className={styles.textArea}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="请输入文本"
                    disabled={isTranslating}
                    style={{ whiteSpace: 'pre-wrap' }}
                />
                <div className={`${styles.textArea} ${styles.outputArea}`}>
                    <div className={styles.outputHeader}>
                        <button className={styles.copyButton} onClick={copyToClipboard}>
                            复制
                        </button>
                    </div>
                    <div className={styles.outputContent}>
                        <ReactMarkdown
                            rehypePlugins={[rehypeRaw]}
                            components={{
                                // 自定义光标的渲染
                                cursor: ({ node, ...props }) => (
                                    <span className={styles.cursor}></span>
                                ),
                            }}
                        >
                            {translatedText + (isTranslating ? '<cursor></cursor>' : '')}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>

            {/* 翻译按钮 */}
            <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={handleTranslate} disabled={isTranslating}>
                    {isTranslating ? '翻译中...' : '翻译'}
                </button>
            </div>
        </div>
    );
}
