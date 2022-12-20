import { Event } from "@toastify/structures";

export default new Event({
  name: "ready",
  once: true,
  run: async (client) => {
    console.log(`Logged in as ${client.user.tag}`);
  },
});
