'use client';

import {useState} from 'react';
import Link from 'next/link';
import { AxiosError } from 'axios';
import {useRouter} from 'next/navigation';
import {useSignup} from '@/hooks/useSignup'

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({username: '', email: '', password: ''});
    const [error, setError] = useState('');
    const signup = useSignup()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await signup.mutateAsync(form)
            router.push('/login')
        } catch (err) {
            const error = err as AxiosError<{ detail?: string }>;
            const msg = error.response?.data?.detail || 'Signup failed';
            setError(msg);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark px-4">
            <div className="w-full max-w-sm bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow">
                <h2 className="text-center text-2xl font-bold mb-6 text-slate-600 dark:text-slate-400">
                    Create Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        value={form.username}
                        className="w-full px-4 py-2 rounded bg-surface-light dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-text-light dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        value={form.email}
                        className="w-full px-4 py-2 rounded bg-surface-light dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-text-light dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={form.password}
                        className="w-full px-4 py-2 rounded bg-surface-light dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-text-light dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-slate-500 hover:bg-slate-600 text-white py-2 rounded font-semibold transition"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-gray-600 dark:text-gray-400 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}