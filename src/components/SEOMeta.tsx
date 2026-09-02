import { useEffect } from 'react';
import { getInternalPage } from '../data/internalPages';

interface SEOMetaProps {
  activeTab: string;
  selectedInternalPageUrl: string | null;
}

export default function SEOMeta({ activeTab, selectedInternalPageUrl }: SEOMetaProps) {
  useEffect(() => {
    let title = "בית הספר שש שנתי ע\"ש משה ארנס | פתח תקוה";
    let description = "ברוכים הבאים לאתר הרשמי של בית הספר השש-שנתי משה ארנס בפתח תקווה. חטיבת ביניים ותיכון מוביל המשלב מצוינות מדעית וטכנולוגית, ערכים חברתיים וחדשנות פדגוגית.";
    let keywords = "משה ארנס, שש שנתי משה ארנס, חטיבת ביניים משה ארנס, בית ספר משה ארנס, פתח תקווה, חינוך פתח תקווה, מצוינות מדעית, בית ספר תיכון";
    let ogType = "website";
    let url = window.location.origin + window.location.pathname;
    
    // Structured Data (JSON-LD Schema.org)
    let jsonLd: any = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "שש-שנתי ע\"ש משה ארנס פתח תקווה",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "פתח תקווה",
        "addressCountry": "IL"
      },
      "url": window.location.origin,
      "logo": window.location.origin + "/logo.png"
    };

    if (activeTab === 'home') {
      title = "בית הספר שש שנתי ע\"ש משה ארנס | פתח תקוה - דף הבית";
    } else if (activeTab === 'about') {
      title = "אודות בית הספר | שש-שנתי משה ארנס פתח תקווה";
      description = "מידע על חזון בית הספר השש-שנתי משה ארנס בפתח תקווה, דמות הבוגר, מורשת משה ארנס וסגל הניהול וההוראה שלנו.";
      keywords = "אודות, חזון משה ארנס, הנהלת בית הספר, חטיבת ביניים פתח תקווה, ערכים חינוכיים, חטיבת ביניים ארנס";
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "אודות - שש-שנתי משה ארנס פתח תקווה",
        "description": description,
        "publisher": {
          "@type": "EducationalOrganization",
          "name": "שש-שנתי ע\"ש משה ארנס פתח תקווה"
        }
      };
    } else if (activeTab === 'spaces') {
      title = "מרחבי למידה חדשניים | שש-שנתי משה ארנס";
      description = "גלו את מרחבי הלמידה והמעבדות הטכנולוגיות המתקדמות ביותר בבית הספר השש-שנתי משה ארנס פתח תקווה. פדגוגיה חדשנית ומפתחת.";
      keywords = "מרחבי למידה, מעבדות, כיתות חכמות, טכנולוגיה בחינוך, פדגוגיה דיגיטלית";
    } else if (activeTab === 'regulations') {
      title = "תקנון בית הספר | שש-שנתי משה ארנס פתח תקווה";
      description = "כללי ההתנהגות, הזכויות והחובות של תלמידי בית הספר השש-שנתי משה ארנס. שמירה על אקלים חינוכי מיטבי, כבוד הדדי ומצוינות.";
      keywords = "תקנון, כללי התנהגות, זכויות תלמידים, אקלים מיטבי, משמעת, בית ספר ארנס";
    } else if (activeTab === 'contact') {
      title = "צור קשר ורישום | שש-שנתי משה ארנס פתח תקווה";
      description = "צרו קשר עם מזכירות בית הספר השש-שנתי משה ארנס בפתח תקווה. פרטי קשר, טפסים דיגיטליים, שעות קבלה והכוונה לרישום.";
      keywords = "צור קשר, מזכירות, רישום לבית ספר, פתח תקווה, טלפון מזכירות, כתובת בית ספר";
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "צור קשר - שש-שנתי משה ארנס פתח תקווה",
        "description": description,
        "mainEntity": {
          "@type": "EducationalOrganization",
          "name": "שש-שנתי ע\"ש משה ארנס פתח תקווה",
          "telephone": "+972-3-7349373"
        }
      };
    } else if (activeTab === 'internal-page' && selectedInternalPageUrl) {
      const page = getInternalPage(selectedInternalPageUrl);
      if (page) {
        title = `${page.title} | שש-שנתי משה ארנס`;
        description = page.subtitle || (page.content && page.content[0]) || `מידע מקיף בנושא ${page.title} בפורטל בית הספר השש-שנתי משה ארנס פתח תקווה.`;
        if (description.length > 160) {
          description = description.slice(0, 157) + '...';
        }
        keywords = `${page.title}, ${page.category}, שש שנתי משה ארנס, פתח תקווה, דפי מידע בית ספריים`;
        ogType = "article";
        url = window.location.origin + "/#" + selectedInternalPageUrl;
        
        jsonLd = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": page.title,
          "description": description,
          "articleSection": page.category,
          "publisher": {
            "@type": "EducationalOrganization",
            "name": "שש-שנתי ע\"ש משה ארנס פתח תקווה"
          }
        };
      }
    }

    // 1. Update Document Title
    document.title = title;

    // Helper function to update/create meta tag
    const setMetaTag = (attribute: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Set Meta Description
    setMetaTag('name', 'description', description);

    // 3. Set Meta Keywords
    setMetaTag('name', 'keywords', keywords);

    // 4. Set OpenGraph Meta Tags for Rich Search & Social Preview
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', url);
    setMetaTag('property', 'og:site_name', 'שש-שנתי ע"ש משה ארנס פתח תקווה');

    // 5. Set Canonical URL Link tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // 6. Set JSON-LD Structured Data script tag
    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(jsonLd);

  }, [activeTab, selectedInternalPageUrl]);

  return null;
}
