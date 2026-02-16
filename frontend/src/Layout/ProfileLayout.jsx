import React from 'react';

export default function ProfileLayout({ children }) {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "var(--color-bg)", 
        display: "flex",
        justifyContent: "center", // Changed from justify-content
        alignItems: "center",     // Center vertically
        overflow: "hidden",       // Lock the background
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      {children}
    </div>
  );
}