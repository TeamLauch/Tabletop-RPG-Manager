import React, { useEffect } from 'react';

/**
 * 
 * @returns 404 Site -> Sends USER to INDEX
 */
export default function Custom404() {
    useEffect(() => {
        window.location.href= "/";
    });
    return <></>
  }