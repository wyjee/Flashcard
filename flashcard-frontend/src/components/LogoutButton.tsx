'use client';

import { useState } from 'react'
import LogoutDialog from './LogoutDialog'

export default function LogoutButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button onClick={() => setOpen(true)} className="text-white bg-gray-700 px-3 py-1 rounded">
                로그아웃
            </button>
            <LogoutDialog open={open} onClose={() => setOpen(false)} />
        </>
    )
}