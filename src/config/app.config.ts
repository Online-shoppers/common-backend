export default () => ({
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
    AT_SECRET: process.env.AT_SECRET,
    RT_SECRET: process.env.RT_SECRET,
  },
});
