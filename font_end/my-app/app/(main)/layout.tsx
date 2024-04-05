"use client";

// import { ThemeProvider } from "@/components/theme-provider";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // <div className="m-auto h-[100vh] overflow-hidden bg-[#5955B3]">
    // <div className="m-auto h-[100vh] overflow-hidden bg-[#000]">{children}</div>
    <div className="m-auto h-[100vh] overflow-hidden">
      {/* <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      > */}
      {children}
      {/* </ThemeProvider> */}
    </div>
  );
};

export default MainLayout;
