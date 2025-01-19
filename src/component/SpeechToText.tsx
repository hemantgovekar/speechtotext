import React, { useState } from "react";
import '../App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const lang = [{ 'English': 'en-US' }, { 'Hindi': 'hi-IN' }, { 'Marathi': 'mr-IN' }, { 'Tamil': 'ta-IN' }, { 'Telugu': 'te-IN' }, { 'Bengali': 'bn-IN' }, { 'Gujarati': 'gu-IN' }, { 'Kannada': 'kn-IN' }, { 'Malayalam': 'ml-IN' }, { 'Punjabi': 'pa-IN' }, { 'Urdu': 'ur-IN' }];

export const SpeechToText = () => {
    const [text, setText] = React.useState('');
    const [setshowHideButton, setSetshowHideButton] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en-US');
    const [, setconvertToLanguage] = useState('en-US');

    const sr = window.SpeechRecognition || window.webkitSpeechRecognition;

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

    // const handleConvertLanguage = async (event: { target: { value: React.SetStateAction<string>; }; }) => {
    //     setconvertToLanguage(event.target.value);
    // }

    const langTranslate = async (text: string) => {
        let encodedText = encodeURI(text);
        console.log("encoded Text", encodedText);
        try {
            const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|hi`;
            console.log("text", encodedText);
            const res = await fetch(url,
                {
                    method: "GET",
                });
            const response = await res.json();
            setconvertToLanguage(response.responseData.translatedText);
        } catch (error) {
        }
    }

    const handleCopy = () => {
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
    };

    const clearTextArea = () => {
        setText('');
        handleStop();
    }

    return (
        <>
            <div className="header">
                <h2>Speech To Text</h2>
            </div>
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

                <div className="textarea_card">
                    <div>
                        <div style={{ paddingLeft: "10px", fontWeight: "bold" }}>
                            {getLanguageName(selectedLanguage)} &nbsp;
                            <span role="img" title="Copy" aria-label="Copy" style={{ cursor: 'pointer', fontSize: '25px', color: 'grey' }} onClick={handleCopy}>
                                <button type='button' className="icon-button" onClick={handleCopy}><i className="fas fa-copy">  </i> Copy</button>
                            </span>
                            &nbsp;
                            <span role="img" title="Clear" aria-label="Clear" style={{ cursor: 'pointer', fontSize: '25px', color: 'grey' }} onClick={clearTextArea}>
                                <button type='button' className="icon-button" onClick={clearTextArea}><i className="fas fa-eraser"></i> Clear</button>
                            </span>
                        </div>
                        <div>
                            <textarea rows={25} value={text} onChange={() => langTranslate(text)} />
                        </div>
                        <br />
                    </div>
                    {/* <div className="convert_btn" >
                    <select onChange={handleConvertLanguage} >
                        {lang.map((item, index) => {
                            return <option key={index} value={Object.values(item)[0]}>
                                {Object.keys(item)[0]}
                            </option>
                        })}
                    </select>
                    <br />
                    <button type='submit' style={{ width: '100px' }} onClick={() => langTranslate(text)}><i className="fas fa-language"></i> &nbsp;</button>
                </div>
                <div>
                    <h3>{getLanguageName(convertToLanguage)}</h3>
                    <textarea rows={10} value={convertToLanguage} style={{ width: '500px' }} />
                </div> */}
                </div>
            </div>

        </>
    )
}
