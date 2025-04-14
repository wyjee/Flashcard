'use client';

import React, {useState} from 'react';
import Link from 'next/link';
import {Plus, User} from 'lucide-react';
import {useCurrentUser} from '@/hooks/useCurrentUser';
import ProfileMenu from '@/components/ProfileMenu';
import LogoutDialog from '@/components/LogoutDialog';

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

    const [showLogoutDialog, setShowLogoutDialog] = useState(false)

    const openDialog = () => setShowLogoutDialog(true)
    const closeDialog = () => setShowLogoutDialog(false)

    return (
        <>
        <div className="min-h-screen px-6 py-4 relative">
            <header className="flex items-center justify-between mb-6 relative">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center w-full">
                    {title}
                </h1>

                {showProfileButton && currentUser && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                        <ProfileMenu onLogoutClick={openDialog}/>
                    </div>
                )}

                {showProfileButton && !currentUser && (
                    <Link
                        href="/login"
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-purple-600"
                        title="Login"
                    >
                        <User size={24}/>
                    </Link>
                )}
            </header>

            <main>{children}</main>

            {showCreateTopicButton && (
                <Link
                    href="/topic/create"
                    className="fixed bottom-6 right-6 bg-gray-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 transition"
                    title="Create Topic"
                >
                    <Plus size={20}/>
                </Link>
            )}
        </div>

            <LogoutDialog open={showLogoutDialog} onClose={closeDialog}/>
        </>
    );
};

export default PageWrapper;
