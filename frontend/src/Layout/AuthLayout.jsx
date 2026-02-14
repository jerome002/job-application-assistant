export default function AuthLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#ffffff",
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
