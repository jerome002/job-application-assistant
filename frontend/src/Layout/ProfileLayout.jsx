export default function ProfileLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6", // light gray background
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "800px",   // make it wider than auth form
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "32px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
