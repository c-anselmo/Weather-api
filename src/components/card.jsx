import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./card.css";
const apiKey = import.meta.env.VITE_API_KEY;
import clearSkyDay from "../assets/clearskyday.gif";
import clearSkyNight from "../assets/clearskynight.gif";
import rain from "../assets/rain.gif";
import clouds from "../assets/cloud.gif";
import snowy from "../assets/snow.gif";

function Teste() {
    const [info, setInfo] = useState(null);
    const [cidade, setCidade] = useState('');
    const [horaLocal, setHoraLocal] = useState('');
    const [timezoneOffset, setTimezoneOffset] = useState(0);
    const [backgroundImage, setBackgroundImage] = useState(`url(${clearSkyDay})`);
    const [error, setError] = useState(false);
    const [welcomeScreen, setWelcomeScreen] = useState(true);
    const [loading, setLoading] = useState(false);

    const getWeather = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&lang=pt_br&appid=${apiKey}`);
            const data = response.data;
            setInfo(data);
            setTimezoneOffset(data.timezone);
            updateBackgroundImage(data.weather[0].icon);
            setError(false);
            setWelcomeScreen(false);
        } catch (error) {
            console.log("Erro ao buscar a cidade:", error);
            setError(true); 
            setWelcomeScreen(false);
        } finally {
            setLoading(false);
        }
    };

    const updateBackgroundImage = (icon) => {
        switch (icon) {
            case '01d':
                setBackgroundImage(`url(${clearSkyDay})`);
                break;
            case '01n':
                setBackgroundImage(`url(${clearSkyNight})`);
                break;
            case '02d':
            case '03d':
            case '04d':
            case '02n':
            case '03n':
            case '04n':
            case '50d':
            case '50n':
                setBackgroundImage(`url(${clouds})`);
                break;
            case '09d':
            case '09n':
            case '10d':
            case '10n':
            case '11d':
            case '11n':
                setBackgroundImage(`url(${rain})`);
                break;
            case '13d':
            case '13n':
                setBackgroundImage(`url(${snowy})`);
                break;
            default:
                setBackgroundImage(`url(${clearSkyDay})`);
                break;
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (timezoneOffset !== 0) {
                const currentTime = new Date();
                const utcTime = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
                const localTime = new Date(utcTime + timezoneOffset * 1000);
                setHoraLocal(localTime.toLocaleTimeString());
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timezoneOffset]);

    const handleInputChange = (e) => {
        setCidade(e.target.value);
    };

    const handleSearch = () => {
        if (cidade) {
            getWeather();
        }
    };

    const busca = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className='bg' style={{backgroundImage}}>
            <div className='card'>
                <div className='searchbar'>
                    <input type="text" onChange={handleInputChange} onKeyUp={busca} placeholder='insira uma cidade' />
                    <button onClick={handleSearch}><img className='icon-lupa' src="https://cdn-icons-png.flaticon.com/512/64/64673.png" alt="" /></button>
                </div>

                {welcomeScreen ? (
                    <div className='card2'>
                        <h1>Bem-vindo! Insira uma cidade para começar.</h1>
                    </div>
                ) : loading ? (
                    <div className='card2'>
                        <h1>Carregando...</h1>
                        <img src="https://i.imgur.com/llF5iyg.gif" alt="Carregando" />
                    </div>
                ) : error ? (
                    <div className='card2'>
                        <h1>CIDADE NÃO ENCONTRADA</h1>
                    </div>
                ) : info ? (
                    <div className='card2'>
                        <h1>{info.name} <img src={`https://flagsapi.com/${info.sys.country}/flat/64.png`} alt="" /></h1>
                        <h1>{(info.main.temp - 273.15).toFixed(1)}°C</h1>
                        <p>Sensação: {(info.main.feels_like - 273.15).toFixed(1)}°C</p>
                        <p>{(info.main.temp_min - 273.15).toFixed(1)}°C / {(info.main.temp_max - 273.15).toFixed(1)}°C</p>
                        <p>{info.weather[0].description}<img src={`http://openweathermap.org/img/wn/${info.weather[0].icon}.png`} alt="" /></p>
                        <p>{horaLocal}</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default Card;
