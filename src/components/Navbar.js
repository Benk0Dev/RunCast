import { useState, useEffect, useRef } from "react";
import styles from "./Navbar.module.css";
import { Wind, Star, Zap, SunMoon, Sun, Moon, Menu } from "lucide-react";

function Navbar({ handleSearch, handleSearchInputChange, suggestions, mode, tempUnits, speedUnits, theme, handleModeChange, handleUnitsChange, handleThemeChange }) {
    // For resonsive design
    const minDesktopWidth = 1057;
    const maxMobileWidth = 482;
    const [desktopMenuActive, setDesktopMenuActive] = useState(window.innerWidth > minDesktopWidth);
    const [mobileMenuActive, setMobileMenuActive] = useState(window.innerWidth <= maxMobileWidth);

    // Active dropdown menu states
    const [modeActive, setModeActive] = useState(false);
    const [unitsActive, setUnitsActive] = useState(false);
    const [themeActive, setThemeActive] = useState(false);
    const [menuActive, setMenuActive] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Refs for dropdown menus
    const modeRef = useRef(null);
    const unitsRef = useRef(null);
    const themeRef = useRef(null);
    const menuRef = useRef(null);
    const searchRef = useRef(null);

    const [search, setSearch] = useState("");

    // Determines whether mobile or desktop menu should be displayed
    useEffect(() => {
        function handleResize() {
            setDesktopMenuActive(window.innerWidth > minDesktopWidth);
            setMobileMenuActive(window.innerWidth <= maxMobileWidth);

            setModeActive(false);
            setUnitsActive(false);
            setThemeActive(false);
            setMenuActive(false);
        }
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Close dropdown menus when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                !modeRef.current?.contains(event.target) &&
                !unitsRef.current?.contains(event.target) &&
                !themeRef.current?.contains(event.target) &&
                !menuRef.current?.contains(event.target) &&
                !searchRef.current?.contains(event.target)
            ) {
                setModeActive(false);
                setUnitsActive(false);
                setThemeActive(false);
                setMenuActive(false);
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [desktopMenuActive]);
    

    const handleModeClick = () => {
        setModeActive(prev => !prev);
        setUnitsActive(false);
        setThemeActive(false);
    }

    const handleUnitsClick = () => {
        setModeActive(false);
        setUnitsActive(prev => !prev);
        setThemeActive(false);
    }

    const handleThemeClick = () => {
        setModeActive(false);
        setUnitsActive(false);
        setThemeActive(prev => !prev);
    }

    const handleMenuClick = () => {
        setMenuActive(prev => !prev);
    }

    // Mode dropdown menu content
    const modeOptions = () => {
        return (
            <>
                <button onClick={() => handleModeChange("basic")}>
                    <Star className={mode === "basic" ? styles.solid : ""} size={14} strokeWidth={2} />Basic Mode
                </button>
                <button onClick={() => handleModeChange("pro")}>
                    <Zap className={mode === "pro" ? styles.solid : ""} size={14} strokeWidth={1.75} />Pro Mode
                </button>
            </>
        );
    }

    // Units dropdown menu content
    const unitsOptions = () => {
        return (
            <>
                <div className={styles.unitsSection}>
                    <span className={styles.unitsSectionTitle}>Temperature</span>
                    <div className={styles.unitOptions}>
                        <button onClick={() => handleUnitsChange("c", speedUnits)}>
                            <span className={tempUnits === "c" ? styles.selected : ""}>C°</span>
                        </button>
                        <button onClick={() => handleUnitsChange("f", speedUnits)}>
                            <span className={tempUnits === "f" ? styles.selected : ""}>F°</span>
                        </button>
                    </div>
                </div>
                <hr className={styles.unitsSpliter}/>
                <div className={styles.unitsSection}>
                    <span className={styles.unitsSectionTitle}>Wind Speed</span>
                    <div className={styles.unitOptions}>
                        <button onClick={() => handleUnitsChange(tempUnits, "m/s")}>
                            <span className={speedUnits === "m/s" ? styles.selected : ""}>m/s</span>
                        </button>
                        <button onClick={() => handleUnitsChange(tempUnits, "mph")}>
                            <span className={speedUnits === "mph" ? styles.selected : ""}>mph</span>
                        </button>
                    </div>
                </div>
            </>
        );
    }

    // Theme dropdown menu content
    const themeOptions = () => {
        return (
            <>
                <button onClick={() => handleThemeChange("system")}>
                        <SunMoon className={theme === "system" ? styles.solid : ""} size={14} strokeWidth={2} />System Default
                </button>
                <button onClick={() => handleThemeChange("light")}>
                    <Sun className={theme === "light" ? styles.solid : ""} size={14} strokeWidth={2} />Light mode
                </button>
                <button onClick={() => handleThemeChange("dark")}>
                    <Moon className={theme === "dark" ? styles.solid : ""} size={14} strokeWidth={2} />Dark mode
                </button>
            </>
        );
    }

    return (
        <div className={styles.navbar}>
            {/* Menu for devices with enough space */}
            {!desktopMenuActive && (
                <div className={styles.menu}  ref={menuRef}>
                    <button>
                        <Menu size={24} onClick={handleMenuClick} />
                    </button>
                    {menuActive && (
                        <div className={styles.dropdownMenu}>
                            <span className={styles.menuTitle}>Mode</span>
                            {modeOptions()}
                            <hr />
                            <span className={styles.menuTitle}>Units</span>
                            {unitsOptions()}
                            <hr />
                            <span className={styles.menuTitle}>Theme</span>
                            {themeOptions()}
                        </div>
                    )}
                </div>
            )}
            {/* Logo for devices if there is enough space */}
            {!mobileMenuActive && (
                <div className={styles.logo}>
                    <h2>RunCast</h2>
                    <Wind size={42} strokeWidth={1.7} />
                </div>
            )}
            {/* Search bar */}
            <div className={styles.search} ref={searchRef}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch(search);
                    setSearch("");
                    handleSearchInputChange("");
                }}>
                    <input 
                        type="text" 
                        placeholder="Search location" 
                        value={search} 
                        onChange={(e) => {
                            setSearch(e.target.value);
                            handleSearchInputChange(e.target.value);
                            setShowSuggestions(e.target.value.length > 0);
                        }} 
                        onFocus={() => {
                            if (search.length > 0) {
                                setShowSuggestions(true);
                            }
                        }} 
                    />   
                    <button type="submit">
                        <svg width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.4167 21.875L13.8542 15.3125C13.3333 15.7292 12.7344 16.059 12.0573 16.3021C11.3802 16.5451 10.6597 16.6667 9.89583 16.6667C8.00347 16.6667 6.40191 16.0113 5.09115 14.7005C3.78038 13.3898 3.125 11.7882 3.125 9.89583C3.125 8.00347 3.78038 6.40191 5.09115 5.09115C6.40191 3.78038 8.00347 3.125 9.89583 3.125C11.7882 3.125 13.3898 3.78038 14.7005 5.09115C16.0113 6.40191 16.6667 8.00347 16.6667 9.89583C16.6667 10.6597 16.5451 11.3802 16.3021 12.0573C16.059 12.7344 15.7292 13.3333 15.3125 13.8542L21.875 20.4167L20.4167 21.875ZM9.89583 14.5833C11.1979 14.5833 12.3047 14.1276 13.2161 13.2161C14.1276 12.3047 14.5833 11.1979 14.5833 9.89583C14.5833 8.59375 14.1276 7.48698 13.2161 6.57552C12.3047 5.66406 11.1979 5.20833 9.89583 5.20833C8.59375 5.20833 7.48698 5.66406 6.57552 6.57552C5.66406 7.48698 5.20833 8.59375 5.20833 9.89583C5.20833 11.1979 5.66406 12.3047 6.57552 13.2161C7.48698 14.1276 8.59375 14.5833 9.89583 14.5833Z"/>
                        </svg>
                    </button>    
                </form>
                {/* Suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                <ul className={styles.suggestionsDropdown}>
                    {suggestions.map((suggestion, index) => (
                        <li key={`${suggestion}-${index}`}
                            onClick={() => {
                                handleSearch(suggestion);
                                setSearch("");
                                handleSearchInputChange("");
                                setShowSuggestions(false);
                            }}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}          
            </div>
            {/* Settings menu for devices with enough space */}
            {desktopMenuActive && (
            <div className={styles.settings}>
                {/* Mode dropdown menu */}
                <div className={styles.setting} ref={modeRef}>
                    <button onClick={handleModeClick}>
                        <span>Mode</span>
                        <svg className={modeActive ? styles.rotated : ""} width="10" height="5" viewBox="0 0 10 5" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 5L0 0H10L5 5Z"/>
                        </svg>
                    </button>
                    {modeActive && (
                        <div className={styles.dropdownMenu}>
                            {modeOptions()}
                        </div>
                    )}
                </div>
                {/* Units dropdown menu */}
                <div className={styles.setting} ref={unitsRef}>
                    <button onClick={handleUnitsClick}>
                        <span>Units</span>
                        <svg className={unitsActive ? styles.rotated : ""} width="10" height="5" viewBox="0 0 10 5" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 5L0 0H10L5 5Z"/>
                        </svg>
                    </button>
                    {unitsActive && (
                        <div className={styles.dropdownMenu}>
                            {unitsOptions()}
                        </div>
                    )}
                </div>
                {/* Theme dropdown menu */}
                <div className={styles.setting} ref={themeRef}>
                    <button onClick={handleThemeClick}>
                        <span>Theme</span>
                        <svg className={themeActive ? styles.rotated : ""} width="10" height="5" viewBox="0 0 10 5" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 5L0 0H10L5 5Z"/>
                        </svg>
                    </button>
                    {themeActive && (
                        <div className={styles.dropdownMenu}>
                            {themeOptions()}
                        </div>
                    )}
                </div>
            </div>
            )}
        </div>
    );
}

export default Navbar;
