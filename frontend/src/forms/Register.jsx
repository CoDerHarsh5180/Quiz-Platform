import React, { useState } from "react";
import { verifyOTP, registerUser } from "../Api/authApi";
import { X, Mail, RefreshCw } from "lucide-react";
import { useAuth } from "../context/teacherContext";

const OTP_LENGTH = 6;

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [experience, setExperience] = useState("");
    const [field, setField] = useState("JEE");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");

    // otpSent: false → OTP not yet sent; true → OTP was sent at least once
    const [otpSent, setOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const { setRegisterForm, setLoginForm } = useAuth();

    // ── Send / Resend OTP ──
    const handleSendOTP = async () => {
        setSendingOtp(true);
        try {
            await registerUser(name, email, username, experience, field, password);
            setOtpSent(true);
            setOtp(""); // clear previous OTP entry on resend
        } catch {
            // error toast shown inside registerUser
        } finally {
            setSendingOtp(false);
        }
    };

    // ── Verify OTP ──
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setVerifying(true);
        try {
            await verifyOTP(name, email, username, experience, field, password, otp);
            setRegisterForm(false);
            setLoginForm(true);
        } catch {
            // error toast shown inside verifyOTP
        } finally {
            setVerifying(false);
        }
    };

    return (
        // Backdrop — click outside to close
        <div
            className="fixed inset-0 w-full h-screen bg-black/50 flex items-center justify-center z-50"
            onClick={() => setRegisterForm(false)}
        >
            {/* Card */}
            <div
                className="w-full max-w-lg bg-white shadow-xl rounded-xl relative mx-4 max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="px-8 pt-8 pb-4 border-b flex-shrink-0">
                    <span
                        className="absolute top-0 right-0 p-3 cursor-pointer text-gray-400 hover:text-gray-700"
                        onClick={() => setRegisterForm(false)}
                    >
                        <X size={20} />
                    </span>
                    <h2 className="text-2xl font-semibold text-center">Create an account</h2>
                    <p className="text-gray-500 text-center text-sm mt-1">SIGN UP to प्रश्णोत्तर</p>
                </div>

                {/* ── Scrollable body ── */}
                <form onSubmit={handleVerifyOTP} className="overflow-y-auto px-8 py-5 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full name"
                                disabled={otpSent}
                                className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                disabled={otpSent}
                                className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="username"
                                disabled={otpSent}
                                className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                disabled={otpSent}
                                className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                            />
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Experience</label>
                            <input
                                type="text"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                placeholder="e.g. 5 years"
                                disabled={otpSent}
                                className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Field</label>
                            <select
                                value={field}
                                onChange={(e) => setField(e.target.value)}
                                disabled={otpSent}
                                className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="JEE">JEE</option>
                                <option value="NEET">NEET</option>
                                <option value="OLYMPIAD">OLYMPIAD</option>
                                <option value="SCHOOL">SCHOOL</option>
                                <option value="GOVT-EXAMS PREP">GOVT-EXAMS PREP</option>
                            </select>
                        </div>

                        {/* ── Send OTP / Resend OTP button ── */}
                        <div className="md:col-span-2">
                            <button
                                type="button"
                                onClick={handleSendOTP}
                                disabled={sendingOtp}
                                className="w-full flex items-center justify-center gap-2 bg-violet-500 text-white py-2 rounded-md hover:bg-violet-600 transition disabled:opacity-50"
                            >
                                {sendingOtp ? (
                                    "Sending OTP..."
                                ) : otpSent ? (
                                    <><RefreshCw size={15} /> Resend OTP</>
                                ) : (
                                    <><Mail size={15} /> Send OTP</>
                                )}
                            </button>
                        </div>

                        {/* ── OTP field: always rendered, disabled until OTP sent ── */}
                        <div className="md:col-span-2">
                            <label className={`block text-sm font-medium mb-1 ${otpSent ? 'text-gray-700' : 'text-gray-400'}`}>
                                OTP
                                {otpSent && (
                                    <span className="ml-2 text-xs text-violet-600 font-normal">
                                        Sent to {email}
                                    </span>
                                )}
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={otp}
                                maxLength={OTP_LENGTH}
                                onChange={(e) => {
                                    // Only allow digits
                                    const val = e.target.value.replace(/\D/g, '');
                                    setOtp(val);
                                }}
                                placeholder={otpSent ? `Enter ${OTP_LENGTH}-digit OTP` : "Send OTP first"}
                                disabled={!otpSent}
                                className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-100 disabled:cursor-not-allowed tracking-widest text-center text-lg font-mono"
                                required={otpSent}
                            />
                            {/* Digit progress indicator */}
                            <div className="mt-1.5 flex gap-1 justify-center">
                                {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 flex-1 rounded-full transition-all duration-200 ${
                                            i < otp.length
                                                ? 'bg-violet-500'
                                                : otpSent
                                                ? 'bg-gray-200'
                                                : 'bg-gray-100'
                                        }`}
                                    />
                                ))}
                            </div>
                            {otpSent && (
                                <p className="text-xs text-gray-400 mt-1 text-right">
                                    {otp.length}/{OTP_LENGTH} digits
                                </p>
                            )}
                        </div>

                        {/* ── Verify OTP button: hidden until OTP sent ── */}
                        {otpSent && (
                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    disabled={verifying || otp.length !== OTP_LENGTH}
                                    className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition disabled:opacity-50"
                                >
                                    {verifying ? "Verifying..." : "Verify OTP & Create Account"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOtpSent(false);
                                        setOtp("");
                                    }}
                                    className="w-full mt-2 text-sm text-gray-400 hover:text-gray-600 underline"
                                >
                                    ← Edit details
                                </button>
                            </div>
                        )}
                    </div>
                </form>

                {/* ── Footer ── */}
                <div className="px-8 pb-6 pt-3 border-t flex-shrink-0 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <button
                        type="button"
                        className="text-violet-600 font-semibold hover:underline"
                        onClick={() => {
                            setLoginForm(true);
                            setRegisterForm(false);
                        }}
                    >
                        Login Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
