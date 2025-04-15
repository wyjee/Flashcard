'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import PageWrapper from '@/components/layout/PageWrapper';
import {useMutation} from '@tanstack/react-query';
import api from '@/lib/api';

export default function CreateTopicPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        title: '',
        description: '',
        is_public: true,
    });

    const mutation = useMutation({
        mutationFn: async () => {
            const res = await api.post('/topics', form, {
                withCredentials: true,
            });
            return res.data;
        },
        onSuccess: (data) => {
            router.push(`/qna/create?topicId=${data.id}`);
        },
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
        mutation.mutate();
    };

    return (
        <PageWrapper title="Create Topic" showProfileButton>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 mt-6">
                <input
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
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
                    <span>Public Topic</span>
                </label>
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
                >
                    {mutation.isPending ? 'Creating...' : 'Next'}
                </button>
            </form>
        </PageWrapper>
    );
}
