FROM node:21.7.3 as deps

ENV NODE_ENV=production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

FROM node:21.7.3 as builder

ENV NODE_ENV=production

WORKDIR /app
COPY .env_prod ./.env
COPY next.config.mjs tsconfig.json ./
COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules

COPY prisma ./prisma
COPY public ./public
COPY src ./src
COPY ruleset ./ruleset

RUN npx prisma generate
RUN npm run build

CMD ["npm", "start"]

FROM node:21.7.3 as runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system -gid 1101 nodejs
RUN adduser --system -uid 1101 nextjs
RUN chown -R nextjs:nodejs /tmp

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/ruleset ./ruleset
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/.next/ ./.next/
COPY --from=builder --chown=nextjs:nodejs /app/next.config.mjs /app/.env /app/next-env.d.ts /app/tsconfig.json ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json /app/package-lock.json ./

USER nextjs

CMD ["npm", "start"]
