import redis from "@/database/redis";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(10, "1m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export default ratelimit; 