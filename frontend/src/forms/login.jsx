import React, { useState } from "react";
import { loginUser } from "../Api/authApi";
import { X } from "lucide-react";
import { useAuth } from "../context/teacherContext";

const LoginPage = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { setLoginForm, setRegisterForm } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await loginUser(identifier, password);
            setLoginForm(false);
        } catch {
            // toast already shown inside loginUser
        } finally {
            setSubmitting(false);
        }
    };

    return (
        // Backdrop — click outside the card to close
        <div
            className="fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-50"
            onClick={() => setLoginForm(false)}
        >
            {/* Card — stop propagation so clicking inside doesn't close */}
            <div
                className="w-full max-w-md bg-[var(--color-modal-bg)] shadow-md rounded-lg p-8 relative mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <span
                    className="absolute top-0 right-0 p-3 cursor-pointer text-[var(--color-modal-close)] hover:text-[var(--color-modal-close-hover)]"
                    onClick={() => setLoginForm(false)}
                >
                    <X />
                </span>
                <h2 className="text-2xl font-semibold text-center mb-2">Welcome back</h2>
                <p className="text-[var(--color-modal-hint)] text-center mb-6">LOGIN to प्रश्णोत्तर</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-on-light)]">
                            EMAIL or USERNAME
                        </label>
                        <input
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="email or username"
                            className="text-[var(--color-text-dark)] mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-accent-focus)] focus:border-[var(--color-accent-focus)]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-on-light)]">
                            PASSWORD
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="text-[var(--color-text-dark)] mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-accent-focus)] focus:border-[var(--color-accent-focus)]"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[var(--color-accent)] text-white py-2 rounded-md hover:bg-[var(--color-accent-hover)] transition disabled:opacity-50"
                    >
                        {submitting ? "Signing in..." : "Sign in →"}
                    </button>
                </form>

                <p className="mt-6 text-center text-[var(--color-modal-hint)]">
                    Don&apos;t have an account?{" "}
                    <button
                        className="text-[var(--color-accent-link)] font-semibold hover:underline"
                        onClick={() => {
                            setLoginForm(false);
                            setRegisterForm(true);
                        }}
                    >
                        Register Now
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
