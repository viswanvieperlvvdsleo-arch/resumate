
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function PageLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // On initial load or when navigating back/forward, the Suspense boundary handles it.
        // We just need to handle clicks on links.
        const handleAnchorClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const anchor = target.closest('a');

            if (anchor) {
                const href = anchor.getAttribute('href');
                const targetAttr = anchor.getAttribute('target');
                
                // Don't show loader for external links, new tabs, or anchor links on the same page.
                if (targetAttr === '_blank' || (href && (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')))) {
                    return;
                }

                const currentUrl = new URL(window.location.href);
                const newUrl = new URL(href!, currentUrl);
                
                if (newUrl.pathname !== currentUrl.pathname || newUrl.search !== currentUrl.search) {
                     setLoading(true);
                }
            }
        };

        const handleMutation: MutationCallback = (mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            (node as Element).querySelectorAll('a').forEach(a => a.addEventListener('click', handleAnchorClick));
                        }
                    });
                }
            });
        };
        
        document.body.addEventListener('click', handleAnchorClick);
        const observer = new MutationObserver(handleMutation);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            document.body.removeEventListener('click', handleAnchorClick);
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        // When the path changes, the new page is rendered, so we can hide the loader.
        setLoading(false);
    }, [pathname, searchParams]);

    if (!loading) {
        return null;
    }

    return (
        <div className="page-loader">
            <div className="spinner"></div>
        </div>
    );
}
