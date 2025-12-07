import React, { useState, useEffect, useCallback } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import BrowserOnly from '@docusaurus/BrowserOnly';

// Helper to get the main content area of the Docusaurus page
const getMainContent = () => {
    return document.querySelector('article');
};

const LANGUAGES = ["Urdu", "Sindhi", "Pashto", "Balochi",'English','Arabic','Chinese','Franche']; // Define the languages for the dropdown

const LanguageSelector = () => {
    const [isTranslated, setIsTranslated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [originalContent, setOriginalContent] = useState<HTMLElement | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string>(LANGUAGES[0]);

    const { siteConfig } = useDocusaurusContext();
    const pythonBackendUrl = siteConfig.customFields.pythonBackendUrl as string | undefined;

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = event.target.value;
        setSelectedLanguage(newLanguage);

        // If already translated, re-translate to the new language
        if (isTranslated) {
            handleTranslate(newLanguage);
        }
    };
    
    const handleTranslate = useCallback(async (language: string = selectedLanguage) => {
        const contentElement = getMainContent();
        if (!contentElement) {
            setError("Could not find the main content to translate.");
            return;
        }

        // Always start from original content for accurate translation
        if (originalContent) {
            contentElement.innerHTML = originalContent.innerHTML;
        } else {
            setOriginalContent(contentElement.cloneNode(true) as HTMLElement); // Save original content if not already saved
        }

        setIsLoading(true);
        setError(null);
        
        const textToTranslate = contentElement.innerText;
        const translateApiUrl = 'https://abdullahcoder54-hackaton1-book-chatbot.hf.space/api/translate';

        if (!translateApiUrl) {
            setError("Translation service is not configured.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(translateApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textToTranslate, target_language: language }),
            });

            if (!response.ok) {
                throw new Error(`Translation failed: ${await response.text()}`);
            }

            const data = await response.json();
            
            // Replace content and add RTL styling for these specific languages
            contentElement.innerHTML = `<div dir="rtl" style="font-family: 'Noto Nastaliq Urdu', sans-serif; font-size: 1.2rem; line-height: 2;">${data.translated_text.replace(/\n/g, '<br />')}</div>`;
            setIsTranslated(true);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [originalContent, pythonBackendUrl, selectedLanguage]);

    const revertToOriginal = () => {
        const contentElement = getMainContent();
        if (originalContent && contentElement) {
            contentElement.innerHTML = originalContent.innerHTML;
        }
        setIsTranslated(false);
        setOriginalContent(null);
        setError(null);
    };
    
    // Add Google Font for Urdu/Sindhi etc. to the document head
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }, []);

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                disabled={isLoading}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc' }}
            >
                {LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                ))}
            </select>
            <button
                className="translate-button"
                onClick={() => isTranslated ? revertToOriginal() : handleTranslate()}
                disabled={isLoading}
                title={isTranslated ? "Show original English text" : `Translate this chapter to ${selectedLanguage}`}
            >
                {isLoading ? "Translating..." : (isTranslated ? "Show English" : "Translate")}
            </button>
            {error && <span style={{color: 'red'}}>{error}</span>}
        </div>
    );
};

// Use BrowserOnly to ensure this component only renders on the client
export default function TranslateButtonBrowserWrapper(): JSX.Element {
    return (
        <BrowserOnly fallback={<div>...</div>}>
            {() => <LanguageSelector />}
        </BrowserOnly>
    );
}