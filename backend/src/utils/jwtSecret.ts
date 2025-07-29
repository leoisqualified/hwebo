import crypto from "crypto";

const secretKeyHex = crypto.randomBytes(32).toString("hex");
console.log(secretKeyHex);
