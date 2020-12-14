const os = require("os");
const NATS = require("nats");
const nc = NATS.connect({
  url: process.env.NATS_URL || "nats://my-nats:4222",
  json: true,
});
nc.on("error", (error) => {
  console.log(error.message);
});
nc.on("connect", () => {
  console.log("Client connected to nats");
});

const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require("unique-names-generator");

const appName = uniqueNamesGenerator({
  dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
  length: 2,
}); // big-donkey

const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const chat_id = process.env.CHAT_ID;
const host = os.hostname();

nc.subscribe("todo_data", { queue: "todo.workers" }, async (msg) => {
  await sendToTelegram(msg);
});

const sendToTelegram = async (msg) => {
  let text = "";
  if (msg.method === "PUT") text = "Todo was updated:";
  if (msg.method === "POST") text = "Todo was created:";
  if (msg.method === "DELETE") text = "Todo was deleted:";
  let jsondata = JSON.stringify(msg, undefined, 2);
  if (!chat_id) return;
  try {
    await bot.telegram.sendMessage(
      chat_id,
      `
      <b>TODOS NATS BROADCASTER</b>

      <a>${text}</a>

      <pre id="json">${jsondata}</pre>

      <a>Broadcasted by: ${appName}  @ ${host}</a>
      `,
      {
        parse_mode: "HTML",
      }
    );
  } catch (e) {
    console.log(e);
  }
};
