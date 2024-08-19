import axios from 'axios'

const forecastendpoint = params => `https://api.weatherapi.com/v1/forecast.json?key=2d3b3d4d4bd44cf0bb1164558241908&q=${params.cityName}&days=1&aqi=no&alerts=no`


const apiCall = async (endpoint) => {
    const options = {
        method: 'GET',
        url: endpoint
    }
    try {
        const response = await axios.request(options)
        return response.data
    } catch (err) {
        console.log('err', err)
        return null
    }
}
export const fetchWeatherForecast = params => {
    let forecastUrl = forecastendpoint(params)
    return apiCall(forecastUrl)
}