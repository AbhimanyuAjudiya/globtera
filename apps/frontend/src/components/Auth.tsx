import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

interface LabelledInputType {
    label: string;
    placeholder: string;
    type: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Auth = ({ type }: { type: "signin" | "signup" }) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [accountType, setAccountType] = useState<"user" | "org">("user");
    const [secretKey, setSecretKey] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    async function sendReq() {
        setIsProcessing(true);
        const endpoint = accountType === "org" ? '/org' : '/user';
        await axios.post(`${BACKEND_URL}${endpoint}${type === "signup" ? "/register" : "/auth"}`, postInputs)
            .then((res) => {
                if (type === "signup") {
                    setSecretKey(res.data.secretKey);
                }
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userType", accountType);
                accountType === "org" ? localStorage.setItem("orgId", res.data.org.id) : localStorage.setItem("userId", res.data.user.id);
                if (type === "signin") navigate("/");
            })
            .catch((e) => {
                console.log(e);
                alert("error");
            })
            .finally(() => {
                setIsProcessing(false);
            });
    }

    return (
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div className="px-8">
                    <div className="px-8 m-5">
                        <div className="text-5xl font-extrabold">
                            {type === "signin" ? "Sign in to your account" : "Create your account"}
                        </div>
                        <div className="text-slate-400">
                            {type === "signup" ? "Already have an account?" : "Create your account"}
                            <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
                                {type === "signin" ? "Signup" : "Signin"}
                            </Link>
                        </div>
                    </div>
                    <div>
                        {type === "signup" && (
                            <LabelledInput label="Name" type="text" placeholder="Your Name" onChange={(e) => {
                                setPostInputs({
                                    ...postInputs,
                                    name: e.target.value
                                });
                            }} />
                        )}
                        <LabelledInput label="Email" type="email" placeholder="your-email@example.com" onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                email: e.target.value
                            });
                        }} />
                        <LabelledInput label="Password" type="password" placeholder="password" onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                password: e.target.value
                            });
                        }} />
                        <div className="mb-4">
                            <label className="block text-lx font-semibold text-gray-900 dark:text-black mb-2">
                                {type === 'signup' ? 'Sign up as' : 'Sign in as'}
                            </label>
                            <div className="flex">
                                <label className="mr-4">
                                    <input
                                        type="radio"
                                        value="user"
                                        checked={accountType === "user"}
                                        onChange={() => setAccountType("user")}
                                        className="mr-1"
                                    />
                                    User
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="org"
                                        checked={accountType === "org"}
                                        onChange={() => setAccountType("org")}
                                        className="mr-1"
                                    />
                                    Organization
                                </label>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={sendReq}
                            className="mt-8 text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
                            disabled={isProcessing}
                        >
                            {type === "signin" ? "Signin" : isProcessing ? "Processing..." : "Signup"}
                        </button>
                        {secretKey && (
                            <div className="w-full mt-4 p-4 bg-yellow-200 text-yellow-800 rounded">
                                <h2 className="font-bold">Secret Key</h2>
                                <p>{secretKey}</p>
                                <p className="text-sm">Please save this key securely. You will need it to make transactions.</p>
                                <Link className="text-slate-400 pl-2 underline" to="/">Home</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const LabelledInput = ({ label, placeholder, type, onChange }: LabelledInputType) => {
    return (
        <div>
            <div>
                <label className="block mb-2 text-lx text font-semibold text-gray-900 dark:text-black">{label}</label>
                <input
                    onChange={onChange}
                    type={type}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder={placeholder}
                    required
                />
            </div>
        </div>
    );
};
