import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const AppBar = () => {
    const [isOrg, setIsOrg] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            const userType = localStorage.getItem('userType');
            if (userType === 'org') {
                setIsOrg(true);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        setIsLoggedIn(false);
        setIsOrg(false);
        navigate("/");
    };

    return (
        <div className="border-b flex justify-between px-10 py-4">
            <Link to={"/"} className="flex flex-col justify-center">
                Globtera
            </Link>
            <div className="flex flex-row items-center">
                {isOrg && (
                    <Link to={"/publish"} className="pl-5">
                        <button
                            type="button"
                            className="flex flex-col justify-center text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            New
                        </button>
                    </Link>
                )}
                {isLoggedIn ? (
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="ml-5 text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-1.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800"
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <Link to={"/signin"} className="pl-5">
                            <button
                                type="button"
                                className="flex flex-col justify-center text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-1.5 text-center dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800"
                            >
                                Sign In
                            </button>
                        </Link>
                        <Link to={"/signup"} className="pl-5">
                            <button
                                type="button"
                                className="flex flex-col justify-center text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-1.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                            >
                                Sign Up
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};
