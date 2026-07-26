import { useEffect, useState } from 'react';

export function useCountry() {
  const [country, setCountry] = useState('US');
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((d) => setCountry(d.country_code))
      .catch(() => {});
  }, []);
  return country;
}