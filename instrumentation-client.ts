import { initBotId } from "botid/client/core";

initBotId({
  protect: [
    {
      path: "/",
      method: "POST",
    },
  ],
});
