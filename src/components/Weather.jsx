import './weather.css'
import { useEffect, useState } from 'react';
import { FaSearch, FaArrowDown, FaArrowUp, FaWind, FaWater, FaTachometerAlt, FaMountain, FaThermometerHalf, FaEye } from "react-icons/fa";
import { GiWaterDrop } from 'react-icons/gi';
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { citySearch, forecast } from '../redux/slices/weatherSlice';

const Weather = () => {

    // Import the useDispatch hook to dispatch actions
    const dispatch = useDispatch();

    // Default city for initial load
    const defaultCity = 'Lebanon';

    // State for the city input and unit selection
    const [city, setCity] = useState(defaultCity);
    const [unit, setUnit] = useState("metric"); // C: metric, F: imperial

    // Use the useSelector hook to access the Redux store state values 
    const {
        citySearchLoading,
        citySearchData,
        citySearchError,
        forecastLoading,
        forecastData,
        forecastError,
    } = useSelector((state) => state.weather); // Access the weather slice

    // Combined loading state for both city search and forecast
    const isLoading = citySearchLoading || forecastLoading;

    // Combined error state for both city search and forecast
    const error = citySearchError || forecastError;

    // Fetch weather data for the default city on initial load
    useEffect(() => {
        // Fetch weather data for the default city
        dispatch(citySearch({ city: defaultCity, unit }));
        // Fetch forecast data for the default city
        dispatch(forecast({ city: defaultCity, unit }));
    }, [dispatch, unit]); // Add unit as a dependency to fetch data when the unit changes

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission
        // Fetch weather data for the city entered in the input field
        if (city) {
            // Dispatch the city search action
            dispatch(citySearch({ city, unit }));
            // Dispatch the forecast action
            dispatch(forecast({ city, unit }));
        }
    };

    // Function to display a toast message for invalid city names
    const handleTestToast = (errorMessage) => {
        toast.error(`Error: ${errorMessage}, Please enter a valid city name`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
        });
    };

    useEffect(() => {
        if (error) {
            handleTestToast(error); // Call the toast function when there is an error
        }
    }, [error]);

    // Render the UI
    return (
        <>
            <ToastContainer />
            <main>
                <section className="head">
                    <form onSubmit={handleSubmit}>
                        <div className="search">
                            <input
                                type="text"
                                placeholder="Enter city name"
                                value={city}
                                onChange={(e) => setCity(e.target.value)} />
                            <button type="submit">
                                <FaSearch className='icon' />
                            </button>
                        </div>
                        <div className='unit'>
                            <label>
                                <input
                                    type="radio"
                                    value="metric"
                                    checked={unit === "metric"}
                                    onChange={() => setUnit("metric")} />
                                °C
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="imperial"
                                    checked={unit === "imperial"}
                                    onChange={() => setUnit("imperial")} />
                                °F
                            </label>
                        </div>
                    </form>
                </section>

                <section className="content">
                    {/* Display Loading Message */}
                    {isLoading &&
                        <ClipLoader
                            color={"#2171d0"}
                            loading={isLoading}
                            size={100}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                            className='loader'
                        />
                    }


                    {/* Conditional Rendering */}
                    {!isLoading && !error && citySearchData && forecastData && (
                        <>
                            {/* City Search Data */}
                            <div className="city-weather">
                                <div className='general'>
                                    <h2 className='title'>Current Weather in {citySearchData.name} <FaThermometerHalf /></h2>
                                    <p className='temp'>Temperature: {citySearchData.main.temp}°{unit === "metric" ? "C" : "F"}</p>
                                    <p>Feels like: {citySearchData.main.feels_like}°{unit === "metric" ? "C" : "F"}</p>
                                    <div className="min-max">
                                        <p><FaArrowDown className='icon' />{citySearchData.main.temp_min}°{unit === "metric" ? "C" : "F"}</p>
                                        <p><FaArrowUp className='icon' />{citySearchData.main.temp_max}°{unit === "metric" ? "C" : "F"}</p>
                                    </div>
                                    <div className="condition">
                                        <img
                                            src={`http://openweathermap.org/img/wn/${citySearchData.weather[0].icon}@2x.png`}
                                            alt={citySearchData.weather[0].description}
                                        />
                                        <p>Condition: {citySearchData.weather[0].description}</p>
                                    </div>

                                </div>

                                <div className='details'>
                                    <div className="rows">
                                        <p className='row'>
                                            <FaWind className='icon' />
                                            Wind: {citySearchData.wind.speed} m/s
                                        </p>
                                        <p className='row'>
                                            <GiWaterDrop className='icon' />
                                            Humidity: {citySearchData.main.humidity}%
                                        </p>
                                        <p className='row'>
                                            <FaTachometerAlt className='icon' />
                                            Pressure: {citySearchData.main.pressure} hPa
                                        </p>
                                        <p className='row'>
                                            <FaWater className='icon' />
                                            Sea Level: {citySearchData.main.sea_level} hPa
                                        </p>
                                        <p className='row'>
                                            <FaMountain className='icon' />
                                            Ground Level: {citySearchData.main.grnd_level} hPa
                                        </p>
                                        <p className='row'>
                                            <FaEye className='icon' />
                                            Visibility: {citySearchData.visibility} m
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Forecast Data */}
                            <div className='forecast-weather'>
                                <h2>Weather Forecast</h2>
                                <div className="boxes">
                                    {forecastData.list.slice(0, 6).map((item, index) => (
                                        <div className='box' key={index}>
                                            {/* Forecast Weather Icon */}
                                            <img
                                                src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                                                alt={item.weather[0].description}
                                            />
                                            <p>
                                                {new Date(item.dt_txt).toLocaleString()}
                                            </p>
                                            <p>
                                                {item.main.temp}°{unit === "metric" ? "C" : "F"}
                                            </p>
                                            <p>
                                                {item.weather[0].description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                </section>
            </main>
        </>
    );
};

// Export the Weather component
export default Weather