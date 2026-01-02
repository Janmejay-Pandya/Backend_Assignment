import Redis from "ioredis";

let redis;

if (process.env.REDIS_URL) {
  // Production (Upstash)
  redis = new Redis(process.env.REDIS_URL);
} else {
  // Local (Docker)
  redis = new Redis({
    host: "127.0.0.1",
    port: 32768,
  });
}

redis.on("connect", () => console.log("🔥 Redis Connected"));
redis.on("error", (err) => console.error("❌ Redis Error:", err));

export { redis };
