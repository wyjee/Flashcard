'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import PageWrapper from '@/components/layout/PageWrapper';

export default function CreateTopicPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        title: '',
        description: '',
        is_public: true,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {name, value, type} = e.target;
        const checked =
            type === 'checkbox' && e.target instanceof HTMLInputElement
                ? e.target.checked
                : undefined;

        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.title.trim()) {
            alert('Title is required.');
            return;
        }

        localStorage.setItem('temp-topic', JSON.stringify(form));
        router.push('/qna/create');
    };

    return (
        <PageWrapper title="Create Topic" showProfileButton>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 mt-6">
                <input
                    name="title"
                    placeholder="Topic Title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                    required
                />
                <textarea
                    name="description"
                    placeholder="Topic Description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                />
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="is_public"
                        checked={form.is_public}
                        onChange={handleChange}
                    />
                    <span>Make this topic public</span>
                </label>
                <button
                    type="submit"
                    className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
                >
                    Next
                </button>
            </form>
        </PageWrapper>
    );
}