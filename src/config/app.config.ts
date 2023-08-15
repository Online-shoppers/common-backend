export default () => ({
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
    jwt_secret: process.env.JWT_SECRET,
  },
});
