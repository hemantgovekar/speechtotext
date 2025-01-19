import React, { useState } from "react";
import '../App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const lang = [{ 'English': 'en-US' }, { 'Hindi': 'hi-IN' }, { 'Marathi': 'mr-IN' }, { 'Tamil': 'ta-IN' }, { 'Telugu': 'te-IN' }, { 'Bengali': 'bn-IN' }, { 'Gujarati': 'gu-IN' }, { 'Kannada': 'kn-IN' }, { 'Malayalam': 'ml-IN' }, { 'Punjabi': 'pa-IN' }, { 'Urdu': 'ur-IN' }];

export const SpeechToText = () => {
    const rowHeight = 20;
    const [text, setText] = React.useState('');
    const [translatedText, setTranslatedText] = React.useState('');
    const [setshowHideButton, setSetshowHideButton] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en-US');
    const [convertToLanguage, setConvertToLanguage] = useState('en-US');

    const sr = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;

    const [spRec] = useState(new sr());

    const getLanguageName = (code: string) => {
        for (let i = 0; i < lang.length; i++) {
            if (Object.values(lang[i])[0] === code) { return Object.keys(lang[i])[0]; }
        }
        return 'Language not found';
    };

    const handleStop = (): void => {
        setSetshowHideButton(false);
        spRec?.stop();
    }

    const handleSpeak = (): void => {
        setSetshowHideButton(true);

        spRec.continuous = true;
        spRec.interimResults = true;
        spRec.lang = selectedLanguage || 'en-US';

        spRec.start();
        spRec.onresult = (res: any) => {
            setText(Array.from(res.results)
                .map((result: any) => result[0])
                .map(txt => txt.transcript)
                .join(''));
        };
    }

    const handleLanguageChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedLanguage(event.target.value);
        handleStop();
        setText('');
    };

    const handleConvertLanguage = async (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setConvertToLanguage(event.target.value);
    }

    const langTranslate = async (text: string, convertToLanguage: string) => {
        let encodedText = encodeURI(text);
        console.log("encoded Text", encodedText);
        try {
            const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${selectedLanguage.substring(0, 2)}|${convertToLanguage.substring(0, 2)}`;
            console.log("text", encodedText);
            const res = await fetch(url,
                {
                    method: "GET",
                });
            const response = await res.json();
            setTranslatedText(response.responseData.translatedText);
        } catch (error) {
            alert(error);
        }
    }

    const handleCopy = (txtbox: string) => {
        if (txtbox === "text") {
            if (text.length < 1) {
                alert('Text is empty!');
                return;
            }
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea); textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Text copied to clipboard!');
        }
        else {
            if (translatedText.length < 1) {
                alert('Text is empty!');
                return;
            }
            const textarea = document.createElement('textarea');
            textarea.value = translatedText;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Text copied to clipboard!');
        }
    };

    const clearTextArea = (txtbox: string) => {
        if (txtbox === "text") {
            setText('');
            handleStop();
        } else {
            setTranslatedText('');
        }
    }

    const readTextArea = (txtbox: string) => {
        if (txtbox === "text") {
            const speech = new SpeechSynthesisUtterance(text);
            speech.lang = selectedLanguage;
            speechSynthesis.speak(speech);
        }
        else {
            const speech = new SpeechSynthesisUtterance(translatedText);
            speech.lang = convertToLanguage;
            speechSynthesis.speak(speech);
        }
    }

    return (
        <>
            <div className="header">
                <h2>Speech To Text</h2>
            </div>
            <hr />
            <div className="container">

                <div className="card">Select a language :&nbsp;
                    <select onChange={handleLanguageChange} >
                        {lang.map((item, index) => {
                            return <option key={index} value={Object.values(item)[0]}>
                                {Object.keys(item)[0]}
                            </option>
                        })}
                    </select>
                    {!setshowHideButton ?
                        <button type='submit' className="icon-button" onClick={handleSpeak}> <i className="fas fa-microphone"></i> Start</button> :
                        <button type='button' className="icon-button" onClick={handleStop}><i className="fas fa-stop"></i> Stop</button>}
                </div>

                <div className="textarea_card_container">
                    <div className="textarea_card">
                        <div style={{ paddingLeft: "10px", fontWeight: "bold" }}>
                            {getLanguageName(selectedLanguage)} &nbsp;
                            &nbsp;
                            <span role="img" title="Clear" aria-label="Clear" style={{ cursor: 'pointer', fontSize: '25px', color: 'grey' }} onClick={() => clearTextArea("text")}>
                                <button type='button' className="icon-button" ><i className="fas fa-eraser"></i> Clear</button>
                            </span>
                            &nbsp;
                            <span role="img" title="Read" aria-label="Read" style={{ cursor: 'pointer', fontSize: '25px', color: 'grey' }} onClick={() => readTextArea("text")}>
                                <button type='button' className="icon-button" ><i className="fas fa-volume-up"></i> Read</button>
                            </span>
                            &nbsp;
                            {
                                (text.length > 1) ? <span role="img" title="Copy" aria-label="Copy" style={{ cursor: 'pointer', fontSize: '25px', color: 'grey' }} onClick={() => handleCopy("text")}>
                                    <button type='button' className="icon-button" ><i className="fas fa-copy">  </i> Copy</button>
                                </span> : ""
                            }
                        </div>
                        <div>
                            <textarea rows={rowHeight} value={text} />
                        </div>
                    </div>
                    {/* Translate Box */}
                    <div className="translate_container">
                        <select onChange={handleConvertLanguage} >
                            {lang.map((item, index) => {
                                return <option key={index} value={Object.values(item)[0]}>
                                    {Object.keys(item)[0]}
                                </option>
                            })}
                        </select>
                        <button
                            type='submit'
                            style={{ width: '100px' }}
                            onClick={() => langTranslate(text, convertToLanguage)}>
                            <i className="fas fa-language"></i>Translate
                        </button>
                    </div>
                    <div className="convert_btn" >
                        <div style={{ paddingLeft: "10px", fontWeight: "bold" }}>
                            {getLanguageName(convertToLanguage)} &nbsp;
                            &nbsp;
                            <span role="img" title="Clear" aria-label="Clear" style={{ cursor: 'pointer', fontSize: '25px', color: 'grey' }} onClick={() => clearTextArea("translate")}>
                                <button type='button' className="icon-button" ><i className="fas fa-eraser"></i> Clear</button>
                            </span>
                            &nbsp;
                            <span role="img" title="Read" aria-label="Read" style={{ cursor: 'pointer', fontSize: '25px', color: 'grey' }} onClick={() => readTextArea("translate")}>
                                <button type='button' className="icon-button" ><i className="fas fa-volume-up"></i> Read</button>
                            </span>
                            &nbsp;
                            {
                                (translatedText.length > 1) ? <span role="img" title="Copy" aria-label="Copy" style={{ cursor: 'pointer', fontSize: '25px', color: 'grey' }} onClick={() => handleCopy("translate")}>
                                    <button type='button' className="icon-button" ><i className="fas fa-copy">  </i> Copy</button>
                                </span> : ""
                            }
                            <textarea rows={rowHeight} value={translatedText} />
                        </div>
                    </div>

                </div>
            </div>

        </>
    )
}
