export default function ProfileLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
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
