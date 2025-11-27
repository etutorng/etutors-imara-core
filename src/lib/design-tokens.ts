export const colors = {
    primary: {
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        50: "#f0f4ff",
        100: "#dbeafe",
        200: "#bfdbfe",
        300: "#93c5fd",
        400: "#60a5fa",
        500: "#667eea", // Base Primary
        600: "#5a67d8",
        700: "#4c51bf",
        800: "#434190",
        900: "#3c366b",
    },
    accent: {
        50: "#fff5f5",
        100: "#fed7d7",
        200: "#feb2b2",
        300: "#fc8181",
        400: "#f56565", // Base Accent
        500: "#e53e3e",
        600: "#c53030",
        700: "#9b2c2c",
        800: "#822727",
        900: "#742a2a",
    },
    success: {
        500: "#48bb78",
    },
    warning: {
        500: "#ecc94b",
    },
    background: {
        light: "#ffffff",
        dark: "#1a202c",
    },
    text: {
        light: "#2d3748",
        dark: "#f7fafc",
    }
} as const;

export const spacing = {
    xs: "0.25rem", // 4px
    sm: "0.5rem",  // 8px
    md: "1rem",    // 16px
    lg: "1.5rem",  // 24px
    xl: "2rem",    // 32px
    "2xl": "3rem", // 48px
} as const;

export const animations = {
    transition: "all 0.3s ease-in-out",
    hoverScale: "scale(1.02)",
} as const;
