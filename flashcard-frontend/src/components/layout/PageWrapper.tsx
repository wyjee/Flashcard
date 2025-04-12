'use client';

import React from 'react';
import Link from 'next/link';
import {User, Plus} from 'lucide-react';
import {useCurrentUser} from '@/hooks/useCurrentUser';

type PageWrapperProps = {
    title: string;
    showProfileButton?: boolean;
    showCreateTopicButton?: boolean;
    children: React.ReactNode;
};

const PageWrapper = ({
                         title,
                         showProfileButton = true,
                         showCreateTopicButton = false,
                         children,
                     }: PageWrapperProps) => {
    const {data: currentUser} = useCurrentUser();
    const profileLink = currentUser ? '/me' : '/login';

    return (
        <div className="min-h-screen px-6 py-4 relative">
            <header className="flex items-center justify-between mb-6 relative">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center w-full">
                    {title}
                </h1>

                {showProfileButton && (
                    <Link
                        href={profileLink}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-purple-600"
                        title="마이페이지"
                    >
                        <User size={24}/>
                    </Link>
                )}
            </header>

            <main>{children}</main>

            {showCreateTopicButton && (
                <Link
                    href="/topics/create"
                    className="fixed bottom-6 right-6 bg-gray-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 transition"
                    title="Create Topic"
                >
                    <Plus size={20}/>
                </Link>
            )}
        </div>
    );
};

export default PageWrapper;
