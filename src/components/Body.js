import styles from "./Body.module.css";
import Header from "./body_components/Header";
import WeatherToday from "./body_components/WeatherToday";
import Rating from "./body_components/Rating";

function Body({ weather }) {
    return (
        <div className={styles.body}>
            <Header weather={weather} />
            <WeatherToday weather={weather} />
            <>Rating weather={weather}</>
        </div>
    );
}

export default Body;
