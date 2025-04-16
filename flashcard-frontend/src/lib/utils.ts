import {clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cx(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}