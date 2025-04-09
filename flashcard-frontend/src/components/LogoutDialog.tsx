'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });
        setLoading(false);
        router.push('/login');
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-900 text-white p-6 rounded-xl shadow-xl w-80">
                <h2 className="text-lg font-bold mb-4">로그아웃 하시겠어요?</h2>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="px-4 py-2 rounded bg-red-500 hover:bg-red-600"
                    >
                        {loading ? '처리 중...' : '로그아웃'}
                    </button>
                </div>
            </div>
        </div>
    );
}