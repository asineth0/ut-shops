import winston from "winston";
import express from "express";
import net from "net";
import morgan from "morgan";
import mongoose from "mongoose";
import { TagModel } from "./models/tag";
import { ItemModel } from "./models/item";
import path from "path";
import sharp from "sharp";
import sodium from "libsodium-wrappers";
import axios from "axios";

const hyalusConfig: {
  token: string;
  privateKey: string;
  channel: {
    id: string;
    users: {
      id: string;
      publicKey: string;
    }[];
  };
} = JSON.parse(process.env.HYALUS_CONFIG || "");

const processImage = async (val: Buffer) => {
  return await sharp(val).resize(256, 256).toFormat("webp").toBuffer();
};

(async () => {
  const log = winston.createLogger({
    level: process.env.node_ENV !== "production" ? "debug" : "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.printf((i) => `${i.timestamp} ${i.level}: ${i.message}`)
    ),
    transports: [new winston.transports.Console()],
  });

  await mongoose.connect("mongodb://db");
  log.info("Connected to DB");

  const app = express();

  app.disable("x-powered-by");

  app.use(
    morgan("tiny", {
      stream: {
        write(s: string) {
          log.http(s.trim());
        },
      },
    })
  );

  app.use(
    express.json({
      limit: "10mb",
    })
  );

  app.get("/api/all", async (req, res) => {
    const tags = [];
    const items = [];

    for (const tag of await TagModel.find({})) {
      tags.push({
        id: tag._id.toString("base64url"),
        name: tag.name,
        variations: tag.variations,
      });
    }

    for (const item of await ItemModel.find({})) {
      items.push({
        id: item._id.toString("base64url"),
        tagId: item.tagId.toString("base64url"),
        name: item.name,
        description: item.description,
        price: item.price,
      });
    }

    res.json({
      tags,
      items,
    });
  });

  app.get("/api/items/:itemId/image", async (req, res) => {
    const item = await ItemModel.findOne({
      _id: Buffer.from(req.params.itemId, "base64url"),
    });

    if (!item?.image) {
      res.status(404).end();
      return;
    }

    res.header("content-type", "image/webp");
    res.send(item.image);
  });

  app.post("/api/admin", (req, res) => {
    if (req.body.password !== process.env.ADMIN_PASSWORD) {
      res.status(400).json({
        error: "Invalid password",
      });

      return;
    }

    res.status(204).end();
  });

  app.post("/api/items", async (req, res) => {
    await ItemModel.create({
      tagId: Buffer.from(req.body.tagId, "base64url"),
      name: req.body.name,
      description: req.body.description,
      image:
        req.body.image &&
        (await processImage(Buffer.from(req.body.image, "base64url"))),
      price: req.body.price,
    });

    res.status(204).end();
  });

  app.post("/api/tags", async (req, res) => {
    await TagModel.create({
      name: req.body.name,
      variations: req.body.variations,
    });

    res.status(204).end();
  });

  app.delete("/api/tags/:tagId", async (req, res) => {
    await TagModel.deleteOne({
      _id: Buffer.from(req.params.tagId, "base64url"),
    });

    res.status(204).end();
  });

  app.delete("/api/items/:itemId", async (req, res) => {
    await ItemModel.deleteOne({
      _id: Buffer.from(req.params.itemId, "base64url"),
    });

    res.status(204).end();
  });

  app.post("/api/tags/:tagId", async (req, res) => {
    await TagModel.updateOne(
      {
        _id: Buffer.from(req.params.tagId, "base64url"),
      },
      {
        $set: {
          name: req.body.name,
          variations: req.body.variations,
        },
      }
    );

    res.status(204).end();
  });

  app.post("/api/items/:itemId", async (req, res) => {
    await ItemModel.updateOne(
      {
        _id: Buffer.from(req.params.itemId, "base64url"),
      },
      {
        $set: {
          tagId: Buffer.from(req.body.tagId, "base64url"),
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          ...(req.body.image
            ? {
                image: await processImage(
                  Buffer.from(req.body.image, "base64url")
                ),
              }
            : {}),
        },
      }
    );

    res.status(204).end();
  });

  app.post("/api/order", async (req, res) => {
    const item = await ItemModel.findOne({
      _id: Buffer.from(req.body.itemId, "base64url"),
    });

    if (!item) {
      res.status(400).json({
        error: "Invalid item",
      });

      return;
    }

    const text = [
      `New Order:`,
      ``,
      `Username: ${req.body.username}`,
      `Item ID: ${req.body.itemId}`,
      `Item Name: ${item.name}`,
      `Item Variation: ${req.body.variation}`,
      `Item Price: $${item.price}`,
      `Item Amount: ${req.body.amount}`,
      `Order Total: $${item.price * req.body.amount}`,
      `Order Time: ${new Date().toLocaleString()}`,
      `Order IP: ${req.ip}`,
    ].join("\n");

    const key = sodium.randombytes_buf(sodium.crypto_secretbox_KEYBYTES);
    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);

    const keys = [];

    for (const user of hyalusConfig.channel.users) {
      const userKeyNonce = sodium.randombytes_buf(
        sodium.crypto_secretbox_NONCEBYTES
      );

      keys.push({
        userId: user.id,
        data: sodium.to_base64(
          new Uint8Array([
            ...userKeyNonce,
            ...sodium.crypto_box_easy(
              key,
              userKeyNonce,
              Buffer.from(user.publicKey, "base64"),
              Buffer.from(hyalusConfig.privateKey, "base64")
            ),
          ])
        ),
      });
    }

    try {
      await axios.post(
        `https://hyalus.app/api/channels/${hyalusConfig.channel.id}/messages`,
        {
          type: 0,
          data: sodium.to_base64(
            Buffer.concat([
              nonce,
              sodium.crypto_secretbox_easy(
                sodium.from_string(text),
                nonce,
                key
              ),
            ])
          ),
          keys,
        },
        {
          headers: {
            authorization: sodium.to_base64(
              Buffer.from(hyalusConfig.token, "base64")
            ), // different formats, cause the world ia a strange place.
          },
        }
      );
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        console.log(e);
      }
    }

    res.status(204).end();
  });

  if (process.env.NODE_ENV === "production") {
    app.use(
      express.static(path.join(__dirname, "../../web/dist"), {
        setHeaders(res, path) {
          if (path.includes("assets/")) {
            res.setHeader("cache-control", "public, max-age=31536000");
          } else {
            res.setHeader("cache-control", "no-cache");
          }

          res.setHeader("service-worker-allowed", "/");
        },
      })
    );

    app.use((_req: express.Request, res: express.Response) => {
      res.setHeader("cache-control", "no-cache");
      res.sendFile(path.join(__dirname, "../../web/dist/index.html"));
    });
  }

  const server = app.listen(3000);
  const info = server.address() as net.AddressInfo;
  log.info(`HTTP listening on :${info.port}`);
})();
