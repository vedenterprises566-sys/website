import React, { useEffect } from 'react';
import { updateHeadMetadata } from '../utils/seoUtils';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  jsonLd?: object | object[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({ title, description, canonicalUrl, jsonLd }) => {
  useEffect(() => {
    updateHeadMetadata({
      title,
      description,
      canonicalUrl,
      jsonLd,
    });
  }, [title, description, canonicalUrl, jsonLd]);

  return null;
};
