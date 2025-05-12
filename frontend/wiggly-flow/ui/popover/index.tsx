'use client';

import * as React from 'react';
import { Popover as RadixPopover } from 'radix-ui';
import { clsx } from 'clsx';

interface PopoverProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    className?: string;
}

export function Popover({
    trigger,
    children,
    side = 'bottom',
    align = 'center',
    className,
}: PopoverProps) {
    return (
        <RadixPopover.Root>
            <RadixPopover.Trigger asChild>
                {trigger}
            </RadixPopover.Trigger>
            <RadixPopover.Portal>
                <RadixPopover.Content
                    side={side}
                    align={align}
                    sideOffset={8}
                    className={clsx(
                        'rounded-md border bg-white p-4 shadow-md z-50 w-64',
                        className
                    )}
                >
                    {children}
                    <RadixPopover.Arrow className="fill-white" />
                </RadixPopover.Content>
            </RadixPopover.Portal>
        </RadixPopover.Root>
    );
}
