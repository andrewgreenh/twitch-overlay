export const environemnt =
  process.env.NODE_ENV === "development"
    ? {
        origin: "http://localhost:3000",
      }
    : {
        origin: "https://localhost",
      };
