'use client'

import {useRouter} from 'next/navigation';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from '@/components/ui/DropdownMenu';
import {LogOut, User} from 'lucide-react';

export default function ProfileMenu({onLogoutClick}: { onLogoutClick: () => void }) {
    const router = useRouter();

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="p-2 hover:opacity-80 text-gray-600 hover:text-purple-600"
                        title="마이페이지"
                    >
                        <User size={24}/>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => router.push('/me')}>
                        <User className="mr-2 h-4 w-4"/>
                        My Page
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onLogoutClick}>
                        <LogOut className="mr-2 h-4 w-4"/>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}