import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';

export function useDocumentTitle(title, description = '', appName = 'Gradify') {
  const fullTitle = title ? `${title} - ${appName}` : appName;
  const prevTitle = useRef();

  useEffect(() => {
    if (typeof document === 'undefined') return;  // SSR guard

    prevTitle.current = document.title;
    document.title = fullTitle;

    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = description;
    }

    return () => {
      if (prevTitle.current) {
        document.title = prevTitle.current;
      }
    };
  }, [fullTitle, description]);

  // Return Helmet component for optional use in JSX
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
}