import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

const FREQUENCY_SIZE = 32;

let audioContext: AudioContext;
let gainNode: GainNode;
let analyserNode: AnalyserNode;

const useAudio = () => {
    const [audioFrequencyData, setAudioFrequencyData] = useState<Uint8Array>(new Uint8Array(FREQUENCY_SIZE / 2));
    const audioFrequencyIntervalId = useRef<NodeJS.Timer>();
    const [audio, setAudio] = useState<AudioBufferSourceNode>();
    const [isAllowedToPlay, setIsAllowedToPlay] = useState(audioContext !== undefined);

    const initializeAudioNodes = () => {
        audioContext = new AudioContext();

        gainNode = new GainNode(audioContext);
        gainNode.gain.value = 0.1;

        analyserNode = new AnalyserNode(audioContext);
        analyserNode.fftSize = FREQUENCY_SIZE;
        setIsAllowedToPlay(true);
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

    const play = async (audioUrl: string, duration?: number, onStart?: () => void) => {
        if (!isAllowedToPlay) {
            return;
        }

        const { data: audioBufferData } = await axios.get(audioUrl, { responseType: 'arraybuffer' });
        const audioBufferSource = audioContext.createBufferSource();
        audioBufferSource.buffer = await audioContext.decodeAudioData(audioBufferData);

        audioBufferSource.connect(gainNode).connect(analyserNode).connect(audioContext.destination);
        audioBufferSource.start(0, 0, duration);
        if (onStart) {
            onStart();
        }
        setAudio(audioBufferSource);
        startAnalyzingAudioFrequency();
    };

    const stop = () => {
        audio?.stop();
        stopAnalyzingAudioFrequency();
    };

    useEffect(() => {
        return () => stopAnalyzingAudioFrequency();
    }, []);

    return {
        play,
        stop,
        audioFrequencyData,
        initializeAudioNodes,
        isAllowedToPlay,
    };
};

export default useAudio;
