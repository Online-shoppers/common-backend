import * as process from 'process';

export default () => ({
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
    AT_SECRET: process.env.AT_SECRET,
    RT_SECRET: process.env.RT_SECRET,
    AT_SECONDS_EXP: parseInt(process.env.AT_SECONDS_EXP, 10),
    RT_SECONDS_EXP: parseInt(process.env.RT_SECONDS_EXP, 10),
  },
});
