import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

let audioContext: AudioContext;
let gainNode: GainNode;
let analyserNode: AnalyserNode;

const useAudio = () => {
    const [audio, setAudio] = useState<AudioBufferSourceNode>();
    const [audioFrequencyData, setAudioFrequencyData] = useState<Uint8Array>(new Uint8Array());
    const audioFrequencyIntervalId = useRef<NodeJS.Timer>();

    const initializeAudioNodes = () => {
        audioContext = new AudioContext();

        gainNode = new GainNode(audioContext);
        gainNode.gain.value = 0.01;

        analyserNode = new AnalyserNode(audioContext);
        analyserNode.fftSize = 32;
    };

    const startAnalyzingAudioFrequency = () => {
        audioFrequencyIntervalId.current = setInterval(() => {
            const frequencyData = new Uint8Array(analyserNode.frequencyBinCount);
            analyserNode.getByteFrequencyData(frequencyData);
            setAudioFrequencyData(frequencyData);
        }, 1000);
    };

    const stopAnalyzingAudioFrequency = () => {
        if (audioFrequencyIntervalId.current) {
            clearInterval(audioFrequencyIntervalId.current);
        }
    };

    const play = async (audioUrl: string) => {
        if (!audioContext) {
            initializeAudioNodes();
        }

        const { data: audioBufferData } = await axios.get(audioUrl, { responseType: 'arraybuffer' });
        const audioBufferSource = audioContext.createBufferSource();
        audioBufferSource.buffer = await audioContext.decodeAudioData(audioBufferData);

        audioBufferSource.connect(gainNode).connect(analyserNode).connect(audioContext.destination);
        audioBufferSource.start();
        setAudio(audioBufferSource);
        startAnalyzingAudioFrequency();
    };

    const stop = () => {
        audio?.stop();
        stopAnalyzingAudioFrequency();
    };

    useEffect(() => {
        if (audio) {
            audio.addEventListener('ended', stop);
        }

        return () => {
            audio?.removeEventListener('ended', stop);
            stopAnalyzingAudioFrequency();
        };
    }, [audio]);

    return {
        play,
        stop,
        audioFrequencyData,
    };
};

export default useAudio;
