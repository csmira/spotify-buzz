import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

const FREQUENCY_SIZE = 32;

let audioContext: AudioContext;
let gainNode: GainNode;
let analyserNode: AnalyserNode;

const useAudio = () => {
    const [audio, setAudio] = useState<AudioBufferSourceNode>();
    const [audioFrequencyData, setAudioFrequencyData] = useState<Uint8Array>(new Uint8Array(FREQUENCY_SIZE / 2));
    const audioFrequencyIntervalId = useRef<NodeJS.Timer>();

    const initializeAudioNodes = () => {
        audioContext = new AudioContext();

        gainNode = new GainNode(audioContext);
        gainNode.gain.value = 0.01;

        analyserNode = new AnalyserNode(audioContext);
        analyserNode.fftSize = FREQUENCY_SIZE;
    };

    const startAnalyzingAudioFrequency = () => {
        audioFrequencyIntervalId.current = setInterval(() => {
            const frequencyData = new Uint8Array(FREQUENCY_SIZE / 2);
            analyserNode.getByteFrequencyData(frequencyData);
            setAudioFrequencyData(frequencyData);
        }, 150);
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
        };
    }, [audio]);

    useEffect(() => {
        return () => stopAnalyzingAudioFrequency();
    }, []);

    return {
        play,
        stop,
        audioFrequencyData,
    };
};

export default useAudio;
