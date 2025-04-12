'use client'

import {useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {useLogin} from '@/hooks/useLogin'
import {AxiosError} from 'axios';

export default function LoginPage() {
    const router = useRouter()
    const [form, setForm] = useState({username: '', password: ''})
    const [error, setError] = useState('')
    const login = useLogin()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await login.mutateAsync(form)
            router.push('/')
        } catch (err: unknown) {
            const axiosError = err as AxiosError<{ detail?: string }>;
            const msg = axiosError?.response?.data?.detail || 'Login failed'
            setError(msg)
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark px-4">
            <div className="w-full max-w-sm bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow">
                <h2 className="text-center text-2xl font-bold mb-6 text-slate-600 dark:text-slate-400">
                    Welcome Back
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        disabled={login.isPending}
                        placeholder="Username or Email"
                        onChange={handleChange}
                        value={form.username}
                        className="w-full px-4 py-2 rounded bg-surface-light dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-text-light dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <input
                        type="password"
                        name="password"
                        disabled={login.isPending}
                        placeholder="Password"
                        onChange={handleChange}
                        value={form.password}
                        className="w-full px-4 py-2 rounded bg-surface-light dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-text-light dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={login.isPending}
                        className="w-full bg-slate-500 hover:bg-slate-600 text-white py-2 rounded font-semibold transition"
                    >
                        Log In
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Don’t have an account?{' '}
                    <Link href="/signup" className="text-purple-600 dark:text-purple-400 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}