import React, { useState } from "react";
import '../App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const lang = [{ 'English': 'en-US' }, { 'Hindi': 'hi-IN' }, { 'Marathi': 'mr-IN' }, { 'Tamil': 'ta-IN' }, { 'Telugu': 'te-IN' }, { 'Bengali': 'bn-IN' }, { 'Gujarati': 'gu-IN' }, { 'Kannada': 'kn-IN' }, { 'Malayalam': 'ml-IN' }, { 'Punjabi': 'pa-IN' }, { 'Urdu': 'ur-IN' }];

export const SpeechToText = () => {
    const [text, setText] = React.useState('');
    const [setshowHideButton, setSetshowHideButton] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en-US');
    const [convertToLanguage, setconvertToLanguage] = useState('en-US');

    const [spokenText, setSpokenText] = useState([]);
    const sr = window.speechRecognition || window.webkitSpeechRecognition;

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
        // spRec.lang = 'en-US';

        spRec.start();
        spRec.onresult = (res: any) => {
            setSpokenText(prevText => [...prevText, res.results[0][0].transcript]);
            setText(Array.from(res.results)
                .map((result: any) => result[0])
                .map(txt => txt.transcript)
                .join(''));
            console.log(text);
            console.log("spokenText", spokenText);
        };
    }

    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
        handleStop();
        setText('');
    };

    const handleConvertLanguage = async (event) => {
        setconvertToLanguage(event.target.value);


    }

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
            // console.log(response.responseData.translatedText);
        } catch (error) {
        }
    }

    const handleCopy = () => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea); textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Text copied to clipboard!');
    };

    return (
        <>
            <h1>Speech To Text</h1>
            <hr />
            <div className="card">Select a language :&nbsp;
                <select onChange={handleLanguageChange} >
                    {lang.map((item, index) => {
                        return <option key={index} value={Object.values(item)[0]}>
                            {Object.keys(item)[0]}
                        </option>
                    })}
                </select>
                {!setshowHideButton ?
                    <button type='submit' onClick={handleSpeak}> <i className="fas fa-microphone"></i></button> :
                    <button type='button' onClick={handleStop}><i className="fas fa-stop"></i></button>}
            </div>
            <br />
            <div className="textarea_card">
                <div>
                    <h3>{getLanguageName(selectedLanguage)}</h3>
                    <textarea rows={10} value={text} style={{ width: '500px' }} onChange={() => langTranslate(text)} />
                    <br />
                    <i className="fas fa-copy" aria-label="Copy" style={{ cursor: 'pointer', fontSize: '25px', color: 'grey' }} onClick={handleCopy}></i>
                </div>
                <div className="convert_btn" >
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
                </div>
            </div>
            <br />
        </>
    )
}
