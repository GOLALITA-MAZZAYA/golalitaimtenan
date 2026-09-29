import React, { useState, useEffect } from 'react';
import { SvgXml } from 'react-native-svg';

const TintedSvg = ({ uri, width, height, color }) => {
  const [xml, setXml] = useState(null);

  useEffect(() => {
    if (!uri) return;
    let isMounted = true;
    fetch(uri)
      .then(res => res.text())
      .then(text => {
        if (isMounted) {
          const modifiedText = text
            .replace(/fill="(?!none\b)[^"]*"/g, 'fill="currentColor"')
            .replace(/stroke="(?!none\b)[^"]*"/g, 'stroke="currentColor"');
          setXml(modifiedText);
        }
      })
      .catch(err => {
        console.warn('Error fetching SVG:', err);
      });
    return () => {
      isMounted = false;
    };
  }, [uri]);

  if (!xml) return null;

  return (
    <SvgXml
      xml={xml}
      width={width}
      height={height}
      color={color}
      preserveAspectRatio="xMidYMid slice"
    />
  );
};

export default TintedSvg;
